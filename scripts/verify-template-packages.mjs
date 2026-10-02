#!/usr/bin/env node
/**
 * LOGIFORGE — Standalone Package Verification & Production Validator
 * Phase 20B-02: Automated Production Validator
 *
 * Verifies that generated template packages in dist/packages/ are 100% autonomous,
 * production-ready Next.js starter projects.
 *
 * Pipeline per template:
 * 1. Checksum validation (SHA-256 against dist/packages/checksums.txt)
 * 2. Isolated extraction into temporary directory
 * 3. Strict contamination & security scan (zero .env, .git, platform code)
 * 4. Structural completeness check (all required files present)
 * 5. Local asset resolution scan (all referenced assets exist locally)
 * 6. Standalone boundary verification (zero imports from parent repo)
 * 7. Identity & differentiation validation
 * 8. Fresh npm install (self-contained node_modules)
 * 9. Standalone typecheck (tsc --noEmit)
 * 10. Standalone lint (next lint)
 * 11. Standalone production build (next build)
 * 12. Standalone production startup (next start on isolated port)
 * 13. Runtime HTTP 200 verification for HTML and assets
 * 14. Clean server shutdown & temporary workspace cleanup
 *
 * Usage:
 *   node scripts/verify-template-packages.mjs --all
 *   node scripts/verify-template-packages.mjs --template cargo-nova
 *   node scripts/verify-template-packages.mjs --no-cleanup  (preserves validation directories for inspection)
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT_DIR, 'dist', 'packages');
const VALIDATION_BASE_DIR = path.join(ROOT_DIR, 'dist', '.validation');
const CHECKSUMS_FILE = path.join(PACKAGES_DIR, 'checksums.txt');

// Prohibited artifact patterns
const PROHIBITED_PATTERNS = [
  /^\.env/i,
  /^\.git$/i,
  /^\.github$/i,
  /^\.next$/i,
  /^node_modules$/i,
  /\.map$/i,
  /studio/i,
  /marketplace/i,
  /compare/i,
  /(?:audit|phase)[_-]?report/i,
  /^PHASE_/i,
  /scratch/i,
];

// Helper to execute commands synchronously with error capture
function runCmd(cmd, cwd, options = {}) {
  try {
    const stdout = execSync(cmd, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: options.timeout || 180000, // 3 min max
      ...options,
    });
    return { ok: true, stdout, stderr: '', exitCode: 0 };
  } catch (err) {
    return {
      ok: false,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : err.message,
      exitCode: err.status || 1,
    };
  }
}

// Helper: HTTP GET request returning promise
function fetchHttp(url, timeoutMs = 5000) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: timeoutMs }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`HTTP request timed out after ${timeoutMs}ms: ${url}`));
    });
  });
}

// Helper: Wait for port to become active and return 200
async function waitForHttpServer(url, maxAttempts = 30, intervalMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetchHttp(url, 2000);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        return res;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Server failed to respond at ${url} within ${maxAttempts * intervalMs}ms`);
}

// Helper: Extract ZIP using PowerShell Expand-Archive (guaranteed on Windows)
function extractZip(zipPath, destDir) {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });

  const psCmd = `powershell -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}' -Force"`;
  const res = runCmd(psCmd, ROOT_DIR);
  if (!res.ok) {
    throw new Error(`Failed to extract ZIP: ${res.stderr || res.stdout}`);
  }
}

// Load checksums manifest
function loadChecksums() {
  if (!fs.existsSync(CHECKSUMS_FILE)) {
    throw new Error(`Checksums file missing: ${CHECKSUMS_FILE}`);
  }
  const raw = fs.readFileSync(CHECKSUMS_FILE, 'utf8');
  const checksumMap = new Map();
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      checksumMap.set(parts[1], parts[0]);
    }
  }
  return checksumMap;
}

/**
 * Validate a single extracted template package
 */
async function verifyPackage(zipFileName, port, options = {}) {
  const zipPath = path.join(PACKAGES_DIR, zipFileName);
  const slug = zipFileName.replace(/-v[0-9.]+\.zip$/, '');
  const extractDir = path.join(VALIDATION_BASE_DIR, slug);

  console.log(`\n==================================================`);
  console.log(`VERIFYING PACKAGE: ${zipFileName}`);
  console.log(`==================================================`);

  const report = {
    template: slug,
    zipFileName,
    archiveSizeKb: (fs.statSync(zipPath).size / 1024).toFixed(1),
    sha256Match: false,
    extractionOk: false,
    contaminationPassed: false,
    structurePassed: false,
    assetsPassed: false,
    boundaryPassed: false,
    installPassed: false,
    typecheckPassed: false,
    lintPassed: false,
    buildPassed: false,
    startupPassed: false,
    httpPassed: false,
    runtimeAssetsPassed: false,
    finalStatus: 'FAIL',
    errors: [],
    warnings: [],
  };

  try {
    // 1. Checksum verification
    const fileBuf = fs.readFileSync(zipPath);
    const computedSha = crypto.createHash('sha256').update(fileBuf).digest('hex');
    const checksums = loadChecksums();
    const expectedSha = checksums.get(zipFileName);

    if (!expectedSha) {
      report.errors.push(`Package ${zipFileName} not found in checksums.txt`);
    } else if (computedSha !== expectedSha) {
      report.errors.push(`SHA-256 mismatch! Expected ${expectedSha}, got ${computedSha}`);
    } else {
      report.sha256Match = true;
      console.log(`✓ Step 1: SHA-256 Checksum verified (${computedSha.slice(0, 16)}...)`);
    }

    // 2. Isolated extraction
    extractZip(zipPath, extractDir);
    report.extractionOk = true;
    console.log(`✓ Step 2: Extracted cleanly to isolated directory: dist/.validation/${slug}`);

    // 3. Contamination & Security scan
    const allFiles = [];
    function scan(dir) {
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, ent.name);
        const rel = path.relative(extractDir, full).replace(/\\/g, '/');
        allFiles.push({ name: ent.name, full, rel, isDir: ent.isDirectory() });
        if (ent.isDirectory()) {
          scan(full);
        }
      }
    }
    scan(extractDir);

    for (const item of allFiles) {
      for (const pattern of PROHIBITED_PATTERNS) {
        if (pattern.test(item.name) || pattern.test(item.rel)) {
          report.errors.push(`Contamination detected: Prohibited artifact "${item.rel}" matched ${pattern}`);
        }
      }
    }

    if (report.errors.length === 0) {
      report.contaminationPassed = true;
      console.log(`✓ Step 3: Contamination scan passed (0 prohibited files/directories)`);
    }

    // 4. Structural completeness check
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'next.config.ts',
      '.gitignore',
      '.eslintrc.json',
      'next-env.d.ts',
      'README.md',
      'GETTING_STARTED.md',
      'CHANGELOG.md',
      'LICENSE',
      'LOGIFORGE_TEMPLATE.json',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/globals.css',
      'src/data/manifest.ts',
      'src/data/tracking.ts',
      'src/lib/tracking.ts',
      'src/types/template.ts',
      'public/icon.svg',
      'public/favicon.ico',
    ];

    for (const req of requiredFiles) {
      if (!fs.existsSync(path.join(extractDir, req))) {
        report.errors.push(`Missing required file in package: ${req}`);
      }
    }

    if (report.errors.length === 0) {
      report.structurePassed = true;
      console.log(`✓ Step 4: Structural completeness verified (${requiredFiles.length} required files present)`);
    }

    // 5. Local Asset Resolution Scan
    const sourceFiles = allFiles.filter(
      (f) => !f.isDir && (f.name.endsWith('.tsx') || f.name.endsWith('.ts') || f.name.endsWith('.css'))
    );

    const assetRefPatterns = [
      /(?:src|href)=["'](\/[^"']+\.(?:webp|png|jpg|jpeg|svg|ico))["']/g,
      /url\(["']?(\/[^"')]+\.(?:webp|png|jpg|jpeg|svg|ico))["']?\)/g,
    ];

    const referencedAssets = new Set();
    for (const src of sourceFiles) {
      const content = fs.readFileSync(src.full, 'utf8');
      for (const pat of assetRefPatterns) {
        let match;
        while ((match = pat.exec(content)) !== null) {
          referencedAssets.add(match[1]);
        }
      }
    }

    for (const assetPath of referencedAssets) {
      const localDiskPath = path.join(extractDir, 'public', assetPath.replace(/^\//, ''));
      if (!fs.existsSync(localDiskPath)) {
        report.errors.push(`Unresolved local asset reference: "${assetPath}" referenced in code does not exist in package public/`);
      }
    }

    if (report.errors.length === 0) {
      report.assetsPassed = true;
      console.log(`✓ Step 5: Local asset resolution passed (${referencedAssets.size} asset references resolved)`);
    }

    // 6. Standalone Boundary Verification (zero parent imports)
    const importRegex = /(?:import\s+(?:[\s\S]*?from\s+)?|require\()\s*['"]([^'"]+)['"]/g;
    for (const src of sourceFiles) {
      const content = fs.readFileSync(src.full, 'utf8');
      let m;
      while ((m = importRegex.exec(content)) !== null) {
        const importTarget = m[1];
        if (
          importTarget.includes('LOGIFORGE') ||
          importTarget.startsWith('..\\..\\..') ||
          importTarget.startsWith('../../../') ||
          /^[a-zA-Z]:[/\\]/.test(importTarget)
        ) {
          report.errors.push(`Boundary violation in ${src.rel}: Imports forbidden target "${importTarget}"`);
        }
      }
    }

    if (report.errors.length === 0) {
      report.boundaryPassed = true;
      console.log(`✓ Step 6: Standalone boundary verified (0 external/parent repository imports)`);
    }

    // 7. Template Identity Check
    const descriptorPath = path.join(extractDir, 'LOGIFORGE_TEMPLATE.json');
    const descriptor = JSON.parse(fs.readFileSync(descriptorPath, 'utf8'));
    if (descriptor.template.slug !== slug) {
      report.errors.push(`Template descriptor slug mismatch: expected ${slug}, got ${descriptor.template.slug}`);
    } else {
      console.log(`✓ Step 7: Template identity confirmed: ${descriptor.template.name} (${slug})`);
    }

    // If static checks failed, abort heavy runtime steps
    if (report.errors.length > 0) {
      throw new Error(`Static verification failed with ${report.errors.length} errors.`);
    }

    // 8. Fresh npm install
    console.log(`⏳ Step 8: Installing dependencies (npm install --prefer-offline --no-audit --no-fund)...`);
    const installStart = Date.now();
    const installRes = runCmd('npm install --prefer-offline --no-audit --no-fund', extractDir, { timeout: 300000 });
    const installTime = ((Date.now() - installStart) / 1000).toFixed(1);

    if (!installRes.ok) {
      report.errors.push(`npm install failed (code ${installRes.exitCode}): ${installRes.stderr}`);
      throw new Error(`npm install failed`);
    }
    report.installPassed = true;
    console.log(`✓ Step 8: Dependencies installed successfully (${installTime}s)`);

    // 9. Standalone typecheck
    console.log(`⏳ Step 9: Running typecheck (npm run typecheck)...`);
    const tcRes = runCmd('npm run typecheck', extractDir);
    if (!tcRes.ok) {
      report.errors.push(`Typecheck failed:\n${tcRes.stdout}\n${tcRes.stderr}`);
      throw new Error(`Typecheck failed`);
    }
    report.typecheckPassed = true;
    console.log(`✓ Step 9: TypeScript typecheck passed cleanly (0 errors)`);

    // 10. Standalone lint
    console.log(`⏳ Step 10: Running linter (npm run lint)...`);
    const lintRes = runCmd('npm run lint', extractDir);
    if (!lintRes.ok) {
      report.errors.push(`Lint failed:\n${lintRes.stdout}\n${lintRes.stderr}`);
      throw new Error(`Lint failed`);
    }
    report.lintPassed = true;
    console.log(`✓ Step 10: Next.js ESLint validation passed cleanly`);

    // 11. Standalone production build
    console.log(`⏳ Step 11: Compiling production build (npm run build)...`);
    const buildStart = Date.now();
    const buildRes = runCmd('npm run build', extractDir, { timeout: 180000 });
    const buildTime = ((Date.now() - buildStart) / 1000).toFixed(1);

    if (!buildRes.ok) {
      report.errors.push(`Production build failed:\n${buildRes.stdout}\n${buildRes.stderr}`);
      throw new Error(`Production build failed`);
    }
    report.buildPassed = true;
    console.log(`✓ Step 11: Production build succeeded in ${buildTime}s`);

    // 12. Standalone production startup
    console.log(`⏳ Step 12: Starting production server on port ${port} (npm start)...`);
    let serverProcess = null;
    let serverLogs = '';

    try {
      if (process.platform === 'win32') {
        serverProcess = spawn(`npm.cmd start -- -p ${port}`, {
          cwd: extractDir,
          shell: true,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      } else {
        serverProcess = spawn('npm', ['start', '--', '-p', String(port)], {
          cwd: extractDir,
          shell: false,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
      }

      serverProcess.stdout.on('data', (d) => {
        serverLogs += d.toString();
      });
      serverProcess.stderr.on('data', (d) => {
        serverLogs += d.toString();
      });

      const serverUrl = `http://localhost:${port}`;
      const rootRes = await waitForHttpServer(serverUrl, 30, 500);

      if (rootRes.statusCode === 200 && rootRes.body.length > 500) {
        report.startupPassed = true;
        report.httpPassed = true;
        console.log(`✓ Step 12: Production server responded with HTTP 200 OK (${rootRes.body.length} bytes HTML)`);
      } else {
        report.errors.push(`Server returned unexpected status code: ${rootRes.statusCode}`);
      }

      // 13. Runtime Asset Verification
      console.log(`⏳ Step 13: Verifying runtime assets over HTTP...`);
      const runtimeTestAssets = [
        '/icon.svg',
        `/images/${descriptor.package.componentDir}/${descriptor.package.componentDir}-hero.webp`,
      ];

      for (const assetPath of runtimeTestAssets) {
        const assetUrl = `${serverUrl}${assetPath}`;
        try {
          const aRes = await fetchHttp(assetUrl, 3000);
          if (aRes.statusCode === 200) {
            console.log(`  ✓ Asset HTTP 200: ${assetPath} (${aRes.body.length} bytes)`);
          } else {
            report.errors.push(`Runtime asset failed with status ${aRes.statusCode}: ${assetUrl}`);
          }
        } catch (assetErr) {
          report.errors.push(`Runtime asset fetch error: ${assetPath} - ${assetErr.message}`);
        }
      }

      if (report.errors.length === 0) {
        report.runtimeAssetsPassed = true;
        console.log(`✓ Step 13: All runtime assets verified successfully`);
      }
    } finally {
      // Cleanly stop production server
      if (serverProcess) {
        console.log(`Terminating standalone server on port ${port}...`);
        if (process.platform === 'win32') {
          try {
            execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' });
          } catch {
            // Process may have already exited
          }
        } else {
          serverProcess.kill('SIGTERM');
        }
      }
    }

    report.finalStatus = report.errors.length === 0 ? 'PASS' : 'FAIL';
  } catch (err) {
    if (!report.errors.includes(err.message)) {
      report.errors.push(err.message);
    }
    report.finalStatus = 'FAIL';
  } finally {
    // 14. Workspace cleanup
    if (!options.noCleanup && fs.existsSync(extractDir)) {
      console.log(`Cleaning up validation directory: dist/.validation/${slug}`);
      try {
        fs.rmSync(extractDir, { recursive: true, force: true });
      } catch (rmErr) {
        report.warnings.push(`Cleanup warning: Could not fully delete ${extractDir}: ${rmErr.message}`);
      }
    }
  }

  console.log(`==================================================`);
  console.log(`RESULT FOR ${slug}: [${report.finalStatus}] (${report.errors.length} errors)`);
  console.log(`==================================================`);

  return report;
}

/**
 * Main Orchestrator
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
LOGIFORGE Standalone Package Verification & Production Validator

Usage:
  node scripts/verify-template-packages.mjs --all
  node scripts/verify-template-packages.mjs --template <slug>
  node scripts/verify-template-packages.mjs --no-cleanup

Options:
  --all               Validate all 10 registered template packages
  --template <slug>   Validate a specific package (e.g. cargo-nova)
  --no-cleanup        Retain extracted project folders in dist/.validation/
  --help, -h          Show this help message
`);
    process.exit(0);
  }

  const noCleanup = args.includes('--no-cleanup');

  if (!fs.existsSync(PACKAGES_DIR)) {
    console.error(`Error: Packages directory not found: ${PACKAGES_DIR}`);
    console.error(`Run "node scripts/package-templates.mjs --all" first.`);
    process.exit(1);
  }

  const zipFiles = fs
    .readdirSync(PACKAGES_DIR)
    .filter((f) => f.endsWith('.zip'))
    .sort();

  if (zipFiles.length === 0) {
    console.error(`Error: No ZIP packages found in ${PACKAGES_DIR}`);
    process.exit(1);
  }

  let targets = [];
  if (args.includes('--all')) {
    targets = zipFiles;
  } else {
    const tmplIdx = args.indexOf('--template');
    if (tmplIdx !== -1 && args[tmplIdx + 1]) {
      const slug = args[tmplIdx + 1].trim().toLowerCase();
      const match = zipFiles.find((f) => f.startsWith(`${slug}-v`));
      if (!match) {
        console.error(`Error: No package found matching slug "${slug}".`);
        console.error(`Available packages: ${zipFiles.join(', ')}`);
        process.exit(1);
      }
      targets = [match];
    } else {
      console.error('Error: Please specify --all or --template <slug>.');
      process.exit(1);
    }
  }

  console.log(`LOGIFORGE Package Production Validator initializing...`);
  console.log(`Target Packages: ${targets.length}`);
  fs.mkdirSync(VALIDATION_BASE_DIR, { recursive: true });

  const results = [];
  let basePort = 3500;

  for (let i = 0; i < targets.length; i++) {
    const zipName = targets[i];
    const port = basePort + i;
    const res = await verifyPackage(zipName, port, { noCleanup });
    results.push(res);
  }

  // Print comprehensive matrix
  console.log(`\n\n========================================================================================`);
  console.log(`LOGIFORGE PHASE 20B-02 PRODUCTION VALIDATION MATRIX`);
  console.log(`========================================================================================\n`);

  console.table(
    results.map((r) => ({
      Template: r.template,
      ZIP: r.sha256Match ? 'PASS' : 'FAIL',
      Install: r.installPassed ? 'PASS' : 'FAIL',
      Typecheck: r.typecheckPassed ? 'PASS' : 'FAIL',
      Lint: r.lintPassed ? 'PASS' : 'FAIL',
      Build: r.buildPassed ? 'PASS' : 'FAIL',
      Start: r.startupPassed ? 'PASS' : 'FAIL',
      Assets: r.runtimeAssetsPassed ? 'PASS' : 'FAIL',
      Security: r.contaminationPassed && r.boundaryPassed ? 'PASS' : 'FAIL',
      Final: r.finalStatus,
    }))
  );

  const failCount = results.filter((r) => r.finalStatus !== 'PASS').length;
  const passCount = results.filter((r) => r.finalStatus === 'PASS').length;

  console.log(`\nSUMMARY: ${passCount}/${results.length} PASSED, ${failCount} FAILED.`);

  if (failCount > 0) {
    console.error(`\n[VALIDATION FAILED]: One or more template packages failed verification.`);
    for (const r of results.filter((r) => r.finalStatus !== 'PASS')) {
      console.error(`\nFailures in ${r.template}:`);
      for (const err of r.errors) {
        console.error(`  - ${err}`);
      }
    }
    process.exit(1);
  } else {
    console.log(`\n[SUCCESS]: All ${passCount} template packages are 100% production-ready standalone starters.`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('\n[FATAL ERROR]:', err);
  process.exit(1);
});

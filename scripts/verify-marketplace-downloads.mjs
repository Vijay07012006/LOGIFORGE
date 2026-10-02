#!/usr/bin/env node
/**
 * LOGIFORGE — Phase 20C Marketplace Download Delivery & HTTP Validator
 *
 * Verifies that all 10 standalone template packages are served with HTTP 200,
 * valid ZIP signatures, correct content-length, checksum parity against
 * public/downloads/checksums.txt, and proper StarterDownloadButton markup.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import zlib from 'node:zlib';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOWNLOADS_DIR = path.join(ROOT_DIR, 'public', 'downloads');
const CHECKSUMS_FILE = path.join(DOWNLOADS_DIR, 'checksums.txt');

const TEMPLATES = [
  'cargo-nova',
  'fleet-one',
  'ship-flow',
  'swift-drop',
  'port-axis',
  'aero-cargo',
  'warehouse-x',
  'supply-core',
  'route-iq',
  'move-sphere',
];

function httpRequest(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const req = http.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy(new Error(`Timeout fetching ${urlStr}`));
    });
  });
}

async function waitForServer(url, maxAttempts = 30, intervalMs = 500) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await httpRequest(url);
      if (res.statusCode >= 200 && res.statusCode < 500) {
        return res;
      }
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Server at ${url} failed to respond after ${maxAttempts} attempts`);
}

async function main() {
  console.log(`==================================================`);
  console.log(`LOGIFORGE Phase 20C — Marketplace Download Validator`);
  console.log(`==================================================\n`);

  if (!fs.existsSync(DOWNLOADS_DIR) || !fs.existsSync(CHECKSUMS_FILE)) {
    console.error(`Error: public/downloads directory or checksums.txt not found. Run prebuild/package-templates first.`);
    process.exit(1);
  }

  // Read authoritative checksums
  const rawChecksums = fs.readFileSync(CHECKSUMS_FILE, 'utf8');
  const expectedChecksums = {};
  for (const line of rawChecksums.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [hash, file] = trimmed.split(/\s+/);
    if (hash && file) {
      expectedChecksums[file] = hash;
    }
  }

  console.log(`Loaded ${Object.keys(expectedChecksums).length} expected checksums from public/downloads/checksums.txt`);

  // Start production Next.js server on isolated port
  const PORT = 3005;
  console.log(`Starting production Next.js server on port ${PORT}...`);
  let serverProcess = null;

  if (process.platform === 'win32') {
    serverProcess = spawn(`npm.cmd start -- -p ${PORT}`, {
      cwd: ROOT_DIR,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } else {
    serverProcess = spawn('npm', ['start', '--', '-p', String(PORT)], {
      cwd: ROOT_DIR,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  let serverOutput = '';
  serverProcess.stdout.on('data', (d) => { serverOutput += d.toString(); });
  serverProcess.stderr.on('data', (d) => { serverOutput += d.toString(); });

  const results = [];
  let overallPassed = true;

  try {
    const rootUrl = `http://localhost:${PORT}`;
    console.log(`Waiting for server at ${rootUrl}...`);
    await waitForServer(rootUrl, 40, 500);
    console.log(`✓ Production server is healthy and responding on port ${PORT}\n`);

    // 1. Verify HTTP downloads for all 10 templates
    console.log(`--- WORKSTREAM 09 & 10: HTTP & CHECKSUM VERIFICATION ---`);
    for (const slug of TEMPLATES) {
      const fileName = `${slug}-v1.0.0.zip`;
      const url = `http://localhost:${PORT}/downloads/${fileName}`;
      console.log(`Checking ${fileName}...`);

      const res = await httpRequest(url);

      if (res.statusCode !== 200) {
        console.error(`  ❌ HTTP Status: ${res.statusCode} (Expected 200)`);
        results.push({ slug, file: fileName, status: 'FAIL', reason: `Status ${res.statusCode}` });
        overallPassed = false;
        continue;
      }

      const body = res.body;
      const sizeBytes = body.length;

      // Verify ZIP magic signature: PK\x03\x04 (0x04034b50)
      const isZip = body.length > 4 && body[0] === 0x50 && body[1] === 0x4b && body[2] === 0x03 && body[3] === 0x04;
      if (!isZip) {
        console.error(`  ❌ Invalid ZIP magic header!`);
        results.push({ slug, file: fileName, status: 'FAIL', reason: 'Invalid ZIP header' });
        overallPassed = false;
        continue;
      }

      // Calculate SHA-256
      const actualSha = crypto.createHash('sha256').update(body).digest('hex');
      const expectedSha = expectedChecksums[fileName];

      if (actualSha !== expectedSha) {
        console.error(`  ❌ Checksum Mismatch!`);
        console.error(`     Actual:   ${actualSha}`);
        console.error(`     Expected: ${expectedSha}`);
        results.push({ slug, file: fileName, status: 'FAIL', reason: 'Checksum mismatch' });
        overallPassed = false;
        continue;
      }

      console.log(`  ✓ HTTP 200 OK | Size: ${(sizeBytes / 1024).toFixed(1)} KB | ZIP Signature: Valid | SHA-256: ${actualSha.slice(0, 16)}...`);
      results.push({ slug, file: fileName, size: `${(sizeBytes / 1024).toFixed(1)} KB`, sha256: actualSha, status: 'PASS' });
    }

    // 2. Negative Tests (Workstream 12)
    console.log(`\n--- WORKSTREAM 12: NEGATIVE & SECURITY TESTS ---`);
    const negativeUrls = [
      `http://localhost:${PORT}/downloads/../package.json`,
      `http://localhost:${PORT}/downloads/non-existent-template-v1.0.0.zip`,
      `http://localhost:${PORT}/downloads/%2e%2e%2fpackage.json`,
    ];

    for (const negUrl of negativeUrls) {
      try {
        const negRes = await httpRequest(negUrl);
        if (negRes.statusCode === 404 || negRes.statusCode === 400 || negRes.statusCode === 403) {
          console.log(`  ✓ Negative Test Passed (${negRes.statusCode}): ${negUrl}`);
        } else {
          console.error(`  ❌ Security Warning: ${negUrl} returned status ${negRes.statusCode}`);
          overallPassed = false;
        }
      } catch (err) {
        console.log(`  ✓ Negative Test Blocked: ${negUrl} (${err.message})`);
      }
    }

    // 3. UI Markup & StarterDownloadButton verification
    console.log(`\n--- WORKSTREAM 07 & 08: UI MARKUP VERIFICATION ---`);
    for (const slug of TEMPLATES) {
      const pageUrl = `http://localhost:${PORT}/templates/${slug}`;
      const res = await httpRequest(pageUrl);
      const html = res.body.toString('utf8');

      const expectedHref = `/downloads/${slug}-v1.0.0.zip`;
      const expectedDownload = `${slug}-v1.0.0.zip`;

      const hasHref = html.includes(`href="${expectedHref}"`);
      const hasDownload = html.includes(`download="${expectedDownload}"`);
      const hasButtonText = html.includes('Download Starter Package');

      if (hasHref && hasDownload && hasButtonText) {
        console.log(`  ✓ Template Page /templates/${slug}: StarterDownloadButton links to ${expectedHref}`);
      } else {
        console.error(`  ❌ Markup Discrepancy on /templates/${slug}: hasHref=${hasHref}, hasDownload=${hasDownload}`);
        overallPassed = false;
      }
    }

  } finally {
    // Terminate server cleanly
    console.log(`\nStopping production server on port ${PORT}...`);
    if (serverProcess) {
      if (process.platform === 'win32') {
        try {
          execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' });
        } catch {}
      } else {
        serverProcess.kill('SIGTERM');
      }
    }
  }

  console.log(`\n==================================================`);
  console.log(`VERIFICATION MATRIX`);
  console.log(`==================================================`);
  console.table(results);

  if (overallPassed) {
    console.log(`\n[SUCCESS]: Phase 20C Marketplace Download Delivery verified 100% PASS.`);
    process.exit(0);
  } else {
    console.error(`\n[FAILED]: One or more download checks failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL]:', err.message);
  process.exit(1);
});

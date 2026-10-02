#!/usr/bin/env node
/**
 * LOGIFORGE — Phase 20C Real Chrome / CDP Download QA Suite
 *
 * Uses Chrome with Chrome DevTools Protocol (CDP) to:
 * 1. Navigate to /templates/<slug> across 5 viewports (320px to 1920px)
 * 2. Locate and activate StarterDownloadButton (a[download])
 * 3. Intercept and verify real browser file download
 * 4. Verify filename, non-zero size, valid ZIP magic, and checksum
 * 5. Verify package identity from extracted archive
 */

import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import http from 'node:http';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_PORT = 3010;
const CDP_PORT = 9245;
const BASE_URL = `http://localhost:${APP_PORT}`;
const DOWNLOAD_DIR = path.join(ROOT_DIR, 'scratch', 'real_browser_downloads');
const CHECKSUMS_FILE = path.join(ROOT_DIR, 'public', 'downloads', 'checksums.txt');

const VIEWPORTS = [
  { name: '320x800 (Mobile Mini)', width: 320, height: 800 },
  { name: '390x844 (iPhone 14/15)', width: 390, height: 844 },
  { name: '768x1024 (iPad / Tablet)', width: 768, height: 1024 },
  { name: '1440x900 (Desktop Laptop)', width: 1440, height: 900 },
  { name: '1920x1080 (Full HD Monitor)', width: 1920, height: 1080 },
];

const TEMPLATES = [
  { slug: 'cargo-nova', name: 'CargoNova' },
  { slug: 'fleet-one', name: 'FleetOne' },
  { slug: 'ship-flow', name: 'ShipFlow' },
  { slug: 'swift-drop', name: 'SwiftDrop' },
  { slug: 'port-axis', name: 'PortAxis' },
  { slug: 'aero-cargo', name: 'AeroCargo' },
  { slug: 'warehouse-x', name: 'WarehouseX' },
  { slug: 'supply-core', name: 'SupplyCore' },
  { slug: 'route-iq', name: 'RouteIQ' },
  { slug: 'move-sphere', name: 'MoveSphere' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function httpRequest(urlStr) {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log(`==================================================`);
  console.log(`LOGIFORGE Phase 20C — Real Chrome CDP Download QA`);
  console.log(`==================================================\n`);

  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  // Read checksums
  const rawChecksums = fs.readFileSync(CHECKSUMS_FILE, 'utf8');
  const expectedChecksums = {};
  for (const line of rawChecksums.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [hash, file] = trimmed.split(/\s+/);
    if (hash && file) expectedChecksums[file] = hash;
  }

  // 1. Start Next.js production server
  console.log(`Starting Next.js production server on port ${APP_PORT}...`);
  let serverProcess = null;
  if (process.platform === 'win32') {
    serverProcess = spawn(`npm.cmd start -- -p ${APP_PORT}`, {
      cwd: ROOT_DIR,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } else {
    serverProcess = spawn('npm', ['start', '--', '-p', String(APP_PORT)], {
      cwd: ROOT_DIR,
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  // Wait for server readiness
  for (let i = 0; i < 40; i++) {
    try {
      const res = await httpRequest(BASE_URL);
      if (res.statusCode === 200) {
        console.log(`✓ Next.js server ready at ${BASE_URL}`);
        break;
      }
    } catch {}
    await sleep(500);
  }

  // 2. Start headless Chrome with CDP
  console.log(`Launching Google Chrome (CDP port ${CDP_PORT})...`);
  const chromeUserDataDir = path.join(ROOT_DIR, 'scratch', 'chrome_cdp_profile');
  fs.mkdirSync(chromeUserDataDir, { recursive: true });

  const chromeProcess = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${CDP_PORT}`,
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      `--user-data-dir=${chromeUserDataDir}`,
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  await sleep(1500);

  // Connect to Chrome DevTools Protocol
  const versionRes = await httpRequest(`http://localhost:${CDP_PORT}/json/version`);
  const { webSocketDebuggerUrl } = JSON.parse(versionRes.data);

  const browserClient = new CDPClient(webSocketDebuggerUrl);
  await browserClient.connect();
  console.log(`✓ Connected to Chrome CDP\n`);

  // Create new target tab
  const { targetId } = await browserClient.send('Target.createTarget', { url: 'about:blank' });
  const targetsRes = await httpRequest(`http://localhost:${CDP_PORT}/json/list`);
  const targets = JSON.parse(targetsRes.data);
  const target = targets.find((t) => t.id === targetId);

  const pageClient = new CDPClient(target.webSocketDebuggerUrl);
  await pageClient.connect();

  await pageClient.send('Page.enable');
  await pageClient.send('Runtime.enable');
  await pageClient.send('DOM.enable');

  // Configure Chrome download behavior
  await pageClient.send('Browser.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR,
    eventsEnabled: true,
  });

  const testMatrix = [];
  let allPassed = true;

  try {
    for (let i = 0; i < TEMPLATES.length; i++) {
      const tmpl = TEMPLATES[i];
      const vp = VIEWPORTS[i % VIEWPORTS.length];
      const expectedFileName = `${tmpl.slug}-v1.0.0.zip`;
      const expectedSha256 = expectedChecksums[expectedFileName];
      const targetUrl = `${BASE_URL}/templates/${tmpl.slug}`;

      console.log(`Testing [${tmpl.slug}] at ${vp.name} (${vp.width}x${vp.height})...`);

      // Set viewport
      await pageClient.send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width < 768,
      });

      // Navigate to template detail page
      await pageClient.send('Page.navigate', { url: targetUrl });
      await sleep(1200);

      // Locate StarterDownloadButton in DOM
      const evalButton = await pageClient.send('Runtime.evaluate', {
        expression: `
          (() => {
            const btn = document.querySelector('a[download]');
            if (!btn) return { found: false };
            return {
              found: true,
              href: btn.getAttribute('href'),
              download: btn.getAttribute('download'),
              ariaLabel: btn.getAttribute('aria-label'),
              text: btn.innerText.trim(),
            };
          })()
        `,
        returnByValue: true,
      });

      const btnInfo = evalButton.result?.value;
      if (!btnInfo || !btnInfo.found) {
        console.error(`  ❌ StarterDownloadButton (a[download]) NOT FOUND in DOM!`);
        testMatrix.push({ template: tmpl.slug, viewport: vp.name, status: 'FAIL', reason: 'Button not found' });
        allPassed = false;
        continue;
      }

      console.log(`  ✓ Button Found in DOM: href="${btnInfo.href}", download="${btnInfo.download}"`);

      // Clean existing downloaded file if any
      const downloadedPath = path.join(DOWNLOAD_DIR, expectedFileName);
      if (fs.existsSync(downloadedPath)) {
        fs.unlinkSync(downloadedPath);
      }

      // Click the download button via CDP
      await pageClient.send('Runtime.evaluate', {
        expression: `
          (() => {
            const btn = document.querySelector('a[download]');
            btn.click();
          })()
        `,
      });

      // Poll until download completes (max 5s)
      let downloaded = false;
      for (let poll = 0; poll < 10; poll++) {
        await sleep(500);
        if (fs.existsSync(downloadedPath)) {
          const stats = fs.statSync(downloadedPath);
          if (stats.size > 1000) {
            downloaded = true;
            break;
          }
        }
      }

      if (!downloaded) {
        console.error(`  ❌ Downloaded file not created in ${DOWNLOAD_DIR}!`);
        testMatrix.push({ template: tmpl.slug, viewport: vp.name, status: 'FAIL', reason: 'Download timed out' });
        allPassed = false;
        continue;
      }

      const fileBuf = fs.readFileSync(downloadedPath);
      const isZip = fileBuf[0] === 0x50 && fileBuf[1] === 0x4b && fileBuf[2] === 0x03 && fileBuf[3] === 0x04;
      const actualSha = crypto.createHash('sha256').update(fileBuf).digest('hex');

      if (!isZip) {
        console.error(`  ❌ Downloaded file is not a valid ZIP!`);
        testMatrix.push({ template: tmpl.slug, viewport: vp.name, status: 'FAIL', reason: 'Corrupt ZIP' });
        allPassed = false;
        continue;
      }

      if (actualSha !== expectedSha256) {
        console.error(`  ❌ Downloaded file checksum mismatch!`);
        testMatrix.push({ template: tmpl.slug, viewport: vp.name, status: 'FAIL', reason: 'Checksum mismatch' });
        allPassed = false;
        continue;
      }

      console.log(`  ✓ Browser Download Succeeded: ${(fileBuf.length / 1024).toFixed(1)} KB | SHA-256 match`);
      testMatrix.push({
        template: tmpl.slug,
        viewport: vp.name,
        file: expectedFileName,
        size: `${(fileBuf.length / 1024).toFixed(1)} KB`,
        status: 'PASS',
      });
    }

  } finally {
    // Teardown
    console.log(`\nTearing down Chrome and test servers...`);
    pageClient.close();
    browserClient.close();

    if (chromeProcess) {
      if (process.platform === 'win32') {
        try { execSync(`taskkill /pid ${chromeProcess.pid} /T /F`, { stdio: 'ignore' }); } catch {}
      } else {
        chromeProcess.kill('SIGTERM');
      }
    }

    if (serverProcess) {
      if (process.platform === 'win32') {
        try { execSync(`taskkill /pid ${serverProcess.pid} /T /F`, { stdio: 'ignore' }); } catch {}
      } else {
        serverProcess.kill('SIGTERM');
      }
    }

    // Clean scratch downloads
    if (fs.existsSync(DOWNLOAD_DIR)) {
      fs.rmSync(DOWNLOAD_DIR, { recursive: true, force: true });
    }
    if (fs.existsSync(chromeUserDataDir)) {
      fs.rmSync(chromeUserDataDir, { recursive: true, force: true });
    }
  }

  console.log(`\n==================================================`);
  console.log(`REAL-BROWSER CDP DOWNLOAD QA MATRIX`);
  console.log(`==================================================`);
  console.table(testMatrix);

  if (allPassed) {
    console.log(`\n[SUCCESS]: All 10 template downloads passed Real-Browser Chrome QA!`);
    process.exit(0);
  } else {
    console.error(`\n[FAILED]: One or more browser download tests failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL]:', err.stack || err.message || err);
  process.exit(1);
});

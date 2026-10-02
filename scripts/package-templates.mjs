#!/usr/bin/env node
/**
 * LOGIFORGE — Standalone Template Packaging Engine
 * Phase 20B-01: Metadata-Driven Packaging Compiler
 *
 * Compiles any registered LOGIFORGE template into an autonomous,
 * production-ready Next.js starter project with zero platform dependencies.
 *
 * Usage:
 *   node scripts/package-templates.mjs --all
 *   node scripts/package-templates.mjs --template cargo-nova
 *   node scripts/package-templates.mjs --clean
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Output directories
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PACKAGES_DIR = path.join(DIST_DIR, 'packages');
const STAGING_BASE_DIR = path.join(DIST_DIR, '.staging');

// Approved source directories for security checks
const APPROVED_SOURCE_ROOTS = [
  path.join(ROOT_DIR, 'src'),
  path.join(ROOT_DIR, 'public'),
  path.join(ROOT_DIR, 'LICENSE'),
];

/**
 * Standard CRC32 table & calculator (works on all Node versions)
 */
const CRC_TABLE = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  CRC_TABLE[n] = c;
}

function calculateCrc32(buffer) {
  if (typeof zlib.crc32 === 'function') {
    return zlib.crc32(buffer);
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buffer.length; i++) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Pure Node.js Zero-Dependency ZIP Archive Builder
 * Conforms to standard PKZIP 2.0 format (DEFLATE compressed)
 */
function createZipArchive(entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  // Sort entries for deterministic builds
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of sorted) {
    const nameBuf = Buffer.from(entry.name.replace(/\\/g, '/'), 'utf8');
    const dataBuf = Buffer.isBuffer(entry.data)
      ? entry.data
      : Buffer.from(entry.data, 'utf8');

    const compressed = zlib.deflateRawSync(dataBuf, { level: 9 });
    const crc = calculateCrc32(dataBuf);

    // Local file header (30 bytes + name length)
    const lh = Buffer.alloc(30 + nameBuf.length);
    lh.writeUInt32LE(0x04034b50, 0); // signature
    lh.writeUInt16LE(20, 4);         // version needed (2.0)
    lh.writeUInt16LE(0, 6);          // flags
    lh.writeUInt16LE(8, 8);          // compression method (8 = deflate)
    lh.writeUInt16LE(0, 10);         // time
    lh.writeUInt16LE(0, 12);         // date
    lh.writeUInt32LE(crc, 14);       // crc-32
    lh.writeUInt32LE(compressed.length, 18); // compressed size
    lh.writeUInt32LE(dataBuf.length, 22);    // uncompressed size
    lh.writeUInt16LE(nameBuf.length, 26);    // file name length
    lh.writeUInt16LE(0, 28);                 // extra field length
    nameBuf.copy(lh, 30);

    // Central directory header (46 bytes + name length)
    const ch = Buffer.alloc(46 + nameBuf.length);
    ch.writeUInt32LE(0x02014b50, 0); // signature
    ch.writeUInt16LE(20, 4);         // version made by
    ch.writeUInt16LE(20, 6);         // version needed
    ch.writeUInt16LE(0, 8);          // flags
    ch.writeUInt16LE(8, 10);         // compression method
    ch.writeUInt16LE(0, 12);         // time
    ch.writeUInt16LE(0, 14);         // date
    ch.writeUInt32LE(crc, 16);       // crc-32
    ch.writeUInt32LE(compressed.length, 20); // compressed size
    ch.writeUInt32LE(dataBuf.length, 24);    // uncompressed size
    ch.writeUInt16LE(nameBuf.length, 28);    // file name length
    ch.writeUInt16LE(0, 30);         // extra field length
    ch.writeUInt16LE(0, 32);         // file comment length
    ch.writeUInt16LE(0, 34);         // disk number start
    ch.writeUInt16LE(0, 36);         // internal file attributes
    ch.writeUInt32LE(0, 38);         // external file attributes
    ch.writeUInt32LE(offset, 42);    // relative offset of local header
    nameBuf.copy(ch, 46);

    localHeaders.push(lh, compressed);
    centralHeaders.push(ch);
    offset += lh.length + compressed.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((sum, h) => sum + h.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4);          // disk number
  eocd.writeUInt16LE(0, 6);          // start disk
  eocd.writeUInt16LE(sorted.length, 8);  // entries on disk
  eocd.writeUInt16LE(sorted.length, 10); // total entries
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);         // comment length

  return Buffer.concat([...localHeaders, ...centralHeaders, eocd]);
}

/**
 * Load template manifests safely from TypeScript source without external tools
 */
function loadTemplateManifests() {
  const manifestsPath = path.join(ROOT_DIR, 'src', 'data', 'templates', 'manifests.ts');
  if (!fs.existsSync(manifestsPath)) {
    throw new Error(`Template manifests file not found: ${manifestsPath}`);
  }
  const raw = fs.readFileSync(manifestsPath, 'utf8');
  // Strip import statements and TypeScript type annotations
  const cleaned = raw
    .replace(/import\s+type\s+[^;]+;/g, '')
    .replace(/export\s+const\s+TEMPLATE_MANIFESTS\s*:\s*Template\[\]\s*=/g, 'const TEMPLATE_MANIFESTS =')
    + '\nTEMPLATE_MANIFESTS;';

  const sandbox = {};
  const manifests = vm.runInNewContext(cleaned, sandbox);
  if (!Array.isArray(manifests) || manifests.length === 0) {
    throw new Error('Failed to parse TEMPLATE_MANIFESTS from source.');
  }
  return manifests;
}

/**
 * Load global tracking fixtures safely from TypeScript source
 */
function loadTrackingFixtures() {
  const fixturesPath = path.join(ROOT_DIR, 'src', 'data', 'tracking', 'fixtures.ts');
  if (!fs.existsSync(fixturesPath)) {
    return {};
  }
  const raw = fs.readFileSync(fixturesPath, 'utf8');
  const cleaned = raw
    .replace(/import\s+type\s+[^;]+;/g, '')
    .replace(/export\s+const\s+SIMULATED_TRACKING_FIXTURES\s*:\s*Record<[^>]+>\s*=/g, 'const FIXTURES =')
    + '\nFIXTURES;';

  const sandbox = {};
  return vm.runInNewContext(cleaned, sandbox) || {};
}

/**
 * Get current git commit hash for metadata traceability
 */
function getSourceCommit() {
  try {
    const headPath = path.join(ROOT_DIR, '.git', 'HEAD');
    if (!fs.existsSync(headPath)) return 'v1.0.0-release';
    const head = fs.readFileSync(headPath, 'utf8').trim();
    if (head.startsWith('ref: ')) {
      const refPath = path.join(ROOT_DIR, '.git', head.slice(5));
      if (fs.existsSync(refPath)) {
        return fs.readFileSync(refPath, 'utf8').trim().slice(0, 7);
      }
    }
    return head.slice(0, 7);
  } catch {
    return 'ccee91a';
  }
}

/**
 * Resolve standardized packaging configuration for any template
 * (Convention-over-configuration with registry override support)
 */
function resolveTemplatePackageConfig(template) {
  const slug = template.slug;
  const cfg = template.packageConfig || {};

  const componentDir = cfg.componentDir || slug.replace(/-/g, '');
  const entryComponent =
    cfg.entryComponent ||
    slug
      .split('-')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join('') + 'Website';

  const heroAssetPath =
    cfg.heroAssetPath || `/images/${componentDir}/${componentDir}-hero.webp`;

  const sampleFixtures =
    cfg.sampleFixtures ||
    template.sections?.tracking?.sampleTrackingNumbers ||
    [];

  return {
    packageName: cfg.packageName || `${slug}-starter`,
    packageSlug: slug,
    version: cfg.version || template.version || '1.0.0',
    frameworkVersion: cfg.frameworkVersion || '^15.5.0',
    minNodeVersion: cfg.minNodeVersion || '>=20.0.0',
    entryComponent,
    componentDir,
    heroAssetPath,
    sampleFixtures,
  };
}

/**
 * Generate customer-facing package.json
 */
function generatePackageJson(template, pkgConfig) {
  return JSON.stringify(
    {
      name: pkgConfig.packageName,
      version: pkgConfig.version,
      description: `${template.name} — ${template.tagline}. Autonomous logistics website starter.`,
      private: true,
      engines: {
        node: pkgConfig.minNodeVersion,
        npm: '>=10.0.0',
      },
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        typecheck: 'tsc --noEmit',
      },
      dependencies: {
        'lucide-react': '^1.16.0',
        next: pkgConfig.frameworkVersion,
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {
        '@types/node': '^22.0.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        eslint: '^8.57.1',
        'eslint-config-next': '^15.5.0',
        typescript: '^5.7.0',
      },
      license: 'SEE LICENSE IN LICENSE',
      keywords: [
        'logistics',
        'transportation',
        'website-template',
        'nextjs',
        template.category,
        ...template.tags.map((t) => t.toLowerCase()),
      ],
    },
    null,
    2
  );
}

/**
 * Generate tsconfig.json for customer starter
 */
function generateTsConfig() {
  return JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2
  );
}

/**
 * Generate next.config.ts for customer starter
 */
function generateNextConfig() {
  return `import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
`;
}

/**
 * Generate .gitignore
 */
function generateGitignore() {
  return `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build
/dist

# Misc
.DS_Store
*.pem

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local environment files
.env*.local
.env
`;
}

/**
 * Generate .eslintrc.json
 */
function generateEslintConfig() {
  return (
    JSON.stringify(
      {
        root: true,
        extends: ['next/core-web-vitals', 'next/typescript'],
      },
      null,
      2
    ) + '\n'
  );
}

/**
 * Generate next-env.d.ts
 */
function generateNextEnv() {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
`;
}

/**
 * Generate standalone globals.css
 */
function generateStandaloneGlobalsCss() {
  return `*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: #090d16;
  color: #f8fafc;
  font-size: 16px;
  line-height: 1.6;
  -webkit-text-size-adjust: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
  overflow-x: hidden;
  max-width: 100vw;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #090d16;
  color: #f8fafc;
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}

button, input, select, textarea {
  font: inherit;
  color: inherit;
  background: transparent;
  border: none;
}

button {
  cursor: pointer;
}

img, svg, video {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #090d16;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 9999px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
}

/**
 * Generate standalone app/layout.tsx
 */
function generateLayout(template) {
  const safeName = template.name.replace(/'/g, "\\'");
  const safeTagline = template.tagline.replace(/'/g, "\\'");
  const safeDesc = template.shortDescription.replace(/'/g, "\\'");

  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${safeName} — ${safeTagline}',
  description: '${safeDesc}',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;
}

/**
 * Generate standalone app/page.tsx
 */
function generatePage(template, pkgConfig) {
  return `'use client';

import React from 'react';
import { ${pkgConfig.entryComponent} } from '@/components/template/${pkgConfig.entryComponent}';
import { TEMPLATE_MANIFEST } from '@/data/manifest';

export default function HomePage() {
  return <${pkgConfig.entryComponent} template={TEMPLATE_MANIFEST} />;
}
`;
}

/**
 * Generate standalone data/manifest.ts
 */
function generateManifestFile(template) {
  return `import type { Template } from '@/types/template';

export const TEMPLATE_MANIFEST: Template = ${JSON.stringify(template, null, 2)};
`;
}

/**
 * Generate localized data/tracking.ts with only relevant sample fixtures
 */
function generateTrackingData(pkgConfig, allFixtures) {
  const selectedFixtures = {};
  for (const key of pkgConfig.sampleFixtures) {
    if (allFixtures[key]) {
      selectedFixtures[key] = allFixtures[key];
    }
  }

  // Fallback if none matched
  if (Object.keys(selectedFixtures).length === 0) {
    const firstKey = Object.keys(allFixtures)[0];
    if (firstKey) selectedFixtures[firstKey] = allFixtures[firstKey];
  }

  return `import type { SimulatedShipment } from '@/types/template';

/**
 * Localized Simulated Logistics Tracking Fixtures
 * For production use, replace these static fixtures with real carrier API integration.
 */
export const SIMULATED_TRACKING_FIXTURES: Record<string, SimulatedShipment> = ${JSON.stringify(
    selectedFixtures,
    null,
    2
  )};
`;
}

/**
 * Generate standalone lib/tracking.ts
 */
function generateTrackingLib() {
  return `import { SIMULATED_TRACKING_FIXTURES } from '@/data/tracking';
import type { SimulatedShipment } from '@/types/template';

export function lookupSimulatedShipment(query: string): SimulatedShipment | null {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return null;

  return SIMULATED_TRACKING_FIXTURES[normalized] || null;
}

export function getSampleTrackingNumbers(): string[] {
  return Object.keys(SIMULATED_TRACKING_FIXTURES);
}

export function getAllSimulatedShipments(): SimulatedShipment[] {
  return Object.values(SIMULATED_TRACKING_FIXTURES);
}
`;
}

/**
 * Generate standalone types/template.ts
 */
function generateTypes() {
  const rootTypesPath = path.join(ROOT_DIR, 'src', 'types', 'template.ts');
  return fs.readFileSync(rootTypesPath, 'utf8');
}

/**
 * Generate customer README.md
 */
function generateReadme(template, pkgConfig) {
  const accentPrimary = template.theme.primaryAccent || '#d4af37';
  const accentSecondary = template.theme.secondaryAccent || '#1b2a4a';

  return `# ${template.name} — Logistics Website Starter

> ${template.tagline}

Welcome to your standalone **${template.name}** website project. This codebase was compiled by the **LOGIFORGE Packaging Engine** and delivers a complete, production-ready Next.js 15 application engineered specifically for the **${template.industry}** sector.

---

## 1. Quickstart

### Prerequisites
- **Node.js:** \`${pkgConfig.minNodeVersion}\`
- **Package Manager:** \`npm >= 10.0.0\` (or pnpm / yarn)

### Installation
\`\`\`bash
# Install dependencies
npm install

# Start local development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to view your live website.

### Production Build
\`\`\`bash
# Typecheck
npm run typecheck

# Lint
npm run lint

# Compile optimized static output
npm run build

# Run production server
npm run start
\`\`\`

---

## 2. Project Architecture

\`\`\`
├── public/
│   ├── icon.svg                     # Site favicon icon
│   └── images/
│       └── ${pkgConfig.componentDir}/
│           └── ${pkgConfig.componentDir}-hero.webp    # High-resolution hero image
├── src/
│   ├── app/
│   │   ├── globals.css              # Global layout reset & scroll styles
│   │   ├── layout.tsx               # Root HTML shell & SEO meta configuration
│   │   └── page.tsx                 # Root entry page rendering ${pkgConfig.entryComponent}
│   ├── components/
│   │   ├── common/                  # Shared modular components (Header, Footer, Metrics)
│   │   └── template/                # Domain-specific section components
│   ├── data/
│   │   ├── manifest.ts              # Strongly typed template theme & content manifest
│   │   └── tracking.ts              # Local simulated waybill fixtures
│   ├── lib/
│   │   └── tracking.ts              # Waybill query & lookup utilities
│   └── types/
│       └── template.ts              # Canonical domain TypeScript interfaces
├── LOGIFORGE_TEMPLATE.json          # Package provenance & build fingerprint
├── LICENSE                          # LOGIFORGE Commercial Developer License
├── next.config.ts                   # Next.js configuration
├── package.json                     # Minimal dependency manifest
└── tsconfig.json                    # Strict TypeScript configuration
\`\`\`

---

## 3. Brand & Theme Customization

This template utilizes **CSS Modules** with locally scoped design tokens to guarantee zero style bleed.

To customize your branding palette, open:
\`src/components/template/${pkgConfig.entryComponent.replace('Website', '')}.module.css\`

Edit the root theme variables:
\`\`\`css
/* Primary Theme Accents */
--tmpl-accent: ${accentPrimary};            /* Primary brand accent */
--tmpl-accent-secondary: ${accentSecondary};  /* Secondary brand accent */
--tmpl-bg: ${template.theme.backgroundColor || '#090d16'};                /* Root background color */
--tmpl-surface: ${template.theme.surfaceColor || '#0f172a'};           /* Elevated card surface */
--tmpl-text: ${template.theme.textColor || '#f8fafc'};              /* Text color */
--tmpl-radius: ${template.theme.borderRadius || '4px'};                 /* Element border radius */
\`\`\`

---

## 4. Connecting Real Logistics APIs

Your template ships with realistic simulated fixtures for instant demonstration.

### Replacing Simulated Tracking with a Real Carrier API
Open \`src/lib/tracking.ts\` and update \`lookupSimulatedShipment\`:

\`\`\`typescript
export async function lookupShipment(trackingNumber: string) {
  // Example: Query your live TMS, WMS, or carrier API (e.g. Project44, Samsara, Shippo)
  const res = await fetch(\`https://api.yourlogistics.com/v1/shipments/\${trackingNumber}\`, {
    headers: { Authorization: \`Bearer \${process.env.LOGISTICS_API_KEY}\` }
  });
  if (!res.ok) return null;
  return await res.json();
}
\`\`\`

---

## 5. Deployment

This project is 100% standard **Next.js 15 App Router** and can be deployed anywhere with zero configuration:

- **Vercel:** Import your repository into Vercel. Framework preset is automatically detected as Next.js.
- **Netlify:** Connect your Git repository and set the publish directory to \`.next\`.
- **AWS / Docker:** Build a standard standalone container via \`npm run build\`.

---

## 6. Commercial License & Terms

This template is licensed under the **LOGIFORGE Commercial Developer License** (see \`LICENSE\` file).
- ✅ You **may** customize, adapt, and build commercial websites and client applications.
- ✅ You **may** deliver finished customized end-products to your clients.
- ❌ You **may not** redistribute or resell this codebase as a raw template, boilerplate, or competing theme on any marketplace.

---

*Compiled by LOGIFORGE Packaging Engine • Version ${pkgConfig.version} • Source Commit: ${getSourceCommit()}*
`;
}

/**
 * Generate LOGIFORGE_TEMPLATE.json metadata descriptor
 */
function generateTemplateDescriptor(template, pkgConfig, sourceCommit) {
  return JSON.stringify(
    {
      $schema: 'https://logiforge.com/schemas/template-package-v1.json',
      product: 'LOGIFORGE Standalone Template Starter',
      template: {
        id: template.id,
        slug: template.slug,
        name: template.name,
        tagline: template.tagline,
        category: template.category,
        style: template.style,
        version: pkgConfig.version,
      },
      package: {
        name: pkgConfig.packageName,
        version: pkgConfig.version,
        framework: 'Next.js 15+ App Router',
        language: 'TypeScript Strict',
        nodeRequirement: pkgConfig.minNodeVersion,
        styling: 'CSS Modules (Scoped Tokens)',
        entryComponent: pkgConfig.entryComponent,
        componentDir: pkgConfig.componentDir,
      },
      generator: {
        engine: 'LOGIFORGE Packaging Engine v1.0.0',
        generatedAt: new Date().toISOString(),
        sourceCommit,
      },
      license: {
        type: 'LogiForge Commercial Developer License',
        file: 'LICENSE',
      },
    },
    null,
    2
  );
}

/**
 * Strict file validation before archiving
 */
function validateStagingDirectory(stagingDir, template, pkgConfig) {
  const errors = [];

  // Required root files
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'next.config.ts',
    '.gitignore',
    '.eslintrc.json',
    'next-env.d.ts',
    'README.md',
    'LICENSE',
    'LOGIFORGE_TEMPLATE.json',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/globals.css',
    'src/data/manifest.ts',
    'src/data/tracking.ts',
    'src/lib/tracking.ts',
    'src/types/template.ts',
    `src/components/template/${pkgConfig.entryComponent}.tsx`,
    `public/images/${pkgConfig.componentDir}/${pkgConfig.componentDir}-hero.webp`,
    'public/icon.svg',
  ];

  for (const rel of requiredFiles) {
    const fullPath = path.join(stagingDir, rel);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Missing required file: ${rel}`);
    }
  }

  // Security & cleanliness scan: recursively inspect all files in staging
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.relative(stagingDir, fullPath).replace(/\\/g, '/');

      // Reject secrets or environment files
      if (entry.name.startsWith('.env')) {
        errors.push(`Forbidden environment file detected: ${relPath}`);
      }

      // Reject git metadata
      if (entry.name === '.git' || entry.name === '.github') {
        errors.push(`Forbidden git metadata detected: ${relPath}`);
      }

      // Reject other template components
      if (entry.isDirectory() && dir.includes('src/components')) {
        if (entry.name !== 'template' && entry.name !== 'common') {
          errors.push(`Forbidden extraneous component directory detected: ${relPath}`);
        }
      }

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        // Validate internal @/ imports
        const content = fs.readFileSync(fullPath, 'utf8');
        const importMatches = content.match(/from\s+['"](@\/[^'"]+)['"]/g) || [];
        for (const m of importMatches) {
          const importPath = m.match(/['"](@\/[^'"]+)['"]/)[1];
          const resolvedRel = importPath.replace(/^@\//, 'src/');
          const candTs = path.join(stagingDir, resolvedRel + '.ts');
          const candTsx = path.join(stagingDir, resolvedRel + '.tsx');
          const candDir = path.join(stagingDir, resolvedRel, 'index.ts');
          const candDirTsx = path.join(stagingDir, resolvedRel, 'index.tsx');

          if (!fs.existsSync(candTs) && !fs.existsSync(candTsx) && !fs.existsSync(candDir) && !fs.existsSync(candDirTsx)) {
            errors.push(`Unresolved @/ import in ${relPath}: ${importPath}`);
          }
        }
      }
    }
  }

  scanDir(stagingDir);

  return errors;
}

/**
 * Collect all files in staging into ZIP memory entries
 */
function collectStagingEntries(stagingDir) {
  const entries = [];

  function traverse(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        traverse(full);
      } else if (item.isFile()) {
        const rel = path.relative(stagingDir, full).replace(/\\/g, '/');
        const data = fs.readFileSync(full);
        entries.push({ name: rel, data });
      }
    }
  }

  traverse(stagingDir);
  return entries;
}

/**
 * Package a single template into a standalone Next.js project ZIP
 */
async function packageSingleTemplate(template, allFixtures, sourceCommit, outputDir = PACKAGES_DIR) {
  const pkgConfig = resolveTemplatePackageConfig(template);
  const stagingDir = path.join(STAGING_BASE_DIR, template.slug);

  console.log(`\n==================================================`);
  console.log(`Compiling: ${template.name} (${template.slug}) v${pkgConfig.version}`);
  console.log(`==================================================`);

  // 1. Clean and initialize staging directory
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  // 2. Copy template component files
  const templateSrcDir = path.join(ROOT_DIR, 'src', 'components', 'templates', pkgConfig.componentDir);
  const templateDestDir = path.join(stagingDir, 'src', 'components', 'template');
  fs.mkdirSync(templateDestDir, { recursive: true });

  if (!fs.existsSync(templateSrcDir)) {
    throw new Error(`Template source directory does not exist: ${templateSrcDir}`);
  }

  for (const file of fs.readdirSync(templateSrcDir)) {
    const srcFile = path.join(templateSrcDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, path.join(templateDestDir, file));
    }
  }

  // 3. Copy shared common components
  const commonSrcDir = path.join(ROOT_DIR, 'src', 'components', 'templates', 'common');
  const commonDestDir = path.join(stagingDir, 'src', 'components', 'common');
  fs.mkdirSync(commonDestDir, { recursive: true });

  for (const file of fs.readdirSync(commonSrcDir)) {
    const srcFile = path.join(commonSrcDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, path.join(commonDestDir, file));
    }
  }

  // 4. Copy template hero asset
  const heroRel = pkgConfig.heroAssetPath.replace(/^\//, '');
  const heroSrc = path.join(ROOT_DIR, 'public', heroRel);
  const heroDest = path.join(stagingDir, 'public', heroRel);
  fs.mkdirSync(path.dirname(heroDest), { recursive: true });

  if (fs.existsSync(heroSrc)) {
    fs.copyFileSync(heroSrc, heroDest);
  } else {
    throw new Error(`Hero image asset not found: ${heroSrc}`);
  }

  // 5. Copy brand icon / favicon
  const candidateIconSources = [
    path.join(ROOT_DIR, 'src', 'app', 'icon.svg'),
    path.join(ROOT_DIR, 'public', 'icon.svg'),
  ];
  const iconSrc = candidateIconSources.find((p) => fs.existsSync(p));
  if (iconSrc) {
    fs.mkdirSync(path.join(stagingDir, 'public'), { recursive: true });
    fs.mkdirSync(path.join(stagingDir, 'src', 'app'), { recursive: true });
    fs.copyFileSync(iconSrc, path.join(stagingDir, 'public', 'icon.svg'));
    fs.copyFileSync(iconSrc, path.join(stagingDir, 'public', 'favicon.ico'));
    fs.copyFileSync(iconSrc, path.join(stagingDir, 'src', 'app', 'icon.svg'));
  }

  // 6. Copy root LICENSE
  const licenseSrc = path.join(ROOT_DIR, 'LICENSE');
  if (fs.existsSync(licenseSrc)) {
    fs.copyFileSync(licenseSrc, path.join(stagingDir, 'LICENSE'));
  }

  // 7. Write generated files
  fs.mkdirSync(path.join(stagingDir, 'src', 'app'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'src', 'data'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'src', 'lib'), { recursive: true });
  fs.mkdirSync(path.join(stagingDir, 'src', 'types'), { recursive: true });

  fs.writeFileSync(path.join(stagingDir, 'package.json'), generatePackageJson(template, pkgConfig));
  fs.writeFileSync(path.join(stagingDir, 'tsconfig.json'), generateTsConfig());
  fs.writeFileSync(path.join(stagingDir, 'next.config.ts'), generateNextConfig());
  fs.writeFileSync(path.join(stagingDir, '.gitignore'), generateGitignore());
  fs.writeFileSync(path.join(stagingDir, '.eslintrc.json'), generateEslintConfig());
  fs.writeFileSync(path.join(stagingDir, 'next-env.d.ts'), generateNextEnv());
  fs.writeFileSync(path.join(stagingDir, 'README.md'), generateReadme(template, pkgConfig));
  fs.writeFileSync(path.join(stagingDir, 'LOGIFORGE_TEMPLATE.json'), generateTemplateDescriptor(template, pkgConfig, sourceCommit));

  fs.writeFileSync(path.join(stagingDir, 'src', 'app', 'layout.tsx'), generateLayout(template));
  fs.writeFileSync(path.join(stagingDir, 'src', 'app', 'page.tsx'), generatePage(template, pkgConfig));
  fs.writeFileSync(path.join(stagingDir, 'src', 'app', 'globals.css'), generateStandaloneGlobalsCss());

  fs.writeFileSync(path.join(stagingDir, 'src', 'data', 'manifest.ts'), generateManifestFile(template));
  fs.writeFileSync(path.join(stagingDir, 'src', 'data', 'tracking.ts'), generateTrackingData(pkgConfig, allFixtures));
  fs.writeFileSync(path.join(stagingDir, 'src', 'lib', 'tracking.ts'), generateTrackingLib());
  fs.writeFileSync(path.join(stagingDir, 'src', 'types', 'template.ts'), generateTypes());

  // 8. Validate staging directory
  const validationErrors = validateStagingDirectory(stagingDir, template, pkgConfig);
  if (validationErrors.length > 0) {
    console.error(`Validation FAILED for ${template.slug}:`);
    for (const err of validationErrors) {
      console.error(`  - ${err}`);
    }
    throw new Error(`Validation failed for ${template.slug} with ${validationErrors.length} errors.`);
  }
  console.log(`✓ Validation passed: 0 missing files, 0 broken imports, 0 security leaks.`);

  // 9. Collect entries and create ZIP archive
  const entries = collectStagingEntries(stagingDir);
  console.log(`✓ Collected ${entries.length} files for packaging.`);

  const zipBuffer = createZipArchive(entries);
  const zipFileName = `${template.slug}-v${pkgConfig.version}.zip`;
  const zipFilePath = path.join(outputDir, zipFileName);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(zipFilePath, zipBuffer);

  const sha256 = crypto.createHash('sha256').update(zipBuffer).digest('hex');
  const sizeKb = (zipBuffer.length / 1024).toFixed(1);

  console.log(`✓ Archive created: ${path.relative(ROOT_DIR, zipFilePath)} (${sizeKb} KB)`);
  console.log(`✓ SHA-256: ${sha256}`);

  return {
    slug: template.slug,
    name: template.name,
    version: pkgConfig.version,
    fileName: zipFileName,
    filePath: zipFilePath,
    sizeKb,
    fileCount: entries.length,
    sha256,
  };
}

/**
 * Main Compiler Orchestrator
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
LOGIFORGE Standalone Template Packaging Engine

Usage:
  node scripts/package-templates.mjs --all
  node scripts/package-templates.mjs --template <slug>
  node scripts/package-templates.mjs --clean
  node scripts/package-templates.mjs --output <dir>

Options:
  --all               Package all 10 registered flagship templates
  --template <slug>   Package specific template (e.g. cargo-nova)
  --output <dir>      Target output directory (defaults to dist/packages)
  --clean             Clean target output directory before packaging
  --help, -h          Show this help message
`);
    process.exit(0);
  }

  const startTime = Date.now();
  console.log('LOGIFORGE Packaging Engine v1.0.0 initializing...');

  const manifests = loadTemplateManifests();
  const allFixtures = loadTrackingFixtures();
  const sourceCommit = getSourceCommit();

  // Parse --output option
  let outputDir = PACKAGES_DIR;
  const outIdx = args.indexOf('--output');
  if (outIdx !== -1 && args[outIdx + 1]) {
    const rawOut = args[outIdx + 1].trim();
    outputDir = path.isAbsolute(rawOut) ? rawOut : path.resolve(ROOT_DIR, rawOut);
  }

  console.log(`Loaded ${manifests.length} template manifests from registry.`);
  console.log(`Loaded ${Object.keys(allFixtures).length} simulated tracking fixtures.`);
  console.log(`Source git commit: ${sourceCommit}`);
  console.log(`Target output directory: ${path.relative(ROOT_DIR, outputDir) || outputDir}`);

  if (args.includes('--clean')) {
    if (outputDir === PACKAGES_DIR) {
      console.log('Cleaning dist/ directory...');
      if (fs.existsSync(DIST_DIR)) {
        fs.rmSync(DIST_DIR, { recursive: true, force: true });
      }
    } else {
      console.log(`Cleaning output directory: ${path.relative(ROOT_DIR, outputDir)}...`);
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
      }
    }
  }

  fs.mkdirSync(outputDir, { recursive: true });

  let targetTemplates = [];

  if (args.includes('--all')) {
    targetTemplates = manifests;
  } else {
    const tmplIdx = args.indexOf('--template');
    if (tmplIdx !== -1 && args[tmplIdx + 1]) {
      const targetSlug = args[tmplIdx + 1].trim().toLowerCase();
      const found = manifests.find((m) => m.slug === targetSlug);
      if (!found) {
        console.error(`Error: Unknown template slug "${targetSlug}".`);
        console.error(`Available slugs: ${manifests.map((m) => m.slug).join(', ')}`);
        process.exit(1);
      }
      targetTemplates = [found];
    } else {
      console.error('Error: Please specify --all or --template <slug>.');
      process.exit(1);
    }
  }

  const results = [];
  for (const template of targetTemplates) {
    const res = await packageSingleTemplate(template, allFixtures, sourceCommit, outputDir);
    results.push(res);
  }

  // Write / Update checksums.txt in outputDir
  const checksumsPath = path.join(outputDir, 'checksums.txt');
  const checksumLines = results.map((r) => `${r.sha256}  ${r.fileName}`);
  fs.writeFileSync(checksumsPath, checksumLines.join('\n') + '\n');

  // Clean up staging directory
  if (fs.existsSync(STAGING_BASE_DIR)) {
    fs.rmSync(STAGING_BASE_DIR, { recursive: true, force: true });
  }

  // Print final compilation summary
  const durationMs = Date.now() - startTime;
  console.log(`\n==================================================`);
  console.log(`PACKAGING COMPILATION COMPLETE (${durationMs}ms)`);
  console.log(`==================================================`);
  console.log(`Output Directory: ${path.relative(ROOT_DIR, outputDir) || outputDir}`);
  console.log(`Checksum Manifest: ${path.relative(ROOT_DIR, checksumsPath)}\n`);

  console.table(
    results.map((r) => ({
      Template: r.name,
      Slug: r.slug,
      Version: r.version,
      Files: r.fileCount,
      'Archive Size': `${r.sizeKb} KB`,
      'SHA-256 (first 16)': r.sha256.slice(0, 16) + '...',
    }))
  );

  console.log(`\nAll ${results.length} package(s) compiled and ready for commercial delivery.`);
}

main().catch((err) => {
  console.error('\n[FATAL ERROR]:', err.message);
  process.exit(1);
});

# LOGIFORGE Production Deployment & Infrastructure Guide

## 1. Architecture Overview

LOGIFORGE is built on **Next.js 15 App Router** and engineered for static delivery on cloud hosting platforms such as **Vercel Hobby / Free Tier** at **$0.00 / ₹0 infrastructure cost**.

```
[ Git Push to origin/main ]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│ Cloud Build & Static Optimization                      │
├────────────────────────────────────────────────────────┤
│  • next build: Pre-renders 41 Static Outputs           │
│  • Compiles 10 flagship template dynamic chunks        │
│  • Compresses assets with Brotli / Gzip                │
│  • Configures HTTP security response headers           │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│ Global Edge CDN Distribution                           │
├────────────────────────────────────────────────────────┤
│  • Pre-rendered HTML & JSON payloads                   │
│  • Immutable script chunks in /_next/static/           │
│  • Optimized WebP media assets in /images/             │
└────────────────────────────────────────────────────────┘
```

---

## 2. Route Breakdown & Static Pre-Generation

During `npm run build`, Next.js compiles the project into **41 pre-rendered static outputs**, categorized as follows:

### Primary Application Routes (35 Pages)
- **5 Platform Pages (`○` Static):**
  - `/` — Homepage & Featured Template Spotlight
  - `/templates` — Interactive Catalog Browser & Faceted Filter Bar
  - `/templates/compare` — Interactive Side-by-Side Template Comparison Matrix
  - `/resources` — Industry Technical Guides & Interactive Modal Reader
  - `/about` — Platform Manifesto & Engineering Standards
- **10 Template Detail Pages (`●` SSG):**
  - `/templates/[slug]` — Deep-dive technical specifications and manifest details (generated via `generateStaticParams`)
- **10 Interactive Demo Studio Pages (`●` SSG):**
  - `/demo/[slug]` — Hardware-simulated preview shells with multi-device viewports and section navigation
- **10 Sandboxed Template Embeds (`●` SSG):**
  - `/demo/[slug]/embed` — Isolated template runtimes rendered without platform navigation

### Metadata, Error & SEO Endpoints (6 Endpoints / Outputs)
- `/_not-found` — Global 404 entity fallback handler
- `/sitemap.xml` — Search engine sitemap indexing canonical application URLs
- `/robots.txt` — Web crawler instructions allowing public pages and disallowing embed frames
- `/icon.svg` — Vector SVG brand favicon

### Static Embed Route Architecture
The `/demo/[slug]/embed` routes are configured as static Server Components via `generateStaticParams`. Query parameters (such as `?tracking=` for waybill lookups and `?page=` for blueprint navigation) are resolved on the client using `useSearchParams()` within a `<Suspense>` boundary. This ensures all embed pages are fully pre-rendered at build time with fast edge delivery and minimal client script bundles (`~2.14 kB` route JS).

---

## 3. Zero-Cost Free Tier Hosting

LOGIFORGE requires **zero paid external services**:
- **No External Database:** Operates with typed in-memory manifests and fixtures (`src/data/`).
- **No Third-Party Analytics:** No paid monitoring, telemetry, or external tracking scripts.
- **No Server Instances:** Runs entirely on static edge CDN distribution without dedicated server runtimes.

### Prerequisites
- **Node.js:** `>= 20.0.0`
- **npm:** `>= 10.0.0`

### Deploying to Vercel
1. Connect the GitHub repository `Vijay07012006/LOGIFORGE` in the Vercel Dashboard.
2. Framework Preset: **Next.js** (automatically detected).
3. Build Command: `next build` (default).
4. Output Directory: `.next` (default).
5. Environment Variables: **None required.**

---

## 4. Canonical Origin Configuration (`SITE_URL`)

The platform's canonical URL is centralized in [`src/lib/utils/index.ts`](../src/lib/utils/index.ts):

```typescript
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://logiforge-hazel.vercel.app'
).replace(/\/+$/, '');
```

### Environment Variable Behavior
- **Default (No variable set):** If `NEXT_PUBLIC_SITE_URL` is omitted, the platform automatically defaults to the production origin `https://logiforge-hazel.vercel.app`. Setting this variable is **completely optional**.
- **Custom Domain Deployment:** If you bind a custom domain (e.g., `https://logiforge.dev`):
  1. Add your domain under **Project Settings → Domains** in Vercel.
  2. Set `NEXT_PUBLIC_SITE_URL=https://logiforge.dev` in the Vercel Environment Variables settings.
  3. Trigger a redeploy. Canonical link tags, OpenGraph metadata, `robots.txt`, `sitemap.xml`, and JSON-LD schemas will automatically reflect the custom domain.

---

## 5. Marketplace Package Delivery & Build Pipeline

LOGIFORGE delivers autonomous, production-ready Next.js starter ZIP archives for each flagship template via a zero-cost static build-time pipeline.

### Build Lifecycle Flow
```
npm run build
     │
     ├─► prebuild: node scripts/package-templates.mjs --clean --all --output public/downloads
     │     • Compiles 10 standalone starter projects
     │     • Generates public/downloads/<slug>-v<version>.zip
     │     • Writes public/downloads/checksums.txt
     │
     └─► next build:
           • Pre-renders all 41 static pages
           • Next.js bundles public/ assets directly for edge CDN static delivery
```

### Static Asset Delivery Paths
- **Route Pattern:** `/downloads/[slug]-v[version].zip`
- **Example:** `https://logiforge-hazel.vercel.app/downloads/cargo-nova-v1.0.0.zip`
- **Integrity Manifest:** `https://logiforge-hazel.vercel.app/downloads/checksums.txt`
- **Zero Storage Cost:** Uses no S3, Vercel Blob, or database. Packaged archives are served as static files directly from edge CDN cache.

### Package Naming & Versioning Source of Truth
- Authoritative version and configuration are defined in `src/data/templates/manifests.ts` under each template's `packageConfig`:
  ```typescript
  packageConfig: {
    packageName: 'cargo-nova-starter',
    version: '1.0.0',
    frameworkVersion: '^15.5.0',
    minNodeVersion: '>=20.0.0',
    ...
  }
  ```
- URL derivation is centralized in `src/lib/templates/index.ts`:
  - `getTemplatePackageFilename(template)` ➔ `${slug}-v${version}.zip`
  - `getTemplateDownloadUrl(template)` ➔ `/downloads/${slug}-v${version}.zip`

### Adding a Future Template (#11+)
To add a new template to the packaging and download pipeline:
1. Implement template components under `src/components/templates/<dir>/`.
2. Register the template in `src/data/templates/manifests.ts` with its `packageConfig`.
3. Running `npm run build` will automatically stage, compile, checksum, and expose the new template ZIP to `/downloads/<new-slug>-v1.0.0.zip` with zero manual packaging scripts needed.

### Release Validation Suite
Before publishing releases:
```bash
# Verify standalone package autonomous health (install, build, start, boundary, security)
node scripts/verify-template-packages.mjs --all

# Verify marketplace download HTTP endpoints, ZIP magic, and checksum parity
node scripts/verify-marketplace-downloads.mjs

# Verify real Chrome browser download triggers across viewports
node scripts/test-real-browser-downloads.mjs
```


<div align="center">

# ⚡ LOGIFORGE
### Enterprise Logistics Website Template Platform & Interactive Design Studio

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Design Tokens](https://img.shields.io/badge/CSS-Dark%20Luxury%20Amber-e8590c?style=for-the-badge)](./docs/ARCHITECTURE.md)
[![Production Ready](https://img.shields.io/badge/Status-100%25%20Verified%20%26%20Certified-emerald?style=for-the-badge)](./PHASE_11_RELEASE_HARDENING_REPORT.md)

<p align="center">
  A category-defining digital marketplace, live device preview studio, and starter kit ecosystem engineered specifically for freight forwarding, maritime shipping, aviation, fleet telematics, warehousing, and global supply chain enterprises.
</p>

[System Architecture](./docs/ARCHITECTURE.md) • [Template Development Guide](./docs/TEMPLATE_DEVELOPMENT.md) • [Phase 11 QA Report](./PHASE_11_RELEASE_HARDENING_REPORT.md) • [Data Model](./docs/architecture/DATA_MODEL_SPECIFICATION.md) • [Design System](./docs/architecture/DESIGN_SYSTEM_SPECIFICATION.md)

</div>

---

## 🧭 1. What is LOGIFORGE?

**LOGIFORGE** is an enterprise-grade digital marketplace and interactive design studio created to replace generic website templates with domain-specific, high-performance web applications tailored to the global supply chain industry.

Built as an ultra-premium dark luxury platform with incandescent tandoori orange accents and warm golden amber highlights, LOGIFORGE operates as a seamless two-tier ecosystem:

1. **The Platform Shell (Marketplace & Studio):** An accessible, responsive catalog featuring multi-attribute faceted filtering, full-text fuzzy search, URL query synchronization, simulated multi-device viewports (Desktop, Tablet, Mobile), physical hardware bezels, orientation rotation, and a dedicated **Client Presentation Mode**.
2. **The Flagship Template Ecosystem:** A curated collection of 10 production-ready website templates. Every template features a unique typographic identity, custom color palette, dedicated CSS token scope (`--tmpl-*`), and working domain interactions (e.g. simulated waybill milestone tracking, live transponder radar, vessel sailing matrices, vehicle CAN-bus telematics, dynamic TSP heuristic solvers, and Scope-3 carbon estimators).

---

## 🚀 2. Core Capabilities & Architecture

### 2.1 Editorial Logistics Marketplace (`/` & `/templates`)
- **Atmospheric Editorial Hero:** Features a live waybill transit ticker (`CN-8924-US`, `AC-9901-FRA`, `FO-4091-TX`), vector radar pulse, and primary discovery CTAs.
- **Faceted Catalog Browser:** Multi-attribute filtering across 11 industry disciplines, 9 aesthetic styles, and 3 license tiers with instant fuzzy search and dismissible filter chips.
- **URL Parameter Synchronization:** Search, category, style, and sort states serialize directly into the browser URL (`/templates?category=ocean-freight&style=minimalist&sort=popular`), ensuring persistent, shareable views.

### 2.2 Interactive Demo Studio (`/demo/[slug]`)
- **Multi-Device Hardware Simulation:**
  - **Desktop (100% / 1440px):** Unconstrained wide-screen presentation.
  - **Tablet (Max 768px):** Hardware bezel with camera notch and orientation rotation (768×1024 Portrait / 1024×768 Landscape).
  - **Mobile (Max 375px):** Hardware bezel with speaker grill, camera notch, and bottom home indicator bar (375×812 Portrait / 812×375 Landscape). Scales down to 320px screens with zero horizontal overflow.
- **Zoom Scaling Controls:** Instant 50%, 75%, and 100% zoom canvas scaling.
- **Client Presentation Mode:** Fullscreen overlay (`fixed, z-index: 999999`) completely hiding background platform navigation with an ambient floating HUD. Toggleable with one click or keyboard shortcut `P` (press `Escape` to cleanly exit).
- **Blueprint Views Navigation:** Synchronized tabs dynamically mapped to each template's real sections (e.g. Berth Board, Gate Turnaround, Rail Intermodal), triggering smooth section scrolling in the sandboxed preview.

### 2.3 Sandboxed Embed Mode (`/demo/[slug]/embed`)
- Isolated, clean template render free of platform chrome.
- Suppresses platform header and footer automatically.
- Frame-busting protection prevents recursive iframe embedding.
- Communicates with the parent host shell via a strictly typed, origin-validated `postMessage` protocol.

### 2.4 Simulated Tracking & Telemetry Engine
- Operates 100% locally with zero external network dependencies.
- Dual-interface waybill simulation supporting both one-click quick sample pills and custom waybill entries.
- Deterministic multi-milestone timelines with timestamps, facilities, carriers, and transponder speeds.

---

## 📦 3. Flagship Templates Matrix (10/10 Live)

| # | Template | Industry Focus | Visual Style & Color Tokens | Signature Interactive Feature | Status |
| :- | :--- | :--- | :--- | :--- | :---: |
| **01** | **CargoNova** | Global Freight Forwarding | Editorial Luxury (`#0A192F`, `#D97706`) | Multi-modal Trade Corridor Visualizer & Tariff Rate Calculator | **LIVE** |
| **02** | **FleetOne** | Fleet & Asset Management | Industrial / Technical (`#0F172A`, `#E11D48`) | Real-Time Engine Diagnostics & EV Battery Range Simulator | **LIVE** |
| **03** | **ShipFlow** | Ocean Freight & Shipping | Minimalist / Nordic (`#0B1B2B`, `#0284C7`) | Live Vessel Sailing Matrix & Container Port Congestion Radar | **LIVE** |
| **04** | **SwiftDrop** | Last-Mile Urban Courier | Modern Bento Grid (`#0D0E15`, `#FF5722`) | Instant Urban Parcel Rate Calculator & Driver Digital POD | **LIVE** |
| **05** | **AeroCargo** | Air Freight & Charter | Aviation Cockpit Dark (`#070A14`, `#38BDF8`) | IATA 11-digit AWB Radar, ULD Estimator & Cold-Chain Vaults | **LIVE** |
| **06** | **PortAxis** | Port Terminal & Intermodal | Enterprise Steel Grey (`#070C18`, `#38BDF8`) | Deepwater Berth Availability Board & On-Dock Class-1 Rail | **LIVE** |
| **07** | **WarehouseX** | 3PL Warehousing & Storage | Operations High-Density (`#060B12`, `#10B981`) | Pallet ASN Ingestion Lookup, ASRS 3D Visualizer & Dock Scheduler | **LIVE** |
| **08** | **SupplyCore** | Enterprise Supply Chain | Corporate / Resilient (`#080B14`, `#6366F1`) | Multi-Tier Supplier Risk Heatmap & Scope-3 Carbon Estimator | **LIVE** |
| **09** | **RouteIQ** | Logistics Software & AI | Data-driven / Dark Tech (`#05070E`, `#A855F7`) | Dynamic Multi-Stop TSP Neural Engine & CAN-Bus Telemetry | **LIVE** |
| **10** | **MoveSphere** | Intermodal Autonomous Freight | Futuristic / Glassmorphic (`#03060D`, `#14B8A6`) | Smart Quantum Sensor Telemetry & Cryogenic Custody Log | **LIVE** |

---

## 🗺️ 4. Route Architecture (35 Routes)

LOGIFORGE contains 35 fully verified and operational application routes:

```
/                                       [Platform Homepage & Featured Spotlight]
/templates                              [Interactive Catalog Browser & Faceted Filter Bar]
/resources                              [Industry Benchmarks & Interactive GuideModal Reader]
/about                                  [Platform Manifesto & Architecture Standards]
/_not-found                             [Branded 404 Entity Fallback Handler]

Template Showcases (10 Routes):
├── /templates/cargo-nova               ├── /templates/port-axis
├── /templates/fleet-one                ├── /templates/warehouse-x
├── /templates/ship-flow                ├── /templates/supply-core
├── /templates/swift-drop               ├── /templates/route-iq
└── /templates/aero-cargo               └── /templates/move-sphere

Live Demo Studios (10 Routes):
├── /demo/cargo-nova                    ├── /demo/port-axis
├── /demo/fleet-one                     ├── /demo/warehouse-x
├── /demo/ship-flow                     ├── /demo/supply-core
├── /demo/swift-drop                    ├── /demo/route-iq
└── /demo/aero-cargo                    └── /demo/move-sphere

Sandboxed Template Embeds (10 Routes):
├── /demo/cargo-nova/embed              ├── /demo/port-axis/embed
├── /demo/fleet-one/embed               ├── /demo/warehouse-x/embed
├── /demo/ship-flow/embed               ├── /demo/supply-core/embed
├── /demo/swift-drop/embed              ├── /demo/route-iq/embed
└── /demo/aero-cargo/embed              └── /demo/move-sphere/embed
```

---

## 🔒 5. Security & Isolation Architecture

- **Strict Origin Validation:** All parent-iframe `postMessage` handlers validate `event.origin !== window.location.origin` and reject untrusted messages. Wildcard origins (`'*'`) are strictly prohibited in browser runtime.
- **Recursive Iframe Protection:** The Demo Studio shell includes an automatic frame-busting guard (`window.top !== window.self`) redirecting to the isolated embed view if ever framed.
- **Zero Unsafe HTML:** Zero instances of `dangerouslySetInnerHTML`, zero dynamic `eval()`, and zero unsanitized query param injections.
- **No Third-Party Trackers or Secrets:** The platform operates 100% locally with zero analytics, zero external API keys, and zero telemetry pingbacks.

---

## 💻 6. Installation & Quickstart

### Prerequisites
- Node.js 18.17+ or 20+ (Next.js 15.x compatible)
- npm 9+

### Setup Commands
```bash
# Clone the repository
git clone https://github.com/Vijay07012006/LOGIFORGE.git
cd LOGIFORGE

# Install dependencies (zero external paid packages)
npm install

# Start local development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the platform.

---

## 🧪 7. Verification & Quality Commands

```bash
# Run strict TypeScript typechecking (0 errors required)
npm run typecheck

# Run ESLint standards check (0 warnings/errors required)
npm run lint

# Build production bundle with static route pre-generation (27 pages)
npm run build

# Start production server locally
npm run start

# Run comprehensive 35-route automated test pass
powershell -ExecutionPolicy Bypass -File scratch/test_all_qa_routes.ps1
```

---

## 👩‍💻 8. Developer Guides

### 8.1 Adding a New Template (Template #11)
To add a new template predictably and repeatably, follow the detailed instructions in [docs/TEMPLATE_DEVELOPMENT.md](./docs/TEMPLATE_DEVELOPMENT.md):
1. Create component directory in `src/components/templates/[slug]/`.
2. Define template tokens (`--tmpl-*`) in `[Slug].module.css`.
3. Implement website orchestrator with `postMessage` communication in `[Slug]Website.tsx`.
4. Register metadata manifest in `src/data/templates/manifests.ts`.
5. Wire the Template Dispatcher in `src/components/templates/dispatcher/TemplateRenderer.tsx`.
6. Map Blueprint Views in `BLUEPRINT_NAV_BY_SLUG` in `src/app/demo/[slug]/page.tsx`.
7. Add simulated tracking milestones in `src/data/tracking/fixtures.ts`.
8. Run `npm run typecheck && npm run build` to certify.

### 8.2 Adding Simulated Tracking Fixtures
Add an entry in `src/data/tracking/fixtures.ts` under `SIMULATED_SHIPMENTS`:
```typescript
'MY-WAYBILL-01': {
  trackingNumber: 'MY-WAYBILL-01',
  status: 'in_transit',
  origin: { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong' },
  destination: { code: 'LAX', city: 'Los Angeles', country: 'United States' },
  eta: 'Tomorrow, 08:30 PST',
  carrier: 'Global Logistics Express',
  serviceLevel: 'Priority Air Freight',
  milestones: [
    { id: 'm1', status: 'completed', location: 'HKG Ramp', timestamp: 'Yesterday', description: 'Airway Bill manifest verified.' },
    { id: 'm2', status: 'in_transit', location: 'Pacific Corridor FL340', timestamp: 'Today', description: 'Cruising at Mach 0.82.' }
  ]
}
```

---

## 🔧 9. Troubleshooting & Known Considerations

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **`ENOENT: Failed to collect page data` during `npm run build`** | Background dev server (`next dev`) running concurrently and writing to `.next/` cache. | Terminate running `next dev` instances before executing `npm run build`. |
| **`next lint` deprecation notice** | Next.js 15 outputs an informational notice regarding ESLint CLI migration in Next.js 16. | Informational only. `npm run lint` passes with 0 errors and requires no changes. |
| **Iframe not scrolling to section in Demo Studio** | Target section ID mismatch in template component. | Ensure section has matching `id` or anchor alias corresponding to `BLUEPRINT_NAV_BY_SLUG`. |

---

## 🗺️ 10. Roadmap & Expansion

- [x] **Phase 01–03:** Platform Foundation, Scaffolding, Data Schemas & Editorial Discovery Catalog
- [x] **Phase 04–06:** Live Demo Studio, Sandboxed Embed Mode & Flagship Templates Wave 1 & 2
- [x] **Phase 07–09:** Download Bundling Engine, Flagship Wave 3 & Responsive Zero-Overflow Audit
- [x] **Phase 10A–10B:** Interaction Hardening, postMessage Bidirectional Sync & Simulated Tracking Fixtures
- [x] **Phase 11:** Production-Grade Release Hardening & Comprehensive 35-Route QA
- [x] **Phase 12:** Productization, Master Architecture Specification & Client-Delivery Readiness

---

## 📄 11. License & Attribution

Distributed under the **LogiForge Commercial License**. Engineered by the **LogiForge Studio Architecture Team**.

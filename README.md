<div align="center">

# ⚡ LOGIFORGE
### Premium Logistics Website Template Platform & Live Design Studio

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Design Tokens](https://img.shields.io/badge/CSS-Dark%20Luxury%20Amber-e8590c?style=for-the-badge)](./docs/architecture/DESIGN_SYSTEM_SPECIFICATION.md)
[![Phase 04 Status](https://img.shields.io/badge/Phase%2004-Live%20Demo%20Studio%20Verified-emerald?style=for-the-badge)](./docs/architecture/PHASE_04_IMPLEMENTATION_REPORT.md)

<p align="center">
  A category-defining digital marketplace, live device preview studio, and starter kit ecosystem engineered specifically for the logistics, maritime shipping, aviation, freight forwarding, telematics, and supply chain industries.
</p>

[Explore Blueprint](./docs/architecture/LOGIFORGE_MASTER_BLUEPRINT.md) • [Phase 04 Report](./docs/architecture/PHASE_04_IMPLEMENTATION_REPORT.md) • [Audit & Fix Report](./docs/architecture/AUDIT_AND_FIX_REPORT.md) • [Data Model](./docs/architecture/DATA_MODEL_SPECIFICATION.md) • [Design System](./docs/architecture/DESIGN_SYSTEM_SPECIFICATION.md)

</div>

---

## 🧭 Overview

**LOGIFORGE** bridges the gap between generic theme marketplaces and bespoke agency code. Built as an ultra-premium dark luxury platform with incandescent tandoori orange accents and warm amber highlights, LOGIFORGE operates as a two-tier ecosystem:

1. **The Platform Shell (Marketplace & Studio):** A high-performance, accessible catalog with multi-facet filtering, full-text fuzzy search, URL query synchronization, device viewport simulation, interactive starter kit generation, and a dedicated **Client Presentation Mode**.
2. **The Flagship Template Ecosystem:** A curated collection of 10 independent website templates. Every template has a unique typographic identity, custom color palette, dedicated CSS token scope, and signature logistics widgets (e.g. simulated cargo milestone tracking, vessel sailing schedules, telematics diagnostic cards, port berth timelines).

---

## 🎨 Ultra-Premium Design System & Aesthetics

The platform features an intentionally curated dark luxury visual identity designed for modern enterprise logistics:

- **Deep Warm Base (`#0d0a08`):** Deep warm black eliminating harsh blue glare while retaining high contrast.
- **Layered Brown Card Surface (`#1a1410`):** `linear-gradient(160deg, #1f1712, #14100c)` creating rich tactile depth.
- **Tandoori Orange Primary Accent (`#e8590c`):** High-energy incandescent orange for primary CTAs, active radio beacons, and hover glow rings.
- **Golden Amber Secondary Accent (`#ffb347`):** Warm golden tone for ratings, prices, category badges, and 4px letter-spaced eyebrows.
- **Warm Cream & Taupe Typography:** `#f5efe6` primary text paired with `#b8a99a` soft taupe for secondary metadata.
- **Pill Architecture (`50px` radius):** Fluid pill buttons with subtle 3D lift (`translateY(-3px) scale(1.03)`) and ambient amber glow.
- **Fluid Typography:** CSS `clamp(2.6rem, 7vw, 5.2rem)` hero titles and `clamp(2rem, 4.5vw, 3.4rem)` section headers.
- **Bespoke Scrollbars & Selection:** Custom `#3a2f26` track with orange hover thumbs and branded text highlight selection.

---

## 🚀 Key Features & Capabilities

### 1. High-End Editorial Logistics Home Page (`/`)
- **Editorial Logistics Hero:** Features an atmospheric radar vector pulse, simulated waybill transit ticker (`CN-8924-US`, `AC-9901-FRA`, `FO-4091-TX`), and primary discovery CTAs.
- **Deterministic Platform Metrics:** 10 Flagships, 11 Disciplines, 100% Type Safety, 0ms Style Leakage.
- **Featured Template Spotlight:** Interactive showcase rendering top flagship templates via `TemplateCard`.
- **11 Logistics Categories Explorer:** Direct navigation into catalog filters by industry sub-niche.
- **4-Perspective Value Proposition:** Tailored benefits for Developers, Designers, Agencies, and Logistics Clients.
- **Curated Collections Showcase:** Sector packs for enterprise freight, urban couriers, and smart logistics with direct catalog query routing.

### 2. Interactive Discovery Catalog (`/templates`)
- **Full-Text Fuzzy Search:** Instant matching across template name, tagline, description, tags, and trade corridors.
- **Multi-Attribute Filters:** Filter by Category (11 disciplines), Style (9 aesthetic profiles), and License Tier (Free, Premium, Enterprise).
- **Curated Collection Filtering:** Supports `?collection=[slug]` query parameters directly from the homepage with active dismissible collection chips.
- **Sort Controls:** Sort by Featured first, Downloads (Popularity), User Rating, or Newest.
- **URL Query Synchronization:** State is serialized to URL parameters (`/templates?category=ocean-freight&style=minimalist&sort=popular`), ensuring shareable, bookmarkable, and reload-persistent filtered views.
- **Active Filter Chips & Counter:** Dismissible filter chips with a one-click "Reset all" trigger.

### 3. Live Demo Studio & Client Presentation Environment (`/demo/[slug]`)
- **Multi-Device Viewport Simulation:**
  - **Desktop (100% / 1440px):** Full-fidelity wide-screen viewport.
  - **Tablet (768px):** Realistic hardware bezel with camera notch and orientation rotation (768×1024 Portrait / 1024×768 Landscape).
  - **Mobile (375px):** Realistic hardware bezel with speaker grill, camera notch, and bottom home indicator bar (375×812 Portrait / 812×375 Landscape).
  - **Fluid (100%):** Unconstrained responsive canvas.
- **Zoom Scaling Controls:** Instant 50%, 75%, and 100% zoom scaling with smooth CSS transitions.
- **Client Presentation Mode:**
  - Collapses platform chrome into a sleek floating ambient HUD: `[ CLIENT PREVIEW • LOGIFORGE STUDIO ]`.
  - Retains responsive device switcher in the floating HUD for presenting mobile vs tablet live to stakeholders.
  - One-click native browser fullscreen toggle.
  - Keyboard shortcuts: `P` to toggle presentation mode, `Escape` to cleanly exit.
- **Template Included Pages Navigation:** Synchronized tabs (`Home Overview`, `Services Matrix`, `Shipment Tracking`, `Global Corridors`) triggering smooth section navigation in the sandboxed preview.
- **Interactive Simulated Logistics Tracking Engine:** Dual-interface waybill simulation with quick sample triggers (`CN-8924-US`, `FO-4091-TX`, `SD-4421-EU`, `AC-9901-FRA`, `PA-7714-SGP`), custom input testing, and verified transit milestone audit timelines.
- **Bidirectional `postMessage` Event Bus:** Typed communication between studio shell and sandboxed template runtime with real-time live connection beacon.

### 4. Template Deep-Dive & Sandboxed Embed (`/templates/[slug]` & `/demo/[slug]/embed`)
- **Template Details (`/templates/[slug]`):** Complete architectural breakdown with live preview links, technical specs, included page list, and core features.
- **Interactive Starter Download Engine:** Generates and downloads a deterministic starter kit manifest JSON (`[slug]-starter-manifest.json`) formatted with template metadata, layout structure, color tokens, and npm setup commands.
- **Isolated Embed Sandbox (`/demo/[slug]/embed`):** Clean, isolated iframe render without platform chrome, complete with in-template search form, trade corridors, metrics, and compliance badges.

### 5. Knowledge Hub & Design Pattern Guides (`/resources`)
- **Pattern Guides Reader:** Built-in accessible `GuideModal` allowing users to read deep technical guides on:
  - *Waybill Transit Milestone Visualizer Patterns*
  - *Vessel AIS Telemetry & Port Congestion Boards*
  - *Heavy Fleet Diagnostics & Sensor Stream Architecture*

---

## 📦 Flagship Templates Matrix

| # | Template | Industry Focus | Style & Mood | Signature Feature |
| :- | :--- | :--- | :--- | :--- |
| **01** | **CargoNova** | Global Freight Forwarding | Editorial Luxury | Multi-modal Trade Corridor Visualizer & Milestone Tracking |
| **02** | **FleetOne** | Fleet & Asset Management | Industrial / Technical | Real-Time Vehicle Engine Telematics & Diagnostics |
| **03** | **ShipFlow** | Ocean Freight & Shipping | Minimalist / Nordic | Live Vessel Sailing Matrix & Container Port Congestion |
| **04** | **SwiftDrop** | Last-Mile Courier | Modern Bento Grid | Instant Urban Parcel Rate Calculator & Driver App Preview |
| **05** | **PortAxis** | Port Terminal & Intermodal | Enterprise / Authoritative | Deepwater Berth Availability Board & Intermodal Rail Yard |
| **06** | **AeroCargo** | Air Cargo & Express Charter | Aviation / Precision Tech | IATA Airway Bill (AWB) Flight Tracker & Hold Estimator |
| **07** | **WarehouseX** | 3PL Warehousing & Storage | Operations High-Density | Pallet ASN Ingestion Lookup & Automated Racking Monitor |
| **08** | **SupplyCore** | Enterprise Supply Chain | Corporate / Resilient | Multi-Tier Supplier Risk Index & Scope-3 Carbon Visibility |
| **09** | **RouteIQ** | Logistics Software & AI | Data-driven / Dark Tech | Dynamic Multi-Stop TSP Neural Engine & Predictive ETA |
| **10** | **MoveSphere** | Intermodal Autonomous Freight | Futuristic / Glassmorphic | Holographic Global Transport Grid & Smart IoT Container |

---

## 🗺️ Route Architecture

```
/
├── /templates                          [Interactive Discovery Catalog & Faceted Filter Bar]
│   └── /templates/[slug]               [Template Deep-Dive: Specs, Pages, Features, Starter Download]
├── /demo/[slug]                        [Live Interactive Demo Studio Shell with Device Bar & Presentation HUD]
│   └── /demo/[slug]/embed              [Sandboxed, Clean Template Render (Isolated Viewport)]
├── /resources                          [Logistics Design Pattern Guides & Interactive Reader Modal]
├── /about                              [Platform Manifesto, Architecture Standards, Licensing]
```

---

## 🏗️ Folder Structure

```
d:/Desktop/LOGIFORGE/
├── docs/                               # Canonical architecture & specifications
│   └── architecture/
│       ├── LOGIFORGE_MASTER_BLUEPRINT.md
│       ├── DATA_MODEL_SPECIFICATION.md
│       ├── DESIGN_SYSTEM_SPECIFICATION.md
│       ├── LIVE_DEMO_AND_SANDBOX_SPECIFICATION.md
│       ├── IMPLEMENTATION_ROADMAP.md
│       ├── PHASE_02_IMPLEMENTATION_REPORT.md
│       ├── PHASE_03_IMPLEMENTATION_REPORT.md
│       ├── AUDIT_AND_FIX_REPORT.md
│       └── PHASE_04_IMPLEMENTATION_REPORT.md [NEW Phase 04 Verified Report]
│
├── src/
│   ├── app/                            # Next.js 15 App Router Routes
│   │   ├── layout.tsx                  # Root layout, metadata & viewport
│   │   ├── page.tsx                    # Editorial Home Page
│   │   ├── loading.tsx                 # Route-level loading state
│   │   ├── error.tsx                   # Error boundary
│   │   ├── not-found.tsx               # 404 entity handler
│   │   ├── templates/                  # Catalog Discovery Page
│   │   ├── demo/                       # /demo/[slug] (Studio) and /demo/[slug]/embed (Sandbox)
│   │   ├── resources/                  # /resources (with interactive GuideModal)
│   │   └── about/                      # /about
│   │
│   ├── components/
│   │   ├── platform/                   # Header, Footer, CatalogBrowser, GuideModal, StarterDownloadButton, TemplateCard
│   │   ├── studio/                     # EmbeddedTemplateView, Studio types & postMessage contracts [UPDATED Phase 04]
│   │   ├── templates/                  # TemplateComponentManifest contract
│   │   └── ui/                         # Container, SectionHeading, Card, IconButton, SearchField, Select, Badge, Button
│   │
│   ├── data/                           # Strongly typed centralized fixtures
│   │   ├── categories/                 # 11 logistics category definitions
│   │   ├── collections/                # 4 curated template collections
│   │   ├── templates/                  # 10 flagship template metadata manifests
│   │   └── tracking/                   # Simulated shipment milestone fixtures
│   │
│   ├── lib/                            # Business logic & lookup modules
│   │   ├── categories/                 # Category lookup functions
│   │   ├── collections/                # Collection lookup functions
│   │   ├── filters/                    # Multi-facet search, filter, and sort engine
│   │   ├── templates/                  # Template retrieval and relations
│   │   ├── tracking/                   # Waybill fixture lookup
│   │   └── utils/                      # Zero-dependency utilities (cn, formatters)
│   │
│   ├── styles/
│   │   ├── tokens.css                  # Platform (--lf-*) Dark Luxury Design Tokens
│   │   └── globals.css                 # CSS reset, custom dark scrollbar, focus rings
│   │
│   └── types/
│       └── template.ts                 # Canonical TypeScript contracts
```

---

## 🛠️ Quality & Verification Standards

```bash
# Run strict TypeScript typechecking
npm run typecheck

# Run ESLint validation
npm run lint

# Build production bundle with static route pre-generation (27 routes)
npm run build

# Start production server locally
npm run start
```

**Verification Matrix:**
- `npm run typecheck`: **PASS (0 errors)**
- `npm run lint`: **PASS (`✔ No ESLint warnings or errors`)**
- `npm run build`: **PASS (All 27 routes pre-rendered statically)**
- `next start`: **PASS (HTTP 200 OK across all routes and views)**

---

## 📈 Implementation Status & Roadmap

- [x] **Phase 01:** Product Architecture & Technical Blueprint (`docs/architecture/`)
- [x] **Phase 02:** Platform Foundation, Scaffolding, Core Token System & Data Schemas
- [x] **Phase 03:** Platform Shell & Discovery UI (Faceted Filter Bar, Live URL Search Sync, Editorial Home)
- [x] **Audit & Fix:** Comprehensive Quality & UI/UX Overhaul (Dark Luxury Amber Theme, Pill Buttons, Guide Modal, Starter Generator)
- [x] **Phase 04:** Live Demo Sandbox Enhancements & Client Presentation Mode
- [ ] **Phase 05:** Flagship Templates Wave 1 (CargoNova, FleetOne, ShipFlow)
- [ ] **Phase 06:** Flagship Templates Wave 2 (SwiftDrop, PortAxis, AeroCargo, WarehouseX, SupplyCore, RouteIQ, MoveSphere)
- [ ] **Phase 07:** Download Bundling Engine, Resources Hub & Production Hardening

---

## 📄 License & Attribution

Distributed under the **LogiForge Commercial License**. Engineered by the **LogiForge Studio Architecture Team**.

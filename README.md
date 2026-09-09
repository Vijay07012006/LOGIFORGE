<div align="center">

# ⚡ LOGIFORGE
### Premium Logistics Website Template Platform & Live Design Studio

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Design Tokens](https://img.shields.io/badge/CSS-Tokens%20%26%20Modules-purple?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Variables)
[![Architecture Status](https://img.shields.io/badge/Phase%2003-Shell%20%26%20Discovery%20Verified-emerald?style=for-the-badge)](./docs/architecture/PHASE_03_IMPLEMENTATION_REPORT.md)

<p align="center">
  A category-defining digital marketplace, live device preview studio, and starter kit ecosystem engineered specifically for the logistics, maritime shipping, aviation, freight forwarding, telematics, and supply chain industries.
</p>

[Explore Documentation](./docs/architecture/LOGIFORGE_MASTER_BLUEPRINT.md) • [Phase 03 Report](./docs/architecture/PHASE_03_IMPLEMENTATION_REPORT.md) • [Data Model](./docs/architecture/DATA_MODEL_SPECIFICATION.md) • [Design Tokens](./docs/architecture/DESIGN_SYSTEM_SPECIFICATION.md) • [Roadmap](./docs/architecture/IMPLEMENTATION_ROADMAP.md)

</div>

---

## 🧭 Overview

**LOGIFORGE** bridges the gap between generic theme marketplaces and bespoke agency code. Unlike cookie-cutter web templates that merely swap accent colors across repetitive card grids, LOGIFORGE is built as a **two-tier platform**:

1. **The Platform Shell (Marketplace & Studio):** A fast, accessible catalog with multi-facet filtering, full-text search, live URL query synchronization, device viewport simulation, and a dedicated distraction-free **Client Presentation Mode**.
2. **The Flagship Template Ecosystem:** A curated collection of 10 independent website templates. Every template has a unique typographic identity, custom color palette, dedicated CSS token scope, and signature logistics widgets (e.g. simulated cargo milestone tracking, vessel sailing schedules, telematics diagnostic cards, port berth timelines).

---

## 🚀 Key Features & Capabilities (Phase 03 Completed)

### 1. High-End Editorial Logistics Home Page (`/`)
- **Editorial Logistics Hero:** Features an atmospheric radar vector pulse, simulated waybill transit ticker (`CN-8924-US`, `AC-9901-FRA`, `FO-4091-TX`), and primary discovery CTAs.
- **Deterministic Platform Metrics:** 10 Flagships, 11 Disciplines, 100% Type Safety, 0ms Style Leakage.
- **Featured Template Spotlight:** Interactive showcase rendering top flagship templates via `TemplateCard`.
- **11 Logistics Categories Explorer:** Direct navigation into catalog filters by industry sub-niche.
- **4-Perspective Value Proposition:** Tailored benefits for Developers, Designers, Agencies, and Logistics Clients.
- **Curated Collections Showcase:** Sector packs for enterprise freight, urban couriers, and smart logistics.

### 2. Interactive Discovery Catalog (`/templates`)
- **Full-Text Fuzzy Search:** Instant matching across template name, tagline, description, tags, and trade corridors.
- **Multi-Attribute Filters:** Filter by Category (11 disciplines), Style (9 aesthetic profiles), and License Tier (Free, Premium, Enterprise).
- **Sort Controls:** Sort by Featured first, Downloads (Popularity), User Rating, or Newest.
- **URL Query Synchronization:** State is serialized to URL parameters (`/templates?category=ocean-freight&style=minimalist&sort=popular`), ensuring shareable, bookmarkable, and reload-persistent filtered views.
- **Active Filter Chips & Counter:** Dismissible filter chips with a one-click "Reset all" trigger.
- **Empty State:** Branded dashed card with quick filter reset action.

### 3. Reusable UI & Platform Component Primitives
- `Container`: Responsive layout constraint with 4 width tiers (`sm`, `md`, `lg`, `full`).
- `SectionHeading`: Editorial section headers with uppercase eyebrows and action button slots.
- `Card`: Surface and elevated card primitive with subtle borders and hover physics.
- `IconButton`: Accessible icon button primitive with keyboard focus rings.
- `SearchField`: Custom search input with search icon, clear button, and accessible labels.
- `Select`: Custom styled accessible select dropdown with custom chevrons.
- `Badge`: Multi-variant signal pills (primary, secondary, accent, warning, success, outline).
- `Button`: Accessible primary, secondary, outline, and ghost button primitives.
- `TemplateCard`: Visual card component communicating template identity, aesthetic style, verified ratings, downloads, and direct links to `/templates/[slug]` and `/demo/[slug]`.
- `MobileDrawer`: Accessible mobile navigation drawer with backdrop blur, keyboard trap, and Escape key handling.

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
│   └── /templates/[slug]               [Template Deep-Dive: Specs, Pages, Features, Gallery]
├── /demo/[slug]                        [Live Interactive Demo Studio Shell with Device Bar]
│   └── /demo/[slug]/embed              [Sandboxed, Clean Template Render (Isolated Viewport)]
├── /resources                          [Logistics Web Design Patterns, UI Guides, Starter Docs]
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
│       └── PHASE_03_IMPLEMENTATION_REPORT.md [NEW]
│
├── src/
│   ├── app/                            # Next.js 15 App Router Routes
│   │   ├── layout.tsx                  # Root layout, metadata & viewport
│   │   ├── page.tsx                    # Editorial Home Page [UPDATED Phase 03]
│   │   ├── loading.tsx                 # Route-level loading state
│   │   ├── error.tsx                   # Error boundary
│   │   ├── not-found.tsx               # 404 entity handler
│   │   ├── templates/                  # Catalog Discovery Page [UPDATED Phase 03]
│   │   ├── demo/                       # /demo/[slug] and /demo/[slug]/embed
│   │   ├── resources/                  # /resources
│   │   └── about/                      # /about
│   │
│   ├── components/
│   │   ├── platform/                   # Header, Footer, CatalogBrowser, MobileDrawer, TemplateCard
│   │   ├── studio/                     # Demo frame controls & viewport types
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
│   │   ├── tokens.css                  # Platform (--lf-*) and template (--tmpl-*) tokens
│   │   └── globals.css                 # CSS reset, focus rings, scrollbars
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

**Verification Results:**
- `npm run typecheck`: **PASS (0 errors)**
- `npm run lint`: **PASS (`✔ No ESLint warnings or errors`)**
- `npm run build`: **PASS (All 27 routes generated successfully)**
- `next start`: **PASS (HTTP 200 OK across `/`, `/templates`, `/templates?category=ocean-freight&style=minimalist`)**

---

## 📈 Implementation Status & Roadmap

- [x] **Phase 01:** Product Architecture & Technical Blueprint (`docs/architecture/`)
- [x] **Phase 02:** Platform Foundation, Scaffolding, Core Token System & Data Schemas
- [x] **Phase 03:** Platform Shell & Discovery UI (Faceted Filter Bar, Live URL Search Sync, Editorial Home)
- [ ] **Phase 04:** Live Demo Sandbox Enhancements & Client Presentation Mode
- [ ] **Phase 05:** Flagship Templates Wave 1 (CargoNova, FleetOne, ShipFlow)
- [ ] **Phase 06:** Flagship Templates Wave 2 (SwiftDrop, PortAxis, AeroCargo, WarehouseX, SupplyCore, RouteIQ, MoveSphere)
- [ ] **Phase 07:** Download Bundling Engine, Resources Hub & Production Hardening

---

## 📄 License & Attribution

Distributed under the **LogiForge Commercial License**. Engineered by the **LogiForge Studio Architecture Team**.

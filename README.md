<div align="center">

# ⚡ LOGIFORGE
### Premium Logistics Website Template Platform & Live Design Studio

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Design Tokens](https://img.shields.io/badge/CSS-Tokens%20%26%20Modules-purple?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Variables)
[![Architecture Status](https://img.shields.io/badge/Phase%2002-Verified%20Foundation-emerald?style=for-the-badge)](./docs/architecture/PHASE_02_IMPLEMENTATION_REPORT.md)

<p align="center">
  A category-defining digital marketplace, live device preview studio, and starter kit ecosystem engineered specifically for the logistics, maritime shipping, aviation, freight forwarding, telematics, and supply chain industries.
</p>

[Explore Documentation](./docs/architecture/LOGIFORGE_MASTER_BLUEPRINT.md) • [Data Model](./docs/architecture/DATA_MODEL_SPECIFICATION.md) • [Design Tokens](./docs/architecture/DESIGN_SYSTEM_SPECIFICATION.md) • [Roadmap](./docs/architecture/IMPLEMENTATION_ROADMAP.md)

</div>

---

## 🧭 Overview

**LOGIFORGE** bridges the gap between generic theme marketplaces and bespoke agency code. Unlike cookie-cutter web templates that merely swap accent colors across repetitive card grids, LOGIFORGE is built as a **two-tier platform**:

1. **The Platform Shell (Marketplace & Studio):** A fast, accessible catalog with multi-facet filtering, full-text search, device viewport simulation, and a dedicated distraction-free **Client Presentation Mode**.
2. **The Flagship Template Ecosystem:** A curated collection of 10 independent website templates. Every template has a unique typographic identity, custom color palette, dedicated CSS token scope, and signature logistics widgets (e.g. simulated cargo milestone tracking, vessel sailing schedules, telematics diagnostic cards, port berth timelines).

---

## 🚀 Key Features & Capabilities

### 1. 10 Flagship Specialized Logistics Templates
Every template is engineered from the ground up to serve a distinct commercial logistics sub-niche:

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

### 2. Live Demo Studio & Sandboxed Viewport Runtime
- **Multi-Device Viewport Switching:** Test any template in real-time across **Desktop (1440px)**, **Tablet (768px)**, **Mobile (390px)**, and **Fluid (100%)** viewports.
- **IFrame Sandbox Isolation:** Templates render inside an isolated frame (`/demo/[slug]/embed`) with zero CSS style bleeding into the platform host shell.
- **Client Presentation Mode (`Hotkey: P`):** Instantly suppresses technical developer metrics, bundle sizes, and code buttons to provide an executive pitch experience for digital agencies presenting to prospective clients.

---

### 3. Stateful Simulated Waybill Intelligence
- Interactive consignment tracker with authentic milestone progression (ocean, road, air, courier, intermodal).
- Sample test tracking numbers ready for immediate demonstration:
  - `CN-8924-US` — Trans-Pacific container shipment (Shanghai → Long Beach)
  - `FO-4091-TX` — Interstate 20 heavy haul commercial tractor-trailer (Dallas → Atlanta)
  - `SD-4421-EU` — Urban e-cargo bike rush courier delivery (Berlin Mitte → Kreuzberg)
  - `AC-9901-FRA` — Priority trans-atlantic air freight Boeing 777F (Frankfurt → Chicago)
  - `PA-3301-SG` — Intermodal port container berth to rail flatcar (Singapore → Kuala Lumpur)
- Strict compliance with development standards: **all demo tracking results feature an explicit `[ SIMULATED DEMO TRACKING — LOGIFORGE ENGINE ]` disclaimer**.

---

### 4. Dual-Layer Design Token Architecture
- **Platform Shell (`--lf-*`):** Obsidian dark studio aesthetic (`#080B10`), Maritime Cobalt (`#2563EB`), logistics signal accents, accessible `:focus-visible` rings, and reduced motion queries.
- **Template Scope (`--tmpl-*`):** Scoped CSS custom properties dynamically injected into each template embed, guaranteeing 100% theme isolation without style collisions.

---

## 🗺️ Route Architecture

```
/
├── /templates                          [Master Template Catalog & Filter Bar]
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
│       └── PHASE_02_IMPLEMENTATION_REPORT.md
│
├── src/
│   ├── app/                            # Next.js 15 App Router Routes
│   │   ├── layout.tsx                  # Root layout, metadata & viewport
│   │   ├── page.tsx                    # Home foundation
│   │   ├── loading.tsx                 # Route-level loading state
│   │   ├── error.tsx                   # Error boundary
│   │   ├── not-found.tsx               # 404 entity handler
│   │   ├── templates/                  # /templates and /templates/[slug]
│   │   ├── demo/                       # /demo/[slug] and /demo/[slug]/embed
│   │   ├── resources/                  # /resources
│   │   └── about/                      # /about
│   │
│   ├── components/
│   │   ├── platform/                   # Header, Footer, studio navigation
│   │   ├── studio/                     # Demo frame controls & viewport types
│   │   ├── templates/                  # TemplateComponentManifest contract
│   │   └── ui/                         # Badge, Button, accessible primitives
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

## 🛠️ Tech Stack & Engineering Decisions

| Category | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15+ (App Router)** | Industry standard for modern web platforms. Provides server-side rendering for catalog SEO, dynamic route segments (`[slug]`), automated code splitting, and zero layout shift. |
| **UI Library** | **React 19** | Modern server/client component architecture and state management primitives. |
| **Language** | **TypeScript 5.7+ (Strict Mode)** | 100% type safety across domain models, filter states, and tracking milestones. Zero `any` casts. |
| **Styling** | **CSS Modules + CSS Variables** | Native performance, zero runtime JavaScript styling overhead, and scoped encapsulation between platform and templates. |
| **Iconography** | **Lucide React** | Cohesive, highly legible transport, maritime, aviation, and UI icons. |

---

## ⚡ Getting Started Locally

### Prerequisites
- **Node.js**: v18.18.0 or newer (v24 recommended)
- **npm**: v9.0.0 or newer

### Installation

```bash
# 1. Clone the repository
git clone git@github.com:Vijay07012006/LOGIFORGE.git
cd LOGIFORGE

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the platform.

### Quality Verification Commands

```bash
# Run strict TypeScript typechecking
npm run typecheck

# Run ESLint validation
npm run lint

# Build production bundle with static route pre-generation
npm run build

# Start production server
npm run start
```

---

## 🐙 Git Setup & GitHub Repository Commands

To initialize git and push the entire LOGIFORGE repository to GitHub:

```bash
# Initialize git repository
git init

# Stage all files (excluding node_modules and build artifacts via .gitignore)
git add .

# Commit changes
git commit -m "feat: complete phase 01 & phase 02 architecture foundation"

# Set branch to main
git branch -M main

# Link remote origin
git remote add origin git@github.com:Vijay07012006/LOGIFORGE.git

# Push to GitHub
git push -u origin main
```

---

## 📈 Implementation Status & Roadmap

- [x] **Phase 01:** Product Architecture & Technical Blueprint (`docs/architecture/`)
- [x] **Phase 02:** Platform Foundation, Scaffolding, Core Token System & Data Schemas
- [ ] **Phase 03:** Platform Shell & Discovery UI (Faceted Filter Bar, Live URL Search Sync)
- [ ] **Phase 04:** Live Demo Sandbox Enhancements & Client Presentation Mode Toolbar
- [ ] **Phase 05:** Flagship Templates Wave 1 (CargoNova, FleetOne, ShipFlow)
- [ ] **Phase 06:** Flagship Templates Wave 2 (SwiftDrop, PortAxis, AeroCargo, WarehouseX, SupplyCore, RouteIQ, MoveSphere)
- [ ] **Phase 07:** Download Bundling Engine, Resources Hub & Production Hardening

---

## 📄 License & Attribution

Distributed under the **LogiForge Commercial License**. Engineered by the **LogiForge Studio Architecture Team**.

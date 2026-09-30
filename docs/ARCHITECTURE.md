# LOGIFORGE System Architecture & Specification

## 1. Overview & Architectural Philosophy

**LOGIFORGE** is an enterprise-grade digital marketplace, live device preview studio, and starter kit platform built specifically for the global logistics, maritime shipping, air freight, warehousing, and supply chain industries.

The architecture is built upon four foundational design principles:
1. **Zero Style Bleed (CSS Modules Isolation):** Every flagship website template operates in its own isolated CSS token scope. Global design tokens (`--lf-*`) style the platform shell, while template-specific tokens (`--tmpl-*`) style each independent template runtime.
2. **Deterministic Client-Side Simulation:** Complex logistics interactions—such as waybill milestone tracking, vessel schedule lookups, WMS rack visualization, traveling salesperson (TSP) heuristic solvers, and simulated Scope-3 carbon emissions estimation—operate 100% locally with deterministic fixtures, requiring zero external paid APIs or cloud dependencies.
3. **Sandboxed Two-Tier Preview Runtime:** The Demo Studio operates as a parent host shell that embeds the live template inside an isolated iframe, communicating across frames via a strictly validated, bidirectional `postMessage` protocol.
4. **Resilient Route & Dispatcher Hierarchy:** A centralized template catalog and dispatcher gracefully route requests to dedicated flagship implementations while providing a standardized fallback runtime (`EmbeddedTemplateView`) for dynamic or custom templates.

---

## 2. End-to-End Request Lifecycle

```
[ Incoming Browser Request ]
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│ Next.js 15 App Router Layer (`src/app/`)                    │
├─────────────────────────────────────────────────────────────┤
│  • `/`                       → Platform Homepage            │
│  • `/templates`              → Discovery Catalog & Filters  │
│  • `/templates/compare`      → Side-by-Side Template Matrix │
│  • `/templates/[slug]`       → Template Deep-Dive Specs     │
│  • `/demo/[slug]`            → Demo Studio Parent Shell     │
│  • `/demo/[slug]/embed`      → Sandboxed Template Embed     │
│  • `/resources`              → Technical Guides & Modal     │
│  • `/about`                  → Architecture & Governance    │
│  • `/_not-found`             → Global 404 Fallback Handler  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Template Catalog Registry (`src/data/templates/manifests.ts`)│
├─────────────────────────────────────────────────────────────┤
│  • Strongly typed metadata manifests (`Template`)           │
│  • Color palettes, typographic tokens, technical specs      │
│  • Included pages, feature tags, and sample tracking IDs    │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Template Dispatcher (`TemplateRenderer.tsx`)                │
├─────────────────────────────────────────────────────────────┤
│  • Resolves `template.slug` against implemented flagships:  │
│    - `cargo-nova`   → <CargoNovaWebsite />                  │
│    - `fleet-one`    → <FleetOneWebsite />                   │
│    - `ship-flow`    → <ShipFlowWebsite />                   │
│    - `swift-drop`   → <SwiftDropWebsite />                  │
│    - `aero-cargo`   → <AeroCargoWebsite />                  │
│    - `port-axis`    → <PortAxisWebsite />                   │
│    - `warehouse-x`  → <WarehouseXWebsite />                 │
│    - `supply-core`  → <SupplyCoreWebsite />                 │
│    - `route-iq`     → <RouteIQWebsite />                    │
│    - `move-sphere`  → <MoveSphereWebsite />                 │
│  • Fallback Handler → <EmbeddedTemplateView />              │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Interactive Domain Modules (`src/components/templates/`)   │
├─────────────────────────────────────────────────────────────┤
│  • Rate Calculators & Quotation Engines                     │
│  • Simulated Telemetry Gauges & Port Congestion Visualizers │
│  • Simulated WMS ASN Pallet Ingestion Trackers              │
│  • Deterministic TSP Heuristic Solvers                      │
│  • Freight Scope-3 Carbon Estimator Simulators             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Demo Studio & Sandboxed Embed Architecture

The Demo Studio (`src/app/demo/[slug]/page.tsx`) provides an interactive testing and client presentation environment. It mounts the requested template inside an isolated iframe at `/demo/[slug]/embed?tracking=[trackingNumber]&page=[activeSection]`.

### 3.1 Frame Isolation & Chrome Suppression
- **Platform Header (`src/components/platform/Header.tsx`):** Automatically checks `pathname?.includes('/embed')` and returns `null`, preventing duplicate platform navigation inside iframes.
- **Platform Footer (`src/components/platform/Footer.tsx`):** Automatically checks `pathname?.startsWith('/demo')` and returns `null`, ensuring the Demo Studio shell fills `100vh` without footer interference.
- **Recursive Frame-Busting:** `src/app/demo/[slug]/page.tsx` executes an initial guard:
  ```typescript
  if (typeof window !== 'undefined' && window.top !== window.self) {
    window.location.replace(`/demo/${slug}/embed`);
  }
  ```
  This guarantees the outer Demo Studio chrome can never be framed inside another iframe.

### 3.2 Viewport Simulation Presets
The Demo Studio canvas provides physical device bezels with smooth orientation rotation:
- **Desktop:** Unconstrained 100% canvas with `maxWidth: 1440px`.
- **Tablet:** 768px × 1024px (Portrait) or 1024px × 768px (Landscape) bezel with camera notch.
- **Mobile:** 375px × 812px (Portrait) or 812px × 375px (Landscape) bezel with speaker grill, camera notch, and home indicator. Scales down to 320px screens seamlessly.
- **Client Presentation Mode:** Fullscreen overlay (`fixed, z-index: 999999`) with an ambient floating HUD, toggled via keyboard shortcut `P` or native fullscreen button.

---

## 4. Bidirectional `postMessage` Protocol & Event Bus

Communication between the Demo Studio host and the embedded template iframe occurs over a strictly typed, origin-validated `postMessage` channel.

```
┌────────────────────────────────────────────────────────┐
│ Demo Studio Host Shell (`/demo/[slug]`)                │
└───────────────────────────┬────────────────────────────┘
                            │
      NAVIGATE_PAGE         │ (User clicks Blueprint Views tab)
      NAVIGATE_TEMPLATE_PAGE│
                            ├──────────────────────────► ┌───────────────────────────────────────┐
                            │                            │ Embedded Template Iframe (`/embed`)   │
      INJECT_TRACKING_QUERY │ (User clicks sample pill   │                                       │
                            │  or enters custom waybill) │ • Validates event.origin              │
                            ├──────────────────────────► │ • Scrolls to target section ID        │
                            │                            │ • Synchronizes state via useEffect    │
                            │                            │ • Executes mock tracking search       │
                            │                            │                                       │
                            │ ◄──────────────────────────┤ • Emits TEMPLATE_MOUNTED              │
                            │    TEMPLATE_MOUNTED        │ • Emits TEMPLATE_PAGE_CHANGED         │
                            │                            │ • Emits TRACKING_SEARCH_PERFORMED     │
                            │ ◄──────────────────────────┤                                       │
                            │    TRACKING_SEARCH_PERF    └───────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ Demo Studio Host Updates Active Tab & Waybill Inspector│
└────────────────────────────────────────────────────────┘
```

### 4.1 Message Types Contract (`src/components/studio/types.ts`)

#### Host to Template Messages
```typescript
export type HostToTemplateMessage =
  | { type: 'SET_CLIENT_PRESENTATION_MODE'; enabled: boolean }
  | { type: 'INJECT_TRACKING_QUERY'; trackingNumber: string }
  | { type: 'NAVIGATE_TEMPLATE_PAGE'; pageSlug: string }
  | { type: 'SET_SIMULATED_DELAY'; delayMs: number }
  | { type: 'THEME_UPDATE'; primaryAccent?: string; secondaryAccent?: string }
  | { type: 'THEME_RESET' };
```

#### Template to Host Messages
```typescript
export type TemplateToHostMessage =
  | { type: 'TEMPLATE_MOUNTED'; slug: string; title: string; currentRoute: string }
  | { type: 'TEMPLATE_PAGE_CHANGED'; pageSlug: string }
  | { type: 'TRACKING_SEARCH_PERFORMED'; trackingNumber: string; found: boolean };
```

### 4.2 Origin & Security Validation
In both directions, messages are protected by strict origin validation:
```typescript
if (typeof window !== 'undefined' && event.origin !== window.location.origin) {
  return; // Reject untrusted cross-origin messages
}
```
Runtime messaging explicitly targets the application origin (`window.location.origin`):
```typescript
const targetOrigin = window.location.origin;
iframeRef.current.contentWindow.postMessage(message, targetOrigin);
```
Wildcard target origins (`'*'`) are never used for cross-origin transmission, and receiving event handlers authenticate `event.source === iframeRef.current.contentWindow` to prevent spoofing.

---

## 5. Simulated Tracking Architecture

Tracking lookups in LOGIFORGE resolve against a deterministic multi-milestone fixture library located in `src/data/tracking/fixtures.ts`.

### 5.1 Data Contract (`SimulatedShipment`)
```typescript
export interface SimulatedMilestone {
  id: string;
  status: 'completed' | 'in_transit' | 'pending' | 'exception';
  location: string;
  facility?: string;
  timestamp: string;
  description: string;
}

export interface SimulatedShipment {
  trackingNumber: string;
  status: 'delivered' | 'in_transit' | 'out_for_delivery' | 'customs_hold' | 'manifest_received';
  origin: { code: string; city: string; country: string };
  destination: { code: string; city: string; country: string };
  eta: string;
  carrier: string;
  serviceLevel: string;
  vesselOrFlight?: string;
  containerId?: string;
  carbonOffsetKg?: number;
  temperatureCelsius?: number;
  milestones: SimulatedMilestone[];
}
```

### 5.2 Lookup Engine (`src/lib/tracking/index.ts`)
When `lookupSimulatedShipment(query)` is called:
1. It sanitizes the input (`query.trim().toUpperCase()`).
2. Checks direct match in `SIMULATED_SHIPMENTS[cleanQuery]`.
3. If not found, generates a deterministic procedural shipment timeline matching the prefix mode (e.g. `CN-` for ocean freight, `FO-` for heavy fleet, `AC-` for airway bill, `WX-` for warehouse ASN, `MS-` for cryogenic intermodal).
4. Ensures zero runtime crashes, zero undefined states, and zero network calls.

---

## 6. CSS Design System & Theme Architecture

The platform employs a two-tier token architecture:

### 6.1 Platform Tokens (`src/styles/tokens.css`)
- Prefix: `--lf-*`
- Scope: Platform shell (Header, Footer, Catalog, Demo Studio toolbar, GuideModal, Badges, Buttons).
- Primary Base: `#0d0a08` (Dark Luxury Warm Base).
- Accents: `#e8590c` (Tandoori Orange) and `#ffb347` (Warm Golden Amber).
- Typography: `Playfair Display` (editorial headings), `Poppins` (clean UI body), and `JetBrains Mono` (technical metrics).

### 6.2 Template Tokens (`src/components/templates/[slug]/[Slug].module.css`)
- Prefix: `--tmpl-*`
- Scope: Scoped strictly to the specific template container class (e.g. `.cargonovaRoot`, `.warehousexRoot`, `.routeiqRoot`).
- Guarantees: Zero style bleeding between templates and zero collision with the platform shell.

---

## 7. Security Review & Best Practices

1. **No DangerouslySetInnerHTML:** Verified 0 occurrences in `src/`. All user and template content is rendered through React JSX element binding with automatic entity escaping.
2. **No Eval or Code Injection:** Zero dynamic code execution.
3. **Sandbox Restrictions:** Sandboxed embed iframes are loaded over same-origin relative URLs (`/demo/[slug]/embed`) and protected by explicit message origin validation.
4. **Input Sanitization:** Calculator and tracking inputs are guarded against `NaN`, negative numbers, infinite loops, and special character injection.
5. **No Secrets in Source:** No `.env` secrets, tokens, credentials, or private keys exist in the repository.

---

## 8. Directory & File Organization

```
LOGIFORGE/
├── docs/                               # System Architecture & Documentation
│   ├── ARCHITECTURE.md                 # Master Architecture Specification
│   ├── TEMPLATE_DEVELOPMENT.md         # Template Development & Extension Guide
│   ├── SECURITY.md                     # Content Security Policy & Frame Isolation
│   ├── DEPLOYMENT.md                   # Static Generation & Vercel Hosting Architecture
│   ├── architecture/                   # Specifications, Data Models & Master Blueprints
│   └── reports/                        # Historical Engineering & QA Audit Archive
│
├── src/
│   ├── app/                            # Next.js 15 App Router Routes
│   │   ├── layout.tsx                  # Root HTML Layout, Metadata & Theme
│   │   ├── page.tsx                    # Platform Editorial Homepage
│   │   ├── not-found.tsx               # Global 404 Entity Handler
│   │   ├── error.tsx                   # Global Client Error Boundary
│   │   ├── loading.tsx                 # Route Loading Spinner
│   │   ├── templates/                  # /templates (Catalog) and /templates/[slug] (Showcase)
│   │   ├── demo/                       # /demo/[slug] (Studio) and /demo/[slug]/embed (Embed)
│   │   ├── resources/                  # /resources (Technical Guides & Modal Reader)
│   │   └── about/                      # /about (Platform Manifesto)
│   │
│   ├── components/
│   │   ├── platform/                   # Header, Footer, MobileDrawer, GuideModal, TemplateCard
│   │   ├── studio/                     # EmbeddedTemplateView, Studio Types & postMessage
│   │   ├── templates/                  # 10 Flagship Template Implementations + Dispatcher
│   │   │   ├── cargonova/
│   │   │   ├── fleetone/
│   │   │   ├── shipflow/
│   │   │   ├── swiftdrop/
│   │   │   ├── aerocargo/
│   │   │   ├── portaxis/
│   │   │   ├── warehousex/
│   │   │   ├── supplycore/
│   │   │   ├── routeiq/
│   │   │   ├── movesphere/
│   │   │   └── dispatcher/TemplateRenderer.tsx
│   │   └── ui/                         # Shared UI Primitives (Button, Badge, Card, Container)
│   │
│   ├── data/                           # Centralized Fixtures & Manifest Registries
│   │   ├── categories/                 # 11 Logistics Industry Categories
│   │   ├── collections/                # Curated Sector Collections
│   │   ├── templates/manifests.ts      # 10 Flagship Template Manifests
│   │   └── tracking/fixtures.ts        # Simulated Milestone Shipment Fixtures
│   │
│   ├── lib/                            # Platform Business Logic & Filtering Engines
│   └── styles/                         # Global Reset, Design Tokens & Custom Scrollbars
│
├── package.json                        # Zero-Bloat Dependencies & Script Definitions
├── tsconfig.json                       # Strict TypeScript Configuration
└── next.config.ts                      # Next.js 15 Server Settings
```

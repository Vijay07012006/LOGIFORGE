# LOGIFORGE: Live Demo & Sandbox Architecture Specification

**Document Version:** 1.0.0  
**Status:** Live Demo & Interactive Sandbox Specification (Phase 01)  

---

## 1. Architectural Philosophy

The Live Demo feature is not a static screenshot viewer; it is a **live, responsive template runtime studio**. A visitor can interact with forms, simulate cargo tracking, switch viewports, inspect responsive behaviors, and switch into **Client Presentation Mode** seamlessly.

---

## 2. Shell vs. Embedded Template Topology

To achieve complete CSS and JavaScript isolation, LogiForge divides the live demo into two interconnected layers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. STUDIO HOST SHELL (Route: /demo/[slug])                                  │
│                                                                             │
│ [Studio Header]                                                             │
│ • Back to Catalog                                                           │
│ • Template Picker Dropdown (Instant switch between templates)               │
│ • Device Viewport Switcher: [Desktop] [Tablet] [Mobile] [Fluid]             │
│ • Zoom Controls (100%, 75%, 50%, Fit-to-screen)                             │
│ • Client Presentation Toggle (Hotkey: P)                                    │
│ • Test Tracking Quick Trigger ("Load Sample Waybill")                       │
│ • Action CTAs: [Download Starter] [Inspect Code / Pages]                    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 2. SANDBOX VIEWPORT CONTAINER                                         │  │
│  │    Width: 390px (Mobile) | 768px (Tablet) | 1440px (Desktop) | 100%   │  │
│  │    Height: 844px | 1024px | 900px | 100%                              │  │
│  │    Frame: Realistic bezel option / clean border                       │  │
│  │                                                                       │  │
│  │    ┌─────────────────────────────────────────────────────────────┐    │  │
│  │    │ 3. SANDBOXED IFRAME (Route: /demo/[slug]/embed)             │    │  │
│  │    │    • Zero style bleed from platform shell                   │    │  │
│  │    │    • Native CSS media queries trigger at device width       │    │  │
│  │    │    • Sandboxed execution: allow-scripts allow-same-origin   │    │  │
│  │    │    • Bidirectional postMessage event bus                    │    │  │
│  │    └─────────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Bidirectional `postMessage` Event Bus

The Studio Host Shell and the Embedded Template communicate over a typed message protocol:

```typescript
// Platform Studio Shell -> Embedded Template
export type HostToTemplateMessage =
  | { type: 'SET_CLIENT_PRESENTATION_MODE'; enabled: boolean }
  | { type: 'INJECT_TRACKING_QUERY'; trackingNumber: string }
  | { type: 'NAVIGATE_TEMPLATE_PAGE'; pageSlug: string }
  | { type: 'SET_SIMULATED_DELAY'; delayMs: number };

// Embedded Template -> Platform Studio Shell
export type TemplateToHostMessage =
  | { type: 'TEMPLATE_MOUNTED'; slug: string; title: string; currentRoute: string }
  | { type: 'TRACKING_SEARCH_PERFORMED'; trackingNumber: string; resultFound: boolean }
  | { type: 'TEMPLATE_PAGE_CHANGED'; pageSlug: string };
```

---

## 4. Interactive Simulated Tracking Engine

In compliance with **Development Principle #6 ("No fake functionality presented as real")**:
- Tracking must feel authentic and delightful, but it must **never** mislead clients into thinking it is an active satellite link or real commercial carrier API.
- All tracking results feature a distinct platform pill:
  `[ SIMULATED DEMO TRACKING — LOGIFORGE ENGINE ]`

### 4.1 Sample Tracking Repository & Milestones

The simulated engine stores realistic stateful data for quick exploration:

```typescript
export const SIMULATED_TRACKING_FIXTURES: Record<string, SimulatedShipment> = {
  'CN-8924-US': {
    trackingNumber: 'CN-8924-US',
    transportMode: 'ocean',
    origin: { city: 'Shanghai', country: 'China', code: 'CNSHA' },
    destination: { city: 'Long Beach', country: 'United States', code: 'USLGB' },
    eta: '2026-09-18 14:00 UTC',
    currentStatus: 'In Transit - Trans-Pacific Trade Corridor',
    carrier: 'Evergreen Marine / CargoNova Alliance',
    vesselOrFlight: 'Ever Forward (Voyage 042E)',
    containerId: 'EGLV-9102834-40HC',
    isSimulatedDemoData: true,
    milestones: [
      {
        id: 'm1',
        status: 'completed',
        location: 'Shanghai Port Pier 4',
        facility: 'Yangshan Deepwater Terminal',
        timestamp: '2026-09-02 08:30 UTC',
        description: 'Export customs cleared & loaded onto container vessel'
      },
      {
        id: 'm2',
        status: 'completed',
        location: 'East China Sea',
        facility: 'Open Waters',
        timestamp: '2026-09-05 18:00 UTC',
        description: 'Vessel departure confirmed, proceeding at 19.4 knots'
      },
      {
        id: 'm3',
        status: 'in-transit',
        location: 'Mid-Pacific Waypoint Alpha',
        facility: 'Pacific Sea Lane 4',
        timestamp: '2026-09-09 11:15 UTC',
        description: 'Optimal weather routing maintained. Normal engine operations'
      },
      {
        id: 'm4',
        status: 'pending',
        location: 'Long Beach Berth 12',
        facility: 'Pier G Intermodal Terminal',
        timestamp: '2026-09-18 14:00 UTC (Estimated)',
        description: 'Scheduled berth arrival & customs clearance'
      }
    ]
  },
  'FO-4091-TX': {
    trackingNumber: 'FO-4091-TX',
    transportMode: 'road',
    origin: { city: 'Dallas', country: 'USA', code: 'DFW' },
    destination: { city: 'Atlanta', country: 'USA', code: 'ATL' },
    eta: '2026-09-10 09:30 CST',
    currentStatus: 'In Transit - Interstate 20 Eastbound',
    carrier: 'FleetOne Heavy Haul Division',
    isSimulatedDemoData: true,
    milestones: [
      {
        id: 'm1',
        status: 'completed',
        location: 'Dallas Distribution Hub',
        facility: 'FleetOne Bay 14',
        timestamp: '2026-09-08 20:00 CST',
        description: 'Freight secured, driver log inspection completed'
      },
      {
        id: 'm2',
        status: 'in-transit',
        location: 'Shreveport, LA',
        facility: 'Telematics Checkpoint Mile 114',
        timestamp: '2026-09-09 04:15 CST',
        description: 'Cruising speed 64 mph, tire pressure optimal'
      },
      {
        id: 'm3',
        status: 'pending',
        location: 'Atlanta Intermodal Center',
        facility: 'Receiving Dock 8',
        timestamp: '2026-09-10 09:30 CST (Estimated)',
        description: 'Scheduled delivery window'
      }
    ]
  }
};
```

---

## 5. Client Presentation Mode Specification

When an agency or developer is presenting to a prospective client:
1. **Activation:** User clicks the **"Client Mode"** button or presses the `P` key.
2. **UI Transformation:**
   - Platform navigation header collapses into a sleek, minimal floating top bar.
   - Developer metrics (bundle size, technology badges, download buttons, code links) are gracefully faded out.
   - A presentation header displays:
     `[ CLIENT PREVIEW — LOGIFORGE STUDIO ] | [ Template: CargoNova ] | [ Presenting to: Stakeholders ]`
   - Focus is entirely on design hierarchy, branding, interactive tracking, responsive adaptability, and page structure.
   - Can easily toggle device views (e.g. "Here is how your customers experience the booking tracking on mobile").

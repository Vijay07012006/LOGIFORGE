# LOGIFORGE Template Development & Extension Guide

This guide provides an end-to-end walkthrough for creating, styling, wiring, and certifying a new flagship template in the **LOGIFORGE** platform. By following these steps, adding **Template #11** (or extending existing templates) is predictable, repeatable, and fully aligned with platform architecture.

---

## 1. Architecture Overview for Template Developers

Every LOGIFORGE template operates as an independent, self-contained website module rendered through the **Template Dispatcher** (`TemplateRenderer.tsx`).

Each template includes:
1. **Component Directory:** `src/components/templates/[slug]/` containing modular section components.
2. **CSS Module:** `[Slug].module.css` defining template-scoped CSS tokens (`--tmpl-*`).
3. **Manifest Entry:** Registered in `src/data/templates/manifests.ts` with complete metadata.
4. **Dispatcher Entry:** Added to `src/components/templates/dispatcher/TemplateRenderer.tsx`.
5. **Blueprint Navigation:** Mapped in `BLUEPRINT_NAV_BY_SLUG` in `src/app/demo/[slug]/page.tsx`.
6. **Simulated Tracking Fixtures:** Added in `src/data/tracking/fixtures.ts`.
7. **postMessage Event Handlers:** Synchronized with the Demo Studio host shell.

---

## 2. Step-by-Step Implementation Guide

### Step 1: Create the Template Directory & Component Files
Create a new directory under `src/components/templates/[slug]/`. For example, for an autonomous drone delivery template named `SkyDrop` (`skydrop`):

```
src/components/templates/skydrop/
├── SkyDrop.module.css          # Scoped styles and CSS tokens
├── SkyDropWebsite.tsx          # Main root website orchestrator
├── SkyDropHero.tsx             # Hero section with headline and CTAs
├── SkyDropTracking.tsx         # Live drone telemetry & waybill tracking
├── SkyDropFlightZones.tsx      # Geofencing visualizer & corridor table
├── SkyDropPayloadCalc.tsx      # Drone payload vs battery range calculator
└── index.ts                    # Barrel export
```

### Step 2: Define Scoped CSS Tokens in `[Slug].module.css`
Define your template's color palette, typography, and container styles using the `--tmpl-*` prefix to prevent any collision with the platform shell (`--lf-*`):

```css
.skydropRoot {
  --tmpl-bg-base: #080d14;
  --tmpl-bg-surface: #0e1724;
  --tmpl-text-primary: #f0f6fc;
  --tmpl-text-muted: #8b949e;
  --tmpl-accent: #00d2ff;
  --tmpl-accent-glow: rgba(0, 210, 255, 0.25);
  --tmpl-border: rgba(0, 210, 255, 0.15);
  --tmpl-radius: 8px;

  background-color: var(--tmpl-bg-base);
  color: var(--tmpl-text-primary);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.section {
  padding: 5rem 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
}
```

### Step 3: Implement the Website Root (`[Slug]Website.tsx`)
The root template component orchestrates sections, manages active navigation, and implements the **bidirectional `postMessage` protocol**:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { SkyDropHero } from './SkyDropHero';
import { SkyDropTracking } from './SkyDropTracking';
import { SkyDropFlightZones } from './SkyDropFlightZones';
import { SkyDropPayloadCalc } from './SkyDropPayloadCalc';
import styles from './SkyDrop.module.css';

interface SkyDropWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Overview' },
  { id: 'tracking', label: 'Drone Telemetry' },
  { id: 'zones', label: 'Flight Corridors' },
  { id: 'payload', label: 'Payload Estimator' },
];

export function SkyDropWebsite({
  template,
  initialTracking = 'SD-9900-AIR',
  initialPage = 'home',
}: SkyDropWebsiteProps) {
  const [activeSection, setActiveSection] = useState(initialPage);
  const [currentTracking, setCurrentTracking] = useState(initialTracking);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const targetId = id === 'telemetry' ? 'tracking' : id;
    const el = document.getElementById(targetId) || document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    // Notify Demo Studio host
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        { type: 'TEMPLATE_PAGE_CHANGED', pageSlug: id },
        window.location.origin
      );
    }
  };

  useEffect(() => {
    function handleHostMessage(event: MessageEvent) {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      // Host navigated to a section
      if ((data.type === 'NAVIGATE_PAGE' || data.type === 'NAVIGATE_TEMPLATE_PAGE') && data.pageSlug) {
        scrollToSection(data.pageSlug);
      }

      // Host injected a tracking query
      if (data.type === 'INJECT_TRACKING_QUERY' && typeof data.trackingNumber === 'string') {
        const query = data.trackingNumber.trim();
        setCurrentTracking(query);
        scrollToSection('tracking');
      }
    }

    window.addEventListener('message', handleHostMessage);

    // Announce mount to Demo Studio host
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TEMPLATE_MOUNTED',
          slug: template.slug,
          title: template.name,
          currentRoute: activeSection,
        },
        window.location.origin
      );
    }

    return () => window.removeEventListener('message', handleHostMessage);
  }, [template.slug, template.name, activeSection]);

  return (
    <div className={styles.skydropRoot}>
      <TemplateHeader
        brandName="SKYDROP"
        tagline="Autonomous Drone Urban Delivery"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Dispatch Fleet"
        onCtaClick={() => scrollToSection('tracking')}
      />

      <main>
        <section id="home">
          <SkyDropHero onExplore={() => scrollToSection('zones')} />
        </section>

        <section id="tracking">
          <SkyDropTracking
            initialTracking={currentTracking}
            onSearchPerformed={(trackingNumber, found) => {
              if (typeof window !== 'undefined' && window.parent !== window) {
                window.parent.postMessage(
                  { type: 'TRACKING_SEARCH_PERFORMED', trackingNumber, found },
                  window.location.origin
                );
              }
            }}
          />
        </section>

        <section id="zones">
          <SkyDropFlightZones />
        </section>

        <section id="payload">
          <SkyDropPayloadCalc />
        </section>
      </main>

      <TemplateFooter brandName="SKYDROP" />
    </div>
  );
}
```

### Step 4: Implement Tracking Synchronization in `[Slug]Tracking.tsx`
Ensure the tracking component synchronizes with the `initialTracking` prop via `useEffect`:

```tsx
export function SkyDropTracking({ initialTracking, onSearchPerformed }: SkyDropTrackingProps) {
  const [query, setQuery] = useState(initialTracking || '');
  const [shipment, setShipment] = useState<SimulatedShipment | null>(() =>
    lookupSimulatedShipment(initialTracking || '')
  );

  React.useEffect(() => {
    if (initialTracking) {
      const clean = initialTracking.trim().toUpperCase();
      setQuery(clean);
      const res = lookupSimulatedShipment(clean);
      setShipment(res);
      onSearchPerformed?.(clean, !!res);
    }
  }, [initialTracking, onSearchPerformed]);

  // Form submit handler with empty check
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toUpperCase();
    if (!clean) {
      setShipment(null);
      return;
    }
    const res = lookupSimulatedShipment(clean);
    setShipment(res);
    onSearchPerformed?.(clean, !!res);
  };

  return (
    <div>
      {/* Search Input */}
      {shipment ? (
        <ShipmentTimeline shipment={shipment} />
      ) : (
        <div className={styles.emptyState}>
          No flight telemetry found for {query || 'empty query'}. Try sample <strong>SD-9900-AIR</strong>.
        </div>
      )}
    </div>
  );
}
```

### Step 5: Register in `src/data/templates/manifests.ts`
Add the complete template metadata object to `MANIFEST_TEMPLATES`:

```typescript
{
  id: 'tmpl-skydrop-011',
  slug: 'skydrop',
  name: 'SkyDrop',
  tagline: 'Autonomous Drone Urban Delivery & Airway Corridor Logistics',
  description: 'Ultra-low-latency aerial dispatch platform featuring urban rooftop landing radar, FAA geofenced corridor visualizer, and dynamic payload battery calculators.',
  category: 'air-cargo',
  style: 'futuristic',
  tags: ['Drone Delivery', 'Urban Air Mobility', 'Air Freight', 'Autonomous Logistics'],
  theme: {
    primaryColor: '#00D2FF',
    secondaryColor: '#0E1724',
    accentColor: '#38BDF8',
    backgroundColor: '#080D14',
    textColor: '#F0F6FC',
    fontHeading: 'Archivo, sans-serif',
    fontBody: 'Inter, sans-serif',
    borderRadius: '8px',
    density: 'spacious',
    colorMode: 'dark',
  },
  technologies: ['React', 'Next.js', 'TypeScript', 'CSS Modules'],
  responsive: { desktop: true, tablet: true, mobile: true, minWidthPx: 320 },
  bundleSizeKb: 46,
  pages: [
    {
      id: 'sd-pg-home',
      title: 'Drone Fleet Mission Control',
      slug: 'home',
      sections: ['hero', 'tracking', 'zones', 'payload', 'footer'],
    },
  ],
  sections: {
    hero: { headline: 'Autonomous Last-Mile Aerial Delivery', ctaPrimary: { label: 'Track Drone', href: '#tracking' } },
    tracking: {
      title: 'Urban Airspace Flight Radar',
      sampleTrackingNumbers: ['SD-9900-AIR'],
      modesSupported: ['air'],
    },
  },
}
```

### Step 6: Wire the Dispatcher in `TemplateRenderer.tsx`
Import your root component and add its slug branch:

```tsx
import { SkyDropWebsite } from '@/components/templates/skydrop/SkyDropWebsite';

export function TemplateRenderer({ template, initialTracking, initialPage = 'home' }: TemplateRendererProps) {
  // Existing templates ...

  if (template.slug === 'skydrop') {
    return (
      <SkyDropWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  return <EmbeddedTemplateView ... />;
}
```

### Step 7: Map Demo Studio Blueprint Navigation
In `src/app/demo/[slug]/page.tsx`, add the template's Blueprint Views tabs and default tracking query:

```typescript
const BLUEPRINT_NAV_BY_SLUG: Record<string, { id: string; label: string }[]> = {
  // ...
  'skydrop': [
    { id: 'home', label: 'Home Overview' },
    { id: 'tracking', label: 'Drone Radar' },
    { id: 'zones', label: 'Flight Corridors' },
    { id: 'payload', label: 'Payload Estimator' },
  ],
};

const DEFAULT_TRACKING_BY_SLUG: Record<string, string> = {
  // ...
  'skydrop': 'SD-9900-AIR',
};
```

### Step 8: Add Tracking Fixture in `src/data/tracking/fixtures.ts`
Add a deterministic multi-milestone shipment entry matching the sample tracking number:

```typescript
'SD-9900-AIR': {
  trackingNumber: 'SD-9900-AIR',
  status: 'in_transit',
  origin: { code: 'UAM-SEA-01', city: 'Seattle Downtown Hub', country: 'United States' },
  destination: { code: 'UAM-BLL-04', city: 'Bellevue Tech Campus Rooftop 4', country: 'United States' },
  eta: 'Today, 14:15 PST (In Flight)',
  carrier: 'SkyDrop Aerial Express',
  serviceLevel: 'Autonomous Drone Priority (Sub-30 Min)',
  vesselOrFlight: 'HexaCopter Drone #88-Alpha',
  carbonOffsetKg: 0.12,
  milestones: [
    {
      id: 'sd-m1',
      status: 'completed',
      location: 'Seattle Hub Port 2',
      timestamp: 'Today, 13:50 PST',
      description: 'Automated battery swap complete. Precision payload bay sealed.',
    },
    {
      id: 'sd-m2',
      status: 'in_transit',
      location: 'Air Corridor Echo-3 (400 FT AGL)',
      timestamp: 'Today, 14:02 PST',
      description: 'Cruising at 42 KTS. LiDAR collision avoidance radar active.',
    },
  ],
},
```

---

## 3. Quality & Certification Checklist

Before marking any new template as release-ready, execute and certify all items:

- [ ] **TypeScript Check:** `npm run typecheck` exits with 0 errors.
- [ ] **Lint Check:** `npm run lint` exits with 0 warnings / 0 errors.
- [ ] **Production Build:** `npm run build` statically pre-renders the new template showcase and embed routes.
- [ ] **Route Coverage:** Verify both `/templates/[slug]`, `/demo/[slug]`, and `/demo/[slug]/embed` respond with 200 OK.
- [ ] **Blueprint Navigation:** Clicking each tab in Demo Studio scrolls the embedded iframe to the corresponding section smoothly.
- [ ] **postMessage Tracking:** Injected sample tracking pill updates the tracker and returns `TRACKING_SEARCH_PERFORMED`.
- [ ] **Responsive Test:** Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`) from 320px to 3840px.
- [ ] **Form Guarding:** Input fields guard against `NaN`, negative values, or empty submissions.
- [ ] **Accessibility:** All interactive buttons and inputs have visible `:focus-visible` styling and accessible labels.
- [ ] **No Secrets or External Services:** Operates 100% locally with zero external network dependencies.

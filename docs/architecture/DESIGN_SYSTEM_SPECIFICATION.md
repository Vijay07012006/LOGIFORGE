# LOGIFORGE: Design System & Token Architecture

**Document Version:** 1.0.0  
**Status:** Canonical Design Token Specification (Phase 01)  

---

## 1. Dual-Layer Token System

LOGIFORGE utilizes a **two-tier design token architecture**:

1. **Layer 1: Platform Shell Tokens (`--lf-platform-*`)**
   - Governs the marketplace catalog, search bar, navigation header, device preview frame toolbar, modal dialogs, drawers, and platform typography.
   - Fixed, high-contrast, premium dark studio aesthetic (Obsidian, Deep Slate, Electric Amber, and Polished Titanium).

2. **Layer 2: Scoped Template Tokens (`--tmpl-*`)**
   - Every individual template defines its own isolated token namespace.
   - Changing tokens in Template #1 (e.g. `CargoNova`'s Cormorant Garamond serif and Gold accent) has **zero impact** on Template #2 (`FleetOne`'s Space Grotesk and Industrial Warning Yellow).

```
   ┌─────────────────────────────────────────────────────────────┐
   │ PLATFORM SHELL SCOPE (:root, body)                          │
   │ --lf-platform-bg: #0B0E14;                                  │
   │ --lf-platform-accent: #3B82F6;                              │
   │ --lf-platform-font-sans: 'Inter', system-ui;                │
   │                                                             │
   │   ┌───────────────────────────────────────────────────────┐ │
   │   │ TEMPLATE EMBED / CONTAINER SCOPE ([data-template])    │ │
   │   │ --tmpl-bg: var(--cargonova-bg, #090D16);              │ │
   │   │ --tmpl-accent: var(--cargonova-gold, #D4AF37);        │ │
   │   │ --tmpl-font-heading: 'Cormorant Garamond', serif;     │ │
   │   └───────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────────┘
```

---

## 2. Platform Shell Token Tokens

### 2.1 Color Palette

```css
:root {
  /* Surface & Background (Obsidian Studio Palette) */
  --lf-bg-base: #080B10;
  --lf-bg-surface: #0E131F;
  --lf-bg-elevated: #161C2E;
  --lf-bg-overlay: rgba(8, 11, 16, 0.85);

  /* Borders & Dividers */
  --lf-border-subtle: rgba(255, 255, 255, 0.08);
  --lf-border-medium: rgba(255, 255, 255, 0.16);
  --lf-border-accent: rgba(59, 130, 246, 0.4);

  /* Typography & Foreground */
  --lf-text-primary: #F8FAFC;
  --lf-text-secondary: #94A3B8;
  --lf-text-muted: #64748B;
  --lf-text-inverse: #080B10;

  /* Brand Accents (Logistics Signal Colors) */
  --lf-accent-primary: #2563EB;        /* Maritime Cobalt */
  --lf-accent-primary-hover: #1D4ED8;
  --lf-accent-amber: #F59E0B;          /* Cargo Warning Gold */
  --lf-accent-emerald: #10B981;        /* In-Transit Success */
  --lf-accent-cyan: #06B6D4;           /* Air Corridors */
  --lf-accent-purple: #8B5CF6;         /* Logistics Tech / AI */

  /* Shadows & Elevation */
  --lf-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
  --lf-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5);
  --lf-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -4px rgba(0, 0, 0, 0.6);
  --lf-shadow-glow: 0 0 24px -4px rgba(37, 99, 235, 0.35);

  /* Spacing Scale */
  --lf-space-1: 0.25rem;   /* 4px */
  --lf-space-2: 0.5rem;    /* 8px */
  --lf-space-3: 0.75rem;   /* 12px */
  --lf-space-4: 1.0rem;    /* 16px */
  --lf-space-6: 1.5rem;    /* 24px */
  --lf-space-8: 2.0rem;    /* 32px */
  --lf-space-12: 3.0rem;   /* 48px */
  --lf-space-16: 4.0rem;   /* 64px */
  --lf-space-24: 6.0rem;   /* 96px */

  /* Border Radii */
  --lf-radius-sm: 4px;
  --lf-radius-md: 8px;
  --lf-radius-lg: 12px;
  --lf-radius-xl: 16px;
  --lf-radius-full: 9999px;

  /* Typography Scale */
  --lf-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lf-font-mono: 'JetBrains Mono', monospace;

  --lf-text-xs: 0.75rem;     /* 12px */
  --lf-text-sm: 0.875rem;    /* 14px */
  --lf-text-base: 1.0rem;    /* 16px */
  --lf-text-lg: 1.125rem;    /* 18px */
  --lf-text-xl: 1.25rem;     /* 20px */
  --lf-text-2xl: 1.5rem;     /* 24px */
  --lf-text-3xl: 1.875rem;   /* 30px */
  --lf-text-4xl: 2.25rem;    /* 36px */
  --lf-text-5xl: 3.0rem;     /* 48px */

  /* Transitions & Timing */
  --lf-transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --lf-transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --lf-transition-slow: 400ms cubic-bezier(0.16, 1, 0.3, 1);

  /* Z-Index Hierarchy */
  --lf-z-base: 0;
  --lf-z-card: 10;
  --lf-z-sticky: 100;
  --lf-z-toolbar: 200;
  --lf-z-overlay: 500;
  --lf-z-modal: 1000;
  --lf-z-toast: 2000;
}
```

---

## 3. Flagship Template Token Profiles

Each of the 10 initial template concepts has a reserved, unique visual token profile:

| Template | Primary Accent | Secondary Color | Heading Font | Body Font | Card Radius | Mood & Texture |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01 CargoNova** | `#D4AF37` (Gold) | `#0E1B2E` (Navy) | Cormorant Garamond | Inter | 4px (Editorial) | High-contrast, gold foil accents, refined luxury |
| **02 FleetOne** | `#EAB308` (Hazard Amber) | `#18181B` (Zinc) | Space Grotesk | JetBrains Mono | 2px (Industrial) | High-density telematics, technical readouts |
| **03 ShipFlow** | `#0284C7` (Nordic Ocean) | `#F8FAFC` (Off-white) | Plus Jakarta Sans | Manrope | 12px (Soft Minimal) | Airy, vast white space, oceanic cyan lines |
| **04 SwiftDrop** | `#F97316` (Express Orange) | `#0F172A` (Slate) | Outfit | Plus Jakarta Sans | 16px (Bento Pill) | Fast-paced, punchy badges, micro-animations |
| **05 PortAxis** | `#64748B` (Steel Grey) | `#0C4A6E` (Berth Blue) | Syne | Inter | 6px (Architectural) | Structural gridlines, heavy tabular data |
| **06 AeroCargo** | `#38BDF8` (Sky Stratosphere)| `#030712` (Void Black) | Sora | IBM Plex Mono | 8px (Aero Tech) | Cockpit glassmorphism, radar vector rings |
| **07 WarehouseX** | `#10B981` (Automated Green) | `#1E293B` (Rack Grey)| Archivo | Inter | 4px (Functional) | High information density, shelf/bay barcodes |
| **08 SupplyCore** | `#6366F1` (Indigo Link) | `#0F172A` (Corporate) | Cabinet Grotesk | Inter | 8px (Enterprise) | Resilient enterprise graphs, node connections |
| **09 RouteIQ** | `#A855F7` (Neural Purple) | `#050811` (Deep Neural) | Uncut Sans | Fira Code | 10px (Algorithm) | Glowing polyline maps, telemetry dashboards |
| **10 MoveSphere** | `#14B8A6` (Quantum Teal) | `#030712` (Glass Deep) | Clash Display | General Sans | 20px (Futuristic) | Holographic gradients, backdrop blur, glowing nodes |

---

## 4. Accessibility & Micro-Interactions

### 4.1 Accessible Focus State
```css
:focus-visible {
  outline: 2px solid var(--lf-accent-primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25);
}
```

### 4.2 Reduced Motion Mode
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

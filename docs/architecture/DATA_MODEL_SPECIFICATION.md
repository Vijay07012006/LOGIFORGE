# LOGIFORGE: Data Model & Schema Specification

**Document Version:** 1.0.0  
**Status:** Canonical Data Specification (Phase 01)  

---

## 1. Overview

This document specifies the exact TypeScript contracts, data schemas, and domain entities for the LOGIFORGE platform. Every template, category, collection, filter state, and simulated demo payload conforms strictly to these types.

---

## 2. Core TypeScript Definitions

```typescript
/**
 * LogiForge Platform & Template Data Contracts
 * Scope: Platform Catalog, Template Registry, Live Sandbox, Download Bundler
 */

export type LogisticsCategorySlug =
  | 'freight-forwarding'
  | 'shipping-maritime'
  | 'courier-express'
  | 'last-mile'
  | 'fleet-management'
  | 'warehousing-fulfillment'
  | 'supply-chain-enterprise'
  | 'air-cargo'
  | 'ocean-freight'
  | 'port-intermodal'
  | 'logistics-tech';

export type TemplateStyle =
  | 'editorial'
  | 'industrial'
  | 'minimalist'
  | 'modern'
  | 'enterprise'
  | 'aviation'
  | 'operations'
  | 'data-driven'
  | 'futuristic';

export type TemplateTier = 'free' | 'premium' | 'enterprise';

export interface TemplateAuthor {
  name: string;
  avatarUrl?: string;
  role: string;
  website?: string;
}

export interface TemplateMetric {
  label: string;
  value: string;
  detail?: string;
}

export interface TemplatePageSpec {
  id: string;
  title: string;
  slug: string;
  description: string;
  previewImageUrl?: string;
  sections: string[];
}

export interface TemplateFeatureSpec {
  id: string;
  title: string;
  description: string;
  category: 'logistics' | 'interactive' | 'layout' | 'performance';
  badge?: string;
  iconName?: string;
}

export interface TemplateThemeSpec {
  id: string;
  name: string;
  primaryAccent: string;
  secondaryAccent: string;
  surfaceColor: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  density: 'compact' | 'comfortable' | 'spacious';
  colorMode: 'dark' | 'light' | 'hybrid';
}

export interface TemplateSectionBlueprint {
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary?: { label: string; href: string };
    trackingBarEnabled: boolean;
    backgroundStyle: 'interactive-map' | 'fleet-render' | 'video-loop' | 'minimal-grid' | 'hologram';
  };
  tracking: {
    title: string;
    description: string;
    sampleTrackingNumbers: string[];
    modesSupported: ('sea' | 'air' | 'road' | 'rail' | 'courier')[];
  };
  services: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      description: string;
      icon: string;
      linkText?: string;
    }[];
  };
  globalNetwork?: {
    hubCount: number;
    countriesServed: number;
    featuredRoutes: { origin: string; destination: string; mode: string; transitDays: string }[];
  };
  statistics?: {
    metrics: TemplateMetric[];
  };
  process?: {
    title: string;
    steps: { stepNumber: string; title: string; description: string }[];
  };
  testimonials?: {
    quote: string;
    author: string;
    company: string;
    rating: number;
  }[];
  cta: {
    headline: string;
    subline: string;
    buttonText: string;
    buttonLink: string;
  };
  footer: {
    copyright: string;
    showOffices: boolean;
    complianceBadges: string[];
  };
}

export interface Template {
  // Identity & Routing
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;

  // Taxonomy & Classification
  category: LogisticsCategorySlug;
  categories: LogisticsCategorySlug[];
  industry: string;
  style: TemplateStyle;
  tags: string[];

  // Badges & Metrics
  featured: boolean;
  new: boolean;
  popular: boolean;
  tier: TemplateTier;
  rating: number;
  reviewCount: number;
  downloads: number;

  // Media & Visuals
  previewImage: string;
  thumbnailImage: string;
  galleryImages: string[];
  logoSvg: string;

  // Visual Styling & Tokens
  theme: TemplateThemeSpec;

  // Technical Specifications
  technologies: string[];
  responsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
    minWidthPx: number;
  };
  bundleSizeKb: number;

  // Page Composition & Features
  pages: TemplatePageSpec[];
  features: TemplateFeatureSpec[];
  sections: TemplateSectionBlueprint;

  // URLs & Distribution
  demoUrl: string;
  embedDemoUrl: string;
  downloadUrl: string;
  githubUrl?: string;

  // Versioning & Meta
  version: string;
  lastUpdated: string;
  releaseDate: string;
  author: TemplateAuthor;
  license: 'LogiForge Personal' | 'LogiForge Commercial' | 'LogiForge Extended';
}

export interface TemplateCategory {
  id: string;
  slug: LogisticsCategorySlug;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  accentColor: string;
  templateCount: number;
  popularTags: string[];
}

export interface TemplateCollection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  featuredTemplateSlugs: string[];
  curator: string;
}

export interface SimulatedMilestone {
  id: string;
  status: 'completed' | 'in-transit' | 'pending' | 'customs-hold';
  location: string;
  facility: string;
  timestamp: string;
  description: string;
}

export interface SimulatedShipment {
  trackingNumber: string;
  transportMode: 'ocean' | 'air' | 'road' | 'rail' | 'intermodal';
  origin: {
    city: string;
    country: string;
    code: string;
  };
  destination: {
    city: string;
    country: string;
    code: string;
  };
  eta: string;
  currentStatus: string;
  carrier: string;
  vesselOrFlight?: string;
  containerId?: string;
  milestones: SimulatedMilestone[];
  isSimulatedDemoData: true;
}

export interface CatalogFilterState {
  searchQuery: string;
  category: LogisticsCategorySlug | 'all';
  style: TemplateStyle | 'all';
  tier: TemplateTier | 'all';
  sortBy: 'featured' | 'newest' | 'popular' | 'rating';
  featureFilter?: string[];
}
```

---

## 3. Sample Template JSON Contract (CargoNova Reference)

```json
{
  "id": "lf-tmpl-001",
  "slug": "cargo-nova",
  "name": "CargoNova",
  "tagline": "Global Freight Forwarding & Intermodal Transport",
  "shortDescription": "Editorial-grade, premium website template engineered for multi-modal international freight operators and customs brokers.",
  "category": "freight-forwarding",
  "categories": ["freight-forwarding", "ocean-freight", "air-cargo"],
  "industry": "International Freight & Logistics",
  "style": "editorial",
  "tags": ["Multimodal", "Customs", "Global Routes", "Tracking", "Air & Sea"],
  "featured": true,
  "new": true,
  "popular": true,
  "tier": "premium",
  "rating": 4.95,
  "reviewCount": 38,
  "downloads": 482,
  "previewImage": "/images/templates/cargo-nova/preview.webp",
  "thumbnailImage": "/images/templates/cargo-nova/thumbnail.webp",
  "galleryImages": [
    "/images/templates/cargo-nova/screen-desktop-home.webp",
    "/images/templates/cargo-nova/screen-tracking.webp",
    "/images/templates/cargo-nova/screen-services.webp"
  ],
  "logoSvg": "<svg>...</svg>",
  "theme": {
    "id": "cargonova-theme",
    "name": "CargoNova Editorial Dark",
    "primaryAccent": "#D4AF37",
    "secondaryAccent": "#1B2A4A",
    "surfaceColor": "#0F172A",
    "backgroundColor": "#090D16",
    "textColor": "#F8FAFC",
    "fontHeading": "Cormorant Garamond, serif",
    "fontBody": "Inter, sans-serif",
    "borderRadius": "4px",
    "density": "comfortable",
    "colorMode": "dark"
  },
  "technologies": ["React", "TypeScript", "Tailwind CSS", "Lucide"],
  "responsive": {
    "desktop": true,
    "tablet": true,
    "mobile": true,
    "minWidthPx": 320
  },
  "bundleSizeKb": 42,
  "pages": [
    {
      "id": "pg-home",
      "title": "Home - Global Freight Portal",
      "slug": "home",
      "description": "Hero section with interactive trade route map, live tracking bar, and international transit estimator.",
      "sections": ["hero", "tracking", "services", "globalNetwork", "statistics", "cta", "footer"]
    },
    {
      "id": "pg-services",
      "title": "Services & Trade Corridors",
      "slug": "services",
      "description": "Detailed breakdown of ocean, air, rail freight, customs brokerage, and cold chain handling.",
      "sections": ["services-header", "service-grid", "rate-calculator", "cta", "footer"]
    }
  ],
  "features": [
    {
      "id": "feat-tracking",
      "title": "Interactive Multi-Modal Tracker",
      "description": "Instant simulated status lookup with milestone timeline and airway bill validation.",
      "category": "interactive",
      "badge": "Core Feature"
    },
    {
      "id": "feat-route-map",
      "title": "Global Trade Corridor Visualizer",
      "description": "High-impact interactive map depicting major ocean sea lanes and air corridors.",
      "category": "layout",
      "badge": "Editorial Design"
    }
  ],
  "demoUrl": "/demo/cargo-nova",
  "embedDemoUrl": "/demo/cargo-nova/embed",
  "downloadUrl": "/downloads/templates/cargo-nova-starter.zip",
  "version": "1.0.0",
  "lastUpdated": "2026-09-01",
  "releaseDate": "2026-08-15",
  "author": {
    "name": "LogiForge Studio",
    "role": "Core Architecture Team"
  },
  "license": "LogiForge Commercial"
}
```

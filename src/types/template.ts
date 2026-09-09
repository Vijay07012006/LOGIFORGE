/**
 * LOGIFORGE: Canonical Type Definitions
 * Phase 01: Product Architecture & Technical Blueprint
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
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;

  category: LogisticsCategorySlug;
  categories: LogisticsCategorySlug[];
  industry: string;
  style: TemplateStyle;
  tags: string[];

  featured: boolean;
  new: boolean;
  popular: boolean;
  tier: TemplateTier;
  rating: number;
  reviewCount: number;
  downloads: number;

  previewImage: string;
  thumbnailImage: string;
  galleryImages: string[];
  logoSvg?: string;

  theme: TemplateThemeSpec;

  technologies: string[];
  responsive: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
    minWidthPx: number;
  };
  bundleSizeKb: number;

  pages: TemplatePageSpec[];
  features: TemplateFeatureSpec[];
  sections: TemplateSectionBlueprint;

  demoUrl: string;
  embedDemoUrl: string;
  downloadUrl: string;
  githubUrl?: string;

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
  transportMode: 'ocean' | 'air' | 'road' | 'rail' | 'intermodal' | 'courier';
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

export interface DeviceViewportSpec {
  id: 'desktop' | 'tablet' | 'mobile' | 'fluid';
  label: string;
  width: number | '100%';
  height: number | '100%';
  scale: number;
  icon: string;
}

import type { TemplateCollection } from '@/types/template';

export const TEMPLATE_COLLECTIONS: TemplateCollection[] = [
  {
    id: 'col-enterprise-freight',
    slug: 'enterprise-freight',
    title: 'Enterprise Global Freight & Logistics',
    subtitle: 'Editorial & corporate platforms for multinational trade operations',
    description: 'Curated collection of high-authority web architectures engineered for international freight forwarders, customs brokers, and cross-border logistics alliances.',
    coverImage: '/images/collections/enterprise-freight.webp',
    featuredTemplateSlugs: ['cargo-nova', 'supply-core', 'aero-cargo'],
    curator: 'LogiForge Editorial Board',
  },
  {
    id: 'col-urban-delivery',
    slug: 'urban-delivery',
    title: 'Urban Logistics & Rapid Courier',
    subtitle: 'High-speed bento layouts for on-demand parcel dispatch',
    description: 'Energetic, modern designs featuring instant quote calculators, live driver map visualizers, and mobile-optimized booking funnels for courier brands.',
    coverImage: '/images/collections/urban-delivery.webp',
    featuredTemplateSlugs: ['swift-drop', 'fleet-one'],
    curator: 'Last-Mile Design Guild',
  },
  {
    id: 'col-smart-logistics',
    slug: 'smart-logistics',
    title: 'Smart Logistics & Telematics Intelligence',
    subtitle: 'Next-generation telemetry, AI routing, and futuristic transport',
    description: 'Data-dense, dark-mode architectures tailored for telematics SaaS companies, algorithmic route dispatchers, and IoT container tracking platforms.',
    coverImage: '/images/collections/smart-logistics.webp',
    featuredTemplateSlugs: ['route-iq', 'move-sphere', 'fleet-one'],
    curator: 'LogiForge AI & IoT Guild',
  },
  {
    id: 'col-ocean-ports',
    slug: 'ocean-ports',
    title: 'Maritime Carriers & Deepwater Ports',
    subtitle: 'Vessel schedule matrices and container terminal authorities',
    description: 'Architectural web layouts built specifically for container shipping lines, port terminal operators, rail intermodal hubs, and marine services.',
    coverImage: '/images/collections/ocean-ports.webp',
    featuredTemplateSlugs: ['ship-flow', 'port-axis', 'cargo-nova'],
    curator: 'Maritime Design Committee',
  },
];

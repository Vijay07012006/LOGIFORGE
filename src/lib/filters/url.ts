import type {
  Template,
  CatalogFilterState,
  CatalogSortOption,
  LogisticsCategorySlug,
  TemplateStyle,
  TemplateTier,
} from '@/types/template';
import { normalizeTag } from './index';

/**
 * Strict maximum length for search query URL parameter per Phase 20E specification.
 */
export const MAX_SEARCH_QUERY_LENGTH = 80;

const VALID_CATEGORIES = new Set<LogisticsCategorySlug>([
  'freight-forwarding',
  'fleet-management',
  'ocean-freight',
  'last-mile',
  'port-intermodal',
  'air-cargo',
  'warehousing-fulfillment',
  'supply-chain-enterprise',
  'logistics-tech',
  'shipping-maritime',
]);

const VALID_STYLES = new Set<TemplateStyle>([
  'editorial',
  'industrial',
  'minimalist',
  'modern',
  'enterprise',
  'aviation',
  'operations',
  'data-driven',
  'futuristic',
]);

const VALID_TIERS = new Set<TemplateTier>(['free', 'premium', 'enterprise']);

const VALID_SORTS = new Set<CatalogSortOption>([
  'featured',
  'popular',
  'rating',
  'newest',
  'name-asc',
  'name-desc',
]);

/**
 * Canonical fallback tag list derived from template manifests (50 curated keywords).
 * Kept lightweight to avoid bundling 56KB template manifests into client chunks.
 */
const CANONICAL_TAGS: string[] = [
  'Multimodal',
  'Customs Clearance',
  'Trade Corridors',
  'Milestone Tracking',
  'Air & Ocean',
  'Telematics',
  'GPS Fleet',
  'OBD Diagnostics',
  'Driver Safety',
  'Heavy Haul',
  'Ocean Carrier',
  'Vessel Schedule',
  'Container Line',
  'Minimalist',
  'Port Congestion',
  'Same-Day',
  'Courier App',
  'Parcel Rates',
  'Urban Logistics',
  'Bento Grid',
  'Port Authority',
  'Container Terminal',
  'Berth Schedule',
  'Intermodal Rail',
  'Customs Yard',
  'Air Freight',
  'AWB Tracking',
  'Cargo Airline',
  'Air Charter',
  'Pharma Cold Chain',
  '3PL Fulfillment',
  'Cold Storage',
  'High Density Racks',
  'WMS Portal',
  'Inventory',
  'Supply Chain ESG',
  'Supplier Risk',
  'Carbon Footprint',
  'Procurement',
  'Enterprise B2B',
  'AI Route Optimization',
  'Predictive ETA',
  'Telemetry',
  'Neural Dispatch',
  'Dark Tech',
  'Futuristic',
  'Glassmorphism',
  'Autonomous Cargo',
  'Smart Containers',
  'Next-Gen',
];

/**
 * Converts a tag string into a clean, URL-safe hyphenated slug.
 * Strips non-alphanumeric characters, converts to lowercase, and replaces separators with hyphens.
 * Example: "Cold Storage" -> "cold-storage", "3PL Fulfillment" -> "3pl-fulfillment"
 */
export function tagToSlug(tag: string): string {
  if (!tag || typeof tag !== 'string') return '';
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extracts all unique canonical tags across templates, falling back to CANONICAL_TAGS.
 */
export function getCanonicalTags(templates?: Template[]): string[] {
  if (!templates || templates.length === 0) {
    return CANONICAL_TAGS;
  }
  const tagSet = new Set<string>();
  for (const tmpl of templates) {
    if (tmpl.tags) {
      for (const t of tmpl.tags) {
        tagSet.add(t);
      }
    }
  }
  return Array.from(tagSet);
}

/**
 * Validates and finds a matching canonical tag from templates using normalizeTag().
 * Returns the canonical template tag name (e.g. "Cold Storage") if found, or undefined if invalid.
 */
export function findCanonicalTag(inputTag: string, templates?: Template[]): string | undefined {
  if (!inputTag || typeof inputTag !== 'string') return undefined;
  const normalizedInput = normalizeTag(inputTag);
  if (!normalizedInput) return undefined;

  const allTags = getCanonicalTags(templates);
  return allTags.find((t) => normalizeTag(t) === normalizedInput);
}

/**
 * Safely parses and validates URL parameters into a strongly-typed CatalogFilterState.
 * Never throws on malformed user input; silently falls back to defaults for invalid parameters.
 */
export function parseCatalogUrl(
  input: URLSearchParams | string,
  templates?: Template[]
): CatalogFilterState {
  let params: URLSearchParams;

  if (typeof input === 'string') {
    const qIndex = input.indexOf('?');
    const qs = qIndex !== -1 ? input.slice(qIndex + 1) : input;
    params = new URLSearchParams(qs);
  } else {
    params = input;
  }

  // 1. Search Query: bounded to MAX_SEARCH_QUERY_LENGTH, trimmed
  const rawQ = params.get('q');
  const searchQuery = rawQ ? rawQ.slice(0, MAX_SEARCH_QUERY_LENGTH).trim() : '';

  // 2. Category: validated against VALID_CATEGORIES
  const rawCategory = params.get('category');
  const category: LogisticsCategorySlug | 'all' =
    rawCategory && VALID_CATEGORIES.has(rawCategory as LogisticsCategorySlug)
      ? (rawCategory as LogisticsCategorySlug)
      : 'all';

  // 3. Style: validated against VALID_STYLES
  const rawStyle = params.get('style');
  const style: TemplateStyle | 'all' =
    rawStyle && VALID_STYLES.has(rawStyle as TemplateStyle)
      ? (rawStyle as TemplateStyle)
      : 'all';

  // 4. Tier: validated against VALID_TIERS
  const rawTier = params.get('tier');
  const tier: TemplateTier | 'all' =
    rawTier && VALID_TIERS.has(rawTier as TemplateTier)
      ? (rawTier as TemplateTier)
      : 'all';

  // 5. Tag: validated against canonical template metadata via normalizeTag()
  const rawTag = params.get('tag');
  const canonicalTag = rawTag ? findCanonicalTag(rawTag, templates) : undefined;
  const tag = canonicalTag ? tagToSlug(canonicalTag) : undefined;

  // 6. Sort: validated against VALID_SORTS
  const rawSort = params.get('sort');
  const sortBy: CatalogSortOption =
    rawSort && VALID_SORTS.has(rawSort as CatalogSortOption)
      ? (rawSort as CatalogSortOption)
      : 'featured';

  return {
    searchQuery,
    category,
    style,
    tier,
    tag,
    sortBy,
  };
}

/**
 * Deterministically serializes CatalogFilterState into canonical URLSearchParams.
 * Parameter order MUST ALWAYS be:
 * 1. q
 * 2. category
 * 3. style
 * 4. tier
 * 5. tag
 * 6. sort
 * Default values are strictly omitted.
 */
export function serializeCatalogParams(
  filters: CatalogFilterState,
  options?: { collection?: string }
): URLSearchParams {
  const params = new URLSearchParams();

  // 1. q
  if (filters.searchQuery) {
    const trimmed = filters.searchQuery.slice(0, MAX_SEARCH_QUERY_LENGTH).trim();
    if (trimmed) {
      params.set('q', trimmed);
    }
  }

  // 2. category (default 'all' omitted)
  if (filters.category && filters.category !== 'all') {
    if (VALID_CATEGORIES.has(filters.category as LogisticsCategorySlug)) {
      params.set('category', filters.category);
    }
  }

  // 3. style (default 'all' omitted)
  if (filters.style && filters.style !== 'all') {
    if (VALID_STYLES.has(filters.style as TemplateStyle)) {
      params.set('style', filters.style);
    }
  }

  // 4. tier (default 'all' omitted)
  if (filters.tier && filters.tier !== 'all') {
    if (VALID_TIERS.has(filters.tier as TemplateTier)) {
      params.set('tier', filters.tier);
    }
  }

  // 5. tag (default undefined omitted)
  if (filters.tag && filters.tag.trim() && filters.tag !== 'all') {
    const slug = tagToSlug(filters.tag);
    if (slug) {
      params.set('tag', slug);
    }
  }

  // 6. sort (default 'featured' omitted)
  if (filters.sortBy && filters.sortBy !== 'featured') {
    if (VALID_SORTS.has(filters.sortBy)) {
      params.set('sort', filters.sortBy);
    }
  }

  // Optional collection preservation for legacy deep links if active
  if (options?.collection && options.collection !== 'all') {
    params.set('collection', options.collection);
  }

  return params;
}

/**
 * Serializes CatalogFilterState to a minimal canonical route string (e.g. "/templates?q=air+cargo").
 * If all parameters are default, returns the bare pathname (e.g. "/templates").
 */
export function serializeCatalogUrl(
  filters: CatalogFilterState,
  pathname: string = '/templates',
  options?: { collection?: string }
): string {
  const params = serializeCatalogParams(filters, options);
  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

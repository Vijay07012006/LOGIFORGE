'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type {
  Template,
  CatalogFilterState,
  CatalogSortOption,
  LogisticsCategorySlug,
  TemplateStyle,
  TemplateTier,
} from '@/types/template';
import { LOGISTICS_CATEGORIES } from '@/data/categories';
import { getCollectionBySlug } from '@/lib/collections';
import { filterTemplates, normalizeTag } from '@/lib/filters';
import { TemplateCard } from './TemplateCard';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Tag,
  X,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Layers,
} from 'lucide-react';
import styles from './CatalogBrowser.module.css';

export interface CatalogBrowserProps {
  initialTemplates: Template[];
}

const STYLE_OPTIONS: { value: TemplateStyle | 'all'; label: string }[] = [
  { value: 'all', label: 'All Styles (9)' },
  { value: 'editorial', label: 'Editorial Luxury' },
  { value: 'industrial', label: 'Industrial / Heavy' },
  { value: 'minimalist', label: 'Minimalist Nordic' },
  { value: 'modern', label: 'Modern Bento' },
  { value: 'enterprise', label: 'Enterprise Authority' },
  { value: 'aviation', label: 'Aviation Tech' },
  { value: 'operations', label: 'Operations High-Density' },
  { value: 'data-driven', label: 'Data-Driven AI' },
  { value: 'futuristic', label: 'Futuristic Glass' },
];

const TIER_OPTIONS: { value: TemplateTier | 'all'; label: string }[] = [
  { value: 'all', label: 'All Tiers' },
  { value: 'free', label: 'Free Starters' },
  { value: 'premium', label: 'Premium Flagships' },
  { value: 'enterprise', label: 'Enterprise Suites' },
];

const SORT_OPTIONS: { value: CatalogSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest Release' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
];

export function CatalogBrowser({ initialTemplates }: CatalogBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read initial filter values from URL params
  const initialCategory = (searchParams.get('category') as LogisticsCategorySlug) || 'all';
  const initialStyle = (searchParams.get('style') as TemplateStyle) || 'all';
  const initialTier = (searchParams.get('tier') as TemplateTier) || 'all';
  const initialTag = searchParams.get('tag') || undefined;
  const initialSort = (searchParams.get('sort') as CatalogSortOption) || 'featured';
  const initialSearch = searchParams.get('q') || '';
  const initialCollection = searchParams.get('collection') || 'all';

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [category, setCategory] = useState<LogisticsCategorySlug | 'all'>(initialCategory);
  const [style, setStyle] = useState<TemplateStyle | 'all'>(initialStyle);
  const [tier, setTier] = useState<TemplateTier | 'all'>(initialTier);
  const [tag, setTag] = useState<string | undefined>(initialTag);
  const [sortBy, setSortBy] = useState<CatalogSortOption>(initialSort);
  const [collection, setCollection] = useState<string>(initialCollection);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  // Sync state with URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (category !== 'all') params.set('category', category);
    if (style !== 'all') params.set('style', style);
    if (tier !== 'all') params.set('tier', tier);
    if (tag && tag.trim()) params.set('tag', tag.trim());
    if (sortBy !== 'featured') params.set('sort', sortBy);
    if (collection !== 'all') params.set('collection', collection);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  }, [searchQuery, category, style, tier, tag, sortBy, collection, pathname, router]);

  // Synchronize state when browser navigation or external link changes searchParams
  useEffect(() => {
    const urlCategory = (searchParams.get('category') as LogisticsCategorySlug) || 'all';
    const urlStyle = (searchParams.get('style') as TemplateStyle) || 'all';
    const urlTier = (searchParams.get('tier') as TemplateTier) || 'all';
    const urlTag = searchParams.get('tag') || undefined;
    const urlSort = (searchParams.get('sort') as CatalogSortOption) || 'featured';
    const urlSearch = searchParams.get('q') || '';
    const urlCollection = searchParams.get('collection') || 'all';

    setCategory((prev) => (prev !== urlCategory ? urlCategory : prev));
    setStyle((prev) => (prev !== urlStyle ? urlStyle : prev));
    setTier((prev) => (prev !== urlTier ? urlTier : prev));
    setTag((prev) => (prev !== urlTag ? urlTag : prev));
    setSortBy((prev) => (prev !== urlSort ? urlSort : prev));
    setSearchQuery((prev) => (prev !== urlSearch ? urlSearch : prev));
    setCollection((prev) => (prev !== urlCollection ? urlCollection : prev));
  }, [searchParams]);

  // Derive unique tags and counts from canonical template metadata
  const tagStats = useMemo(() => {
    const counts = new Map<string, number>();
    initialTemplates.forEach((t) => {
      t.tags?.forEach((item) => {
        counts.set(item, (counts.get(item) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [initialTemplates]);

  // Slice visible tags for compact desktop display (default 10)
  const visibleTags = useMemo(() => {
    if (showAllTags) return tagStats;
    const slice = tagStats.slice(0, 10);
    // Ensure active tag is always visible even if not in top 10
    if (tag && !slice.some((item) => normalizeTag(item.name) === normalizeTag(tag))) {
      const activeItem = tagStats.find((item) => normalizeTag(item.name) === normalizeTag(tag));
      if (activeItem) {
        return [...slice, activeItem];
      }
    }
    return slice;
  }, [tagStats, showAllTags, tag]);

  // Find active collection data if present
  const activeCollection = useMemo(() => {
    if (collection === 'all') return null;
    return getCollectionBySlug(collection) || null;
  }, [collection]);

  // Compute filtered templates
  const filteredTemplates = useMemo(() => {
    let base = initialTemplates;

    // Filter by curated collection slugs first if active
    if (activeCollection) {
      base = base.filter((t) => activeCollection.featuredTemplateSlugs.includes(t.slug));
    }

    const filterState: CatalogFilterState = {
      searchQuery,
      category,
      style,
      tier,
      tag,
      sortBy,
    };
    return filterTemplates(base, filterState);
  }, [initialTemplates, activeCollection, searchQuery, category, style, tier, tag, sortBy]);

  // Active filter counters & helpers
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    category !== 'all' ||
    style !== 'all' ||
    tier !== 'all' ||
    Boolean(tag) ||
    sortBy !== 'featured' ||
    collection !== 'all';

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setStyle('all');
    setTier('all');
    setTag(undefined);
    setSortBy('featured');
    setCollection('all');
  };

  const handleTagClick = (selectedTag: string) => {
    setTag((prev) => {
      if (prev && normalizeTag(prev) === normalizeTag(selectedTag)) {
        return undefined;
      }
      return selectedTag;
    });
  };

  const getCategoryName = (slug: string) => {
    const found = LOGISTICS_CATEGORIES.find((c) => c.slug === slug);
    return found ? found.shortName : slug;
  };

  return (
    <div className={styles.browser}>
      {/* Search Bar & Primary Controls */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <label htmlFor="catalog-search" className={styles.srOnly}>
              Search logistics templates
            </label>
            <Search size={18} className={styles.searchIcon} aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, industry, trade route, or keyword..."
              className={styles.searchInput}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={styles.searchClearBtn}
                aria-label="Clear search term"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.controlsRow}>
          {/* Style Selector */}
          <div className={styles.filterControl}>
            <Select
              options={STYLE_OPTIONS}
              value={style}
              onChange={(e) => setStyle(e.target.value as TemplateStyle | 'all')}
              aria-label="Filter by Aesthetic Style"
            />
          </div>

          {/* Tier Selector */}
          <div className={styles.filterControl}>
            <Select
              options={TIER_OPTIONS}
              value={tier}
              onChange={(e) => setTier(e.target.value as TemplateTier | 'all')}
              aria-label="Filter by License Tier"
            />
          </div>

          {/* Sort Selector */}
          <div className={styles.sortControl}>
            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CatalogSortOption)}
              aria-label="Sort Templates"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            className={styles.mobileFilterToggle}
            onClick={() => setShowFiltersMobile((prev) => !prev)}
            aria-expanded={showFiltersMobile}
            aria-label="Toggle mobile filter categories"
          >
            <SlidersHorizontal size={16} />
            <span>Categories</span>
            {category !== 'all' && <span className={styles.filterDot} />}
          </button>
        </div>
      </div>

      {/* Category Tabs Pill Bar (Desktop & Mobile Dropdown) */}
      <div className={`${styles.categoryPillsBar} ${showFiltersMobile ? styles.categoryPillsMobileVisible : ''}`}>
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`${styles.categoryPill} ${category === 'all' ? styles.categoryPillActive : ''}`}
        >
          <span>All Disciplines</span>
          <span className={styles.pillCount}>{initialTemplates.length}</span>
        </button>

        {LOGISTICS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.slug)}
            className={`${styles.categoryPill} ${category === cat.slug ? styles.categoryPillActive : ''}`}
          >
            <span>{cat.shortName}</span>
            <span className={styles.pillCount}>{cat.templateCount}</span>
          </button>
        ))}
      </div>

      {/* Tag Discovery / Tag Filter Cloud */}
      <div className={styles.tagCloudBar}>
        <span className={styles.tagCloudLabel}>Keywords:</span>
        <div className={styles.tagList}>
          {visibleTags.map((item) => {
            const isTagActive = tag ? normalizeTag(tag) === normalizeTag(item.name) : false;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleTagClick(item.name)}
                className={`${styles.tagButton} ${isTagActive ? styles.tagButtonActive : ''}`}
                aria-pressed={isTagActive}
                aria-label={`Filter catalog by tag: ${item.name}`}
              >
                <Tag size={11} className={styles.tagIcon} aria-hidden="true" />
                <span>{item.name}</span>
                <span className={styles.tagCount}>{item.count}</span>
              </button>
            );
          })}

          {tagStats.length > 10 && (
            <button
              type="button"
              onClick={() => setShowAllTags((prev) => !prev)}
              className={styles.tagExpandBtn}
              aria-expanded={showAllTags}
            >
              {showAllTags ? 'Show fewer tags' : `+${tagStats.length - 10} more tags`}
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips & Counter Bar */}
      <div className={styles.statusBar}>
        <div
          className={styles.counterGroup}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className={styles.counterText}>
            Showing <strong>{filteredTemplates.length}</strong> of {initialTemplates.length} templates
          </span>
        </div>

        {hasActiveFilters && (
          <div className={styles.chipsGroup}>
            {activeCollection && (
              <span className={`${styles.filterChip} ${styles.collectionChip}`}>
                <Layers size={12} />
                <span>Collection: {activeCollection.title}</span>
                <button
                  type="button"
                  onClick={() => setCollection('all')}
                  aria-label="Remove collection filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className={styles.filterChip}>
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={`Remove search filter: ${searchQuery}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className={styles.filterChip}>
                Category: {getCategoryName(category)}
                <button
                  type="button"
                  onClick={() => setCategory('all')}
                  aria-label={`Remove category filter: ${getCategoryName(category)}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {style !== 'all' && (
              <span className={styles.filterChip}>
                Style: {style}
                <button
                  type="button"
                  onClick={() => setStyle('all')}
                  aria-label={`Remove style filter: ${style}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {tier !== 'all' && (
              <span className={styles.filterChip}>
                Tier: {tier}
                <button
                  type="button"
                  onClick={() => setTier('all')}
                  aria-label={`Remove tier filter: ${tier}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {tag && (
              <span className={styles.filterChip}>
                Tag: {tag}
                <button
                  type="button"
                  onClick={() => setTag(undefined)}
                  aria-label={`Remove tag filter: ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className={styles.resetBtn}
              aria-label="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset all</span>
            </button>
          </div>
        )}
      </div>

      {/* Template Cards Grid or Empty State */}
      {filteredTemplates.length > 0 ? (
        <div className={styles.templateGrid}>
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onTagClick={handleTagClick}
              activeTag={tag}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Compass size={32} />
          </div>
          <h3 className={styles.emptyTitle}>No matching templates found</h3>
          <p className={styles.emptyDesc}>
            No logistics website templates matched your current combination of search terms and filters.
          </p>
          <div className={styles.emptyActions}>
            <Button variant="primary" size="md" onClick={resetAllFilters}>
              <RotateCcw size={16} />
              <span>Reset All Filters</span>
            </Button>
          </div>
          <div className={styles.emptySuggestions}>
            <span className={styles.suggestionLabel}>Or browse popular disciplines:</span>
            <div className={styles.suggestionPills}>
              {LOGISTICS_CATEGORIES.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    resetAllFilters();
                    setCategory(cat.slug);
                  }}
                  className={styles.suggestionPill}
                >
                  {cat.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

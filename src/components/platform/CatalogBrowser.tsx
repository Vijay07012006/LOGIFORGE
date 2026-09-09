'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type {
  Template,
  CatalogFilterState,
  LogisticsCategorySlug,
  TemplateStyle,
  TemplateTier,
} from '@/types/template';
import { LOGISTICS_CATEGORIES } from '@/data/categories';
import { filterTemplates } from '@/lib/filters';
import { TemplateCard } from './TemplateCard';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  X,
  RotateCcw,
  SlidersHorizontal,
  Compass,
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

const SORT_OPTIONS: { value: CatalogFilterState['sortBy']; label: string }[] = [
  { value: 'featured', label: 'Featured First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Recently Updated' },
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
  const initialSort = (searchParams.get('sort') as CatalogFilterState['sortBy']) || 'featured';
  const initialSearch = searchParams.get('q') || '';

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [category, setCategory] = useState<LogisticsCategorySlug | 'all'>(initialCategory);
  const [style, setStyle] = useState<TemplateStyle | 'all'>(initialStyle);
  const [tier, setTier] = useState<TemplateTier | 'all'>(initialTier);
  const [sortBy, setSortBy] = useState<CatalogFilterState['sortBy']>(initialSort);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Sync state with URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (category !== 'all') params.set('category', category);
    if (style !== 'all') params.set('style', style);
    if (tier !== 'all') params.set('tier', tier);
    if (sortBy !== 'featured') params.set('sort', sortBy);

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(targetUrl, { scroll: false });
    });
  }, [searchQuery, category, style, tier, sortBy, pathname, router]);

  // Compute filtered templates
  const filteredTemplates = useMemo(() => {
    const filterState: CatalogFilterState = {
      searchQuery,
      category,
      style,
      tier,
      sortBy,
    };
    return filterTemplates(initialTemplates, filterState);
  }, [initialTemplates, searchQuery, category, style, tier, sortBy]);

  // Active filter counters & helpers
  const hasActiveFilters =
    searchQuery.trim() !== '' || category !== 'all' || style !== 'all' || tier !== 'all' || sortBy !== 'featured';

  const resetAllFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setStyle('all');
    setTier('all');
    setSortBy('featured');
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
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search by name, industry, trade route, or keyword..."
          />
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
              onChange={(e) => setSortBy(e.target.value as CatalogFilterState['sortBy'])}
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

      {/* Category Tabs Pill Bar (Desktop & Mobile Drawer) */}
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

      {/* Active Filter Chips & Counter Bar */}
      <div className={styles.statusBar}>
        <div className={styles.counterGroup}>
          <span className={styles.counterText}>
            Showing <strong>{filteredTemplates.length}</strong> of {initialTemplates.length} templates
          </span>
        </div>

        {hasActiveFilters && (
          <div className={styles.chipsGroup}>
            {searchQuery.trim() && (
              <span className={styles.filterChip}>
                Search: &ldquo;{searchQuery}&rdquo;
                <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search term">
                  <X size={12} />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className={styles.filterChip}>
                Category: {getCategoryName(category)}
                <button type="button" onClick={() => setCategory('all')} aria-label="Clear category filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {style !== 'all' && (
              <span className={styles.filterChip}>
                Style: {style}
                <button type="button" onClick={() => setStyle('all')} aria-label="Clear style filter">
                  <X size={12} />
                </button>
              </span>
            )}

            {tier !== 'all' && (
              <span className={styles.filterChip}>
                Tier: {tier}
                <button type="button" onClick={() => setTier('all')} aria-label="Clear tier filter">
                  <X size={12} />
                </button>
              </span>
            )}

            <button type="button" onClick={resetAllFilters} className={styles.resetBtn}>
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
            <TemplateCard key={template.id} template={template} />
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
          <Button variant="primary" size="md" onClick={resetAllFilters}>
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
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
import {
  filterTemplates,
  normalizeTag,
  parseCatalogUrl,
  serializeCatalogUrl,
  tagToSlug,
  findCanonicalTag,
} from '@/lib/filters';
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
import { cn } from '@/lib/utils';
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
  const pathname = usePathname() || '/templates';
  const searchParams = useSearchParams();

  // Parse initial filter values from URL params
  const initialFilters = useMemo(() => {
    return parseCatalogUrl(searchParams, initialTemplates);
  }, [searchParams, initialTemplates]);

  const initialCollection = searchParams.get('collection') || 'all';

  // Local state for filters
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters.searchQuery);
  const [category, setCategory] = useState<LogisticsCategorySlug | 'all'>(initialFilters.category);
  const [style, setStyle] = useState<TemplateStyle | 'all'>(initialFilters.style);
  const [tier, setTier] = useState<TemplateTier | 'all'>(initialFilters.tier);
  const [tag, setTag] = useState<string | undefined>(initialFilters.tag);
  const [sortBy, setSortBy] = useState<CatalogSortOption>(initialFilters.sortBy);
  const [collection, setCollection] = useState<string>(initialCollection);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  // Refs for drawer accessibility & focus restoration
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Synchronization refs to prevent popstate loops and track history
  const isPopStateRef = useRef<boolean>(false);
  const hasMountedRef = useRef<boolean>(false);
  const lastSyncedUrlRef = useRef<string>('');
  const searchQueryRef = useRef<string>(searchQuery);
  searchQueryRef.current = searchQuery;

  // Draft filter state for mobile drawer
  const [draftCategory, setDraftCategory] = useState<LogisticsCategorySlug | 'all'>(category);
  const [draftStyle, setDraftStyle] = useState<TemplateStyle | 'all'>(style);
  const [draftTier, setDraftTier] = useState<TemplateTier | 'all'>(tier);
  const [draftTag, setDraftTag] = useState<string | undefined>(tag);
  const [draftSortBy, setDraftSortBy] = useState<CatalogSortOption>(sortBy);

  // Focus trap & Escape listener for mobile drawer
  useEffect(() => {
    if (!isDrawerOpen) return;

    // Focus the close button on mount
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 40);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsDrawerOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  // Auto-close drawer if window is resized to desktop width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDrawerOpen]);

  // Canonical cleanup on initial client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parsed = parseCatalogUrl(window.location.search, initialTemplates);
    const canonicalUrl = serializeCatalogUrl(parsed, pathname, {
      collection: searchParams.get('collection') || undefined,
    });
    const currentUrl = window.location.pathname + window.location.search;

    if (currentUrl !== canonicalUrl) {
      window.history.replaceState(null, '', canonicalUrl);
    }
    lastSyncedUrlRef.current = canonicalUrl;
    hasMountedRef.current = true;
  }, [initialTemplates, pathname, searchParams]);

  // Listen for browser Back/Forward (popstate)
  useEffect(() => {
    function handlePopState() {
      if (typeof window === 'undefined') return;

      isPopStateRef.current = true;
      const newState = parseCatalogUrl(window.location.search, initialTemplates);
      const newCollection = new URLSearchParams(window.location.search).get('collection') || 'all';

      setSearchQuery(newState.searchQuery);
      setCategory(newState.category);
      setStyle(newState.style);
      setTier(newState.tier);
      setTag(newState.tag);
      setSortBy(newState.sortBy);
      setCollection(newCollection);

      // Reconstruct mobile drawer state
      setDraftCategory(newState.category);
      setDraftStyle(newState.style);
      setDraftTier(newState.tier);
      setDraftTag(newState.tag);
      setDraftSortBy(newState.sortBy);

      lastSyncedUrlRef.current = window.location.pathname + window.location.search;

      // Reset popstate flag after render cycle completes
      setTimeout(() => {
        isPopStateRef.current = false;
      }, 50);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialTemplates]);

  // Synchronize discrete non-search filter changes immediately via replaceState
  useEffect(() => {
    if (!hasMountedRef.current || isPopStateRef.current) return;

    const targetUrl = serializeCatalogUrl(
      {
        searchQuery: searchQueryRef.current,
        category,
        style,
        tier,
        tag,
        sortBy,
      },
      pathname,
      { collection }
    );

    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== targetUrl && lastSyncedUrlRef.current !== targetUrl) {
      window.history.replaceState(null, '', targetUrl);
      lastSyncedUrlRef.current = targetUrl;
    }
  }, [category, style, tier, tag, sortBy, collection, pathname]);

  // Synchronize search query URL changes debounced by 150ms
  useEffect(() => {
    if (!hasMountedRef.current || isPopStateRef.current) return;

    const timer = setTimeout(() => {
      if (typeof window === 'undefined' || isPopStateRef.current) return;

      const targetUrl = serializeCatalogUrl(
        {
          searchQuery,
          category,
          style,
          tier,
          tag,
          sortBy,
        },
        pathname,
        { collection }
      );

      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== targetUrl && lastSyncedUrlRef.current !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
        lastSyncedUrlRef.current = targetUrl;
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, category, style, tier, tag, sortBy, collection, pathname]);

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

  // Compute filtered templates for main view
  const filteredTemplates = useMemo(() => {
    let base = initialTemplates;

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

  // Compute draft filtered templates count for mobile drawer CTA
  const draftFilteredCount = useMemo(() => {
    let base = initialTemplates;

    if (activeCollection) {
      base = base.filter((t) => activeCollection.featuredTemplateSlugs.includes(t.slug));
    }

    const draftState: CatalogFilterState = {
      searchQuery,
      category: draftCategory,
      style: draftStyle,
      tier: draftTier,
      tag: draftTag,
      sortBy: draftSortBy,
    };
    return filterTemplates(base, draftState).length;
  }, [initialTemplates, activeCollection, searchQuery, draftCategory, draftStyle, draftTier, draftTag, draftSortBy]);

  // Count active non-default filtering dimensions
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== 'all') count++;
    if (style !== 'all') count++;
    if (tier !== 'all') count++;
    if (tag) count++;
    if (searchQuery.trim() !== '') count++;
    if (sortBy !== 'featured') count++;
    return count;
  }, [category, style, tier, tag, searchQuery, sortBy]);

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

    setDraftCategory('all');
    setDraftStyle('all');
    setDraftTier('all');
    setDraftTag(undefined);
    setDraftSortBy('featured');

    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', pathname);
      lastSyncedUrlRef.current = pathname;
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      const targetUrl = serializeCatalogUrl(
        {
          searchQuery: '',
          category,
          style,
          tier,
          tag,
          sortBy,
        },
        pathname,
        { collection }
      );
      const currentUrl = window.location.pathname + window.location.search;
      if (currentUrl !== targetUrl) {
        window.history.replaceState(null, '', targetUrl);
        lastSyncedUrlRef.current = targetUrl;
      }
    }
  };

  const handleOpenDrawer = () => {
    setDraftCategory(category);
    setDraftStyle(style);
    setDraftTier(tier);
    setDraftTag(tag);
    setDraftSortBy(sortBy);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    triggerRef.current?.focus();
  };

  const handleApplyDrawerFilters = () => {
    setCategory(draftCategory);
    setStyle(draftStyle);
    setTier(draftTier);
    setTag(draftTag);
    setSortBy(draftSortBy);
    setIsDrawerOpen(false);
    triggerRef.current?.focus();
  };

  const handleDrawerResetAll = () => {
    setDraftCategory('all');
    setDraftStyle('all');
    setDraftTier('all');
    setDraftTag(undefined);
    setDraftSortBy('featured');
    resetAllFilters();
  };

  const handleTagClick = (selectedTag: string) => {
    const slug = tagToSlug(selectedTag);
    setTag((prev) => {
      if (prev && normalizeTag(prev) === normalizeTag(selectedTag)) {
        return undefined;
      }
      return slug;
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
                onClick={handleClearSearch}
                className={styles.searchClearBtn}
                aria-label="Clear search term"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className={styles.controlsRow}>
          {/* Desktop Style Selector */}
          <div className={styles.filterControl}>
            <Select
              options={STYLE_OPTIONS}
              value={style}
              onChange={(e) => setStyle(e.target.value as TemplateStyle | 'all')}
              aria-label="Filter by Aesthetic Style"
            />
          </div>

          {/* Desktop Tier Selector */}
          <div className={styles.filterControl}>
            <Select
              options={TIER_OPTIONS}
              value={tier}
              onChange={(e) => setTier(e.target.value as TemplateTier | 'all')}
              aria-label="Filter by License Tier"
            />
          </div>

          {/* Desktop Sort Selector */}
          <div className={styles.sortControl}>
            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CatalogSortOption)}
              aria-label="Sort Templates"
            />
          </div>

          {/* Accessible Mobile Filter & Sort Drawer Trigger */}
          <button
            ref={triggerRef}
            type="button"
            className={styles.mobileFilterTrigger}
            onClick={handleOpenDrawer}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-filter-drawer"
            aria-label={
              activeFilterCount > 0
                ? `Filter and sort templates, ${activeFilterCount} active filter${activeFilterCount === 1 ? '' : 's'}`
                : 'Filter and sort templates'
            }
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            <span>Filter &amp; Sort</span>
            {activeFilterCount > 0 && (
              <span className={styles.triggerBadge} aria-hidden="true">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Category Tabs Pill Bar (Desktop & Horizontally Scrollable Mobile) */}
      <div className={styles.categoryPillsBar}>
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

      {/* Tag Discovery / Tag Filter Cloud (Desktop Only) */}
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
                  onClick={handleClearSearch}
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
                Tag: {findCanonicalTag(tag, initialTemplates) || tag}
                <button
                  type="button"
                  onClick={() => setTag(undefined)}
                  aria-label={`Remove tag filter: ${findCanonicalTag(tag, initialTemplates) || tag}`}
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

      {/* Accessible Mobile Filter Drawer */}
      {isDrawerOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={handleCloseDrawer}
          role="presentation"
        >
          <div
            id="mobile-filter-drawer"
            ref={drawerRef}
            className={styles.drawerContainer}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort templates"
          >
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerTitleGroup}>
                <SlidersHorizontal size={18} className={styles.drawerTitleIcon} aria-hidden="true" />
                <h2 className={styles.drawerTitle}>Filter &amp; Sort</h2>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleCloseDrawer}
                className={styles.drawerCloseBtn}
                aria-label="Close filters"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div className={styles.drawerBody}>
              {/* Sort By Section */}
              <div className={styles.drawerSection}>
                <label htmlFor="drawer-sort-select" className={styles.drawerSectionLabel}>
                  Sort By
                </label>
                <div className={styles.drawerSelectWrapper}>
                  <Select
                    id="drawer-sort-select"
                    options={SORT_OPTIONS}
                    value={draftSortBy}
                    onChange={(e) => setDraftSortBy(e.target.value as CatalogSortOption)}
                    aria-label="Sort Templates"
                  />
                </div>
              </div>

              {/* Logistics Discipline / Category Section */}
              <div className={styles.drawerSection}>
                <span className={styles.drawerSectionLabel}>Logistics Discipline</span>
                <div className={styles.drawerCategoryGrid}>
                  <button
                    type="button"
                    onClick={() => setDraftCategory('all')}
                    className={cn(
                      styles.drawerCategoryBtn,
                      draftCategory === 'all' && styles.drawerCategoryBtnActive
                    )}
                    aria-pressed={draftCategory === 'all'}
                  >
                    <span>All Disciplines</span>
                    <span className={styles.drawerCountBadge}>{initialTemplates.length}</span>
                  </button>
                  {LOGISTICS_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDraftCategory(cat.slug)}
                      className={cn(
                        styles.drawerCategoryBtn,
                        draftCategory === cat.slug && styles.drawerCategoryBtnActive
                      )}
                      aria-pressed={draftCategory === cat.slug}
                    >
                      <span>{cat.shortName}</span>
                      <span className={styles.drawerCountBadge}>{cat.templateCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aesthetic Style Section */}
              <div className={styles.drawerSection}>
                <label htmlFor="drawer-style-select" className={styles.drawerSectionLabel}>
                  Aesthetic Style
                </label>
                <div className={styles.drawerSelectWrapper}>
                  <Select
                    id="drawer-style-select"
                    options={STYLE_OPTIONS}
                    value={draftStyle}
                    onChange={(e) => setDraftStyle(e.target.value as TemplateStyle | 'all')}
                    aria-label="Filter by Aesthetic Style"
                  />
                </div>
              </div>

              {/* Commercial Tier Section */}
              <div className={styles.drawerSection}>
                <label htmlFor="drawer-tier-select" className={styles.drawerSectionLabel}>
                  License Tier
                </label>
                <div className={styles.drawerSelectWrapper}>
                  <Select
                    id="drawer-tier-select"
                    options={TIER_OPTIONS}
                    value={draftTier}
                    onChange={(e) => setDraftTier(e.target.value as TemplateTier | 'all')}
                    aria-label="Filter by License Tier"
                  />
                </div>
              </div>

              {/* Keywords & Tags Section */}
              <div className={styles.drawerSection}>
                <div className={styles.drawerTagHeader}>
                  <span className={styles.drawerSectionLabel}>Keywords &amp; Capabilities</span>
                  {draftTag && (
                    <button
                      type="button"
                      onClick={() => setDraftTag(undefined)}
                      className={styles.drawerTagClearBtn}
                      aria-label="Clear selected keyword filter"
                    >
                      Clear Tag
                    </button>
                  )}
                </div>
                <div className={styles.drawerTagCloud}>
                  {tagStats.map((item) => {
                    const isTagActive = draftTag ? normalizeTag(draftTag) === normalizeTag(item.name) : false;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          const slug = tagToSlug(item.name);
                          setDraftTag((prev) => {
                            if (prev && normalizeTag(prev) === normalizeTag(item.name)) {
                              return undefined;
                            }
                            return slug;
                          });
                        }}
                        className={cn(
                          styles.drawerTagBtn,
                          isTagActive && styles.drawerTagBtnActive
                        )}
                        aria-pressed={isTagActive}
                        aria-label={`Filter by keyword: ${item.name}`}
                      >
                        <Tag size={11} className={styles.drawerTagIcon} aria-hidden="true" />
                        <span>{item.name}</span>
                        <span className={styles.drawerTagCount}>{item.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fixed Drawer Footer */}
            <div className={styles.drawerFooter}>
              <button
                type="button"
                onClick={handleDrawerResetAll}
                className={styles.drawerResetBtn}
                aria-label="Reset all filters"
              >
                <RotateCcw size={14} aria-hidden="true" />
                <span>Reset All</span>
              </button>

              <Button
                variant="primary"
                size="md"
                onClick={handleApplyDrawerFilters}
                className={styles.drawerApplyBtn}
              >
                <span>Apply Filters (Showing {draftFilteredCount})</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

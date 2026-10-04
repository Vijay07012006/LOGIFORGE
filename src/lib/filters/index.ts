import type { Template, CatalogFilterState, CatalogSortOption } from '@/types/template';

/**
 * Safely normalizes tag strings for comparison.
 * Strips non-alphanumeric characters and converts to lowercase.
 * Example: "Cold Chain" -> "coldchain", "cold-chain" -> "coldchain"
 */
export function normalizeTag(tag: string): string {
  if (!tag || typeof tag !== 'string') return '';
  return tag.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Tokenizes a search query into safe, lowercase, non-empty tokens.
 * Limits query length to prevent excessive parsing overhead.
 * Splits on whitespace, commas, slashes, and plus signs.
 */
export function tokenizeQuery(query: string): string[] {
  if (!query || typeof query !== 'string') return [];
  const bounded = query.slice(0, 100).toLowerCase().trim();
  if (!bounded) return [];
  return bounded
    .split(/[\s,+/]+/)
    .map((token) => token.trim().replace(/^['"]+|['"]+$/g, ''))
    .filter((token) => token.length > 0);
}

/**
 * Calculates a deterministic relevance score for a template matching a single search token.
 * Returns 0 if the token does not match any searchable field.
 */
function scoreTokenMatch(token: string, template: Template): number {
  let score = 0;

  const nameLower = template.name.toLowerCase();
  const slugLower = template.slug.toLowerCase();

  // 1. High Priority (Weight 10): Name or Slug
  if (nameLower.includes(token) || slugLower.includes(token)) {
    score = Math.max(score, 10);
    if (nameLower === token || slugLower === token) {
      score += 5; // Exact match bonus
    }
  }

  // 2. Medium-High Priority (Weight 8): Category, Categories, Tags
  const categoryLower = template.category.toLowerCase();
  const normalizedToken = normalizeTag(token);

  if (categoryLower.includes(token)) {
    score = Math.max(score, 8);
  } else if (template.categories && template.categories.some((c) => c.toLowerCase().includes(token))) {
    score = Math.max(score, 8);
  } else if (
    template.tags &&
    template.tags.some((t) => {
      const tLower = t.toLowerCase();
      return tLower.includes(token) || (normalizedToken && normalizeTag(t).includes(normalizedToken));
    })
  ) {
    score = Math.max(score, 8);
  }

  // 3. Medium Priority (Weight 6): Industry, Tagline
  const industryLower = template.industry.toLowerCase();
  const taglineLower = template.tagline.toLowerCase();
  if (industryLower.includes(token) || taglineLower.includes(token)) {
    score = Math.max(score, 6);
  }

  // 4. Lower Priority (Weight 4): Features, Technologies
  if (
    template.technologies &&
    template.technologies.some((tech) => tech.toLowerCase().includes(token))
  ) {
    score = Math.max(score, 4);
  } else if (
    template.features &&
    template.features.some(
      (f) => f.title.toLowerCase().includes(token) || f.description.toLowerCase().includes(token)
    )
  ) {
    score = Math.max(score, 4);
  }

  // 5. Lowest Priority (Weight 2): Descriptions
  const shortDescLower = template.shortDescription.toLowerCase();
  const descLower = template.description ? template.description.toLowerCase() : '';
  if (shortDescLower.includes(token) || descLower.includes(token)) {
    score = Math.max(score, 2);
  }

  return score;
}

/**
 * Evaluates whether all tokens match a template (AND semantics).
 * Returns the cumulative score if all tokens match, or 0 if any token fails.
 */
function evaluateTemplateSearch(tokens: string[], template: Template): { matches: boolean; score: number } {
  if (tokens.length === 0) return { matches: true, score: 0 };

  let totalScore = 0;
  for (const token of tokens) {
    const tokenScore = scoreTokenMatch(token, template);
    if (tokenScore === 0) {
      // AND semantics: if any token fails to match, the template is excluded
      return { matches: false, score: 0 };
    }
    totalScore += tokenScore;
  }

  return { matches: true, score: totalScore };
}

/**
 * Filter and sort templates according to CatalogFilterState.
 */
export function filterTemplates(templates: Template[], filters: CatalogFilterState): Template[] {
  let result = [...templates];
  const searchScores = new Map<string, number>();

  // 1. Tokenized Search with AND semantics across all tokens
  const tokens = tokenizeQuery(filters.searchQuery);
  if (tokens.length > 0) {
    result = result.filter((tmpl) => {
      const evaluation = evaluateTemplateSearch(tokens, tmpl);
      if (evaluation.matches) {
        searchScores.set(tmpl.id, evaluation.score);
        return true;
      }
      return false;
    });
  }

  // 2. Category Filter
  if (filters.category && filters.category !== 'all') {
    const selectedCategory = filters.category;
    result = result.filter(
      (tmpl) => tmpl.category === selectedCategory || tmpl.categories?.includes(selectedCategory)
    );
  }

  // 3. Explicit Tag Filter
  if (filters.tag && filters.tag.trim() && filters.tag !== 'all') {
    const targetTag = normalizeTag(filters.tag);
    if (targetTag) {
      result = result.filter((tmpl) =>
        tmpl.tags && tmpl.tags.some((t) => normalizeTag(t) === targetTag)
      );
    }
  }

  // 4. Aesthetic Style Filter
  if (filters.style && filters.style !== 'all') {
    result = result.filter((tmpl) => tmpl.style === filters.style);
  }

  // 5. Commercial Tier Filter
  if (filters.tier && filters.tier !== 'all') {
    result = result.filter((tmpl) => tmpl.tier === filters.tier);
  }

  // 6. Feature Badges Filter (if provided)
  if (filters.featureFilter && filters.featureFilter.length > 0) {
    result = result.filter((tmpl) =>
      filters.featureFilter?.every((feat) =>
        tmpl.features &&
        tmpl.features.some((f) => f.id === feat || f.title.toLowerCase().includes(feat.toLowerCase()))
      )
    );
  }

  // 7. Sorting
  return sortTemplates(result, filters.sortBy, searchScores);
}

/**
 * Deterministic sorting for templates supporting all CatalogSortOption variants.
 */
export function sortTemplates(
  templates: Template[],
  sortBy: CatalogSortOption = 'featured',
  searchScores?: Map<string, number>
): Template[] {
  const sorted = [...templates];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    case 'popular':
      return sorted.sort(
        (a, b) => b.downloads - a.downloads || a.name.localeCompare(b.name)
      );

    case 'rating':
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.downloads - a.downloads || a.name.localeCompare(b.name)
      );

    case 'newest':
      return sorted.sort((a, b) => {
        const timeDiff = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        return timeDiff !== 0 ? timeDiff : a.name.localeCompare(b.name);
      });

    case 'featured':
    default:
      // If there are search relevance scores available and this is the default sort, prioritize relevance
      if (searchScores && searchScores.size > 0) {
        return sorted.sort((a, b) => {
          const scoreA = searchScores.get(a.id) || 0;
          const scoreB = searchScores.get(b.id) || 0;
          if (scoreB !== scoreA) {
            return scoreB - scoreA;
          }
          const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
          if (featuredDiff !== 0) return featuredDiff;
          const downloadDiff = b.downloads - a.downloads;
          return downloadDiff !== 0 ? downloadDiff : a.name.localeCompare(b.name);
        });
      }

      return sorted.sort((a, b) => {
        const featuredDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        if (featuredDiff !== 0) return featuredDiff;
        const downloadDiff = b.downloads - a.downloads;
        return downloadDiff !== 0 ? downloadDiff : a.name.localeCompare(b.name);
      });
  }
}

export * from './url';

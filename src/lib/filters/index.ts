import type { Template, CatalogFilterState } from '@/types/template';

export function filterTemplates(templates: Template[], filters: CatalogFilterState): Template[] {
  let result = [...templates];

  // 1. Text Search across name, tagline, description, tags, and industry
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter((tmpl) => {
      const matchName = tmpl.name.toLowerCase().includes(query);
      const matchTagline = tmpl.tagline.toLowerCase().includes(query);
      const matchDesc = tmpl.shortDescription.toLowerCase().includes(query);
      const matchIndustry = tmpl.industry.toLowerCase().includes(query);
      const matchTags = tmpl.tags.some((tag) => tag.toLowerCase().includes(query));
      const matchCategory = tmpl.category.toLowerCase().includes(query);

      return matchName || matchTagline || matchDesc || matchIndustry || matchTags || matchCategory;
    });
  }

  // 2. Category Filter
  if (filters.category !== 'all') {
    const selectedCategory = filters.category;
    result = result.filter(
      (tmpl) => tmpl.category === selectedCategory || tmpl.categories.includes(selectedCategory)
    );
  }

  // 3. Aesthetic Style Filter
  if (filters.style !== 'all') {
    result = result.filter((tmpl) => tmpl.style === filters.style);
  }

  // 4. Commercial Tier Filter
  if (filters.tier !== 'all') {
    result = result.filter((tmpl) => tmpl.tier === filters.tier);
  }

  // 5. Feature Badges Filter (if provided)
  if (filters.featureFilter && filters.featureFilter.length > 0) {
    result = result.filter((tmpl) =>
      filters.featureFilter?.every((feat) =>
        tmpl.features.some((f) => f.id === feat || f.title.toLowerCase().includes(feat.toLowerCase()))
      )
    );
  }

  // 6. Sorting
  return sortTemplates(result, filters.sortBy);
}

export function sortTemplates(templates: Template[], sortBy: CatalogFilterState['sortBy']): Template[] {
  const sorted = [...templates];

  switch (sortBy) {
    case 'popular':
      return sorted.sort((a, b) => b.downloads - a.downloads);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    case 'featured':
    default:
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

import { TEMPLATE_MANIFESTS } from '@/data/templates';
import type { Template, LogisticsCategorySlug } from '@/types/template';

export function getAllTemplates(): Template[] {
  return TEMPLATE_MANIFESTS;
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return TEMPLATE_MANIFESTS.find((tmpl) => tmpl.slug === slug);
}

export function getFeaturedTemplates(): Template[] {
  return TEMPLATE_MANIFESTS.filter((tmpl) => tmpl.featured);
}

export function getTemplatesByCategory(categorySlug: LogisticsCategorySlug | string): Template[] {
  return TEMPLATE_MANIFESTS.filter(
    (tmpl) => tmpl.category === categorySlug || tmpl.categories.includes(categorySlug as LogisticsCategorySlug)
  );
}

export function getPopularTemplates(limit = 4): Template[] {
  return [...TEMPLATE_MANIFESTS]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

export function getRelatedTemplates(currentSlug: string, limit = 3): Template[] {
  const current = getTemplateBySlug(currentSlug);
  if (!current) return [];

  return TEMPLATE_MANIFESTS.filter((tmpl) => tmpl.slug !== currentSlug)
    .filter(
      (tmpl) =>
        tmpl.category === current.category ||
        tmpl.style === current.style ||
        tmpl.categories.some((c) => current.categories.includes(c))
    )
    .slice(0, limit);
}

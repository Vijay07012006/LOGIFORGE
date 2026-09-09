import { LOGISTICS_CATEGORIES } from '@/data/categories';
import type { TemplateCategory, LogisticsCategorySlug } from '@/types/template';

export function getAllCategories(): TemplateCategory[] {
  return LOGISTICS_CATEGORIES;
}

export function getCategoryBySlug(slug: LogisticsCategorySlug | string): TemplateCategory | undefined {
  return LOGISTICS_CATEGORIES.find((cat) => cat.slug === slug);
}

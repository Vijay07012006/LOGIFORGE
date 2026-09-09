import { TEMPLATE_COLLECTIONS } from '@/data/collections';
import type { TemplateCollection } from '@/types/template';

export function getAllCollections(): TemplateCollection[] {
  return TEMPLATE_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): TemplateCollection | undefined {
  return TEMPLATE_COLLECTIONS.find((col) => col.slug === slug);
}

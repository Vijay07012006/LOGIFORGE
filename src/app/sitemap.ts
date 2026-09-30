import type { MetadataRoute } from 'next';
import { getAllTemplates } from '@/lib/templates';

const BASE_URL = 'https://logiforge.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const templates = getAllTemplates();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/templates`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date('2026-09-29'),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const templateRoutes: MetadataRoute.Sitemap = templates.flatMap((template) => [
    {
      url: `${BASE_URL}/templates/${template.slug}`,
      lastModified: new Date(template.lastUpdated || '2026-09-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/demo/${template.slug}`,
      lastModified: new Date(template.lastUpdated || '2026-09-01'),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
  ]);

  return [...staticRoutes, ...templateRoutes];
}

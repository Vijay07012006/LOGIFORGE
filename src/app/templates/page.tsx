import React, { Suspense } from 'react';
import { getAllTemplates } from '@/lib/templates';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CatalogBrowser } from '@/components/platform/CatalogBrowser';
import styles from './templates.module.css';

export const metadata = {
  title: 'Logistics Website Templates Catalog',
  description:
    'Discover and filter 10 specialized logistics website templates. Browse by category, style, license tier, or keywords with live device sandbox previews.',
};

function CatalogLoadingFallback() {
  return (
    <div className={styles.loadingSkeleton}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonGrid}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className={styles.skeletonCard} />
        ))}
      </div>
    </div>
  );
}

export default function TemplatesCatalogPage() {
  const templates = getAllTemplates();

  return (
    <div className={styles.page}>
      <Container size="lg">
        {/* Catalog Header */}
        <div className={styles.header}>
          <div className={styles.badgeWrapper}>
            <Badge variant="primary" size="sm">
              DISCOVERY CATALOG • {templates.length} SPECIALIZED ARCHITECTURES
            </Badge>
          </div>
          <h1 className={styles.title}>Logistics Website Template Catalog</h1>
          <p className={styles.subtitle}>
            Explore our complete directory of production-grade logistics websites. Every template is engineered for a specific industry sub-niche with dedicated design tokens, live responsive device sandboxes, and modular components.
          </p>
        </div>

        {/* Interactive Catalog Browser inside Suspense for URL Query Sync */}
        <Suspense fallback={<CatalogLoadingFallback />}>
          <CatalogBrowser initialTemplates={templates} />
        </Suspense>
      </Container>
    </div>
  );
}

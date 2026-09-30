import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTemplates } from '@/lib/templates';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CatalogBrowser } from '@/components/platform/CatalogBrowser';
import { Scale } from 'lucide-react';
import { SITE_URL } from '@/lib/utils';
import styles from './templates.module.css';

export const metadata: Metadata = {
  title: 'Logistics Website Templates Catalog',
  description:
    'Discover and filter 10 specialized logistics website templates. Browse by category, style, license tier, or keywords with live device sandbox previews.',
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Logistics Website Templates Catalog | LOGIFORGE',
    description:
      'Discover and filter 10 specialized logistics website templates across freight forwarding, telematics, maritime, air cargo, 3PL, and last-mile delivery.',
    url: `${SITE_URL}/templates`,
    type: 'website',
    images: [
      {
        url: '/images/templates/cargo-nova/preview.webp',
        width: 1200,
        height: 630,
        alt: 'LOGIFORGE Template Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logistics Website Templates Catalog | LOGIFORGE',
    description:
      'Discover and filter 10 specialized logistics website templates with live device sandbox previews.',
    images: ['/images/templates/cargo-nova/preview.webp'],
  },
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

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Logistics Website Templates Catalog',
    description:
      'Complete directory of 10 production-grade logistics website templates engineered by LOGIFORGE.',
    url: `${SITE_URL}/templates`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: templates.length,
      itemListElement: templates.map((t, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: t.name,
        url: `${SITE_URL}/templates/${t.slug}`,
      })),
    },
  };

  return (
    <div className={styles.page}>
      <script type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>
      <Container size="lg">
        {/* Catalog Header */}
        <div className={styles.header}>
          <div className={styles.badgeWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Badge variant="primary" size="sm">
              DISCOVERY CATALOG • {templates.length} SPECIALIZED ARCHITECTURES
            </Badge>
            <Link
              href="/templates/compare"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--lf-accent-amber)',
                textDecoration: 'none',
                padding: '0.35rem 0.85rem',
                background: 'var(--lf-bg-surface)',
                border: '1px solid var(--lf-border-subtle)',
                borderRadius: 'var(--lf-radius-sm)',
                transition: 'all 0.15s ease',
              }}
            >
              <Scale size={14} />
              <span>Compare Templates Matrix</span>
            </Link>
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

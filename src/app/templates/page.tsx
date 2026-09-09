import React from 'react';
import Link from 'next/link';
import { getAllTemplates } from '@/lib/templates';
import { getAllCategories } from '@/lib/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, Filter } from 'lucide-react';
import styles from './templates.module.css';

export const metadata = {
  title: 'Logistics Website Templates Catalog',
  description: 'Explore the complete directory of 10 flagship logistics website templates engineered for freight forwarders, fleet operators, ports, and air cargo carriers.',
};

export default function TemplatesCatalogPage() {
  const templates = getAllTemplates();
  const categories = getAllCategories();

  return (
    <div className={styles.page}>
      <div className="lf-container">
        {/* Catalog Header */}
        <div className={styles.header}>
          <Badge variant="primary" size="sm">
            CATALOG DIRECTORY • {templates.length} TEMPLATES
          </Badge>
          <h1 className={styles.title}>Logistics Website Template Catalog</h1>
          <p className={styles.subtitle}>
            Explore our curated directory of specialized web platforms. Each template features independent design tokens, interactive logistics widgets, and production-ready source code.
          </p>
        </div>

        {/* Categories Bar Foundation */}
        <div className={styles.categoryPills}>
          <Link href="/templates" className={styles.pillActive}>
            All Categories ({templates.length})
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/templates?category=${cat.slug}`} className={styles.pill}>
              {cat.shortName}
            </Link>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className={styles.grid}>
          {templates.map((template) => (
            <article key={template.id} className={styles.card}>
              <div className={styles.cardHead}>
                <div className={styles.badges}>
                  <Badge variant="primary" size="sm">
                    {template.category}
                  </Badge>
                  <Badge variant="outline" size="sm">
                    {template.style}
                  </Badge>
                  {template.tier === 'premium' && (
                    <Badge variant="accent" size="sm">
                      <Sparkles size={10} />
                      <span>Premium</span>
                    </Badge>
                  )}
                </div>
                <span className={styles.downloads}>{template.downloads} downloads</span>
              </div>

              <h2 className={styles.cardTitle}>{template.name}</h2>
              <p className={styles.cardTagline}>{template.tagline}</p>
              <p className={styles.cardDesc}>{template.shortDescription}</p>

              <div className={styles.tags}>
                {template.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <Link href={`/templates/${template.slug}`} className={styles.actionBtn}>
                  <Button variant="outline" size="sm">
                    Specifications
                  </Button>
                </Link>
                <Link href={`/demo/${template.slug}`} className={styles.actionBtn}>
                  <Button variant="primary" size="sm">
                    <Play size={14} />
                    <span>Live Demo</span>
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Phase 03 Filter Notice */}
        <div className={styles.filterNotice}>
          <Filter size={16} />
          <span>Faceted client-side search, multi-attribute filter drawers, and live URL sync will be fully wired in Phase 03.</span>
        </div>
      </div>
    </div>
  );
}

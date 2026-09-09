import React from 'react';
import Link from 'next/link';
import { getAllTemplates } from '@/lib/templates';
import { getAllCategories } from '@/lib/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Compass, Layers, ShieldCheck, Play } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const templates = getAllTemplates();
  const categories = getAllCategories();
  const featured = templates.filter((t) => t.featured).slice(0, 4);

  return (
    <div className={styles.page}>
      {/* Foundation Hero Section */}
      <section className={styles.hero}>
        <div className="lf-container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadgeWrapper}>
              <Badge variant="primary" size="md">
                LOGISTICS TEMPLATE STUDIO • PHASE 02 FOUNDATION
              </Badge>
            </div>
            <h1 className={styles.heroTitle}>
              Architectural Standard for Logistics Web Platforms
            </h1>
            <p className={styles.heroSubtitle}>
              LOGIFORGE is a specialized digital ecosystem combining a curated template marketplace, interactive live demo sandbox, simulated consignment tracking, and developer starter kits for global supply chain and transport brands.
            </p>

            <div className={styles.heroActions}>
              <Link href="/templates">
                <Button variant="primary" size="lg">
                  <Compass size={18} />
                  <span>Explore 10 Flagship Templates</span>
                </Button>
              </Link>
              <Link href="/demo/cargo-nova">
                <Button variant="secondary" size="lg">
                  <Play size={18} />
                  <span>Launch Live Demo Studio</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Templates Preview Foundation */}
      <section className={styles.section}>
        <div className="lf-container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionPretitle}>FLAGSHIP CONCEPTS</span>
              <h2 className={styles.sectionTitle}>Engineered for Specific Logistics Niches</h2>
            </div>
            <Link href="/templates" className={styles.viewAllLink}>
              View All 10 Templates <ArrowRight size={16} />
            </Link>
          </div>

          <div className={styles.templateGrid}>
            {featured.map((template) => (
              <div key={template.id} className={styles.templateCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardBadges}>
                    <Badge variant="primary" size="sm">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      {template.style}
                    </Badge>
                  </div>
                  <span className={styles.version}>{template.version}</span>
                </div>

                <h3 className={styles.cardTitle}>{template.name}</h3>
                <p className={styles.cardDesc}>{template.shortDescription}</p>

                <div className={styles.cardFooter}>
                  <Link href={`/templates/${template.slug}`}>
                    <Button variant="ghost" size="sm">
                      Inspect Specs
                    </Button>
                  </Link>
                  <Link href={`/demo/${template.slug}`}>
                    <Button variant="secondary" size="sm">
                      <Play size={14} />
                      <span>Live Demo</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logistics Taxonomy Foundation (11 Categories) */}
      <section className={styles.categorySection}>
        <div className="lf-container">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionPretitle}>TAXONOMY</span>
              <h2 className={styles.sectionTitle}>11 Logistics Industry Disciplines</h2>
            </div>
          </div>

          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/templates?category=${cat.slug}`}
                className={styles.categoryCard}
              >
                <div className={styles.catTop}>
                  <span className={styles.catName}>{cat.name}</span>
                  <Badge variant="secondary" size="sm">
                    {cat.templateCount} {cat.templateCount === 1 ? 'Template' : 'Templates'}
                  </Badge>
                </div>
                <p className={styles.catDesc}>{cat.description}</p>
                <div className={styles.tagRow}>
                  {cat.popularTags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.pill}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Pillars Foundation */}
      <section className={styles.pillarsSection}>
        <div className="lf-container">
          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <Layers size={24} />
              </div>
              <h3 className={styles.pillarTitle}>Strict Style & Token Isolation</h3>
              <p className={styles.pillarDesc}>
                Platform shell tokens (<code className={styles.code}>--lf-*</code>) and template tokens (<code className={styles.code}>--tmpl-*</code>) remain strictly decoupled. Templates never mutate platform UI.
              </p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <Play size={24} />
              </div>
              <h3 className={styles.pillarTitle}>Sandboxed Device Runtime</h3>
              <p className={styles.pillarDesc}>
                Live previews execute inside isolated frames with responsive device controls (Desktop, Tablet, Mobile) and Client Presentation Mode.
              </p>
            </div>

            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <ShieldCheck size={24} />
              </div>
              <h3 className={styles.pillarTitle}>Simulated Waybill Intelligence</h3>
              <p className={styles.pillarDesc}>
                Authentic, stateful waypoint progression across ocean, air, road, and courier fixtures with explicit simulation labeling.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

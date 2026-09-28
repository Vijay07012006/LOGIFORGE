import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarterDownloadButton } from '@/components/platform/StarterDownloadButton';
import { Play, ArrowLeft, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';
import { LocalShareButton } from '@/components/platform/LocalShareButton';
import styles from './template-detail.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return { title: 'Template Not Found' };
  }

  return {
    title: `${template.name} — Logistics Website Template`,
    description: template.shortDescription,
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className="lf-container">
        {/* Back navigation */}
        <div className={styles.backNav}>
          <Link href="/templates" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Template Directory</span>
          </Link>
        </div>

        {/* Hero Specs Header */}
        <div className={styles.header}>
          <div className={styles.badges}>
            <Badge variant="primary" size="sm">
              {template.category}
            </Badge>
            <Badge variant="outline" size="sm">
              {template.style} style
            </Badge>
            <Badge variant="secondary" size="sm">
              v{template.version}
            </Badge>
          </div>

          <h1 className={styles.title}>{template.name}</h1>
          <p className={styles.tagline}>{template.tagline}</p>
          <p className={styles.description}>{template.description}</p>

          <div className={styles.actions}>
            <Link href={`/demo/${template.slug}`}>
              <Button variant="primary" size="lg">
                <Play size={18} />
                <span>Launch Live Demo Studio</span>
              </Button>
            </Link>
            <Link href={`/demo/${template.slug}/embed`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <ExternalLink size={18} />
                <span>Isolated Embed</span>
              </Button>
            </Link>
            <LocalShareButton slug={template.slug} name={template.name} mode="template" size="lg" variant="secondary" />
            <StarterDownloadButton template={template} size="lg" variant="outline" />
          </div>
        </div>

        {/* Template Media Architecture Preview */}
        <div className={styles.mediaPreviewPanel}>
          <div className={styles.mediaFrame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={template.previewImage}
              alt={`${template.name} Architecture Preview`}
              width={1600}
              height={900}
              fetchPriority="high"
              decoding="async"
              className={styles.mediaMainImg}
            />
            <div className={styles.mediaBadgeOverlay}>
              <Badge variant="primary" size="sm">
                Production Preview
              </Badge>
              <span className={styles.mediaDimBadge}>1600 × 900 High-DPI</span>
            </div>
          </div>
          {template.galleryImages && template.galleryImages.length > 1 && (
            <div className={styles.galleryStrip}>
              {template.galleryImages.slice(0, 3).map((imgUrl, idx) => (
                <div key={idx} className={styles.galleryItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${template.name} View ${idx + 1}`}
                    width={600}
                    height={338}
                    className={styles.galleryImg}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical Specifications Grid */}
        <div className={styles.grid}>
          {/* Main Column: Features & Pages */}
          <div className={styles.mainCol}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Signature Interactive Features</h2>
              <div className={styles.featureList}>
                {template.features.map((feat) => (
                  <div key={feat.id} className={styles.featureItem}>
                    <div className={styles.featIcon}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div className={styles.featHeader}>
                        <span className={styles.featTitle}>{feat.title}</span>
                        {feat.badge && (
                          <Badge variant="secondary" size="sm">
                            {feat.badge}
                          </Badge>
                        )}
                      </div>
                      <p className={styles.featDesc}>{feat.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Included Page Layouts ({template.pages.length})</h2>
              <div className={styles.pageList}>
                {template.pages.map((pg) => (
                  <div key={pg.id} className={styles.pageCard}>
                    <div className={styles.pageTitleRow}>
                      <span className={styles.pageTitle}>{pg.title}</span>
                      <code className={styles.pageSlug}>/{pg.slug}</code>
                    </div>
                    <p className={styles.pageDesc}>{pg.description}</p>
                    <div className={styles.sectionTags}>
                      {pg.sections.map((sec) => (
                        <span key={sec} className={styles.sectionTag}>
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Specs Panel */}
          <aside className={styles.sideCol}>
            <div className={styles.specsCard}>
              <h3 className={styles.specsTitle}>Technical Overview</h3>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Industry</span>
                <span className={styles.specVal}>{template.industry}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Aesthetic</span>
                <span className={styles.specVal}>{template.theme.name}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Font Pairing</span>
                <span className={styles.specVal}>
                  {template.theme.fontHeading.split(',')[0]} / {template.theme.fontBody.split(',')[0]}
                </span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Technologies</span>
                <span className={styles.specVal}>{template.technologies.join(', ')}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>License</span>
                <span className={styles.specVal}>{template.license}</span>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Last Updated</span>
                <span className={styles.specVal}>{template.lastUpdated}</span>
              </div>
            </div>

            <div className={styles.auditCard}>
              <ShieldCheck size={20} className={styles.auditIcon} />
              <div>
                <span className={styles.auditTitle}>LogiForge Production Verified</span>
                <p className={styles.auditDesc}>
                  Meets strict isolation guidelines. Zero style pollution, WCAG accessible colors, and typed contracts.
                </p>
              </div>
            </div>

            <div className={styles.specsCard}>
              <h3 className={styles.specsTitle}>Client Delivery Routes</h3>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Demo Route</span>
                <Link href={`/demo/${template.slug}`} className={styles.specValLink}>
                  /demo/{template.slug}
                </Link>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Embed Route</span>
                <Link href={`/demo/${template.slug}/embed`} target="_blank" className={styles.specValLink}>
                  /demo/{template.slug}/embed
                </Link>
              </div>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Sample Waybill</span>
                <span className={styles.specVal}>{template.sections.tracking?.sampleTrackingNumbers?.[0] || 'N/A'}</span>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <LocalShareButton slug={template.slug} name={template.name} mode="demo" size="sm" variant="outline" />
                <LocalShareButton slug={template.slug} name={template.name} mode="embed" size="sm" variant="ghost" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

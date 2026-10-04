import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getTemplateBySlug,
  getAllTemplates,
  getTemplateProductMetadata,
  getTemplateReleaseMetadata,
  getTemplatePackageManifestEntry,
  getRelatedTemplates,
} from '@/lib/templates';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarterDownloadButton } from '@/components/platform/StarterDownloadButton';
import { Play, ArrowLeft, CheckCircle2, ShieldCheck, ExternalLink, Scale } from 'lucide-react';
import { LocalShareButton } from '@/components/platform/LocalShareButton';
import { PackageSpecsCard } from '@/components/platform/PackageSpecsCard';
import { CommercialScopeCard } from '@/components/platform/CommercialScopeCard';
import { DeveloperQuickstart } from '@/components/platform/DeveloperQuickstart';
import { DocumentationOverview } from '@/components/platform/DocumentationOverview';
import { TemplateCard } from '@/components/platform/TemplateCard';
import { SITE_URL } from '@/lib/utils';
import styles from './template-detail.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return { title: 'Template Not Found' };
  }

  const canonicalPath = `/templates/${template.slug}`;
  const fullTitle = `${template.name} — ${template.tagline}`;

  return {
    title: `${template.name} — Logistics Website Template`,
    description: template.shortDescription,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${fullTitle} | LOGIFORGE`,
      description: template.shortDescription,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'website',
      images: [
        {
          url: template.previewImage,
          width: 1200,
          height: 630,
          alt: `${template.name} Logistics Website Template Preview`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fullTitle} | LOGIFORGE`,
      description: template.shortDescription,
      images: [template.previewImage],
    },
  };
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const product = getTemplateProductMetadata(template);
  const release = getTemplateReleaseMetadata(template);
  const manifestEntry = getTemplatePackageManifestEntry(template.slug);
  const relatedTemplates = getRelatedTemplates(template.slug, 3);

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${template.name} Logistics Website Template`,
    description: template.shortDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: `Cross-platform (${product.runtimeRequirement})`,
    url: `${SITE_URL}/templates/${template.slug}`,
    image: `${SITE_URL}${template.previewImage}`,
    softwareVersion: release.version,
    downloadUrl: `${SITE_URL}${product.packageUrl}`,
    fileSize: manifestEntry?.sizeFormatted || undefined,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'LOGIFORGE',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Templates',
        item: `${SITE_URL}/templates`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: template.name,
        item: `${SITE_URL}/templates/${template.slug}`,
      },
    ],
  };

  const secondaryGallery = Array.from(
    new Set((template.galleryImages ?? []).filter((img) => img !== template.previewImage))
  );

  return (
    <div className={styles.page}>
      <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
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
              v{release.version}
            </Badge>
            <Badge variant="success" size="sm">
              {release.releaseChannel} release
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
            <StarterDownloadButton template={template} size="lg" variant="secondary" />
            <Link href={`/templates/compare?templates=${template.slug}`}>
              <Button variant="outline" size="lg">
                <Scale size={18} />
                <span>Compare Specs</span>
              </Button>
            </Link>
            <Link href={`/demo/${template.slug}/embed`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                <ExternalLink size={18} />
                <span>Isolated Embed</span>
              </Button>
            </Link>
            <LocalShareButton slug={template.slug} name={template.name} mode="template" size="lg" variant="secondary" />
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
          {secondaryGallery.length > 0 && (
            <div className={styles.galleryStrip}>
              {secondaryGallery.slice(0, 3).map((imgUrl, idx) => (
                <div key={imgUrl} className={styles.galleryItem}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${template.name} Supplementary Architecture View ${idx + 1}`}
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
          {/* Main Column: Features, Pages, Commercial Scope, Quickstart, Docs */}
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

            {/* Commercial Scope */}
            <CommercialScopeCard product={product} />

            {/* Developer Quickstart */}
            <DeveloperQuickstart template={template} product={product} />

            {/* Documentation Overview */}
            <DocumentationOverview template={template} product={product} release={release} />
          </div>

          {/* Sidebar Specs Panel */}
          <aside className={styles.sideCol}>
            {/* Package Specifications Card */}
            <PackageSpecsCard
              template={template}
              product={product}
              release={release}
              manifestEntry={manifestEntry}
            />

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
                <span className={styles.specVal}>{product.licenseType}</span>
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
                <Link href={`/demo/${template.slug}/embed`} target="_blank" rel="noopener noreferrer" className={styles.specValLink}>
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

        {/* Related Templates Directory */}
        {relatedTemplates.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedHeader}>
              <div>
                <h2 className={styles.relatedTitle}>Explore Related Architectures</h2>
                <p className={styles.relatedSubtitle}>
                  Complementary logistics website templates matching industry category and aesthetic pairings.
                </p>
              </div>
              <Link href={`/templates/compare?templates=${template.slug}`}>
                <Button variant="outline" size="sm">
                  <Scale size={14} />
                  <span>Compare Across Catalog</span>
                </Button>
              </Link>
            </div>

            <div className={styles.relatedGrid}>
              {relatedTemplates.map((relTmpl) => (
                <TemplateCard key={relTmpl.slug} template={relTmpl} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

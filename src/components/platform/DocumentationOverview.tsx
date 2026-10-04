import React from 'react';
import type { Template, TemplateProductMetadata, TemplateReleaseMetadata } from '@/types/template';
import { BookOpen, FileText, CheckCircle, Shield, History, ExternalLink } from 'lucide-react';
import styles from './DocumentationOverview.module.css';

export interface DocumentationOverviewProps {
  template: Template;
  product: TemplateProductMetadata;
  release: TemplateReleaseMetadata;
}

export function DocumentationOverview({ template, product, release }: DocumentationOverviewProps) {
  const docs = [
    {
      fileName: 'README.md',
      title: 'Project Architecture & Directory Layout',
      description: `Complete overview of ${template.name}'s Next.js component hierarchy, CSS Modules tokens, and local static assets.`,
      icon: <BookOpen size={16} />,
      badge: 'Architecture',
    },
    {
      fileName: 'GETTING_STARTED.md',
      title: '10-Step Setup & Customization Guide',
      description: 'Zero-to-production walk-through covering environment setup, styling overrides, and deployment to Vercel/Netlify/Node.',
      icon: <FileText size={16} />,
      badge: 'Deployment',
    },
    {
      fileName: 'CHANGELOG.md',
      title: `Release Notes — v${release.version}`,
      description: release.changes.join(' • '),
      icon: <History size={16} />,
      badge: release.releaseChannel,
    },
    {
      fileName: 'LICENSE',
      title: 'LOGIFORGE Commercial Developer License',
      description: 'Grants perpetual internal and commercial client use. Standalone template redistribution or sub-licensing is prohibited.',
      icon: <Shield size={16} />,
      badge: 'Commercial',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className={styles.title}>Package Documentation</h2>
            <p className={styles.subtitle}>
              4 comprehensive documents included at the root of every standalone starter archive.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.docsGrid}>
        {docs.map((doc) => (
          <div key={doc.fileName} className={styles.docCard}>
            <div className={styles.docTop}>
              <div className={styles.docFileBadge}>
                {doc.icon}
                <code className={styles.fileName}>{doc.fileName}</code>
              </div>
              <span className={styles.docTypeBadge}>{doc.badge}</span>
            </div>
            <h3 className={styles.docTitle}>{doc.title}</h3>
            <p className={styles.docDesc}>{doc.description}</p>
          </div>
        ))}
      </div>

      <div className={styles.footerNote}>
        <div className={styles.footerLeft}>
          <CheckCircle size={15} className={styles.noteIcon} />
          <span>All documentation files are extracted alongside source code when unzipping the starter package.</span>
        </div>
        {product.support.documentationUrl && (
          <a
            href={product.support.documentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.supportLink}
          >
            <span>Repository Readme</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

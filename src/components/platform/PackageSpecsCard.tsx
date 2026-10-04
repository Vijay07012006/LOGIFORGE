import React from 'react';
import type { Template, TemplateProductMetadata, TemplateReleaseMetadata, TemplatePackageManifestEntry } from '@/types/template';
import { CopySnippetButton } from './CopySnippetButton';
import { Package, Shield } from 'lucide-react';
import styles from './PackageSpecsCard.module.css';

export interface PackageSpecsCardProps {
  template: Template;
  product: TemplateProductMetadata;
  release: TemplateReleaseMetadata;
  manifestEntry?: TemplatePackageManifestEntry;
}

export function PackageSpecsCard({
  template,
  product,
  release,
  manifestEntry,
}: PackageSpecsCardProps) {
  const sizeFormatted = manifestEntry?.sizeFormatted || 'Calculated at build';
  const sha256 = manifestEntry?.sha256 || '';
  const shortSha = sha256 ? `${sha256.slice(0, 12)}...${sha256.slice(-8)}` : 'Generating on prebuild';
  const filename = manifestEntry?.packageFilename || release.packageFilename;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerIcon}>
          <Package size={18} />
        </div>
        <div>
          <h3 className={styles.title}>Package Specifications</h3>
          <span className={styles.subtitle}>Verified Standalone Next.js Starter</span>
        </div>
      </div>

      <div className={styles.specsList}>
        <div className={styles.specItem}>
          <span className={styles.specLabel}>Package Name</span>
          <code className={styles.specCode}>{product.packageName}</code>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>Release Channel</span>
          <span className={styles.channelBadge}>
            <span className={styles.channelDot} />
            {release.releaseChannel} (v{release.version})
          </span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>Archive Size</span>
          <span className={styles.specValue}>{sizeFormatted}</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>Archive Filename</span>
          <code className={styles.specCode} title={filename}>
            {filename}
          </code>
        </div>

        <div className={styles.specItemColumn}>
          <div className={styles.specLabelRow}>
            <span className={styles.specLabel}>SHA-256 Checksum</span>
            {sha256 && (
              <CopySnippetButton
                text={sha256}
                label="Copy Hash"
                copiedLabel="Copied!"
                variant="compact"
                ariaLabel={`Copy full SHA-256 hash for ${template.name}`}
              />
            )}
          </div>
          <code className={styles.checksumCode} title={sha256}>
            {shortSha}
          </code>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>Runtime Requirement</span>
          <span className={styles.specValue}>{product.runtimeRequirement}</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>Framework Engine</span>
          <span className={styles.specValue}>Next.js App Router</span>
        </div>

        <div className={styles.specItem}>
          <span className={styles.specLabel}>TypeScript</span>
          <span className={styles.specValue}>Strict Configuration</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerNote}>
          <Shield size={14} className={styles.footerIcon} />
          <span>Independent build, typecheck, lint & boot verified</span>
        </div>
      </div>
    </div>
  );
}

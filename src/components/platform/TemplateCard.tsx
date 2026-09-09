import React from 'react';
import Link from 'next/link';
import type { Template } from '@/types/template';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Play, Sparkles, Star, Download, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { formatNumber, formatRating } from '@/lib/utils';
import styles from './TemplateCard.module.css';

export interface TemplateCardProps {
  template: Template;
  priority?: boolean;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <article
      className={styles.card}
      style={{
        '--card-accent': template.theme.primaryAccent,
        '--card-surface': template.theme.surfaceColor,
      } as React.CSSProperties}
    >
      {/* Visual Preview Banner with Logistics Aesthetic */}
      <div className={styles.previewArea}>
        <div className={styles.schematicBackground}>
          <div className={styles.gridPattern} />
          <div className={styles.accentGlow} />

          {/* Minimalist Graphic Schematic tailored to style */}
          <div className={styles.schematicGraphic}>
            <div className={styles.schematicNode} />
            <div className={styles.schematicLine} />
            <div className={styles.schematicNodeEnd} />
          </div>

          <div className={styles.previewCenterBadge}>
            <span className={styles.previewFontHeading} style={{ fontFamily: template.theme.fontHeading }}>
              {template.name}
            </span>
            <span className={styles.previewStyleLabel}>
              {template.style} • {template.theme.name}
            </span>
          </div>
        </div>

        {/* Floating Top Badges */}
        <div className={styles.previewHeader}>
          <div className={styles.badgeCluster}>
            {template.featured && (
              <Badge variant="primary" size="sm">
                Featured
              </Badge>
            )}
            {template.new && (
              <Badge variant="success" size="sm">
                New v{template.version}
              </Badge>
            )}
            {template.tier === 'premium' && (
              <Badge variant="accent" size="sm">
                <Sparkles size={10} />
                <span>Premium</span>
              </Badge>
            )}
            {template.tier === 'enterprise' && (
              <Badge variant="warning" size="sm">
                Enterprise
              </Badge>
            )}
          </div>

          <span className={styles.categoryPill}>{template.industry}</span>
        </div>

        {/* Hover Quick Overlay Action */}
        <div className={styles.hoverOverlay}>
          <Link href={`/demo/${template.slug}`} className={styles.overlayPlayBtn} tabIndex={-1}>
            <Play size={20} />
            <span>Launch Live Sandbox</span>
          </Link>
        </div>
      </div>

      {/* Card Content Details */}
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <div>
            <h3 className={styles.name}>
              <Link href={`/templates/${template.slug}`} className={styles.nameLink}>
                {template.name}
              </Link>
            </h3>
            <p className={styles.tagline}>{template.tagline}</p>
          </div>
          <Link
            href={`/templates/${template.slug}`}
            className={styles.cornerLink}
            aria-label={`View ${template.name} specifications`}
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <p className={styles.description}>{template.shortDescription}</p>

        {/* Key Logistics Signals / Tags */}
        <div className={styles.tagsRow}>
          {template.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tagPill}>
              {tag}
            </span>
          ))}
        </div>

        {/* Performance & Quality Signals */}
        <div className={styles.metaRow}>
          <div className={styles.ratingGroup} title={`Rated ${formatRating(template.rating)} by ${template.reviewCount} teams`}>
            <Star size={13} className={styles.starIcon} fill="#F59E0B" />
            <span className={styles.ratingVal}>{formatRating(template.rating)}</span>
            <span className={styles.reviewCount}>({template.reviewCount})</span>
          </div>

          <div className={styles.downloadGroup} title={`${template.downloads} verified downloads`}>
            <Download size={13} className={styles.downloadIcon} />
            <span className={styles.downloadVal}>{formatNumber(template.downloads)}</span>
          </div>

          <div className={styles.verifiedGroup}>
            <ShieldCheck size={13} className={styles.shieldIcon} />
            <span className={styles.verifiedText}>Typed Contract</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Link href={`/templates/${template.slug}`} className={styles.actionBtn}>
            <Button variant="outline" size="sm">
              Inspect Specs
            </Button>
          </Link>
          <Link href={`/demo/${template.slug}`} className={styles.actionBtn}>
            <Button variant="primary" size="sm">
              <Play size={14} />
              <span>Live Demo</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

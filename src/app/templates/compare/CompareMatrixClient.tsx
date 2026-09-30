'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { Template } from '@/types/template';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Plus,
  X,
  Play,
  ExternalLink,
  Check,
  Scale,
  Sparkles,
} from 'lucide-react';
import styles from './compare.module.css';

interface CompareMatrixClientProps {
  allTemplates: Template[];
}

const SUGGESTED_PAIRS: { label: string; slugs: [string, string] }[] = [
  { label: 'Freight vs. Telematics', slugs: ['cargo-nova', 'fleet-one'] },
  { label: 'Ocean Lines vs. Urban Courier', slugs: ['ship-flow', 'swift-drop'] },
  { label: 'Terminal vs. Air Cargo', slugs: ['port-axis', 'aero-cargo'] },
  { label: '3PL Storage vs. Enterprise ESG', slugs: ['warehouse-x', 'supply-core'] },
  { label: 'AI Optimization vs. Autonomous Grid', slugs: ['route-iq', 'move-sphere'] },
];

export function CompareMatrixClient({ allTemplates }: CompareMatrixClientProps) {
  const searchParams = useSearchParams();

  // Initialize selected slugs from URL params
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    const raw = searchParams.get('templates') || searchParams.get('t') || '';
    if (!raw) return [];
    const parsed = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => allTemplates.some((t) => t.slug === s));
    return Array.from(new Set(parsed)).slice(0, 3);
  });

  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Sync state changes with URL query string
  const updateUrl = useCallback((slugs: string[]) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (slugs.length > 0) {
      url.searchParams.set('templates', slugs.join(','));
      url.searchParams.delete('t');
    } else {
      url.searchParams.delete('templates');
      url.searchParams.delete('t');
    }
    window.history.replaceState(null, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
  }, []);

  const handleSelectTemplate = (slug: string) => {
    if (selectedSlugs.includes(slug) || selectedSlugs.length >= 3) return;
    const next = [...selectedSlugs, slug];
    setSelectedSlugs(next);
    updateUrl(next);
    setIsPickerOpen(false);
  };

  const handleRemoveTemplate = (slug: string) => {
    const next = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(next);
    updateUrl(next);
  };

  const handleApplyPreset = (slugs: [string, string]) => {
    setSelectedSlugs(slugs);
    updateUrl(slugs);
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    function handlePopState() {
      const currentUrl = new URL(window.location.href);
      const raw = currentUrl.searchParams.get('templates') || currentUrl.searchParams.get('t') || '';
      if (!raw) {
        setSelectedSlugs([]);
        return;
      }
      const parsed = raw
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => allTemplates.some((t) => t.slug === s));
      setSelectedSlugs(Array.from(new Set(parsed)).slice(0, 3));
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [allTemplates]);

  // Handle keyboard Escape for modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isPickerOpen) {
        setIsPickerOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPickerOpen]);

  // Resolved template models
  const selectedTemplates = useMemo(() => {
    return selectedSlugs
      .map((slug) => allTemplates.find((t) => t.slug === slug))
      .filter((t): t is Template => Boolean(t));
  }, [selectedSlugs, allTemplates]);

  // Unselected templates for the modal
  const availableTemplates = useMemo(() => {
    return allTemplates.filter((t) => !selectedSlugs.includes(t.slug));
  }, [allTemplates, selectedSlugs]);

  return (
    <>
      {/* Top navigation */}
      <div className={styles.topBar}>
        <Link href="/templates" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Template Catalog</span>
        </Link>
        {selectedTemplates.length > 0 && selectedTemplates.length < 3 && (
          <button
            onClick={() => setIsPickerOpen(true)}
            className={styles.primaryActionBtn}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
          >
            <Plus size={14} />
            <span>Add Template ({selectedTemplates.length}/3)</span>
          </button>
        )}
      </div>

      {/* Page Header */}
      <div className={styles.header}>
        <div className={styles.badgeWrapper}>
          <Badge variant="primary" size="sm">
            SPECIFICATION MATRIX • SIDE-BY-SIDE ARCHITECTURE EVALUATION
          </Badge>
        </div>
        <h1 className={styles.title}>Compare Logistics Templates</h1>
        <p className={styles.subtitle}>
          Evaluate production architectures, bundle weights, design tokens, responsive features, and verified specs side by side to choose the optimal template for your logistics brand.
        </p>

        {/* Suggested comparison presets */}
        <div className={styles.suggestionsRow}>
          <span className={styles.suggestionsLabel}>Featured Comparisons:</span>
          {SUGGESTED_PAIRS.map((pair) => (
            <button
              key={pair.label}
              onClick={() => handleApplyPreset(pair.slugs)}
              className={styles.suggestionChip}
            >
              <Sparkles size={12} />
              <span>{pair.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 0-Template Empty State */}
      {selectedTemplates.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconBox}>
            <Scale size={28} />
          </div>
          <h2 className={styles.emptyTitle}>No Templates Selected For Comparison</h2>
          <p className={styles.emptyDescription}>
            Select 2 or 3 templates from our 10 specialized logistics architectures to compare technical specs, device viewports, design tokens, and components side-by-side.
          </p>
          <button
            onClick={() => setIsPickerOpen(true)}
            className={styles.primaryActionBtn}
          >
            <Plus size={16} />
            <span>Select Templates from Catalog</span>
          </button>
        </div>
      )}

      {/* 1-Template Guidance Banner */}
      {selectedTemplates.length === 1 && (
        <div className={styles.singleTemplateBanner}>
          <div className={styles.singleBannerText}>
            Comparing <strong>{selectedTemplates[0].name}</strong>. Add at least 1 more template to activate the side-by-side specification matrix.
          </div>
          <button
            onClick={() => setIsPickerOpen(true)}
            className={styles.primaryActionBtn}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
          >
            <Plus size={14} />
            <span>Add 2nd Template</span>
          </button>
        </div>
      )}

      {/* Comparison Matrix Table (1, 2, or 3 templates) */}
      {selectedTemplates.length > 0 && (
        <div className={styles.matrixWrapper}>
          <table className={styles.comparisonTable}>
            <thead>
              <tr>
                <th className={styles.attrColHeader}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--lf-text-muted)' }}>
                    Specifications
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--lf-text-primary)', marginTop: '0.25rem' }}>
                    Comparing {selectedTemplates.length} {selectedTemplates.length === 1 ? 'Template' : 'Templates'}
                  </div>
                </th>
                {selectedTemplates.map((t) => (
                  <th key={t.slug} className={styles.templateColHeader}>
                    <div className={styles.cardHeaderBox}>
                      <div className={styles.cardTopRow}>
                        <Badge
                          variant={t.tier === 'enterprise' ? 'outline' : 'primary'}
                          size="sm"
                        >
                          {t.tier.toUpperCase()}
                        </Badge>
                        <button
                          onClick={() => handleRemoveTemplate(t.slug)}
                          className={styles.removeBtn}
                          title={`Remove ${t.name} from comparison`}
                          aria-label={`Remove ${t.name} from comparison`}
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className={styles.imageFrame}>
                        <Image
                          src={t.previewImage}
                          alt={`${t.name} preview`}
                          width={400}
                          height={225}
                          className={styles.previewImg}
                        />
                      </div>

                      <div>
                        <h2 className={styles.templateName}>
                          <Link href={`/templates/${t.slug}`}>{t.name}</Link>
                        </h2>
                        <div className={styles.templateTagline}>{t.tagline}</div>
                      </div>

                      <div className={styles.cardActionBtns}>
                        <Link
                          href={`/demo/${t.slug}`}
                          className={styles.demoStudioBtn}
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Open Demo Studio</span>
                        </Link>
                        <Link
                          href={`/templates/${t.slug}`}
                          className={styles.viewSpecsBtn}
                        >
                          <ExternalLink size={13} />
                          <span>View Template</span>
                        </Link>
                      </div>
                    </div>
                  </th>
                ))}

                {/* Add template placeholder slot if less than 3 */}
                {selectedTemplates.length < 3 && (
                  <th className={styles.templateColHeader}>
                    <div
                      className={styles.emptyColSlot}
                      onClick={() => setIsPickerOpen(true)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsPickerOpen(true);
                        }
                      }}
                      aria-label="Add template to comparison"
                    >
                      <div className={styles.emptyColSlotIcon}>
                        <Plus size={20} />
                      </div>
                      <div className={styles.emptyColSlotText}>Add Template</div>
                      <div className={styles.emptyColSlotSub}>
                        {selectedTemplates.length === 1 ? 'Slot 2 of 3' : 'Slot 3 of 3'}
                      </div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {/* SECTION: OVERVIEW & CLASSIFICATION */}
              <tr className={styles.sectionRow}>
                <td colSpan={selectedTemplates.length < 3 ? selectedTemplates.length + 2 : selectedTemplates.length + 1} className={styles.sectionHeaderCell}>
                  1. Classification & Domain
                </td>
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Logistics Category</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <Badge variant="outline" size="sm">
                      {t.category.replace(/-/g, ' ').toUpperCase()}
                    </Badge>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Target Industry</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    {t.industry}
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Visual Style & Aesthetic</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell} style={{ textTransform: 'capitalize' }}>
                    {t.style}
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>License Tier</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell} style={{ textTransform: 'capitalize' }}>
                    {t.tier}
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>

              {/* SECTION: PERFORMANCE & TECHNICAL SPECS */}
              <tr className={styles.sectionRow}>
                <td colSpan={selectedTemplates.length < 3 ? selectedTemplates.length + 2 : selectedTemplates.length + 1} className={styles.sectionHeaderCell}>
                  2. Architecture & Performance
                </td>
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Production Bundle Size</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <strong>{t.bundleSizeKb} kB</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lf-text-muted)' }}>First Load Route JS</div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Technology Stack</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div className={styles.tagList}>
                      {t.technologies.map((tech) => (
                        <span key={tech} className={styles.tagItem}>{tech}</span>
                      ))}
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Responsive Support</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8rem' }}>
                      <span>✓ Desktop (1280px+)</span>
                      <span>✓ Tablet (768px - 1024px)</span>
                      <span>✓ Mobile (min {t.responsive.minWidthPx}px)</span>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Included Blueprint Views</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <strong>{(t.blueprintNav || t.pages).length} Views</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lf-text-muted)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                      {t.blueprintNav
                        ? t.blueprintNav.map((p) => p.label).join(' • ')
                        : t.pages.map((p) => p.title).join(' • ')}
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>

              {/* SECTION: DESIGN TOKENS & TYPOGRAPHY */}
              <tr className={styles.sectionRow}>
                <td colSpan={selectedTemplates.length < 3 ? selectedTemplates.length + 2 : selectedTemplates.length + 1} className={styles.sectionHeaderCell}>
                  3. Design Tokens & Theme Specs
                </td>
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Theme Accents</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <div className={styles.colorSwatchGroup}>
                        <span
                          className={styles.colorSwatch}
                          style={{ backgroundColor: t.theme.primaryAccent }}
                        />
                        <span className={styles.colorCode}>Primary: {t.theme.primaryAccent}</span>
                      </div>
                      <div className={styles.colorSwatchGroup}>
                        <span
                          className={styles.colorSwatch}
                          style={{ backgroundColor: t.theme.secondaryAccent }}
                        />
                        <span className={styles.colorCode}>Secondary: {t.theme.secondaryAccent}</span>
                      </div>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Font Pairing</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div><strong>Headings:</strong> {t.theme.fontHeading.split(',')[0]}</div>
                      <div style={{ color: 'var(--lf-text-muted)' }}><strong>Body:</strong> {t.theme.fontBody.split(',')[0]}</div>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Geometry & Density</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>Radius: <code>{t.theme.borderRadius}</code></div>
                      <div style={{ textTransform: 'capitalize' }}>Density: {t.theme.density}</div>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>

              {/* SECTION: FEATURES & INTERACTIVE TOOLS */}
              <tr className={styles.sectionRow}>
                <td colSpan={selectedTemplates.length < 3 ? selectedTemplates.length + 2 : selectedTemplates.length + 1} className={styles.sectionHeaderCell}>
                  4. Feature Set & Specialized Components
                </td>
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Signature Features</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <ul className={styles.featureList}>
                      {t.features.map((f) => (
                        <li key={f.id} className={styles.featureItem}>
                          <Check size={14} className={styles.featureCheck} />
                          <span>
                            <strong>{f.title}</strong> — {f.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>

              {/* SECTION: SOCIAL PROOF & VERSIONING */}
              <tr className={styles.sectionRow}>
                <td colSpan={selectedTemplates.length < 3 ? selectedTemplates.length + 2 : selectedTemplates.length + 1} className={styles.sectionHeaderCell}>
                  5. Version & Social Proof
                </td>
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Rating & Reviews</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div>★ <strong>{t.rating.toFixed(2)}</strong> / 5.0</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--lf-text-muted)' }}>
                      Based on {t.reviewCount} customer reviews
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Deployments</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    {t.downloads.toLocaleString()} active deployments
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Release & Update</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ fontSize: '0.8rem' }}>
                      <div>Version: <code>v{t.version}</code></div>
                      <div style={{ color: 'var(--lf-text-muted)' }}>Updated: {t.lastUpdated}</div>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>License Type</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <Badge variant="outline" size="sm">{t.license}</Badge>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
              <tr className={styles.dataRow}>
                <td className={styles.attrLabelCell}>Interactive Sandboxes</td>
                {selectedTemplates.map((t) => (
                  <td key={t.slug} className={styles.dataCell}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
                      <Link href={`/demo/${t.slug}`} style={{ color: 'var(--lf-accent-amber)', textDecoration: 'none' }}>
                        → Open Demo Studio
                      </Link>
                      <a href={`/demo/${t.slug}/embed`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lf-text-secondary)', textDecoration: 'none' }}>
                        → View Isolated Embed ↗
                      </a>
                    </div>
                  </td>
                ))}
                {selectedTemplates.length < 3 && <td className={styles.dataCell} />}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Template Selection Modal */}
      {isPickerOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsPickerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Select template to compare"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Select Template to Compare</h3>
              <button
                onClick={() => setIsPickerOpen(false)}
                className={styles.modalCloseBtn}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalList}>
              {availableTemplates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--lf-text-muted)' }}>
                  All templates have been added to the comparison.
                </div>
              ) : (
                availableTemplates.map((tmpl) => (
                  <div key={tmpl.slug} className={styles.pickerItem}>
                    <div className={styles.pickerItemLeft}>
                      <Image
                        src={tmpl.thumbnailImage || tmpl.previewImage}
                        alt={tmpl.name}
                        width={60}
                        height={38}
                        className={styles.pickerThumb}
                      />
                      <div className={styles.pickerInfo}>
                        <div className={styles.pickerName}>{tmpl.name}</div>
                        <div className={styles.pickerMeta}>{tmpl.industry} • {tmpl.tier}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectTemplate(tmpl.slug)}
                      className={styles.pickerSelectBtn}
                    >
                      + Add to Compare
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

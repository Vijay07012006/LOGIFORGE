'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { SupplyCoreHero } from './SupplyCoreHero';
import { SupplyCoreAuditTracker } from './SupplyCoreAuditTracker';
import { SupplyCoreRiskHeatmap } from './SupplyCoreRiskHeatmap';
import { SupplyCoreScope3Calc } from './SupplyCoreScope3Calc';
import { ArrowRight, ShieldCheck, FileCheck, Award, Lock, Network } from 'lucide-react';
import styles from './SupplyCore.module.css';

interface SupplyCoreWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Resilience Hub' },
  { id: 'tracking', label: 'PO & Provenance' },
  { id: 'risk', label: 'Risk Heatmap' },
  { id: 'scope3', label: 'Scope-3 Emissions' },
  { id: 'capabilities', label: 'Governance' },
];

const METRICS = [
  {
    value: '< 6 Hrs',
    label: 'Disruption Recovery Time',
    detail: 'Automated secondary vendor failover',
  },
  {
    value: '4,200+',
    label: 'Audited Tier-1 Suppliers',
    detail: 'Across 68 sovereign jurisdictions',
  },
  {
    value: '99.98%',
    label: 'Continuity Verification',
    trend: 'Cryptographic hash audit trail',
  },
  {
    value: '-34%',
    label: 'Scope-3 Footprint Reduction',
    detail: 'Via intermodal green route dispatch',
  },
];

const FOOTER_COLS = [
  {
    title: 'Enterprise Solutions',
    links: [
      { label: 'Multi-Tier Supplier Audits', href: '#tracking' },
      { label: 'Global Corridor Risk Visualizer', href: '#risk' },
      { label: 'Scope-3 Carbon Engine', href: '#scope3' },
      { label: 'Contingency Route Blueprinting', href: '#risk' },
    ],
  },
  {
    title: 'Governance & Security',
    links: [
      { label: 'ISO 28000 Certification', href: '#capabilities' },
      { label: 'SOC 2 Type II Attestation', href: '#capabilities' },
      { label: 'GRI Standards Framework', href: '#capabilities' },
      { label: 'OECD Conflict Minerals Seal', href: '#capabilities' },
    ],
  },
  {
    title: 'Architecture Hub',
    links: [
      { label: 'Executive Briefing', href: '#contact' },
      { label: 'Enterprise API Documentation', href: '#contact' },
      { label: 'Sovereign Data Storage', href: '#contact' },
      { label: 'Global Operations Network', href: '#capabilities' },
    ],
  },
];

export function SupplyCoreWebsite({
  template,
  initialTracking,
  initialPage = 'home',
}: SupplyCoreWebsiteProps) {
  const [activeSection, setActiveSection] = useState<string>(initialPage);
  const [trackingNumber, setTrackingNumber] = useState<string>(
    initialTracking || 'SC-7700-GL'
  );

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TEMPLATE_PAGE_CHANGED',
          pageSlug: id,
        },
        '*'
      );
    }
  };

  useEffect(() => {
    function handleHostMessage(event: MessageEvent) {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'INJECT_TRACKING_QUERY' && typeof data.trackingNumber === 'string') {
        setTrackingNumber(data.trackingNumber);
        scrollToSection('tracking');
      }

      if (data.type === 'NAVIGATE_TEMPLATE_PAGE' && typeof data.pageSlug === 'string') {
        scrollToSection(data.pageSlug);
      }
    }

    window.addEventListener('message', handleHostMessage);

    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TEMPLATE_MOUNTED',
          slug: template.slug,
          title: template.name,
          currentRoute: activeSection,
        },
        '*'
      );
    }

    return () => window.removeEventListener('message', handleHostMessage);
  }, [template.slug, template.name, activeSection]);

  return (
    <div className={styles.supplycoreRoot}>
      <TemplateHeader
        brandName="SUPPLYCORE"
        tagline="Enterprise Global Supply Chain & Resilience Intelligence"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Executive Briefing"
        onCtaClick={() => scrollToSection('contact')}
      />

      <main>
        <div id="home">
          <SupplyCoreHero
            onAuditLine={() => scrollToSection('tracking')}
            onExploreRisk={() => scrollToSection('risk')}
            onScope3Calc={() => scrollToSection('scope3')}
          />
        </div>

        <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <StatMetricBlock
            metrics={METRICS}
            accentColor="#6366f1"
          />
        </div>

        <SupplyCoreAuditTracker initialPo={trackingNumber} />

        <SupplyCoreRiskHeatmap />

        <SupplyCoreScope3Calc />

        {/* Enterprise Governance Capabilities */}
        <section id="capabilities" className={styles.section} aria-label="Governance and Capabilities">
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <Network size={14} />
              <span>ENTERPRISE GOVERNANCE</span>
            </div>
            <h2 className={styles.sectionTitle}>Built for Corporate Supply Officers</h2>
            <p className={styles.sectionSubtitle}>
              Full architectural containment, sovereign cryptographic custody,
              and automated regulatory compliance across 68 jurisdictions.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            <div style={{
              background: '#10162A',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '1.75rem',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818CF8',
                marginBottom: '1rem',
              }}>
                <Network size={22} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Automated Secondary Vendor Failover
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Dynamic API triggers automatically reallocate purchase orders when critical tier-1 suppliers exceed vulnerability thresholds.
              </p>
            </div>

            <div style={{
              background: '#10162A',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '1.75rem',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34D399',
                marginBottom: '1rem',
              }}>
                <Lock size={22} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Cryptographic Custody Verification
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                Immutable ledger recording of every component transfer, certified smelter transaction, and laboratory test result.
              </p>
            </div>

            <div style={{
              background: '#10162A',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '8px',
              padding: '1.75rem',
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FBBF24',
                marginBottom: '1rem',
              }}>
                <FileCheck size={22} aria-hidden="true" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                EU CSRD & SEC Climate Disclosures
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.6 }}>
                One-click export of verified Scope-1, Scope-2, and Scope-3 carbon data formatted for corporate compliance reporting.
              </p>
            </div>
          </div>
        </section>

        {/* Global Compliance Seals */}
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.25rem 3rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <ShieldCheck size={18} style={{ color: '#818CF8' }} aria-hidden="true" />
            <span>ISO 28000 Supply Chain Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <Award size={18} style={{ color: '#34D399' }} aria-hidden="true" />
            <span>GRI Standards Aligned</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <Lock size={18} style={{ color: '#FBBF24' }} aria-hidden="true" />
            <span>SOC 2 Type II Certified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
            <FileCheck size={18} style={{ color: '#A78BFA' }} aria-hidden="true" />
            <span>OECD Conflict Minerals Due Diligence</span>
          </div>
        </div>

        {/* Call to Action */}
        <section id="contact" style={{ background: '#05070d', borderTop: '1px solid var(--tmpl-border)', borderBottom: '1px solid var(--tmpl-border)', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 22, 42, 0.9) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '4rem 2rem',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
              Shield Your Enterprise From Supply Shocks
            </h2>
            <p style={{ color: '#CBD5E1', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Deploy SupplyCore resilience architecture across your global tier-1 to tier-3 manufacturing nodes.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollToSection('tracking')}
            >
              <span>Schedule Executive Briefing</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <TemplateFooter
        brandName="SUPPLYCORE"
        description="SupplyCore provides enterprise-grade supply chain resilience intelligence, automated tier-1 to tier-3 supplier risk scoring, and verified Scope-3 carbon telemetry."
        certifications={['ISO 28000 SUPPLY CHAIN SECURITY', 'GRI STANDARDS ALIGNED', 'SOC 2 TYPE II AUDITED', 'OECD CONFLICT MINERALS']}
        columns={FOOTER_COLS}
        dispatchCenterName="Executive Risk & Supply Resilience Center"
        dispatchInfo="Continuous 24/7 geopolitical disruption radar, GLEC carbon calculations, and automated purchase order failover."
      />
    </div>
  );
}

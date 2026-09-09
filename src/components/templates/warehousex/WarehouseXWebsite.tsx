'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { WarehouseXHero } from './WarehouseXHero';
import { WarehouseXAsnTracker } from './WarehouseXAsnTracker';
import { WarehouseXRackVisualizer } from './WarehouseXRackVisualizer';
import { WarehouseXDockScheduler } from './WarehouseXDockScheduler';
import { Warehouse, ArrowRight, Thermometer, Box, Cpu } from 'lucide-react';
import styles from './WarehouseX.module.css';

interface WarehouseXWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Facility Overview' },
  { id: 'tracking', label: 'ASN & Pallet Tracker' },
  { id: 'racks', label: 'Rack Visualizer' },
  { id: 'docks', label: 'Dock Scheduling' },
  { id: 'disciplines', label: 'Storage Disciplines' },
];

const METRICS = [
  {
    value: '3.8M Sq Ft',
    label: 'Storage Area Managed',
    detail: 'Across 14 strategically positioned nationwide fulfillment hubs',
  },
  {
    value: '99.96%',
    label: 'Pick & Pack Accuracy',
    detail: 'Optical barcode vision verification at every picking station',
  },
  {
    value: '45 Sec',
    label: 'ASRS Pallet Retrieval',
    trend: 'Automated high-bay robotic crane cycle speed',
  },
  {
    value: '< 28 Mins',
    label: 'Average Trailer Offload',
    detail: 'Automated dock door scheduling and live cross-dock scanning',
  },
];

const SERVICES = [
  {
    title: 'Automated Storage & Retrieval (ASRS)',
    desc: 'High-density multi-tier crane racking achieving sub-45-second pallet retrieval with automated weight balance telemetry.',
    icon: Warehouse,
  },
  {
    title: 'Pharmaceutical Cold Vaults',
    desc: 'GDP-certified -20°C and 2-8°C compartments with validated 24/7 continuous temperature data loggers and backup power.',
    icon: Thermometer,
  },
  {
    title: 'Cross-Docking & Transloading',
    desc: 'High-velocity inbound-to-outbound freight transfer minimizing storage dwelling time and expediting line-haul dispatch.',
    icon: Box,
  },
  {
    title: 'Robotic Pick & Pack Goods-to-Person',
    desc: 'Autonomous mobile robots (AMR) directing SKUs to ergonomically optimized packing stations with zero walk waste.',
    icon: Cpu,
  },
];

const FOOTER_COLS = [
  {
    title: 'Fulfillment Network',
    links: [
      { label: 'High-Density ASRS Racking', href: '#racks' },
      { label: 'ASN Pallet Ingestion', href: '#tracking' },
      { label: 'Dock Door Management', href: '#docks' },
      { label: 'Cold-Chain Pharma Vaults', href: '#disciplines' },
    ],
  },
  {
    title: 'Compliance & Safety',
    links: [
      { label: 'FDA Food Facility Registry', href: '#disciplines' },
      { label: 'GDP Pharmaceutical Certified', href: '#disciplines' },
      { label: 'OSHA Star Standard Compliance', href: '#disciplines' },
      { label: 'WMS API Integration Specs', href: '#home' },
    ],
  },
];

export function WarehouseXWebsite({
  template,
  initialTracking,
  initialPage = 'home',
}: WarehouseXWebsiteProps) {
  const [activeSection, setActiveSection] = useState(initialPage);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    if (typeof window !== 'undefined' && window.parent !== window) {
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
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'NAVIGATE_PAGE' && event.data.pageSlug) {
        scrollToSection(event.data.pageSlug);
      }
    }

    window.addEventListener('message', handleHostMessage);

    if (typeof window !== 'undefined' && window.parent !== window) {
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
    <div className={styles.warehousexRoot}>
      <TemplateHeader
        brandName="WAREHOUSEX"
        tagline="Automated 3PL Warehousing & Multi-Node Fulfillment"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Schedule Dock Door"
        onCtaClick={() => scrollToSection('docks')}
      />

      <main>
        <div id="home">
          <WarehouseXHero
            onTrackAsn={() => scrollToSection('tracking')}
            onExploreRacks={() => scrollToSection('racks')}
            onDockSchedule={() => scrollToSection('docks')}
          />
        </div>

        <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <StatMetricBlock
            metrics={METRICS}
            accentColor="#10b981"
          />
        </div>

        <WarehouseXAsnTracker initialAsn={initialTracking || 'WX-5510-IL'} />

        <WarehouseXRackVisualizer />

        <WarehouseXDockScheduler />

        <section id="disciplines" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <Warehouse size={14} />
              <span>LOGISTICS DISCIPLINES</span>
            </div>
            <h2 className={styles.sectionTitle}>Engineered for High-Velocity Retail & Pharma</h2>
            <p className={styles.sectionSubtitle}>
              From micro-fulfillment hubs to enterprise multi-tenant campuses, WarehouseX is purpose-built for extreme operational rigor.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {SERVICES.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div key={idx} className={styles.serviceCard}>
                  <div className={styles.serviceIcon}>
                    <IconComp size={24} />
                  </div>
                  <h3 className={styles.serviceTitle}>{srv.title}</h3>
                  <p className={styles.serviceDesc}>{srv.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{ background: '#09111b', borderTop: '1px solid var(--tmpl-border)', borderBottom: '1px solid var(--tmpl-border)', padding: '4rem 1.25rem' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              Distribute Your Inventory Across the WarehouseX Grid
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Connect your ERP or TMS via our native REST & EDI connectors. Position pallets within 1-day ground reach of 92% of the continental population.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollToSection('docks')}
            >
              <span>Connect Inbound Carrier</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <TemplateFooter
        brandName="WAREHOUSEX"
        description="WarehouseX operates 3.8M sq ft of high-velocity automated 3PL facilities across 14 nationwide fulfillment nodes with sub-minute ASRS retrieval."
        certifications={['FDA FOOD FACILITY REGISTERED', 'GDP PHARMA CERTIFIED', 'OSHA STAR STANDARD', 'ISO 9001 WMS VERIFIED']}
        columns={FOOTER_COLS}
        dispatchCenterName="Central Fulfillment WMS & Yard Control"
        dispatchInfo="24/7 automated crane status, optical barcode scan verification, and trailer dock turnaround tracking."
      />
    </div>
  );
}

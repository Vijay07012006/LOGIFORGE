'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { AeroCargoHero } from './AeroCargoHero';
import { AeroCargoAwbTrack } from './AeroCargoAwbTrack';
import { AeroCargoUldCalc } from './AeroCargoUldCalc';
import { AeroCargoPharma } from './AeroCargoPharma';
import { ArrowRight, Plane } from 'lucide-react';
import styles from './AeroCargo.module.css';

interface AeroCargoWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Flight Operations' },
  { id: 'awb', label: 'AWB Radar Tracking' },
  { id: 'uld', label: 'Aircraft ULD Calculator' },
  { id: 'pharma', label: 'Cold-Chain Pharma' },
];

const METRICS = [
  { value: '28 Aircraft', label: 'Maindeck B777 & B747 Fleet', detail: 'Dedicated long-range intercontinental freighters' },
  { value: '99.4%', label: 'Flown As Booked (FAB) SLA', detail: 'Guaranteed space on published flight rotations' },
  { value: '180,000 T', label: 'Annual Air Cargo Tonnage', detail: 'Moved across Trans-Pacific & European hubs' },
  { value: '45 Mins', label: 'Tarmac Ramp Turnaround', trend: 'Automated nose-door high-loader operations' },
];

const FOOTER_COLS = [
  {
    title: 'Aviation Corridors',
    links: [
      { label: 'Trans-Pacific (ICN - ANC - ORD)', href: '#awb' },
      { label: 'Euro-Asia (FRA - DXB - HKG)', href: '#awb' },
      { label: 'Trans-Atlantic Express (BRU - ATL)', href: '#awb' },
      { label: 'Charter Flights Booking', href: '#uld' },
    ],
  },
  {
    title: 'Aviation Compliance',
    links: [
      { label: 'IATA CEIV Pharma Certified', href: '#pharma' },
      { label: 'Dangerous Goods Regs (DGR)', href: '#pharma' },
      { label: 'Customs ACE Electronic Airway Bill', href: '#awb' },
      { label: 'Unit Load Device Guidelines', href: '#uld' },
    ],
  },
];

export function AeroCargoWebsite({
  template,
  initialTracking = 'AC-9901-FRA',
  initialPage = 'home',
}: AeroCargoWebsiteProps) {
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
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'NAVIGATE_TEMPLATE_PAGE' && typeof data.pageSlug === 'string') {
        scrollToSection(data.pageSlug);
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
    <div className={styles.aerocargoRoot}>
      {/* Navigation */}
      <TemplateHeader
        brandName="AEROCARGO"
        tagline="International Air Freight & Charter"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Book Air Charter"
        onCtaClick={() => scrollToSection('uld')}
      />

      {/* Hero */}
      <AeroCargoHero
        onAwbClick={() => scrollToSection('awb')}
        onUldClick={() => scrollToSection('uld')}
      />

      {/* Metrics */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent)" />
      </div>

      {/* AWB Tracking */}
      <AeroCargoAwbTrack initialTracking={initialTracking} />

      {/* ULD Calculator */}
      <AeroCargoUldCalc />

      {/* Pharma & Cold Chain */}
      <AeroCargoPharma />

      {/* Enterprise Charter CTA */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--tmpl-bg), #04060c)',
          borderTop: '1px solid var(--tmpl-border-light)',
          padding: 'clamp(4rem, 8vw, 6rem) 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className={styles.eyebrow}>
            <Plane size={14} />
            MAINDECK CHARTER ADVISORY
          </div>
          <h2 className={styles.sectionTitle}>
            Charter Full Freighter Aircraft On-Demand
          </h2>
          <p className={styles.sectionSubtitle}>
            Our global 24/7 air operations desk arranges ad-hoc emergency B777-F and B747-8F charters with landing permits secured within 4 hours globally.
          </p>
          <button
            type="button"
            className={styles.btnAero}
            onClick={() => scrollToSection('uld')}
            style={{ maxWidth: '340px' }}
          >
            Request Heavy Air Charter
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <TemplateFooter
        brandName="AEROCARGO"
        description="AeroCargo International Airlines operates a dedicated fleet of 28 widebody freighters providing scheduled air cargo and critical aerospace charters across 65 international airports."
        certifications={['IATA CARGO MEMBER', 'CEIV PHARMA VALIDATED', 'FAA PART 129 APPROVED', 'C-TPAT AIR CARRIER']}
        columns={FOOTER_COLS}
        dispatchCenterName="Frankfurt Global Flight Dispatch"
        dispatchInfo="Continuous ADS-B transponder telemetry across 28 widebody freighters."
      />
    </div>
  );
}

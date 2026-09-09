'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { SwiftDropHero } from './SwiftDropHero';
import { SwiftDropRateCalc } from './SwiftDropRateCalc';
import { SwiftDropTracking } from './SwiftDropTracking';
import { SwiftDropBento } from './SwiftDropBento';
import { SwiftDropFleet } from './SwiftDropFleet';
import { ArrowRight, Zap } from 'lucide-react';
import styles from './SwiftDrop.module.css';

interface SwiftDropWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'rates', label: 'Instant Rates' },
  { id: 'tracking', label: 'Live Tracking' },
  { id: 'features', label: 'Bento Grid' },
  { id: 'fleet', label: 'EV Fleet' },
];

const METRICS = [
  { value: '46 Mins', label: 'Average Delivery Time', detail: 'Measured across 240,000 urban drops' },
  { value: '99.7%', label: 'First-Attempt Success Rate', detail: 'Powered by automated recipient SMS' },
  { value: '180+', label: 'Subway Parcel Lockers', detail: '24/7 one-time Bluetooth code release' },
  { value: '0 Grams', label: 'Tailpipe Carbon Emissions', trend: '100% Electric vans & cargo trikes' },
];

const FOOTER_COLS = [
  {
    title: 'Courier Services',
    links: [
      { label: 'Flash 2-Hour Express', href: '#rates' },
      { label: 'Same-Day Commercial', href: '#rates' },
      { label: 'Smart Locker Ingestion', href: '#features' },
      { label: 'Temperature Cold Totes', href: '#features' },
    ],
  },
  {
    title: 'Metropolitan Hubs',
    links: [
      { label: 'Manhattan Core (NYC)', href: '#fleet' },
      { label: 'Greater London (City)', href: '#fleet' },
      { label: 'Chicago Loop (IL)', href: '#fleet' },
      { label: 'Berlin Mitte (DE)', href: '#fleet' },
    ],
  },
];

export function SwiftDropWebsite({
  template,
  initialTracking = 'SD-4421-EU',
  initialPage = 'home',
}: SwiftDropWebsiteProps) {
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
    <div className={styles.swiftdropRoot}>
      {/* Navigation */}
      <TemplateHeader
        brandName="SWIFTDROP"
        tagline="Last-Mile & Urban Courier"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Send Parcel"
        onCtaClick={() => scrollToSection('rates')}
      />

      {/* Hero */}
      <SwiftDropHero
        onQuoteClick={() => scrollToSection('rates')}
        onTrackClick={() => scrollToSection('tracking')}
      />

      {/* Metrics */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent)" />
      </div>

      {/* Instant Rate Calculator */}
      <SwiftDropRateCalc />

      {/* Live Doorstep Courier Tracking */}
      <SwiftDropTracking initialTracking={initialTracking} />

      {/* Bento Grid Architecture */}
      <SwiftDropBento />

      {/* Urban EV Fleet */}
      <SwiftDropFleet />

      {/* Enterprise Commercial CTA */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--tmpl-bg), #06070a)',
          borderTop: '1px solid var(--tmpl-border-light)',
          padding: 'clamp(4rem, 8vw, 6rem) 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className={styles.eyebrow}>
            <Zap size={14} />
            ENTERPRISE API COURIER INTEGRATION
          </div>
          <h2 className={styles.sectionTitle}>
            Integrate 45-Minute Delivery Directly into Your Checkout
          </h2>
          <p className={styles.sectionSubtitle}>
            Our developer-friendly REST &amp; Webhook API empowers regional retailers and medical providers to dispatch nearby couriers programmatically with sub-second rider pairing.
          </p>
          <button
            type="button"
            className={styles.btnOrange}
            onClick={() => scrollToSection('rates')}
            style={{ maxWidth: '340px' }}
          >
            Create Merchant API Account
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <TemplateFooter
        brandName="SWIFTDROP"
        description="SwiftDrop Last-Mile Logistics is an urban on-demand courier platform operating 100% electric delivery fleets and automated smart lockers across North America and Europe."
        certifications={['ZERO EMISSION CERTIFIED', 'HIPAA MEDICAL COURIER', 'PCI-DSS LEVEL 1', 'ISO 27001']}
        columns={FOOTER_COLS}
        dispatchCenterName="Midtown Dispatch Operations"
        dispatchInfo="Active telemetry over 640 electric cargo vans and 1,200 urban couriers."
      />
    </div>
  );
}

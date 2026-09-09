'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { FleetOneHero } from './FleetOneHero';
import { FleetOneTelematics } from './FleetOneTelematics';
import { FleetOneVehicles } from './FleetOneVehicles';
import { FleetOneDispatch } from './FleetOneDispatch';
import { FleetOneSafety } from './FleetOneSafety';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import styles from './FleetOne.module.css';

interface FleetOneWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Command Center' },
  { id: 'telematics', label: 'Powertrain Telematics' },
  { id: 'vehicles', label: 'Heavy Transport Assets' },
  { id: 'dispatch', label: 'Highway Dispatch' },
  { id: 'safety', label: 'Safety & Compliance' },
];

const METRICS = [
  { value: '840+', label: 'Active Heavy Tractors', detail: 'Class 8 long-haul & heavy haul units' },
  { value: '99.8%', label: 'Interstate Fleet Uptime', detail: 'Preventative maintenance cycle < 15,000 mi' },
  { value: '48 States', label: 'Continental Freight Authority', detail: 'Plus Canadian cross-border FAST certified' },
  { value: '100%', label: 'J1939 CAN-Bus Connected', trend: 'Sub-second real-time telemetry stream' },
];

const FOOTER_COLS = [
  {
    title: 'Fleet Categories',
    links: [
      { label: 'Class 8 Aerodynamic Sleepers', href: '#vehicles' },
      { label: '53ft Multi-Temp Reefers', href: '#vehicles' },
      { label: '55-Ton RGN Lowboys', href: '#vehicles' },
      { label: 'DOT-407 HazMat Tankers', href: '#vehicles' },
      { label: 'Port Drayage Intermodal', href: '#vehicles' },
    ],
  },
  {
    title: 'Corridors & Depots',
    links: [
      { label: 'I-80 Midwest High-Velocity', href: '#dispatch' },
      { label: 'I-10 Gulf-to-Pacific', href: '#dispatch' },
      { label: 'I-95 Atlantic Coast Spine', href: '#dispatch' },
      { label: 'Dallas-Fort Worth Master Terminal', href: '#dispatch' },
    ],
  },
];

export function FleetOneWebsite({
  template,
  initialPage = 'home',
}: FleetOneWebsiteProps) {
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
    <div className={styles.fleetoneRoot}>
      {/* Navigation */}
      <TemplateHeader
        brandName="FLEETONE"
        tagline="Heavy Asset Telematics & Transport"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Dispatch Unit"
        onCtaClick={() => scrollToSection('dispatch')}
      />

      {/* Hero */}
      <FleetOneHero
        onTelematicsClick={() => scrollToSection('telematics')}
        onDispatchClick={() => scrollToSection('dispatch')}
      />

      {/* Industrial Metrics */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent)" />
      </div>

      {/* Powertrain Diagnostics */}
      <FleetOneTelematics />

      {/* Vehicle Asset Categories */}
      <FleetOneVehicles />

      {/* Automated Highway Dispatch */}
      <FleetOneDispatch />

      {/* Safety & Compliance */}
      <FleetOneSafety />

      {/* Enterprise CTA */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--tmpl-bg), #07080c)',
          borderTop: '2px solid var(--tmpl-border)',
          padding: 'clamp(4rem, 8vw, 6rem) 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className={styles.eyebrow}>
            <ShieldCheck size={14} />
            FLEET CONTRACTING &amp; CAPACITY
          </div>
          <h2 className={styles.sectionTitle}>
            Secure Dedicated Commercial Fleet Capacity
          </h2>
          <p className={styles.sectionSubtitle}>
            Partner with FleetOne for dedicated tractor-trailer capacity, guaranteed driver availability, and real-time API telematics integration into your enterprise ERP.
          </p>
          <button
            type="button"
            className={styles.btnHazard}
            onClick={() => scrollToSection('dispatch')}
            style={{ maxWidth: '340px' }}
          >
            Request Fleet Allocation
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <TemplateFooter
        brandName="FLEETONE"
        description="FleetOne Commercial Transport & Telematics operates over 840 Class 8 power units and specialized trailers engineered for industrial supply chains across North America."
        certifications={['FMCSA APEX SAFETY', 'C-TPAT HIGHWAY TIER 3', 'SMARTWAY EXCELLENCE', 'FAST CERTIFIED']}
        columns={FOOTER_COLS}
        dispatchCenterName="Dallas-Fort Worth Command Depot"
        dispatchInfo="Live telemetry feeds active across 840 interstate tractors and 1,600 specialized trailers."
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { ShipFlowHero } from './ShipFlowHero';
import { ShipFlowSchedules } from './ShipFlowSchedules';
import { ShipFlowPortStatus } from './ShipFlowPortStatus';
import { ShipFlowContainers } from './ShipFlowContainers';
import { ShipFlowSustainability } from './ShipFlowSustainability';
import { ArrowRight, Anchor } from 'lucide-react';
import styles from './ShipFlow.module.css';

interface ShipFlowWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Nordic Portal' },
  { id: 'schedules', label: 'Sailing Schedules' },
  { id: 'ports', label: 'Port Congestion' },
  { id: 'containers', label: 'Container Fleet' },
  { id: 'sustainability', label: 'Decarbonization' },
];

const METRICS = [
  { value: '164 Vessels', label: 'Active Container Liners', detail: 'Ultra-Large Container Vessels up to 24,000 TEU' },
  { value: '98.6%', label: 'Schedule Reliability Index', detail: 'Consistent port arrival on published day' },
  { value: '2.8 Hours', label: 'Average Berth Waiting Time', detail: 'Priority green docking at alliance terminals' },
  { value: '-28% CO2', label: 'Lifecycle Emissions Reduced', trend: 'Bio-methanol dual-fuel propulsion' },
];

const FOOTER_COLS = [
  {
    title: 'Liner Services',
    links: [
      { label: 'Asia - North Europe Loops', href: '#schedules' },
      { label: 'Trans-Pacific Pearl Route', href: '#schedules' },
      { label: 'Trans-Atlantic Direct West', href: '#schedules' },
      { label: 'Intra-Europe Feeder Network', href: '#schedules' },
    ],
  },
  {
    title: 'Container Equipment',
    links: [
      { label: '20ft Standard Dry', href: '#containers' },
      { label: '40ft High Cube Dry', href: '#containers' },
      { label: '40ft Controlled Atmosphere Reefer', href: '#containers' },
      { label: '40ft Out-of-Gauge Flat Rack', href: '#containers' },
    ],
  },
];

export function ShipFlowWebsite({
  template,
  initialPage = 'home',
}: ShipFlowWebsiteProps) {
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
    <div className={styles.shipflowRoot}>
      {/* Navigation */}
      <TemplateHeader
        brandName="SHIPFLOW"
        tagline="Nordic Maritime & Ocean Lines"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Book Container Slot"
        onCtaClick={() => scrollToSection('schedules')}
      />

      {/* Hero */}
      <ShipFlowHero
        onSchedulesClick={() => scrollToSection('schedules')}
        onContainersClick={() => scrollToSection('containers')}
      />

      {/* Ocean Shipping Metrics */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent-secondary)" />
      </div>

      {/* Sailing Schedules Table */}
      <ShipFlowSchedules />

      {/* Port Turnaround Radar */}
      <ShipFlowPortStatus />

      {/* Container Equipment */}
      <ShipFlowContainers />

      {/* Green Decarbonization */}
      <ShipFlowSustainability />

      {/* Institutional CTA */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--tmpl-bg), #05080f)',
          borderTop: '1px solid var(--tmpl-border-light)',
          padding: 'clamp(4rem, 8vw, 6rem) 1.25rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div className={styles.eyebrow}>
            <Anchor size={14} />
            OCEAN CARRIER CONTRACTS
          </div>
          <h2 className={styles.sectionTitle}>
            Reserve Guaranteed Ocean Container Slots
          </h2>
          <p className={styles.sectionSubtitle}>
            Partner with ShipFlow for transparent demurrage terms, direct terminal gate reservation, and sustainable bio-fuel container transit.
          </p>
          <button
            type="button"
            className={styles.btnNordic}
            onClick={() => scrollToSection('schedules')}
            style={{ maxWidth: '340px' }}
          >
            Access Sailing Schedule Booking
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Maritime Footer */}
      <TemplateFooter
        brandName="SHIPFLOW"
        description="ShipFlow Nordic Maritime Lines operates 164 modern container vessels across 38 primary trade routes, delivering Scandinavian reliability and environmental leadership."
        certifications={['IMO 2030 CII A-RATED', 'BIMCO MEMBER', 'CLEAN CARGO ALLIANCE', 'ISO 14001']}
        columns={FOOTER_COLS}
        dispatchCenterName="Copenhagen Maritime Operations"
        dispatchInfo="Live AIS satellite monitoring across 164 vessels and 28 alliance deepwater terminals."
      />
    </div>
  );
}

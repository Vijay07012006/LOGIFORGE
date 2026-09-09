'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { PortAxisHero } from './PortAxisHero';
import { PortAxisBerthBoard } from './PortAxisBerthBoard';
import { PortAxisGateTurn } from './PortAxisGateTurn';
import { PortAxisIntermodal } from './PortAxisIntermodal';
import { PortAxisCapacities } from './PortAxisCapacities';
import { ArrowRight, Anchor, ShieldCheck } from 'lucide-react';
import styles from './PortAxis.module.css';

interface PortAxisWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Terminal Overview' },
  { id: 'berth-schedule', label: 'Berth Schedule' },
  { id: 'gate-turnaround', label: 'Gate & PIN Lookup' },
  { id: 'rail-intermodal', label: 'Rail Intermodal' },
  { id: 'infrastructure', label: 'Terminal Specs' },
];

const METRICS = [
  {
    value: '4.2M TEU',
    label: 'Annual Container Throughput',
    detail: 'Moves across 6 deepwater container berths',
  },
  {
    value: '16.5m CD',
    label: 'Natural Deepwater Draft',
    detail: 'Full tide-independent 24,000 TEU accommodation',
  },
  {
    value: '24.2 Mins',
    label: 'Average Gate Turnaround',
    trend: '16 automated optical OCR truck lanes',
  },
  {
    value: '-68% CO₂',
    label: 'On-Dock Rail Carbon Cut',
    detail: 'Direct Class-1 double-stack rail connectivity',
  },
];

const FOOTER_COLS = [
  {
    title: 'Terminal Operations',
    links: [
      { label: 'Deepwater Berth Schedule', href: '#berth-schedule' },
      { label: 'Gate Appointment & PIN', href: '#gate-turnaround' },
      { label: 'On-Dock Class-1 Rail', href: '#rail-intermodal' },
      { label: 'Reefer Yard Monitoring', href: '#infrastructure' },
    ],
  },
  {
    title: 'Maritime Governance',
    links: [
      { label: 'ISPS Level 1 Compliance', href: '#infrastructure' },
      { label: 'Terminal Tariff & Rules', href: '#berth-schedule' },
      { label: 'Vessel Draft Limitations', href: '#infrastructure' },
      { label: 'Hazardous Cargo (IMDG)', href: '#gate-turnaround' },
    ],
  },
];

export function PortAxisWebsite({
  template,
  initialPage = 'home',
}: PortAxisWebsiteProps) {
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
    <div className={styles.portaxisRoot}>
      {/* Top Header */}
      <TemplateHeader
        brandName="PORTAXIS"
        tagline="Deepwater Maritime & Intermodal Terminal"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Access Gate PIN"
        onCtaClick={() => scrollToSection('gate-turnaround')}
      />

      {/* Hero Section */}
      <PortAxisHero
        onExploreBerths={() => scrollToSection('berth-schedule')}
        onGateLookup={() => scrollToSection('gate-turnaround')}
        onIntermodal={() => scrollToSection('rail-intermodal')}
      />

      {/* Throughput Metrics Block */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent)" />
      </div>

      {/* Berth Scheduling Board */}
      <PortAxisBerthBoard />

      {/* Drayage Gate & PIN Lookup */}
      <PortAxisGateTurn />

      {/* Intermodal Rail Timetable */}
      <PortAxisIntermodal />

      {/* Infrastructure Capacities & Specs */}
      <PortAxisCapacities />

      {/* Commercial Call to Action Banner */}
      <section
        className={styles.section}
        style={{
          paddingTop: '2rem',
          paddingBottom: '5rem',
        }}
      >
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(12, 74, 110, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '6px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Anchor size={28} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--tmpl-font-heading)',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#f8fafc',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Schedule Ocean Carrier Berthing or Book Rail Capacity
          </h2>

          <p
            style={{
              fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
              color: 'var(--tmpl-text-muted)',
              maxWidth: '660px',
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Connect with our harbor master and intermodal dispatch team. Direct integration
            with EDI 301, 310, and 315 messaging for real-time bayplan and stowage management.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              marginTop: '0.5rem',
            }}
          >
            <button
              type="button"
              className={styles.btnSteel}
              onClick={() => scrollToSection('gate-turnaround')}
            >
              <span>Driver Pre-Clearance PIN</span>
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className={styles.btnHarbor}
              onClick={() => scrollToSection('berth-schedule')}
            >
              <span>View Terminal Berths</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.8125rem',
              color: 'var(--tmpl-text-muted)',
              marginTop: '0.75rem',
            }}
          >
            <ShieldCheck size={16} color="#38bdf8" />
            <span>Authorized by Federal Maritime Commission & Harbor Commission</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <TemplateFooter
        brandName="PORTAXIS"
        description="PortAxis Deepwater Intermodal Terminal operates 6 container berths and 8 on-dock Class-1 rail tracks handling 4.2M TEU annually with zero-emission electric infrastructure."
        certifications={['ISPS CODE LEVEL 1', 'CBP RADIATION PORTAL COMPLIANT', 'TWIC BIOMETRIC SECURE', 'ISO 14001 ECO-TERMINAL']}
        columns={FOOTER_COLS}
        dispatchCenterName="Harbor Operations & Intermodal Rail Control"
        dispatchInfo="Continuous 24/7/365 vessel traffic radar, gate OCR monitoring, and EDI 315 dispatch messaging."
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { MoveSphereHero } from './MoveSphereHero';
import { MoveSphereContainerTracker } from './MoveSphereContainerTracker';
import { MoveSphereCorridorMap } from './MoveSphereCorridorMap';
import { MoveSphereSmartPack } from './MoveSphereSmartPack';
import { Orbit, ArrowRight, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import styles from './MoveSphere.module.css';

interface MoveSphereWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Grid Overview' },
  { id: 'tracking', label: 'Quantum Telemetry' },
  { id: 'corridors', label: 'Corridors' },
  { id: 'smartpack', label: 'Payload Packager' },
  { id: 'future', label: 'Next-Gen Horizon' },
];

const METRICS = [
  {
    value: '4.8B',
    label: 'Daily Sensor Telemetry Pings',
    detail: 'Continuous mesh telemetry across space, sea and rail',
  },
  {
    value: '100%',
    label: 'Zero-Emission Intermodal Grid',
    detail: 'Autonomous hydrogen & electric maglev propulsion',
  },
  {
    value: '0.001g',
    label: 'Active Inertial Shock Damping',
    trend: 'Magnetic levitation suspension dampeners',
  },
  {
    value: '16 Nodes',
    label: 'Spaceport & Sub-Orbital Gateways',
    detail: 'Direct sub-orbital capsule transfer ready',
  },
];

const FOOTER_COLS = [
  {
    title: 'Autonomous Ecosystem',
    links: [
      { label: 'Quantum Smart Containers', href: '#tracking' },
      { label: 'Maglev Tube Infrastructure', href: '#corridors' },
      { label: 'Sub-Orbital Freight Lanes', href: '#corridors' },
      { label: 'High-Consequence Payloads', href: '#smartpack' },
    ],
  },
  {
    title: 'Standards & Protocols',
    links: [
      { label: 'Zero-Emission Transport Accord', href: '#future' },
      { label: 'Quantum Cryptographic Verification', href: '#tracking' },
      { label: 'Orbital Freight Safety Standards', href: '#corridors' },
      { label: 'Autonomous AI Navigation Trust', href: '#home' },
    ],
  },
];

export function MoveSphereWebsite({
  template,
  initialTracking,
  initialPage = 'home',
}: MoveSphereWebsiteProps) {
  const [activeSection, setActiveSection] = useState(initialPage);
  const [currentTracking, setCurrentTracking] = useState(initialTracking || 'MS-9900-QUANTUM');

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

      if (data.type === 'INJECT_TRACKING_QUERY' && typeof data.trackingNumber === 'string') {
        setCurrentTracking(data.trackingNumber);
        scrollToSection('tracking');
      }

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
    <div className={styles.movesphereRoot}>
      <TemplateHeader
        brandName="MOVESPHERE"
        tagline="Futuristic Intermodal Logistics & Smart Cargo Ecosystems"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Connect To Grid"
        onCtaClick={() => scrollToSection('tracking')}
      />

      <main>
        <div id="home">
          <MoveSphereHero
            onTrackContainer={() => scrollToSection('tracking')}
            onExploreCorridors={() => scrollToSection('corridors')}
            onSmartPack={() => scrollToSection('smartpack')}
          />
        </div>

        <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <StatMetricBlock
            metrics={METRICS}
            accentColor="#14b8a6"
          />
        </div>

        <MoveSphereContainerTracker initialUuid={currentTracking} />

        <MoveSphereCorridorMap />

        <MoveSphereSmartPack />

        {/* Next-Gen Vision Section */}
        <section id="future" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <Sparkles size={14} />
              <span>NEXT-GEN HORIZON</span>
            </div>
            <h2 className={styles.sectionTitle}>Built for Autonomous Global Consortia</h2>
            <p className={styles.sectionSubtitle}>
              MoveSphere provides the cyber-physical foundation for un-crewed oceanic vessels, high-speed pneumatic tubes, and orbital cargo staging.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#0a121e', border: '1px solid var(--tmpl-border-subtle)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ color: '#2dd4bf', marginBottom: '1rem' }}>
                <Orbit size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Autonomous Ocean Freight
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Fully automated, zero-emission hydrogen container vessels guided by multi-spectrum satellite radar and artificial intelligence.
              </p>
            </div>

            <div style={{ background: '#0a121e', border: '1px solid var(--tmpl-border-subtle)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ color: '#2dd4bf', marginBottom: '1rem' }}>
                <Compass size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Pneumatic Tube Routing
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Low-pressure vacuum maglev tube conduits moving high-density pallets between continental distribution centers at near-sonic velocities.
              </p>
            </div>

            <div style={{ background: '#0a121e', border: '1px solid var(--tmpl-border-subtle)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ color: '#2dd4bf', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Smart Container Vaults
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Cryogenic nitrogen-shielded containers providing uninterrupted microclimates and sub-millig shock protection for mission-critical cargo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{ background: '#010307', borderTop: '1px solid var(--tmpl-border)', borderBottom: '1px solid var(--tmpl-border)', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              Join the Autonomous MoveSphere Grid
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Integrate your smart telemetry containers and autonomous transport corridors with the MoveSphere cyber-physical logistics engine.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollToSection('tracking')}
            >
              <span>Connect Sensor Beacon</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <TemplateFooter
        brandName="MOVESPHERE"
        description="MoveSphere is the futuristic intermodal transport grid orchestrating autonomous container ships, electric maglev corridors, and smart telemetry containers."
        certifications={['ZERO EMISSION ACCORD', 'QUANTUM ENCRYPTED', 'ORBITAL SAFETY CERTIFIED', 'AUTONOMOUS AI COMPLIANT']}
        columns={FOOTER_COLS}
        dispatchCenterName="Autonomous Cyber-Physical Grid Control"
        dispatchInfo="24/7 global sensor mesh synchronization, satellite telemetry relays, and cryogenic atmospheric verification."
      />
    </div>
  );
}

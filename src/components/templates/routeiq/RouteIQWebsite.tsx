'use client';

import React, { useState, useEffect } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { RouteIQHero } from './RouteIQHero';
import { RouteIQSimTracker } from './RouteIQSimTracker';
import { RouteIQTspSimulator } from './RouteIQTspSimulator';
import { RouteIQTelemetryFeed } from './RouteIQTelemetryFeed';
import { ArrowRight, Terminal } from 'lucide-react';
import styles from './RouteIQ.module.css';

interface RouteIQWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Engine Overview' },
  { id: 'tracking', label: 'Dispatch Simulation' },
  { id: 'solver', label: 'TSP Solver' },
  { id: 'telemetry', label: 'CAN-Bus Feed' },
  { id: 'architecture', label: 'API Architecture' },
];

const METRICS = [
  {
    value: '-23.4%',
    label: 'Deadhead Mile Reduction',
    detail: 'Across 12 million simulated fleet miles',
  },
  {
    value: '42 ms',
    label: 'Heuristic Optimization Latency',
    detail: 'Sub-second GPU multi-core TSP solver',
  },
  {
    value: '± 3 Mins',
    label: 'ETA Prediction Variance',
    trend: '98% confidence window accuracy',
  },
  {
    value: '10,000+',
    label: 'Concurrent Fleet Dispatches',
    detail: 'Synchronous cellular IoT telemetry ingestion',
  },
];

const FOOTER_COLS = [
  {
    title: 'Algorithmic Modules',
    links: [
      { label: 'Multi-Stop TSP Solver', href: '#solver' },
      { label: 'CAN-Bus Vehicle Telematics', href: '#telemetry' },
      { label: 'Predictive ETA Engine', href: '#tracking' },
      { label: 'Weigh Station Avoidance', href: '#tracking' },
    ],
  },
  {
    title: 'Developer Platform',
    links: [
      { label: 'RESTful Dispatch API', href: '#architecture' },
      { label: 'GraphQL Fleet Stream', href: '#architecture' },
      { label: 'SOC 2 Security Attestation', href: '#architecture' },
      { label: 'Open Logistics Specifications', href: '#architecture' },
    ],
  },
];

export function RouteIQWebsite({
  template,
  initialTracking,
  initialPage = 'home',
}: RouteIQWebsiteProps) {
  const [activeSection, setActiveSection] = useState(initialPage);
  const [currentTracking, setCurrentTracking] = useState(initialTracking || 'RQ-2048-AI');

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
    <div className={styles.routeiqRoot}>
      <TemplateHeader
        brandName="ROUTEIQ"
        tagline="AI Route Optimization & Telemetry Intelligence"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Integrate Engine"
        onCtaClick={() => scrollToSection('architecture')}
      />

      <main>
        <div id="home">
          <RouteIQHero
            onSimulateRoute={() => scrollToSection('tracking')}
            onTspSolver={() => scrollToSection('solver')}
            onTelemetry={() => scrollToSection('telemetry')}
          />
        </div>

        <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <StatMetricBlock
            metrics={METRICS}
            accentColor="#a855f7"
          />
        </div>

        <RouteIQSimTracker initialKey={currentTracking} />

        <RouteIQTspSimulator />

        <RouteIQTelemetryFeed />

        {/* API Architecture Section */}
        <section id="architecture" className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.eyebrow}>
              <Terminal size={14} />
              <span>DEVELOPER API SPECIFICATION</span>
            </div>
            <h2 className={styles.sectionTitle}>High-Throughput Logistics Algorithms</h2>
            <p className={styles.sectionSubtitle}>
              Directly integrate RouteIQ dispatch heuristics into your proprietary TMS, WMS, or mobile driver applications.
            </p>
          </div>

          <div style={{ background: '#090d1c', border: '1px solid var(--tmpl-border)', borderRadius: '10px', padding: '2rem', maxWidth: '880px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--tmpl-border-subtle)', paddingBottom: '0.75rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '1rem', fontFamily: 'monospace', fontSize: '0.8125rem', color: '#94a3b8' }}>POST /api/v1/dispatch/optimize</span>
            </div>

            <pre style={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: '#c084fc', lineHeight: 1.6, overflowX: 'auto' }}>
{`// RouteIQ GPU Heuristic Execution Request
{
  "fleet_id": "FL-PACIFIC-NODE-04",
  "heuristic_mode": "NEURAL_TSP_CLUSTER",
  "time_window_strict": true,
  "waypoints": 34,
  "battery_reserve_min": 0.20,
  "avoid_weigh_stations": true
}

// 200 OK — Computed in 41.8ms
// Result: 18.4% Deadhead Reduction • 0 Violations`}
            </pre>
          </div>
        </section>

        {/* CTA Banner */}
        <section style={{ background: '#020409', borderTop: '1px solid var(--tmpl-border)', borderBottom: '1px solid var(--tmpl-border)', padding: '4rem 1.25rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#f8fafc', marginBottom: '1rem' }}>
              Deploy RouteIQ Into Your Fleet Network
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Connect your fleet telematics hardware via our real-time WebSocket protocol and experience immediate reduction in empty miles.
            </p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => scrollToSection('architecture')}
            >
              <span>Explore Developer Documentation</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <TemplateFooter
        brandName="ROUTEIQ"
        description="RouteIQ delivers high-throughput algorithmic route optimization, real-time CAN-bus hardware telemetry, and predictive machine-learning dispatch."
        certifications={['SOC 2 CERTIFIED', 'IEEE INTELLIGENT TRANSPORT', 'OPEN LOGISTICS API', 'ISO 27001 AUDITED']}
        columns={FOOTER_COLS}
        dispatchCenterName="Neural Fleet Intelligence Control"
        dispatchInfo="24/7 sub-second route calculation, cellular IoT streaming, and Hours-of-Service safety monitoring."
      />
    </div>
  );
}

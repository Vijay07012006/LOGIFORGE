'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Template } from '@/types/template';
import { TemplateHeader } from '../common/TemplateHeader';
import { TemplateFooter } from '../common/TemplateFooter';
import { StatMetricBlock } from '../common/StatMetricBlock';
import { TrustCertifications } from '../common/TrustCertifications';
import { CargoNovaHero } from './CargoNovaHero';
import { CargoNovaTracking } from './CargoNovaTracking';
import { CargoNovaServices } from './CargoNovaServices';
import { CargoNovaCorridors } from './CargoNovaCorridors';
import { CargoNovaRateCalculator } from './CargoNovaRateCalculator';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './CargoNova.module.css';

interface CargoNovaWebsiteProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Freight Services' },
  { id: 'corridors', label: 'Trade Corridors' },
  { id: 'tracking', label: 'Consignment Tracking' },
  { id: 'quote', label: 'Rates & Booking' },
];

const METRICS = [
  { value: '1.4M+', label: 'TEU Ocean Freight Moved', detail: 'Across 38 global maritime alliances' },
  { value: '99.4%', label: 'Customs Green-Lane Clearance', detail: 'Average dwell time under 4.2 hours' },
  { value: '140+', label: 'Deepwater Port Terminals', detail: 'Direct berths in Asia, Europe & Americas' },
  { value: '24/7', label: 'Satellite Telemetry & AIS', trend: '+18% Fuel Efficiency via Smart Routing' },
];

const FOOTER_COLS = [
  {
    title: 'Freight Solutions',
    links: [
      { label: 'Full Container Load (FCL)', href: '#services' },
      { label: 'Less Than Container Load (LCL)', href: '#services' },
      { label: 'Expedited Air Charter', href: '#services' },
      { label: 'Customs Automated Brokerage', href: '#services' },
      { label: 'Cold-Chain Pharmaceutical', href: '#services' },
    ],
  },
  {
    title: 'Trade Corridors',
    links: [
      { label: 'Trans-Pacific (Shanghai - Long Beach)', href: '#corridors' },
      { label: 'Asia - North Europe (Singapore - Rotterdam)', href: '#corridors' },
      { label: 'Trans-Atlantic (Antwerp - New York)', href: '#corridors' },
      { label: 'Arabian Gulf Airfreight (Dubai - Frankfurt)', href: '#corridors' },
    ],
  },
];

export function CargoNovaWebsite({
  template,
  initialTracking = 'CN-8924-US',
  initialPage = 'home',
}: CargoNovaWebsiteProps) {
  const [activeSection, setActiveSection] = useState(initialPage);
  const [currentTracking, setCurrentTracking] = useState(initialTracking);

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

  // Studio Host bidirectional postMessage communication
  useEffect(() => {
    function handleHostMessage(event: MessageEvent) {
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

    // Announce mount to parent host
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

  const handleSearchPerformed = useCallback((trackingNumber: string, found: boolean) => {
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TRACKING_SEARCH_PERFORMED',
          trackingNumber,
          resultFound: found,
        },
        '*'
      );
    }
  }, []);

  return (
    <div className={styles.cargonovaRoot}>
      {/* Autonomous Navigation */}
      <TemplateHeader
        brandName="CARGONOVA"
        tagline="Global Freight & Maritime"
        navItems={NAV_ITEMS}
        activeId={activeSection}
        onSelectNav={scrollToSection}
        ctaLabel="Get Freight Quote"
        onCtaClick={() => scrollToSection('quote')}
      />

      {/* Hero Section */}
      <CargoNovaHero
        onTrackClick={() => scrollToSection('tracking')}
        onQuoteClick={() => scrollToSection('quote')}
      />

      {/* Operational Metrics Block */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <StatMetricBlock metrics={METRICS} accentColor="var(--tmpl-accent)" />
      </div>

      {/* Specialized Services */}
      <CargoNovaServices />

      {/* High-Volume Trade Corridors */}
      <CargoNovaCorridors />

      {/* Live Consignment Telemetry & Tracking */}
      <CargoNovaTracking
        initialTracking={currentTracking}
        onSearchPerformed={handleSearchPerformed}
      />

      {/* Instant Rate Calculator Simulator */}
      <CargoNovaRateCalculator />

      {/* Regulatory Trust & Certifications */}
      <div className={styles.section} style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <TrustCertifications />
      </div>

      {/* Institutional CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <div className={styles.eyebrow}>
            <ShieldCheck size={14} />
            ENTERPRISE CONTRACTS
          </div>
          <h2 className={styles.sectionTitle}>
            Ready to Transition Your Supply Chain to Guaranteed Corridors?
          </h2>
          <p className={styles.sectionSubtitle}>
            Connect with our trade lane directors for sovereign customs advisory, volume tariff commitments, and dedicated terminal space allocation.
          </p>
          <button
            type="button"
            className={styles.btnGold}
            onClick={() => scrollToSection('quote')}
            style={{ maxWidth: '320px' }}
          >
            Initiate Corporate Freight Inquiry
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Global Freight Footer */}
      <TemplateFooter
        brandName="CARGONOVA"
        description="CargoNova International Logistics is a Tier-1 multimodal freight forwarder and licensed customs brokerage orchestrating maritime, air, and intermodal corridors across 140+ global terminals."
        certifications={['AEO-F ACCREDITED', 'IATA CARGO AGENT', 'FIATA MEMBER', 'C-TPAT TIER 3']}
        columns={FOOTER_COLS}
        dispatchCenterName="Singapore Maritime Command"
        dispatchInfo="Coordinating 142 container vessels, 28 air charters, and 4 foreign trade zones."
      />
    </div>
  );
}

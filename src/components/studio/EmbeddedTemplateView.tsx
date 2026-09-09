'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Template, SimulatedShipment } from '@/types/template';
import { lookupSimulatedShipment } from '@/lib/tracking';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  Globe2,
  TrendingUp,
  Award,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import styles from './EmbeddedTemplateView.module.css';

interface EmbeddedTemplateViewProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

export function EmbeddedTemplateView({
  template,
  initialTracking,
  initialPage = 'home',
}: EmbeddedTemplateViewProps) {
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>(
    initialTracking || template.sections.tracking.sampleTrackingNumbers[0] || 'CN-8924-US'
  );
  const [trackingInput, setTrackingInput] = useState<string>(activeTrackingNumber);
  const [shipment, setShipment] = useState<SimulatedShipment | null>(() =>
    lookupSimulatedShipment(activeTrackingNumber)
  );
  const [activePage, setActivePage] = useState<string>(initialPage);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Synchronize shipment when activeTrackingNumber changes
  const executeSearch = useCallback((query: string) => {
    const trimmed = query.trim().toUpperCase();
    setActiveTrackingNumber(trimmed);
    const result = lookupSimulatedShipment(trimmed);
    setShipment(result);

    // Notify parent frame
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TRACKING_SEARCH_PERFORMED',
          trackingNumber: trimmed,
          resultFound: !!result,
        },
        '*'
      );
    }
  }, []);

  // Bidirectional postMessage listener from parent studio host
  useEffect(() => {
    function handleHostMessage(event: MessageEvent) {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'INJECT_TRACKING_QUERY' && typeof data.trackingNumber === 'string') {
        setTrackingInput(data.trackingNumber);
        executeSearch(data.trackingNumber);
      }

      if (data.type === 'NAVIGATE_TEMPLATE_PAGE' && typeof data.pageSlug === 'string') {
        setActivePage(data.pageSlug);
        const sectionEl = document.getElementById(data.pageSlug);
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: 'smooth' });
        }
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
          currentRoute: activePage,
        },
        '*'
      );
    }

    return () => window.removeEventListener('message', handleHostMessage);
  }, [template.slug, template.name, activePage, executeSearch]);

  const handlePageSelect = (pageSlug: string) => {
    setActivePage(pageSlug);
    setMobileMenuOpen(false);

    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'TEMPLATE_PAGE_CHANGED',
          pageSlug,
        },
        '*'
      );
    }

    const sectionEl = document.getElementById(pageSlug);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={styles.embedContainer}
      style={
        {
          '--tmpl-accent': template.theme.primaryAccent,
          '--tmpl-accent-secondary': template.theme.secondaryAccent,
          '--tmpl-bg': template.theme.backgroundColor,
          '--tmpl-surface': template.theme.surfaceColor,
          '--tmpl-text': template.theme.textColor,
          '--tmpl-radius': template.theme.borderRadius,
        } as React.CSSProperties
      }
    >
      {/* Template Autonomous Header */}
      <header className={styles.templateNav}>
        <div className={styles.navInner}>
          <div className={styles.brandTitle}>
            <span className={styles.brandDot} />
            <span className={styles.brandName}>{template.name}</span>
            <span className={styles.brandTagline}>{template.tagline}</span>
          </div>

          <nav className={styles.navLinks}>
            <button
              onClick={() => handlePageSelect('home')}
              className={`${styles.navLink} ${activePage === 'home' ? styles.navLinkActive : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handlePageSelect('services')}
              className={`${styles.navLink} ${activePage === 'services' ? styles.navLinkActive : ''}`}
            >
              Services
            </button>
            <button
              onClick={() => handlePageSelect('tracking')}
              className={`${styles.navLink} ${activePage === 'tracking' ? styles.navLinkActive : ''}`}
            >
              Tracking
            </button>
            {template.sections.globalNetwork && (
              <button
                onClick={() => handlePageSelect('network')}
                className={`${styles.navLink} ${activePage === 'network' ? styles.navLinkActive : ''}`}
              >
                Network
              </button>
            )}
            <a href="#contact" className={styles.navCta}>
              Book Transport
            </a>
          </nav>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={styles.mobileToggle}
            aria-label="Toggle Template Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileDrawer}>
            <button
              onClick={() => handlePageSelect('home')}
              className={`${styles.mobileLink} ${activePage === 'home' ? styles.mobileLinkActive : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handlePageSelect('services')}
              className={`${styles.mobileLink} ${activePage === 'services' ? styles.mobileLinkActive : ''}`}
            >
              Services
            </button>
            <button
              onClick={() => handlePageSelect('tracking')}
              className={`${styles.mobileLink} ${activePage === 'tracking' ? styles.mobileLinkActive : ''}`}
            >
              Tracking
            </button>
            {template.sections.globalNetwork && (
              <button
                onClick={() => handlePageSelect('network')}
                className={`${styles.mobileLink} ${activePage === 'network' ? styles.mobileLinkActive : ''}`}
              >
                Network
              </button>
            )}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className={styles.mobileCta}
            >
              Book Transport
            </a>
          </div>
        )}
      </header>

      {/* Template Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Badge variant="outline" size="sm">
              {template.industry} • {template.style.toUpperCase()}
            </Badge>
          </div>
          <h1 className={styles.headline}>{template.sections.hero.headline}</h1>
          <p className={styles.subheadline}>{template.sections.hero.subheadline}</p>

          <div className={styles.heroButtons}>
            <button
              onClick={() => handlePageSelect('tracking')}
              className={styles.btnPrimary}
            >
              {template.sections.hero.ctaPrimary.label}
            </button>
            {template.sections.hero.ctaSecondary && (
              <button
                onClick={() => handlePageSelect('services')}
                className={styles.btnSecondary}
              >
                {template.sections.hero.ctaSecondary.label}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Simulated Consignment Tracking Section */}
      <section id="tracking" className={styles.trackingSection}>
        <div className={styles.sectionInner}>
          <div className={styles.trackingHeader}>
            <span className={styles.simDisclaimer}>
              [ SIMULATED DEMO TRACKING — LOGIFORGE ENGINE ]
            </span>
            <h2 className={styles.trackingTitle}>{template.sections.tracking.title}</h2>
            <p className={styles.trackingDesc}>{template.sections.tracking.description}</p>

            {/* In-Frame Interactive Waybill Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeSearch(trackingInput);
              }}
              className={styles.trackingForm}
            >
              <div className={styles.inputWrapper}>
                <Search size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Enter Waybill (e.g. CN-8924-US, FO-4091-TX)"
                  className={styles.trackingInputField}
                  aria-label="Consignment Waybill Number"
                />
              </div>
              <button type="submit" className={styles.trackingSubmitBtn}>
                Track Shipment
              </button>
            </form>

            {/* Quick Sample Waybill Badges */}
            <div className={styles.sampleTriggers}>
              <span className={styles.sampleLabel}>Try sample waybills:</span>
              <div className={styles.sampleList}>
                {template.sections.tracking.sampleTrackingNumbers.map((no) => (
                  <button
                    key={no}
                    type="button"
                    onClick={() => {
                      setTrackingInput(no);
                      executeSearch(no);
                    }}
                    className={`${styles.sampleBtn} ${activeTrackingNumber === no ? styles.sampleBtnActive : ''}`}
                  >
                    {no}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tracking Result Card */}
          {shipment ? (
            <div className={styles.shipmentCard}>
              <div className={styles.shipmentHead}>
                <div className={styles.shipmentMeta}>
                  <span className={styles.consignmentLabel}>Consignment Identifier</span>
                  <span className={styles.consignmentNo}>{shipment.trackingNumber}</span>
                  {shipment.containerId && (
                    <span className={styles.containerId}>Unit / Container: {shipment.containerId}</span>
                  )}
                </div>
                <div className={styles.shipmentStatus}>
                  <Badge variant="success" size="md">
                    {shipment.currentStatus}
                  </Badge>
                </div>
              </div>

              {/* Route Origin -> Destination */}
              <div className={styles.routeBar}>
                <div className={styles.routePoint}>
                  <span className={styles.pointLabel}>Origin Port / Facility</span>
                  <span className={styles.pointCity}>
                    {shipment.origin.city}, {shipment.origin.country}
                  </span>
                  <code className={styles.pointCode}>{shipment.origin.code}</code>
                </div>
                <div className={styles.routeTransit}>
                  <span className={styles.carrierText}>{shipment.carrier}</span>
                  <div className={styles.transitLine}>
                    <span className={styles.transitDot} />
                    <ArrowRight size={14} className={styles.transitArrow} />
                  </div>
                  <span className={styles.etaText}>Target Arrival: {shipment.eta}</span>
                </div>
                <div className={styles.routePoint}>
                  <span className={styles.pointLabel}>Destination</span>
                  <span className={styles.pointCity}>
                    {shipment.destination.city}, {shipment.destination.country}
                  </span>
                  <code className={styles.pointCode}>{shipment.destination.code}</code>
                </div>
              </div>

              {/* Milestones Progress Timeline */}
              <div className={styles.timeline}>
                <h3 className={styles.timelineTitle}>Verified Transit Milestones</h3>
                <div className={styles.milestoneList}>
                  {shipment.milestones.map((m, idx) => (
                    <div key={m.id} className={styles.milestoneRow}>
                      <div className={styles.milestoneIndicator}>
                        {m.status === 'completed' ? (
                          <CheckCircle2 size={18} className={styles.iconDone} />
                        ) : m.status === 'in-transit' ? (
                          <Clock size={18} className={styles.iconActive} />
                        ) : (
                          <span className={styles.iconPending} />
                        )}
                        {idx < shipment.milestones.length - 1 && (
                          <div className={styles.milestoneConnector} />
                        )}
                      </div>
                      <div className={styles.milestoneContent}>
                        <div className={styles.mHead}>
                          <span className={styles.mLocation}>
                            {m.location} ({m.facility})
                          </span>
                          <span className={styles.mTime}>{m.timestamp}</span>
                        </div>
                        <p className={styles.mDesc}>{m.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.shipmentNotFound}>
              <AlertCircle size={24} />
              <div>
                <strong>Waybill {activeTrackingNumber} Not Found in Demo Registry</strong>
                <p>
                  Try selecting a verified sample waybill above such as {template.sections.tracking.sampleTrackingNumbers.join(', ')}.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Template Services Matrix */}
      <section id="services" className={styles.servicesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.servicesHeader}>
            <h2 className={styles.servicesTitle}>{template.sections.services.title}</h2>
            <p className={styles.servicesSubtitle}>{template.sections.services.subtitle}</p>
          </div>

          <div className={styles.serviceCards}>
            {template.sections.services.items.map((srv) => (
              <div key={srv.id} className={styles.serviceCard}>
                <div className={styles.srvIconWrap}>
                  <Award size={20} className={styles.srvIcon} />
                </div>
                <h3 className={styles.srvTitle}>{srv.title}</h3>
                <p className={styles.srvDesc}>{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Network Section (if available) */}
      {template.sections.globalNetwork && (
        <section id="network" className={styles.networkSection}>
          <div className={styles.sectionInner}>
            <div className={styles.networkHeader}>
              <div className={styles.networkBadge}>
                <Globe2 size={16} />
                <span>Global Transit Corridors</span>
              </div>
              <h2 className={styles.networkTitle}>International Transit Infrastructure</h2>
              <p className={styles.networkSubtitle}>
                Operating across {template.sections.globalNetwork.hubCount} intermodal gateways and {template.sections.globalNetwork.countriesServed} sovereign customs jurisdictions.
              </p>
            </div>

            <div className={styles.corridorGrid}>
              {template.sections.globalNetwork.featuredRoutes.map((route, idx) => (
                <div key={idx} className={styles.corridorCard}>
                  <div className={styles.corridorMode}>
                    <Badge variant="outline" size="sm">
                      {route.mode}
                    </Badge>
                    <span className={styles.corridorDays}>{route.transitDays}</span>
                  </div>
                  <div className={styles.corridorEndpoints}>
                    <span className={styles.corridorOrigin}>{route.origin}</span>
                    <ArrowRight size={14} className={styles.corridorArrow} />
                    <span className={styles.corridorDest}>{route.destination}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Statistics Section (if available) */}
      {template.sections.statistics && (
        <section className={styles.statsSection}>
          <div className={styles.sectionInner}>
            <div className={styles.statsGrid}>
              {template.sections.statistics.metrics.map((metric, idx) => (
                <div key={idx} className={styles.statCard}>
                  <div className={styles.statIconWrap}>
                    <TrendingUp size={18} className={styles.statIcon} />
                  </div>
                  <span className={styles.statValue}>{metric.value}</span>
                  <span className={styles.statLabel}>{metric.label}</span>
                  {metric.detail && <span className={styles.statDetail}>{metric.detail}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section id="contact" className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaHeadline}>{template.sections.cta.headline}</h2>
            <p className={styles.ctaSubline}>{template.sections.cta.subline}</p>
            <a href="#tracking" className={styles.ctaButton}>
              {template.sections.cta.buttonText}
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Autonomous Template Footer */}
      <footer className={styles.templateFooter}>
        <div className={styles.sectionInner}>
          <div className={styles.footerRow}>
            <span className={styles.copyright}>{template.sections.footer.copyright}</span>
            <div className={styles.complianceList}>
              {template.sections.footer.complianceBadges.map((badge) => (
                <span key={badge} className={styles.complianceBadge}>
                  <ShieldCheck size={14} />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

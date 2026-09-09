import React from 'react';
import { notFound } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { lookupSimulatedShipment } from '@/lib/tracking';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './embed.module.css';

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tracking?: string }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export default async function TemplateEmbedPage({ params, searchParams }: EmbedPageProps) {
  const { slug } = await params;
  const { tracking } = await searchParams;

  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const trackingQuery = tracking || template.sections.tracking.sampleTrackingNumbers[0] || 'CN-8924-US';
  const shipment = lookupSimulatedShipment(trackingQuery);

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
          </div>
          <nav className={styles.navLinks}>
            <a href="#services" className={styles.navLink}>Services</a>
            <a href="#tracking" className={styles.navLink}>Tracking</a>
            <a href="#network" className={styles.navLink}>Network</a>
            <a href="#contact" className={styles.navCta}>Book Transport</a>
          </nav>
        </div>
      </header>

      {/* Template Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <Badge variant="outline" size="sm">
              {template.industry}
            </Badge>
          </div>
          <h1 className={styles.headline}>{template.sections.hero.headline}</h1>
          <p className={styles.subheadline}>{template.sections.hero.subheadline}</p>

          <div className={styles.heroButtons}>
            <a href={template.sections.hero.ctaPrimary.href} className={styles.btnPrimary}>
              {template.sections.hero.ctaPrimary.label}
            </a>
            {template.sections.hero.ctaSecondary && (
              <a href={template.sections.hero.ctaSecondary.href} className={styles.btnSecondary}>
                {template.sections.hero.ctaSecondary.label}
              </a>
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
          </div>

          {/* Tracking Result Card */}
          {shipment ? (
            <div className={styles.shipmentCard}>
              <div className={styles.shipmentHead}>
                <div className={styles.shipmentMeta}>
                  <span className={styles.consignmentLabel}>Consignment Identifier</span>
                  <span className={styles.consignmentNo}>{shipment.trackingNumber}</span>
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
                  <span className={styles.pointLabel}>Origin Port</span>
                  <span className={styles.pointCity}>{shipment.origin.city}, {shipment.origin.country}</span>
                  <code className={styles.pointCode}>{shipment.origin.code}</code>
                </div>
                <div className={styles.routeTransit}>
                  <span className={styles.carrierText}>{shipment.carrier}</span>
                  <div className={styles.transitLine}>
                    <span className={styles.transitDot} />
                    <ArrowRight size={14} className={styles.transitArrow} />
                  </div>
                  <span className={styles.etaText}>Estimated Arrival: {shipment.eta}</span>
                </div>
                <div className={styles.routePoint}>
                  <span className={styles.pointLabel}>Destination</span>
                  <span className={styles.pointCity}>{shipment.destination.city}, {shipment.destination.country}</span>
                  <code className={styles.pointCode}>{shipment.destination.code}</code>
                </div>
              </div>

              {/* Milestones Progress Timeline */}
              <div className={styles.timeline}>
                <h3 className={styles.timelineTitle}>Transit Milestone Audit</h3>
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
                        {idx < shipment.milestones.length - 1 && <div className={styles.milestoneConnector} />}
                      </div>
                      <div className={styles.milestoneContent}>
                        <div className={styles.mHead}>
                          <span className={styles.mLocation}>{m.location} ({m.facility})</span>
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
              <span>Waybill {trackingQuery} not found in sample database. Try CN-8924-US, FO-4091-TX, or SD-4421-EU.</span>
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
                <h3 className={styles.srvTitle}>{srv.title}</h3>
                <p className={styles.srvDesc}>{srv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Footer */}
      <footer className={styles.templateFooter}>
        <div className={styles.sectionInner}>
          <div className={styles.footerRow}>
            <span>{template.sections.footer.copyright}</span>
            <div className={styles.complianceList}>
              {template.sections.footer.complianceBadges.map((badge) => (
                <span key={badge} className={styles.complianceBadge}>
                  <ShieldCheck size={12} />
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

'use client';

import React from 'react';
import { ShieldCheck, ArrowRight, Globe, BarChart3 } from 'lucide-react';
import styles from './SupplyCore.module.css';

interface SupplyCoreHeroProps {
  onAuditLine?: () => void;
  onExploreRisk?: () => void;
  onScope3Calc?: () => void;
}

export const SupplyCoreHero: React.FC<SupplyCoreHeroProps> = ({
  onAuditLine,
  onExploreRisk,
  onScope3Calc,
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.resilienceTicker}>
          <span className={styles.pulseDot} />
          <span>ENTERPRISE RESILIENCE RADAR: 4,200+ AUDITED VENDORS</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>&lt; 6 HR DISRUPTION RECOVERY</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>TIER-3 PROVENANCE ASSURED</span>
        </div>

        <div className={styles.eyebrow}>
          <ShieldCheck size={14} />
          <span>GLOBAL SUPPLY CHAIN RESILIENCE</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Enterprise Architecture for <br />
          <span className={styles.heroHeadlineAccent}>Mission-Critical Supply Networks</span>
        </h1>

        <p className={styles.heroLead}>
          Proactive geopolitical disruption insulation, automated multi-tier procurement audits,
          and ISO 14064 verified Scope-3 carbon accounting for multinational corporations.
        </p>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onAuditLine}
          >
            <span>Audit Supply Line Provenance</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onExploreRisk}
          >
            <Globe size={18} />
            <span>Supplier Risk Heatmap</span>
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onScope3Calc}
          >
            <BarChart3 size={18} />
            <span>Scope-3 Emissions Calculator</span>
          </button>
        </div>

        <div className={styles.heroMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>&lt; 6 Hrs</div>
            <div className={styles.metricLbl}>Disruption Recovery Time</div>
            <div className={styles.metricSub}>Automated secondary vendor failover</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>4,200+</div>
            <div className={styles.metricLbl}>Audited Tier-1 Suppliers</div>
            <div className={styles.metricSub}>Across 68 sovereign jurisdictions</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>100%</div>
            <div className={styles.metricLbl}>Scope-3 Auditability</div>
            <div className={styles.metricSub}>GLEC Framework aligned accounting</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>99.98%</div>
            <div className={styles.metricLbl}>Contract Compliance</div>
            <div className={styles.metricSub}>Automated SLA penalty attribution</div>
          </div>
        </div>
      </div>
    </section>
  );
};

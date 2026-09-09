'use client';

import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import styles from './SupplyCore.module.css';

interface RegionRisk {
  region: string;
  riskLevel: 'low' | 'medium' | 'high';
  indexScore: number;
  activeDisruptions: string;
  mitigationProtocol: string;
  supplierCount: number;
}

const REGIONS: RegionRisk[] = [
  {
    region: 'North America (USMCA Pacific Rim)',
    riskLevel: 'low',
    indexScore: 18,
    activeDisruptions: 'Stable rail intermodal transit; low port congestion at LA/Long Beach',
    mitigationProtocol: 'Standard primary carrier allocation',
    supplierCount: 1420,
  },
  {
    region: 'Western & Northern Europe',
    riskLevel: 'low',
    indexScore: 22,
    activeDisruptions: 'Rhine waterway barge levels normal; energy grid steady',
    mitigationProtocol: 'Multi-modal road and inland rail routing',
    supplierCount: 1150,
  },
  {
    region: 'East Asia (Taiwan Strait & East China Sea)',
    riskLevel: 'medium',
    indexScore: 54,
    activeDisruptions: 'Typhoon season maritime draft advisories; airspace routing alerts',
    mitigationProtocol: 'Air charter secondary routing via Anchorage & Incheon',
    supplierCount: 890,
  },
  {
    region: 'Southeast Asia (Malacca Strait Corridor)',
    riskLevel: 'medium',
    indexScore: 42,
    activeDisruptions: 'Chokepoint transit delays; bunker fuel surcharge variance',
    mitigationProtocol: 'Feeder loop diversion via Port of Tanjung Pelepas',
    supplierCount: 460,
  },
  {
    region: 'Red Sea & Bab-el-Mandeb Strait',
    riskLevel: 'high',
    indexScore: 88,
    activeDisruptions: 'Maritime security exclusion zone; Cape of Good Hope rerouting (+12 days)',
    mitigationProtocol: 'Mandatory trans-Africa circumnavigation with fuel hedge buffer',
    supplierCount: 180,
  },
  {
    region: 'Eastern Mediterranean & Black Sea',
    riskLevel: 'high',
    indexScore: 82,
    activeDisruptions: 'War-risk insurance premiums elevated; grain and mineral corridors constricted',
    mitigationProtocol: 'Overland intermodal rail diversion via Poland and Germany',
    supplierCount: 100,
  },
];

export const SupplyCoreRiskHeatmap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionRisk>(REGIONS[0]);

  return (
    <section id="risk" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Globe size={14} />
          <span>GEOPOLITICAL & WEATHER RADAR</span>
        </div>
        <h2 className={styles.sectionTitle}>Multi-Tier Global Supplier Risk Heatmap</h2>
        <p className={styles.sectionSubtitle}>
          Real-time composite risk scores combining maritime chokepoints, trade tariff adjustments,
          extreme weather anomalies, and labor actions.
        </p>
      </div>

      <div className={styles.heatmapGrid}>
        {REGIONS.map((reg, idx) => {
          let scoreClass = styles.riskScoreLow;
          if (reg.riskLevel === 'medium') scoreClass = styles.riskScoreMedium;
          if (reg.riskLevel === 'high') scoreClass = styles.riskScoreHigh;

          const isSelected = selectedRegion.region === reg.region;

          return (
            <div
              key={idx}
              className={styles.riskCard}
              style={{
                outline: isSelected ? '2px solid #6366f1' : 'none',
                background: isSelected ? '#151d38' : undefined,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedRegion(reg)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{reg.supplierCount} AUDITED NODES</span>
                <span
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                  className={scoreClass}
                >
                  RISK INDEX: {reg.indexScore}/100
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                {reg.region}
              </h3>

              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                {reg.activeDisruptions}
              </p>

              <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600 }}>
                Protocol: {reg.mitigationProtocol}
              </div>
            </div>
          );
        })}
      </div>

      {selectedRegion && (
        <div style={{ marginTop: '1.5rem', background: '#0b1022', border: '1px solid var(--tmpl-border)', borderRadius: '8px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#818cf8', textTransform: 'uppercase', fontWeight: 700 }}>EXECUTIVE DISRUPTION ADVISORY</div>
            <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
              {selectedRegion.region}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {selectedRegion.activeDisruptions}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>FAILOVER LATENCY</div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.125rem' }}>&lt; 4 Hours Guaranteed</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

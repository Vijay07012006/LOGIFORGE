'use client';

import React from 'react';
import { Leaf } from 'lucide-react';
import styles from './ShipFlow.module.css';

const GREEN_METRICS = [
  {
    title: 'Dual-Fuel Bio-Methanol',
    val: '18% Fleet',
    desc: 'Ultra-low lifecycle carbon emission propulsion on primary Trans-Pacific trade lanes.',
  },
  {
    title: 'Zero-Emission Port Cold-Ironing',
    val: '100% Berths',
    desc: 'Auxiliary diesel engines shut down completely at quay; powered by shore renewable microgrids.',
  },
  {
    title: 'IMO 2030 Carbon Intensity (CII)',
    val: 'A-Rating',
    desc: 'Surpassing International Maritime Organization energy efficiency targets by 28% across 164 vessels.',
  },
  {
    title: 'Silicone Air-Lubricated Hulls',
    val: '-8.4% Drag',
    desc: 'Micro-bubble hull air lubrication reducing hydrodynamic friction and fuel burn in open ocean.',
  },
];

export function ShipFlowSustainability() {
  return (
    <div className={styles.section} id="sustainability">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Leaf size={14} />
          MARITIME DECARBONIZATION
        </div>
        <h2 className={styles.sectionTitle}>Sailing Towards Zero-Emission Ocean Freight</h2>
        <p className={styles.sectionSubtitle}>
          Pioneering Scandinavian sustainability principles across commercial maritime routes with alternative marine fuels and shore-power integration.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {GREEN_METRICS.map((g) => (
          <div
            key={g.title}
            style={{
              background: 'var(--tmpl-surface)',
              border: '1px solid var(--tmpl-border-light)',
              borderRadius: 'var(--tmpl-radius)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tmpl-accent-secondary)' }}>
              {g.val}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tmpl-text)' }}>
              {g.title}
            </div>
            <div style={{ fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--tmpl-text-muted)' }}>
              {g.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Thermometer } from 'lucide-react';
import styles from './AeroCargo.module.css';

const PHARMA_STANDARDS = [
  {
    title: 'IATA CEIV Pharma Certified',
    metric: '100% Audit',
    desc: 'Full compliance with global GDP guidelines covering healthcare vaccines, insulin, and biotherapeutics.',
  },
  {
    title: 'Tarmac Thermal Blankets',
    metric: '± 0.5°C Stability',
    desc: 'Multi-layer reflective thermal tarmac covers protecting cargo during 40°C ramp transfers.',
  },
  {
    title: 'Cryogenic Deep-Freeze Hubs',
    metric: '-80°C to +25°C',
    desc: 'Dedicated cold rooms with automatic dry-ice topping networks adjacent to primary cargo ramps.',
  },
  {
    title: 'Real-Time Cellular Data Loggers',
    metric: 'Real-Time Beacon',
    desc: 'FAA and EASA approved GPS sensors transmitting internal payload temperature every 60 seconds.',
  },
];

export function AeroCargoPharma() {
  return (
    <div className={styles.section} id="pharma">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Thermometer size={14} />
          HEALTHCARE AVIATION CORRIDORS
        </div>
        <h2 className={styles.sectionTitle}>Temperature-Controlled Air Cargo</h2>
        <p className={styles.sectionSubtitle}>
          CEIV-certified airport tarmac handling, automated ramp cold boxes, and temperature monitoring across transcontinental trade lanes.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {PHARMA_STANDARDS.map((p) => (
          <div
            key={p.title}
            style={{
              background: 'var(--tmpl-surface)',
              border: '1px solid var(--tmpl-border-light)',
              borderRadius: 'var(--tmpl-radius)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--tmpl-accent)' }}>
              {p.metric}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--tmpl-text)' }}>
              {p.title}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--tmpl-text-muted)', lineHeight: 1.5 }}>
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './FleetOne.module.css';

const SAFETY_PILLARS = [
  {
    title: 'FMCSA Apex Safety Rating',
    score: '99.4%',
    desc: 'Unblemished DOT roadside safety compliance score across all 48 continental states and Canadian provinces.',
  },
  {
    title: 'Collision Avoidance Radar',
    score: '100%',
    desc: 'Bendix Wingman Fusion 2.0 active braking, lane departure warning, and stationary object mitigation on all tractors.',
  },
  {
    title: 'Automated Pre-Trip DVIR',
    score: '120-Point',
    desc: 'Mandatory electronic daily vehicle inspection reports with photo-verified brake chamber stroke and tread depth measurements.',
  },
  {
    title: 'Master CDL Driver Roster',
    score: '1.2M Miles',
    desc: 'Average career clean driving record required for all heavy haul lowboy and chemical tanker command drivers.',
  },
];

export function FleetOneSafety() {
  return (
    <div className={styles.section} id="safety">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <ShieldCheck size={14} />
          ZERO-COMPROMISE SAFETY PROTOCOL
        </div>
        <h2 className={styles.sectionTitle}>Commercial Fleet Safety &amp; Governance</h2>
        <p className={styles.sectionSubtitle}>
          Industry-leading preventative maintenance schedules and driver behavioral telematics protecting your high-value cargo.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {SAFETY_PILLARS.map((p) => (
          <div
            key={p.title}
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
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--tmpl-accent)',
                fontFamily: 'var(--tmpl-font-body)',
              }}
            >
              {p.score}
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--tmpl-text)',
              }}
            >
              {p.title}
            </div>
            <div
              style={{
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                color: 'var(--tmpl-text-muted)',
              }}
            >
              {p.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

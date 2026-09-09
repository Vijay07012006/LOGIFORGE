'use client';

import React from 'react';
import { Anchor } from 'lucide-react';
import styles from './ShipFlow.module.css';

const PORTS = [
  {
    code: 'SGSIN',
    name: 'Singapore PSA Terminal',
    delayHours: '2.1h',
    status: 'Optimal Berthing',
    craneRate: '36.4 Moves/hr',
    level: 'optimal',
  },
  {
    code: 'CNSHA',
    name: 'Shanghai Yangshan Deepwater',
    delayHours: '3.8h',
    status: 'Normal Flow',
    craneRate: '34.8 Moves/hr',
    level: 'normal',
  },
  {
    code: 'NLRTM',
    name: 'Rotterdam Maasvlakte II',
    delayHours: '5.4h',
    status: 'Moderate Queue',
    craneRate: '31.2 Moves/hr',
    level: 'moderate',
  },
  {
    code: 'USLGB',
    name: 'Long Beach Pier 400',
    delayHours: '6.2h',
    status: 'Peak Drayage Volume',
    craneRate: '29.5 Moves/hr',
    level: 'moderate',
  },
];

export function ShipFlowPortStatus() {
  return (
    <div className={styles.section} id="ports">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Anchor size={14} />
          GLOBAL BERTH TELEMETRY
        </div>
        <h2 className={styles.sectionTitle}>Port Turnaround &amp; Congestion Index</h2>
        <p className={styles.sectionSubtitle}>
          Real-time harbor radar tracking average anchorage dwell time, vessel queue depth, and quay crane productivity rates.
        </p>
      </div>

      <div className={styles.portsGrid}>
        {PORTS.map((p) => (
          <div key={p.code} className={styles.portCard}>
            <div className={styles.portHeader}>
              <div className={styles.portTitle}>{p.name}</div>
              <span className={styles.portCodePill}>{p.code}</span>
            </div>

            <div className={styles.delayHours}>{p.delayHours}</div>
            <div className={styles.delaySubtext}>Average Anchorage Dwell Time</div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--tmpl-border-light)',
                fontSize: '0.75rem',
              }}
            >
              <span style={{ color: p.level === 'optimal' ? '#10b981' : 'var(--tmpl-accent-secondary)', fontWeight: 600 }}>
                {p.status}
              </span>
              <span style={{ color: 'var(--tmpl-text-muted)' }}>{p.craneRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import styles from './RouteIQ.module.css';

interface TelemetryPing {
  unitId: string;
  speedMph: number;
  batterySoc: string;
  tirePressurePsi: number;
  hosDriveTime: string;
  canbusStatus: 'Nominal' | 'Alert';
}

const LIVE_PINGS: TelemetryPing[] = [
  { unitId: 'VEH-8812 (EV Semi)', speedMph: 62.4, batterySoc: '78% (184 mi range)', tirePressurePsi: 104, hosDriveTime: '4h 12m / 11h', canbusStatus: 'Nominal' },
  { unitId: 'VEH-4402 (Sprinter)', speedMph: 28.1, batterySoc: '62% (98 mi range)', tirePressurePsi: 48, hosDriveTime: '2h 45m / 11h', canbusStatus: 'Nominal' },
  { unitId: 'VEH-9912 (Cold Haul)', speedMph: 58.7, batterySoc: '91% (240 mi range)', tirePressurePsi: 102, hosDriveTime: '6h 30m / 11h', canbusStatus: 'Nominal' },
];

export const RouteIQTelemetryFeed: React.FC = () => {
  return (
    <section id="telemetry" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Zap size={14} />
          <span>CAN-BUS HARDWARE INTEGRATION</span>
        </div>
        <h2 className={styles.sectionTitle}>Real-Time Vehicle CAN-Bus Ingestion</h2>
        <p className={styles.sectionSubtitle}>
          Direct J1939 and OBD-II telemetry streams continuously re-scoring route ETA models with
          live battery State-of-Charge, tire temperature, and driver Hours-of-Service.
        </p>
      </div>

      <div className={styles.telemetryGrid}>
        {LIVE_PINGS.map((ping, idx) => (
          <div key={idx} className={styles.telemetryCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'var(--tmpl-font-heading)', fontWeight: 700, color: '#f8fafc', fontSize: '1.125rem' }}>
                {ping.unitId}
              </span>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {ping.canbusStatus}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Live Velocity:</span>
                <strong style={{ color: '#f8fafc' }}>{ping.speedMph} MPH</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Battery SoC:</span>
                <strong style={{ color: '#c084fc' }}>{ping.batterySoc}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Tire Pressure:</span>
                <strong style={{ color: '#f8fafc' }}>{ping.tirePressurePsi} PSI</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>HOS Compliance:</span>
                <strong style={{ color: '#10b981' }}>{ping.hosDriveTime}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

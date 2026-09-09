'use client';

import React, { useState } from 'react';
import type { SimulatedShipment } from '@/types/template';
import { lookupSimulatedShipment } from '@/lib/tracking';
import { Plane, Radio } from 'lucide-react';
import styles from './AeroCargo.module.css';

interface AeroCargoAwbTrackProps {
  initialTracking?: string;
  onSearchPerformed?: (trackingNumber: string, found: boolean) => void;
}

export function AeroCargoAwbTrack({
  initialTracking = 'AC-9901-FRA',
  onSearchPerformed,
}: AeroCargoAwbTrackProps) {
  const [awbQuery, setAwbQuery] = useState(initialTracking);
  const [shipment, setShipment] = useState<SimulatedShipment | null>(() =>
    lookupSimulatedShipment(initialTracking)
  );

  const handleSearch = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const res = lookupSimulatedShipment(trimmed);
    setShipment(res);
    onSearchPerformed?.(trimmed, !!res);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(awbQuery);
  };

  return (
    <div className={styles.section} id="awb">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Radio size={14} />
          IATA AIRWAY BILL (AWB) AUDIT
        </div>
        <h2 className={styles.sectionTitle}>In-Flight Cargo Telemetry Radar</h2>
        <p className={styles.sectionSubtitle}>
          Live transponder altitude, true airspeed, and scheduled tarmac unloading ramp slots for time-critical air freight.
        </p>
      </div>

      <div className={styles.awbCard}>
        <form onSubmit={onSubmit} className={styles.awbInputRow}>
          <div className={styles.awbInputWrapper}>
            <Plane size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tmpl-text-muted)' }} />
            <input
              type="text"
              value={awbQuery}
              onChange={(e) => setAwbQuery(e.target.value)}
              placeholder="Enter 11-Digit IATA AWB (e.g. AC-9901-FRA or 020-89241021)"
              className={styles.awbInput}
              aria-label="IATA Airway Bill Number Input"
            />
          </div>
          <button type="submit" className={styles.btnAero} style={{ flex: '0 0 auto', minHeight: '44px' }}>
            Poll Transponder
          </button>
        </form>

        {shipment ? (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
                  Registered Airway Bill
                </span>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--tmpl-accent)' }}>
                  {shipment.trackingNumber}
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid var(--tmpl-border)',
                  color: 'var(--tmpl-accent)',
                  padding: '0.375rem 0.875rem',
                  borderRadius: 'var(--tmpl-radius)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                CRUISING • MACH 0.84 (FL370)
              </span>
            </div>

            <div className={styles.flightHudGrid}>
              <div className={styles.hudItem}>
                <span className={styles.hudKey}>Aircraft Registration</span>
                <span className={styles.hudVal}>{shipment.vesselOrFlight || 'N772AC (B777-F)'}</span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudKey}>Cruising Altitude</span>
                <span className={styles.hudVal}>37,000 FT</span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudKey}>Ground Speed</span>
                <span className={styles.hudVal}>495 KTS</span>
              </div>
              <div className={styles.hudItem}>
                <span className={styles.hudKey}>Touchdown ETA</span>
                <span className={styles.hudVal}>{shipment.eta}</span>
              </div>
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--tmpl-border-light)',
                borderRadius: 'var(--tmpl-radius)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '1rem',
                fontSize: '0.75rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--tmpl-text-muted)' }}>Departure Tarmac:</span>{' '}
                <strong>{shipment.origin.city} ({shipment.origin.code}) Cargo City South</strong>
              </div>
              <div>
                <span style={{ color: 'var(--tmpl-text-muted)' }}>Destination Gate:</span>{' '}
                <strong>{shipment.destination.city} ({shipment.destination.code}) Ramp Stand 42</strong>
              </div>
              <div>
                <span style={{ color: 'var(--tmpl-text-muted)' }}>Customs Status:</span>{' '}
                <strong style={{ color: '#10b981' }}>Electronic Manifest Pre-Approved</strong>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--tmpl-text-muted)' }}>
            No airway bill found for identifier: {awbQuery}. Try sample <strong>AC-9901-FRA</strong>.
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Activity, Gauge, Flame, Fuel, Disc, CheckCircle2 } from 'lucide-react';
import styles from './FleetOne.module.css';

export function FleetOneTelematics() {
  const [heavyLoadMode, setHeavyLoadMode] = useState(false);

  const coolantTemp = heavyLoadMode ? 208 : 194;
  const oilPressure = heavyLoadMode ? 48 : 42;
  const fuelRateMpg = heavyLoadMode ? 6.4 : 7.9;
  const turboBoostPsi = heavyLoadMode ? 34 : 22;

  return (
    <div className={styles.section} id="telematics">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Activity size={14} />
          J1939 CAN-BUS SENSOR TELEMETRY
        </div>
        <h2 className={styles.sectionTitle}>Real-Time Powertrain Diagnostics</h2>
        <p className={styles.sectionSubtitle}>
          Live electronic control module (ECM) telemetry streamed directly from heavy haul tractors across active interstate corridors.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setHeavyLoadMode((prev) => !prev)}
          className={heavyLoadMode ? styles.btnHazard : styles.btnTechnical}
          style={{ minHeight: '40px', padding: '0.5rem 1.25rem', whiteSpace: 'normal', textAlign: 'center', wordBreak: 'break-word' }}
        >
          {heavyLoadMode ? 'Grade Climb Mode (Heavy Haul 80,000 lbs)' : 'Standard Interstate Cruise (55 MPH)'}
        </button>
      </div>

      <div className={styles.gaugeGrid}>
        {/* Coolant Temp */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeHead}>
            <span className={styles.gaugeName}>Engine Coolant Temp</span>
            <Flame size={16} color="var(--tmpl-accent)" />
          </div>
          <div className={styles.gaugeValue}>{coolantTemp}°F</div>
          <div className={styles.gaugeBarTrack}>
            <div
              className={`${styles.gaugeBarFill} ${
                coolantTemp > 205 ? styles.gaugeBarFillWarning : styles.gaugeBarFillGreen
              }`}
              style={{ width: `${(coolantTemp / 240) * 100}%` }}
            />
          </div>
          <div className={styles.gaugeFooter}>
            <span>Normal: 180° - 210°F</span>
            <span>ECM Status: OK</span>
          </div>
        </div>

        {/* Oil Pressure */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeHead}>
            <span className={styles.gaugeName}>Oil Pressure (Main Gallery)</span>
            <Gauge size={16} color="var(--tmpl-accent)" />
          </div>
          <div className={styles.gaugeValue}>{oilPressure} PSI</div>
          <div className={styles.gaugeBarTrack}>
            <div
              className={`${styles.gaugeBarFill} ${styles.gaugeBarFillGreen}`}
              style={{ width: `${(oilPressure / 60) * 100}%` }}
            />
          </div>
          <div className={styles.gaugeFooter}>
            <span>Range: 35 - 55 PSI</span>
            <span>Pump: Nominal</span>
          </div>
        </div>

        {/* Turbo Boost */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeHead}>
            <span className={styles.gaugeName}>Turbo VGT Boost</span>
            <Activity size={16} color="var(--tmpl-accent)" />
          </div>
          <div className={styles.gaugeValue}>{turboBoostPsi} PSI</div>
          <div className={styles.gaugeBarTrack}>
            <div
              className={styles.gaugeBarFill}
              style={{ width: `${(turboBoostPsi / 40) * 100}%` }}
            />
          </div>
          <div className={styles.gaugeFooter}>
            <span>Manifold Pressure</span>
            <span>Variable Geometry</span>
          </div>
        </div>

        {/* Fuel Economy */}
        <div className={styles.gaugeCard}>
          <div className={styles.gaugeHead}>
            <span className={styles.gaugeName}>Instantaneous Fuel Rate</span>
            <Fuel size={16} color="var(--tmpl-accent)" />
          </div>
          <div className={styles.gaugeValue}>{fuelRateMpg} MPG</div>
          <div className={styles.gaugeBarTrack}>
            <div
              className={`${styles.gaugeBarFill} ${styles.gaugeBarFillGreen}`}
              style={{ width: `${(fuelRateMpg / 10) * 100}%` }}
            />
          </div>
          <div className={styles.gaugeFooter}>
            <span>Fleet Avg: 7.4 MPG</span>
            <span>Aero Pack: Active</span>
          </div>
        </div>
      </div>

      {/* TPMS & DEF Subsystem Status */}
      <div
        style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            background: 'var(--tmpl-surface)',
            border: '1px solid var(--tmpl-border-light)',
            padding: '1.25rem',
            borderRadius: 'var(--tmpl-radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Disc size={20} color="var(--tmpl-accent)" />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>
                18-Wheel TPMS Matrix
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
                Steers: 110 PSI • Drives: 105 PSI • Trailer: 100 PSI
              </div>
            </div>
          </div>
          <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
            ALL BALANCED
          </span>
        </div>

        <div
          style={{
            background: 'var(--tmpl-surface)',
            border: '1px solid var(--tmpl-border-light)',
            padding: '1.25rem',
            borderRadius: 'var(--tmpl-radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>
                FMCSA ELD Log Telematics
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
                Duty Status: Driving • 08:42 HOS Remaining
              </div>
            </div>
          </div>
          <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
            CERTIFIED COMPLIANT
          </span>
        </div>
      </div>
    </div>
  );
}

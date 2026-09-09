'use client';

import React, { useState, useId } from 'react';
import { Calculator, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './CargoNova.module.css';

export function CargoNovaRateCalculator() {
  const originId = useId();
  const destId = useId();
  const modeId = useId();
  const weightId = useId();

  const [origin, setOrigin] = useState('CNSHA');
  const [destination, setDestination] = useState('USLGB');
  const [mode, setMode] = useState<'fcl' | 'lcl' | 'air'>('fcl');
  const [weightKg, setWeightKg] = useState<number>(4500);
  const [submitted, setSubmitted] = useState(false);

  // Simple deterministic calculator formulas
  const transitDays =
    mode === 'air'
      ? '2 - 3 Days'
      : origin === 'CNSHA' && destination === 'USLGB'
      ? '14 Days'
      : origin === 'SGSIN' && destination === 'USNYC'
      ? '24 Days'
      : '18 Days';

  const freightClass =
    weightKg > 10000 ? 'Class 60 (Heavy FCL)' : weightKg > 3000 ? 'Class 85 (Standard Commercial)' : 'Class 125 (Consolidated LCL)';

  const co2OffsetKg = Math.round(weightKg * (mode === 'air' ? 0.65 : 0.08));

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className={styles.section} id="quote">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Calculator size={14} />
          INSTANT QUOTATION ESTIMATOR
        </div>
        <h2 className={styles.sectionTitle}>Simulate Freight Transit &amp; Freight Class</h2>
        <p className={styles.sectionSubtitle}>
          Configure your corridor parameters below for automated schedule calculation, tariff class estimation, and carbon footprint telemetry.
        </p>
      </div>

      <div className={styles.calculatorCard}>
        <form onSubmit={handleCalculate}>
          <div className={styles.calcFormGrid}>
            <div className={styles.calcField}>
              <label htmlFor={originId} className={styles.calcLabel}>Origin Port / Hub</label>
              <select
                id={originId}
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setSubmitted(false);
                }}
                className={styles.calcSelect}
              >
                <option value="CNSHA">Shanghai, China (CNSHA)</option>
                <option value="SGSIN">Singapore (SGSIN)</option>
                <option value="BEANR">Antwerp, Belgium (BEANR)</option>
                <option value="NLRTM">Rotterdam, Netherlands (NLRTM)</option>
                <option value="DXB">Dubai, UAE (DXB / DWC)</option>
              </select>
            </div>

            <div className={styles.calcField}>
              <label htmlFor={destId} className={styles.calcLabel}>Destination Facility</label>
              <select
                id={destId}
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setSubmitted(false);
                }}
                className={styles.calcSelect}
              >
                <option value="USLGB">Long Beach, CA (USLGB)</option>
                <option value="USNYC">New York / Newark (USNYC)</option>
                <option value="DEHAM">Hamburg, Germany (DEHAM)</option>
                <option value="FRA">Frankfurt Main (FRA Air Cargo)</option>
                <option value="ORD">Chicago O&apos;Hare Intermodal (ORD)</option>
              </select>
            </div>

            <div className={styles.calcField}>
              <label htmlFor={modeId} className={styles.calcLabel}>Carriage Mode</label>
              <select
                id={modeId}
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value as 'fcl' | 'lcl' | 'air');
                  setSubmitted(false);
                }}
                className={styles.calcSelect}
              >
                <option value="fcl">Ocean FCL (Full Container)</option>
                <option value="lcl">Ocean LCL (Consolidation)</option>
                <option value="air">Air Cargo Priority (B777-F)</option>
              </select>
            </div>

            <div className={styles.calcField}>
              <label htmlFor={weightId} className={styles.calcLabel}>Gross Cargo Weight (kg)</label>
              <input
                id={weightId}
                type="number"
                min="100"
                max="50000"
                step="100"
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(Number(e.target.value));
                  setSubmitted(false);
                }}
                className={styles.calcInput}
              />
            </div>
          </div>

          <div className={styles.calcResultBox}>
            <div className={styles.calcResultDetails}>
              <div className={styles.resultMetric}>
                <span className={styles.calcLabel}>Estimated Port-to-Port Transit</span>
                <span className={styles.resultMetricValue}>{transitDays}</span>
              </div>
              <div className={styles.resultMetric}>
                <span className={styles.calcLabel}>Freight Rating Class</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--tmpl-text)' }}>
                  {freightClass}
                </span>
              </div>
              <div className={styles.resultMetric}>
                <span className={styles.calcLabel}>Estimated Carbon Footprint</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#10b981' }}>
                  ~{co2OffsetKg.toLocaleString()} kg CO2e
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnGold}
              style={{ flex: '0 0 auto', minHeight: '46px' }}
            >
              {submitted ? (
                <>
                  <CheckCircle2 size={16} />
                  Quotation Draft Generated
                </>
              ) : (
                <>
                  Lock Guaranteed Slot
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {submitted && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--tmpl-radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.8125rem',
              color: '#10b981',
            }}
          >
            <CheckCircle2 size={18} />
            <span>
              Quotation token generated for <strong>{weightKg} kg</strong> on lane <strong>{origin} &rarr; {destination}</strong>. Berth allocation holds for 72 hours under CargoNova Tariff Tariff Schedule.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

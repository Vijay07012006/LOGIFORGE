'use client';

import React, { useState } from 'react';
import { Leaf, CheckCircle2 } from 'lucide-react';
import styles from './SupplyCore.module.css';

type FreightMode = 'sea' | 'air' | 'rail' | 'road';

export const SupplyCoreScope3Calc: React.FC = () => {
  const [transportMode, setTransportMode] = useState<'sea' | 'air' | 'rail' | 'road'>('sea');
  const [distanceKm, setDistanceKm] = useState<number>(8500);
  const [weightTons, setWeightTons] = useState<number>(120);

  // Carbon factor: g CO2 per ton-km (GLEC Framework standard benchmarks)
  const factors: Record<string, number> = {
    sea: 11.2, // Container ship
    rail: 24.5, // Electric rail
    road: 82.0, // Modern Class-8 heavy diesel
    air: 580.0, // Long-haul freighter
  };

  const calculatedKg = Math.round((distanceKm * weightTons * factors[transportMode]) / 1000);
  const metricTons = (calculatedKg / 1000).toFixed(2);
  const carbonOffsetCost = (parseFloat(metricTons) * 35).toFixed(2); // $35/ton voluntary high-durability credit

  return (
    <section id="scope3" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Leaf size={14} />
          <span>ESG & DECARBONIZATION ENGINE</span>
        </div>
        <h2 className={styles.sectionTitle}>Scope-3 Carbon Visibility Calculator</h2>
        <p className={styles.sectionSubtitle}>
          ISO 14064 and GLEC Framework aligned emissions estimation across maritime, intermodal rail,
          and air freight logistics lanes.
        </p>
      </div>

      <div className={styles.calcGrid}>
        <div>
          <div className={styles.calcFormGroup}>
            <label className={styles.calcLabel} htmlFor="calc-mode">LOGISTICS FREIGHT MODE</label>
            <select
              id="calc-mode"
              className={styles.calcSelect}
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value as FreightMode)}
            >
              <option value="sea">Maritime Container Vessel (11.2 g CO₂/ton-km)</option>
              <option value="rail">Class-1 Double-Stack Rail (24.5 g CO₂/ton-km)</option>
              <option value="road">Heavy-Duty Linehaul Truck (82.0 g CO₂/ton-km)</option>
              <option value="air">Intercontinental Air Freight (580.0 g CO₂/ton-km)</option>
            </select>
          </div>

          <div className={styles.calcFormGroup}>
            <label className={styles.calcLabel} htmlFor="calc-distance">TRANSIT DISTANCE (KILOMETERS)</label>
            <input
              id="calc-distance"
              type="number"
              className={styles.calcInput}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Math.max(1, Number(e.target.value)))}
              min={1}
            />
          </div>

          <div className={styles.calcFormGroup}>
            <label className={styles.calcLabel} htmlFor="calc-weight">TOTAL CARGO MASS (METRIC TONS)</label>
            <input
              id="calc-weight"
              type="number"
              className={styles.calcInput}
              value={weightTons}
              onChange={(e) => setWeightTons(Math.max(1, Number(e.target.value)))}
              min={1}
            />
          </div>

          <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '1rem' }}>
            * Calculations conform to EN 16258 and GHG Protocol Corporate Value Chain Standard.
          </div>
        </div>

        <div className={styles.calcResultBox}>
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ESTIMATED SCOPE-3 EMISSIONS
          </span>
          <div className={styles.co2Val}>{metricTons} t</div>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '1rem' }}>
            Metric Tons of CO₂ Equivalent
          </span>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: '6px', padding: '0.875rem 1.25rem', width: '100%', boxSizing: 'border-box', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#818cf8', fontWeight: 600 }}>VOLUNTARY OFFSET BENCHMARK</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
              ${carbonOffsetCost} USD
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Certified Biochar & Direct Air Capture CDR</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#10b981' }}>
            <CheckCircle2 size={16} />
            <span>Audit Certificate Available in CSRD Format</span>
          </div>
        </div>
      </div>
    </section>
  );
};

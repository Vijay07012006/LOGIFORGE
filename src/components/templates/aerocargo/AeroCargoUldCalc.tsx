'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import styles from './AeroCargo.module.css';

const ULD_TYPES = [
  {
    id: 'pmc',
    name: 'PMC / P6P Heavy Pallet',
    dim: '318 × 244 cm (125 × 96 in)',
    maxGross: '11,340 kg',
    volume: '11.5 m³',
    use: 'Heavy industrial engines, machinery, and concentrated palletized freight.',
  },
  {
    id: 'pag',
    name: 'PAG Maindeck Pallet',
    dim: '318 × 224 cm (125 × 88 in)',
    maxGross: '6,800 kg',
    volume: '10.8 m³',
    use: 'High-value consumer technology, semiconductor wafer crates, apparel.',
  },
  {
    id: 'ake',
    name: 'AKE / LD3 Contoured Container',
    dim: '156 × 153 × 163 cm',
    maxGross: '1,588 kg',
    volume: '4.3 m³',
    use: 'Standard lower-deck containerized express freight and interline baggage.',
  },
  {
    id: 'pharma',
    name: 'Envirotainer e2 Active Cold ULD',
    dim: '156 × 153 × 162 cm',
    maxGross: '1,588 kg',
    volume: '3.8 m³',
    use: 'Compressor-driven active cold chain (+2°C to +8°C / -20°C) for vaccines.',
  },
];

const AIRCRAFT_FLEET = [
  {
    model: 'Boeing 777-F Freighter',
    payload: '102,800 kg (226,600 lbs)',
    maindeckUld: '27 PMC Pallets',
    lowerdeckUld: '10 Pallets + 6 LD3',
    range: '4,970 NM',
  },
  {
    model: 'Boeing 747-8F (Nose-Door Loader)',
    payload: '137,700 kg (303,500 lbs)',
    maindeckUld: '34 PMC Pallets',
    lowerdeckUld: '12 Pallets + 8 LD3',
    range: '4,120 NM',
  },
  {
    model: 'Airbus A330-300P2F Express',
    payload: '61,000 kg (134,500 lbs)',
    maindeckUld: '26 ULD Positions',
    lowerdeckUld: '8 LD3 Containers',
    range: '3,650 NM',
  },
];

export function AeroCargoUldCalc() {
  const [selectedUld, setSelectedUld] = useState('pmc');
  const [selectedPlane, setSelectedPlane] = useState(0);

  const uld = ULD_TYPES.find((u) => u.id === selectedUld) || ULD_TYPES[0];
  const plane = AIRCRAFT_FLEET[selectedPlane];

  return (
    <div className={styles.section} id="uld">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Layers size={14} />
          MAINDECK ULD STOWAGE MATRIX
        </div>
        <h2 className={styles.sectionTitle}>Aircraft Hold Capacity &amp; ULD Configuration</h2>
        <p className={styles.sectionSubtitle}>
          Determine optimum aircraft hold utilization, maximum structural takeoff payload, and container contour compatibility.
        </p>
      </div>

      <div className={styles.uldCard}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Select Unit Load Device (ULD) Standard
        </div>
        <div className={styles.uldSelectGrid}>
          {ULD_TYPES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => setSelectedUld(u.id)}
              className={`${styles.uldOptionBtn} ${
                selectedUld === u.id ? styles.uldOptionBtnActive : ''
              }`}
            >
              <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--tmpl-accent)' }}>
                {u.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
                Dimensions: {u.dim}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                Gross Cap: {u.maxGross} • Volume: {u.volume}
              </span>
            </button>
          ))}
        </div>

        <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Select Freighter Airframe
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {AIRCRAFT_FLEET.map((f, idx) => (
            <button
              key={f.model}
              type="button"
              onClick={() => setSelectedPlane(idx)}
              className={selectedPlane === idx ? styles.btnAero : styles.btnCockpit}
              style={{ minHeight: '38px', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              {f.model}
            </button>
          ))}
        </div>

        <div className={styles.aircraftCapacityDisplay}>
          <div>
            <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
              Airframe Technical Profile
            </span>
            <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--tmpl-text)', margin: '0.25rem 0' }}>
              {plane.model}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--tmpl-text-muted)', marginBottom: '1rem' }}>
              Maximum Structural Payload: <strong style={{ color: 'var(--tmpl-accent)' }}>{plane.payload}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <div>
                Maindeck Capacity: <strong>{plane.maindeckUld}</strong>
              </div>
              <div>
                Lower-deck Belly Capacity: <strong>{plane.lowerdeckUld}</strong>
              </div>
              <div>
                Full-Payload Range: <strong>{plane.range}</strong>
              </div>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--tmpl-border-light)', paddingLeft: '1.5rem' }}>
            <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
              Selected ULD Suitability Assessment
            </span>
            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--tmpl-accent)', margin: '0.25rem 0 0.5rem' }}>
              {uld.name}
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--tmpl-text-muted)', lineHeight: 1.5 }}>
              {uld.use}
            </p>
            <div
              style={{
                marginTop: '1rem',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid var(--tmpl-border)',
                padding: '0.75rem',
                borderRadius: 'var(--tmpl-radius)',
                fontSize: '0.75rem',
                color: 'var(--tmpl-accent)',
              }}
            >
              ✓ Direct aircraft loading via main cargo door (MCD). Automated floor power rollers engaged.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

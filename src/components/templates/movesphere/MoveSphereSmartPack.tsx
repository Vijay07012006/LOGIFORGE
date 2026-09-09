'use client';

import React, { useState } from 'react';
import { Box, CheckCircle2 } from 'lucide-react';
import styles from './MoveSphere.module.css';

interface PayloadSpec {
  category: string;
  recommendedContainer: string;
  atmosphereSetting: string;
  shockRating: string;
  antiTamperProtocol: string;
}

const PAYLOAD_TYPES: Record<string, PayloadSpec> = {
  biotech: {
    category: 'Biotech & mRNA Cell Cultures',
    recommendedContainer: 'MS-CryoBio Capsule (Nitrogen Vapor Phase)',
    atmosphereSetting: '-196°C Liquid N2 Vapor • Zero Air Permeation',
    shockRating: 'Active Electro-Magnetic Damping (< 0.005g)',
    antiTamperProtocol: 'Multi-Factor Genomic Signature Lock',
  },
  quantum: {
    category: 'Quantum Computing & Semiconductor Dies',
    recommendedContainer: 'MS-Shielded Faraday Unit',
    atmosphereSetting: 'Vacuum Sealed (< 10⁻⁶ mbar) with Argon Buffer',
    shockRating: 'Quad-Axis Magnetic Levitation (< 0.001g)',
    antiTamperProtocol: 'Quantum Entanglement Optical Fiber Intrusion Grid',
  },
  aerospace: {
    category: 'Aerospace Satellite Guidance Sensors',
    recommendedContainer: 'MS-Titanium Inertial Casing',
    atmosphereSetting: 'Ultra-Dry Nitrogen (+20°C Constant Dew Point -60°C)',
    shockRating: 'Pneumatic Viscoelastic Suspension (< 0.01g)',
    antiTamperProtocol: 'Hardware Security Module (HSM) Cryptographic Seal',
  },
};

export const MoveSphereSmartPack: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('biotech');
  const spec = PAYLOAD_TYPES[selectedType];

  return (
    <section id="smartpack" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Box size={14} />
          <span>AUTONOMOUS PAYLOAD CONFIGURATOR</span>
        </div>
        <h2 className={styles.sectionTitle}>Smart Container Payload Packager</h2>
        <p className={styles.sectionSubtitle}>
          Select high-value, high-consequence cargo disciplines to generate dynamic atmospheric and shock packaging specifications.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`${styles.pillBtn} ${selectedType === 'biotech' ? styles.btnPrimary : ''}`}
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setSelectedType('biotech')}
        >
          Biotech & mRNA Biologics
        </button>
        <button
          type="button"
          className={`${styles.pillBtn} ${selectedType === 'quantum' ? styles.btnPrimary : ''}`}
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setSelectedType('quantum')}
        >
          Quantum Qubit Modules
        </button>
        <button
          type="button"
          className={`${styles.pillBtn} ${selectedType === 'aerospace' ? styles.btnPrimary : ''}`}
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setSelectedType('aerospace')}
        >
          Aerospace Avionics & Optics
        </button>
      </div>

      <div style={{ background: '#0a121e', border: '1px solid var(--tmpl-border)', borderRadius: '16px', padding: '2rem', maxWidth: '840px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--tmpl-border-subtle)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 700 }}>RECOMMENDED CONTAINER PROFILE</span>
            <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
              {spec.recommendedContainer}
            </div>
          </div>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 700 }}>
            <CheckCircle2 size={16} /> Autonomous Grid Ready
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ATMOSPHERIC ENVIRONMENT</div>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.375rem' }}>
              {spec.atmosphereSetting}
            </div>
          </div>

          <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>INERTIAL SHOCK DAMPING</div>
            <div style={{ color: '#2dd4bf', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.375rem' }}>
              {spec.shockRating}
            </div>
          </div>

          <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ANTI-INTRUSION PROTOCOL</div>
            <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.375rem' }}>
              {spec.antiTamperProtocol}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

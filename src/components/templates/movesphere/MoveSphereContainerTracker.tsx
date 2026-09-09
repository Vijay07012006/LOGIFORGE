'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, ShieldCheck, Thermometer, Activity, Orbit } from 'lucide-react';
import styles from './MoveSphere.module.css';

interface QuantumContainerRecord {
  uuid: string;
  payloadType: string;
  status: 'In Orbital Transit' | 'Autonomous Maglev Corridor' | 'Hyperloop Tube 04';
  internalTemp: string;
  nitrogenLevel: string;
  shockG: string;
  tamperSeal: string;
  autonomousVessel: string;
  powerReserve: string;
}

const PRESET_CONTAINERS: Record<string, QuantumContainerRecord> = {
  'MS-9900-QUANTUM': {
    uuid: 'MS-9900-QUANTUM',
    payloadType: 'Superconducting Qubit Processor Modules',
    status: 'Autonomous Maglev Corridor',
    internalTemp: '-271.8°C (Cryogenic Liquid Helium Stabilized)',
    nitrogenLevel: '99.999% Pure Inert Purge',
    shockG: '0.002g (Magnetic Suspension Locked)',
    tamperSeal: 'Quantum Cryptographic Fiber Intact (Zero Intrusion)',
    autonomousVessel: 'Maglev Line Hyper-08 (Tokyo → Osaka 18-min transit)',
    powerReserve: '98% (Solid-State Battery + Solar Resupply)',
  },
  'MS-1044-ORBIT': {
    uuid: 'MS-1044-ORBIT',
    payloadType: 'Low-Gravity Biologic Organoids & Enzyme Crystals',
    status: 'In Orbital Transit',
    internalTemp: '+4.0°C Precision Biosphere',
    nitrogenLevel: '78% N2 / 21% O2 Controlled Atmosphere',
    shockG: '0.000g (Micro-Gravity Glide)',
    tamperSeal: 'Biometric Smart Latch Encrypted',
    autonomousVessel: 'Autonomous Sub-Orbital Cargo Craft #02',
    powerReserve: '94% (Radioisotope Resupply Cell)',
  },
  'MS-7712-GRID': {
    uuid: 'MS-7712-GRID',
    payloadType: 'Rare Renaissance Masterpiece Oil Canvas (Museum Loan)',
    status: 'Hyperloop Tube 04',
    internalTemp: '20.0°C ± 0.1°C Strict Museum Climate',
    nitrogenLevel: 'Inert Argon Blanket (Zero Oxidation)',
    shockG: '0.001g (Active Pneumatic Isolation Base)',
    tamperSeal: 'Multi-Sensor Spectral Seal Active',
    autonomousVessel: 'Pneumatic Hyperloop Pod X-4 (Zurich → Paris)',
    powerReserve: '99% (Inductive Track Power Ingest)',
  },
};

interface MoveSphereContainerTrackerProps {
  initialUuid?: string;
}

export const MoveSphereContainerTracker: React.FC<MoveSphereContainerTrackerProps> = ({
  initialUuid = 'MS-9900-QUANTUM',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialUuid);
  const [activeRecord, setActiveRecord] = useState<QuantumContainerRecord | null>(
    PRESET_CONTAINERS[initialUuid] || PRESET_CONTAINERS['MS-9900-QUANTUM']
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (PRESET_CONTAINERS[clean]) {
      setActiveRecord(PRESET_CONTAINERS[clean]);
    } else {
      setActiveRecord({
        uuid: clean,
        payloadType: 'High-Value Autonomous High-Tech Freight',
        status: 'Autonomous Maglev Corridor',
        internalTemp: '18.0°C Controlled Atmosphere',
        nitrogenLevel: 'Standard Inert Gas Environment',
        shockG: '0.004g (Dynamic Active Damping)',
        tamperSeal: 'Cryptographic Hash Validated',
        autonomousVessel: 'Autonomous Grid Drone Unit',
        powerReserve: '95% (Solar Inductive)',
      });
    }
  };

  return (
    <section id="tracking" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Orbit size={14} />
          <span>CYBER-PHYSICAL SENSOR TELEMETRY</span>
        </div>
        <h2 className={styles.sectionTitle}>Quantum Smart Container Telemetry</h2>
        <p className={styles.sectionSubtitle}>
          Query container sensor UUIDs to inspect internal microclimate, cryogenic temperatures,
          3-axis inertial shock loads, and quantum tamper seals.
        </p>
      </div>

      <div className={styles.containerCard}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchInputIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Sensor UUID (e.g. MS-9900-QUANTUM)"
              aria-label="Quantum Container Sensor UUID Input"
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>
            <span>Inspect Sensor Beacon</span>
          </button>
        </form>

        <div className={styles.samplePills}>
          <span>Active Sensor Samples:</span>
          {Object.keys(PRESET_CONTAINERS).map((uuid) => (
            <button
              key={uuid}
              type="button"
              className={styles.pillBtn}
              onClick={() => {
                setSearchQuery(uuid);
                setActiveRecord(PRESET_CONTAINERS[uuid]);
              }}
            >
              {uuid}
            </button>
          ))}
        </div>

        {activeRecord && (
          <div style={{ background: '#070f1a', border: '1px solid var(--tmpl-border)', borderRadius: '12px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--tmpl-border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase' }}>CONTAINER TELEMETRY BEACON</span>
                <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeRecord.uuid}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Payload: <strong style={{ color: '#f8fafc' }}>{activeRecord.payloadType}</strong>
                </div>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  background: 'rgba(20, 184, 166, 0.15)',
                  color: '#2dd4bf',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={14} /> {activeRecord.status}
              </span>
            </div>

            <div className={styles.containerResultGrid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Thermometer size={14} color="#2dd4bf" /> INTERNAL ATMOSPHERE & CLIMATE
                  </div>
                  <div style={{ color: '#2dd4bf', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.5rem' }}>
                    {activeRecord.internalTemp}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Atmosphere: {activeRecord.nitrogenLevel}
                  </div>
                </div>

                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Activity size={14} color="#2dd4bf" /> INERTIAL LOAD & DAMPING
                  </div>
                  <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.5rem' }}>
                    Instantaneous Shock: {activeRecord.shockG}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Sub-millig shock isolation active
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <ShieldCheck size={14} color="#2dd4bf" /> CRYPTOGRAPHIC ANTI-TAMPER
                  </div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '1.125rem', marginTop: '0.5rem' }}>
                    {activeRecord.tamperSeal}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Zero physical perimeter compromises recorded
                  </div>
                </div>

                <div style={{ background: 'rgba(20, 184, 166, 0.08)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(20, 184, 166, 0.25)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#2dd4bf', textTransform: 'uppercase', fontWeight: 700 }}>AUTONOMOUS MOTHER VESSEL</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                    {activeRecord.autonomousVessel}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    Onboard Reserve: <strong>{activeRecord.powerReserve}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

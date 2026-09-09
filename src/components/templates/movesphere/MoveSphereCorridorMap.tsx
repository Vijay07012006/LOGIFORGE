'use client';

import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import styles from './MoveSphere.module.css';

interface AutonomousCorridor {
  name: string;
  type: 'Maglev Tube' | 'Sub-Orbital Lane' | 'Autonomous Drone Grid' | 'Hydrogen Ocean';
  speed: string;
  co2PerTon: string;
  status: 'Operational' | 'Testing Phase';
  description: string;
}

const CORRIDORS: AutonomousCorridor[] = [
  {
    name: 'Trans-Pacific Hyper-Corridor (Tokyo ⇄ San Francisco)',
    type: 'Sub-Orbital Lane',
    speed: '4,200 MPH (Mach 5.5)',
    co2PerTon: '0.00 kg (Green Hydrogen Scramjet)',
    status: 'Testing Phase',
    description: '45-minute intercontinental transport for urgent cryogenic medical biologics and semiconductor wafers.',
  },
  {
    name: 'European Central Maglev Line (Rotterdam ⇄ Vienna)',
    type: 'Maglev Tube',
    speed: '380 MPH',
    co2PerTon: '0.00 kg (100% Wind-Powered Grid)',
    status: 'Operational',
    description: 'Continuous vacuum-sealed tube transport bypassing all surface highway bottlenecks.',
  },
  {
    name: 'Nordic Autonomous Marine Highway (Gothenburg ⇄ Oslo)',
    type: 'Hydrogen Ocean',
    speed: '28 Knots',
    co2PerTon: '0.00 kg (Liquid Hydrogen Fuel Cell)',
    status: 'Operational',
    description: 'Crewless automated container feeder vessels utilizing satellite computer vision navigation.',
  },
];

export const MoveSphereCorridorMap: React.FC = () => {
  const [selectedCorridor, setSelectedCorridor] = useState<AutonomousCorridor>(CORRIDORS[0]);

  return (
    <section id="corridors" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Compass size={14} />
          <span>AUTONOMOUS INFRASTRUCTURE GRID</span>
        </div>
        <h2 className={styles.sectionTitle}>Autonomous Global Transport Corridors</h2>
        <p className={styles.sectionSubtitle}>
          Zero-emission hyperloop tubes, sub-orbital cargo lanes, and autonomous electric maritime feeders.
        </p>
      </div>

      <div className={styles.corridorGrid}>
        {CORRIDORS.map((corridor, idx) => {
          const isSelected = selectedCorridor.name === corridor.name;
          return (
            <div
              key={idx}
              className={styles.corridorCard}
              style={{
                outline: isSelected ? '2px solid #14b8a6' : 'none',
                background: isSelected ? '#122338' : undefined,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedCorridor(corridor)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#2dd4bf', fontWeight: 700, textTransform: 'uppercase' }}>
                  {corridor.type}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    background: corridor.status === 'Operational' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: corridor.status === 'Operational' ? '#10b981' : '#f59e0b',
                  }}
                >
                  {corridor.status}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                {corridor.name}
              </h3>

              <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
                {corridor.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderTop: '1px solid var(--tmpl-border-subtle)', paddingTop: '0.75rem' }}>
                <span>Speed: <strong style={{ color: '#2dd4bf' }}>{corridor.speed}</strong></span>
                <span>Emissions: <strong style={{ color: '#10b981' }}>{corridor.co2PerTon}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

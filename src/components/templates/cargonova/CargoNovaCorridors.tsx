'use client';

import React, { useState } from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import styles from './CargoNova.module.css';

const CORRIDORS = [
  {
    id: 'tp-express',
    title: 'Trans-Pacific Direct Express',
    origin: 'Shanghai (CNSHA)',
    destination: 'Long Beach, CA (USLGB)',
    mode: 'Ocean FCL / Intermodal',
    transitDays: '14 Days',
    frequency: '3x Weekly',
    vesselCapacity: '24,000 TEU',
    co2Rating: 'A+ Eco-Steaming',
  },
  {
    id: 'asia-europe',
    title: 'Asia–North Europe Gateway',
    origin: 'Singapore (SGSIN)',
    destination: 'Rotterdam (NLRTM)',
    mode: 'Ocean Carrier Alliance',
    transitDays: '22 Days',
    frequency: 'Daily Sailings',
    vesselCapacity: '21,500 TEU',
    co2Rating: 'Tier III IMO Certified',
  },
  {
    id: 'transatlantic',
    title: 'Trans-Atlantic Industrial Hub',
    origin: 'Antwerp (BEANR)',
    destination: 'New York / Newark (USNYC)',
    mode: 'Dedicated Direct Berth',
    transitDays: '10 Days',
    frequency: '2x Weekly',
    vesselCapacity: '15,000 TEU',
    co2Rating: 'Green Port Drayage',
  },
  {
    id: 'mideast-air',
    title: 'Arabian Gulf–Central Europe Airfreight',
    origin: 'Dubai Al Maktoum (DWC)',
    destination: 'Frankfurt Main (FRA)',
    mode: 'Maindeck B777-F Charter',
    transitDays: '6.5 Hours',
    frequency: 'Daily Flights',
    vesselCapacity: '105 Tonnes Payload',
    co2Rating: 'SAF Biofuel Blend 20%',
  },
];

export function CargoNovaCorridors() {
  const [selectedCorridor, setSelectedCorridor] = useState(CORRIDORS[0].id);

  return (
    <div className={styles.section} id="corridors">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Globe size={14} />
          STRATEGIC TRADE ARTERIES
        </div>
        <h2 className={styles.sectionTitle}>High-Volume Global Trade Corridors</h2>
        <p className={styles.sectionSubtitle}>
          Dedicated berths, pre-cleared customs corridors, and guaranteed container allocations on the world’s busiest commercial routes.
        </p>
      </div>

      <div className={styles.corridorsGrid}>
        {CORRIDORS.map((c) => {
          const isSelected = selectedCorridor === c.id;
          return (
            <div
              key={c.id}
              className={styles.corridorCard}
              style={{
                borderColor: isSelected ? 'var(--tmpl-accent)' : undefined,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedCorridor(c.id)}
            >
              <div className={styles.corridorCardHead}>
                <div>
                  <div className={styles.corridorLaneTitle}>{c.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--tmpl-accent)', marginTop: '0.25rem' }}>
                    {c.origin} &rarr; {c.destination}
                  </div>
                </div>
                <span className={styles.corridorPill}>{c.mode}</span>
              </div>

              <div className={styles.corridorStatsRow}>
                <div>
                  <div className={statCellLabel}>{c.transitDays}</div>
                  <div className={statCellValue}>Transit Time</div>
                </div>
                <div>
                  <div className={statCellLabel}>{c.frequency}</div>
                  <div className={statCellValue}>Frequency</div>
                </div>
                <div>
                  <div className={statCellLabel}>{c.vesselCapacity}</div>
                  <div className={statCellValue}>Capacity</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.75rem',
                  color: 'var(--tmpl-text-muted)',
                  borderTop: '1px solid var(--tmpl-border-light)',
                  paddingTop: '0.75rem',
                }}
              >
                <span>Compliance: {c.co2Rating}</span>
                <span style={{ color: 'var(--tmpl-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Inspect Corridor <ArrowRight size={12} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const statCellLabel = styles.statCellValue;
const statCellValue = styles.statCellLabel;

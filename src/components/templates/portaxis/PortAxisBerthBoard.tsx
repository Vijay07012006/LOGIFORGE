'use client';

import React, { useState } from 'react';
import { Ship, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './PortAxis.module.css';

interface BerthData {
  id: string;
  berthNumber: string;
  vessel: string;
  carrier: string;
  capacityTeu: string;
  status: 'working' | 'moored' | 'departing';
  cranes: number;
  movesDone: number;
  totalMoves: number;
  eta: string;
  etd: string;
  draft: string;
  grossMovesHr: number;
}

const BERTH_LIST: BerthData[] = [
  {
    id: 'b-01',
    berthNumber: 'BERTH 01-A',
    vessel: 'Ever Golden',
    carrier: 'Evergreen Marine',
    capacityTeu: '20,124 TEU',
    status: 'working',
    cranes: 4,
    movesDone: 1480,
    totalMoves: 2200,
    eta: 'Today 04:30 UTC',
    etd: 'Today 22:00 UTC',
    draft: '15.8m',
    grossMovesHr: 34.8,
  },
  {
    id: 'b-02',
    berthNumber: 'BERTH 02-B',
    vessel: 'CMA CGM Jacques Saadé',
    carrier: 'CMA CGM (LNG Dual-Fuel)',
    capacityTeu: '23,000 TEU',
    status: 'working',
    cranes: 5,
    movesDone: 2150,
    totalMoves: 3400,
    eta: 'Yesterday 18:00 UTC',
    etd: 'Tomorrow 06:00 UTC',
    draft: '16.1m',
    grossMovesHr: 36.2,
  },
  {
    id: 'b-03',
    berthNumber: 'BERTH 03-A',
    vessel: 'MSC Gülsün',
    carrier: 'Mediterranean Shipping Co',
    capacityTeu: '23,756 TEU',
    status: 'moored',
    cranes: 4,
    movesDone: 120,
    totalMoves: 2800,
    eta: 'Today 11:15 UTC',
    etd: 'Tomorrow 18:00 UTC',
    draft: '16.4m',
    grossMovesHr: 31.5,
  },
  {
    id: 'b-04',
    berthNumber: 'BERTH 04-B',
    vessel: 'Madrid Maersk',
    carrier: 'Maersk Line',
    capacityTeu: '20,568 TEU',
    status: 'departing',
    cranes: 0,
    movesDone: 3120,
    totalMoves: 3120,
    eta: 'Day -2 08:00 UTC',
    etd: 'Pilot Onboard (Departing)',
    draft: '15.2m',
    grossMovesHr: 35.0,
  },
  {
    id: 'b-05',
    berthNumber: 'BERTH 05-A',
    vessel: 'HMM Algeciras',
    carrier: 'HMM Co / THE Alliance',
    capacityTeu: '23,964 TEU',
    status: 'working',
    cranes: 4,
    movesDone: 890,
    totalMoves: 2450,
    eta: 'Today 08:45 UTC',
    etd: 'Day +2 12:00 UTC',
    draft: '16.2m',
    grossMovesHr: 33.4,
  },
  {
    id: 'b-06',
    berthNumber: 'BERTH 06-B',
    vessel: 'ONE Apus',
    carrier: 'Ocean Network Express',
    capacityTeu: '14,052 TEU',
    status: 'moored',
    cranes: 3,
    movesDone: 450,
    totalMoves: 1600,
    eta: 'Today 14:00 UTC',
    etd: 'Tomorrow 23:00 UTC',
    draft: '14.6m',
    grossMovesHr: 32.1,
  },
];

export const PortAxisBerthBoard: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'working' | 'moored' | 'departing'>('all');
  const [selectedBerth, setSelectedBerth] = useState<BerthData>(BERTH_LIST[0]);

  const filteredBerths = BERTH_LIST.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <section id="berth-schedule" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Ship size={14} />
          <span>REAL-TIME TERMINAL RADAR</span>
        </div>
        <h2 className={styles.sectionTitle}>Deepwater Berth Schedule</h2>
        <p className={styles.sectionSubtitle}>
          Live status of our 6 deepwater container berths. Super Post-Panamax STS crane
          gang operations, discharge/load cycles, and vessel departure windows.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2rem',
        }}
      >
        {(['all', 'working', 'moored', 'departing'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              border:
                filter === cat
                  ? '1px solid #38bdf8'
                  : '1px solid rgba(100, 116, 139, 0.25)',
              background: filter === cat ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              color: filter === cat ? '#38bdf8' : 'var(--tmpl-text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {cat === 'all' ? 'All Berths (6)' : `${cat.toUpperCase()}`}
          </button>
        ))}
      </div>

      <div className={styles.berthGrid}>
        {filteredBerths.map((b) => {
          const pct = Math.round((b.movesDone / b.totalMoves) * 100);
          const isSelected = selectedBerth.id === b.id;

          return (
            <div
              key={b.id}
              className={styles.berthCard}
              style={{
                borderColor: isSelected ? '#38bdf8' : undefined,
                boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.15)' : undefined,
                cursor: 'pointer',
              }}
              onClick={() => setSelectedBerth(b)}
            >
              <div className={styles.berthHead}>
                <span className={styles.berthNumber}>{b.berthNumber}</span>
                {b.status === 'working' && (
                  <span className={styles.statusWorking}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#10b981',
                      }}
                    />
                    Working
                  </span>
                )}
                {b.status === 'moored' && (
                  <span className={styles.statusMoored}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#38bdf8',
                      }}
                    />
                    Moored
                  </span>
                )}
                {b.status === 'departing' && (
                  <span className={styles.statusDeparting}>
                    <AlertCircle size={12} />
                    Departing
                  </span>
                )}
              </div>

              <div>
                <h3 className={styles.berthVesselName}>{b.vessel}</h3>
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--tmpl-text-muted)',
                    marginTop: '0.25rem',
                  }}
                >
                  {b.carrier} • {b.capacityTeu}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    marginBottom: '0.375rem',
                    fontFamily: 'monospace',
                  }}
                >
                  <span>
                    MOVES: {b.movesDone} / {b.totalMoves}
                  </span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{pct}%</span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct === 100 ? '#10b981' : '#38bdf8',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              <div className={styles.berthStats}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>STS Gantry Gangs:</span>
                  <strong style={{ color: '#f8fafc' }}>
                    {b.cranes > 0 ? `${b.cranes} Super Post-Panamax` : 'Released'}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gross Rate:</span>
                  <strong style={{ color: '#38bdf8' }}>{b.grossMovesHr} moves/hr</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Draft Depth:</span>
                  <strong style={{ color: '#f8fafc' }}>{b.draft} CD</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Estimated Departure:</span>
                  <strong style={{ color: '#f8fafc' }}>{b.etd}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail drawer for selected berth */}
      {selectedBerth && (
        <div
          style={{
            marginTop: '2rem',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid #38bdf8',
            borderRadius: '6px',
            padding: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Ship size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                ACTIVE INSPECTION: {selectedBerth.berthNumber}
              </div>
              <h4 style={{ margin: '0.125rem 0 0', fontSize: '1.125rem', color: '#f8fafc' }}>
                {selectedBerth.vessel} ({selectedBerth.capacityTeu})
              </h4>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.8125rem',
              color: 'var(--tmpl-text-muted)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase' }}>Current ETA</div>
              <strong style={{ color: '#f8fafc' }}>{selectedBerth.eta}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase' }}>ETD Window</div>
              <strong style={{ color: '#f8fafc' }}>{selectedBerth.etd}</strong>
            </div>
            <div>
              <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase' }}>Safety Clearance</div>
              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={14} /> Customs & Coast Guard Approved
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

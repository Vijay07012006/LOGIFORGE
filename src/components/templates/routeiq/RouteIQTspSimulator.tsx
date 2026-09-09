'use client';

import React, { useState } from 'react';
import { GitBranch } from 'lucide-react';
import styles from './RouteIQ.module.css';

interface StopItem {
  id: number;
  label: string;
  tw: string;
  demandKg: number;
  unoptimizedSeq: number;
  neuralSeq: number;
}

const STOPS: StopItem[] = [
  { id: 1, label: 'Depot (South Bay Logistics Hub)', tw: '07:00 - 07:30', demandKg: 0, unoptimizedSeq: 1, neuralSeq: 1 },
  { id: 2, label: 'Delivery A (Downtown Retail Flagship)', tw: '08:00 - 09:00', demandKg: 850, unoptimizedSeq: 2, neuralSeq: 3 },
  { id: 3, label: 'Delivery B (Northside Fulfillment Node)', tw: '08:30 - 09:30', demandKg: 1200, unoptimizedSeq: 3, neuralSeq: 2 },
  { id: 4, label: 'Delivery C (Airport Air-Cargo Cargo Bay)', tw: '10:00 - 11:00', demandKg: 640, unoptimizedSeq: 4, neuralSeq: 4 },
  { id: 5, label: 'Delivery D (East Valley Distribution Node)', tw: '11:30 - 12:30', demandKg: 910, unoptimizedSeq: 5, neuralSeq: 5 },
  { id: 6, label: 'Return Depot (Recharge & Staging)', tw: '13:00 - 14:00', demandKg: 0, unoptimizedSeq: 6, neuralSeq: 6 },
];

export const RouteIQTspSimulator: React.FC = () => {
  const [solverMode, setSolverMode] = useState<'sequential' | 'neural'>('neural');

  const stopsSorted = [...STOPS].sort((a, b) =>
    solverMode === 'neural' ? a.neuralSeq - b.neuralSeq : a.unoptimizedSeq - b.unoptimizedSeq
  );

  return (
    <section id="solver" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <GitBranch size={14} />
          <span>DYNAMIC NP-HARD TRAVELING SALESPERSON ENGINE</span>
        </div>
        <h2 className={styles.sectionTitle}>Interactive Multi-Stop TSP Solver</h2>
        <p className={styles.sectionSubtitle}>
          Compare standard sequential order routing against neural clustering heuristics across
          tight time-window constraints and vehicle weight balances.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          type="button"
          className={`${styles.pillBtn} ${solverMode === 'sequential' ? styles.btnPrimary : ''}`}
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setSolverMode('sequential')}
        >
          Baseline Sequential Order (Naive FIFO)
        </button>
        <button
          type="button"
          className={`${styles.pillBtn} ${solverMode === 'neural' ? styles.btnPrimary : ''}`}
          style={{ padding: '0.625rem 1.25rem', fontSize: '0.875rem' }}
          onClick={() => setSolverMode('neural')}
        >
          RouteIQ Neural Clustering Solver (Heuristic)
        </button>
      </div>

      <div className={styles.tspComparisonGrid}>
        <div>
          <h3 style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Active Dispatch Sequence</span>
            <span style={{ fontSize: '0.75rem', color: solverMode === 'neural' ? '#10b981' : '#f59e0b' }}>
              ({solverMode === 'neural' ? 'Neural Optimized' : 'Standard FIFO'})
            </span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stopsSorted.map((stop, idx) => (
              <div key={stop.id} className={styles.stopNode}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: solverMode === 'neural' ? '#a855f7' : '#475569',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: 600 }}>{stop.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Window: {stop.tw} • Payload: {stop.demandKg > 0 ? `${stop.demandKg} kg` : 'N/A'}
                    </div>
                  </div>
                </div>
                <span style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 700 }}>
                  Waypoint #{idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.routeVisualBox}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>SOLVER TELEMETRY BENCHMARK</span>
          <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.75rem', fontWeight: 800, color: '#c084fc' }}>
            {solverMode === 'neural' ? '48.2 Miles Total Transit' : '64.8 Miles Total Transit'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ background: '#0e1424', padding: '0.875rem', borderRadius: '6px', border: '1px solid var(--tmpl-border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TOTAL FLEET DWELL TIME</div>
              <div style={{ color: '#f8fafc', fontWeight: 700 }}>
                {solverMode === 'neural' ? '2 Hours 14 Mins' : '3 Hours 08 Mins'}
              </div>
            </div>

            <div style={{ background: '#0e1424', padding: '0.875rem', borderRadius: '6px', border: '1px solid var(--tmpl-border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>TIME WINDOW VIOLATIONS</div>
              <div style={{ color: solverMode === 'neural' ? '#10b981' : '#ef4444', fontWeight: 700 }}>
                {solverMode === 'neural' ? '0 Violations (100% On-Time SLA)' : '2 Late Arrivals (SLA Penalty Risk)'}
              </div>
            </div>

            <div style={{ background: '#0e1424', padding: '0.875rem', borderRadius: '6px', border: '1px solid var(--tmpl-border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>COMPUTE CYCLE LATENCY</div>
              <div style={{ color: '#c084fc', fontWeight: 700 }}>
                {solverMode === 'neural' ? '41.8 milliseconds (GPU Matrix Kernel)' : '2.1 seconds (Brute Force)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

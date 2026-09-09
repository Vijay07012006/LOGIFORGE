'use client';

import React, { useState } from 'react';
import { Train, Clock, CheckCircle2, ArrowUpRight, Flame } from 'lucide-react';
import styles from './PortAxis.module.css';

interface RailSchedule {
  id: string;
  trainId: string;
  railroad: string;
  destination: string;
  wagonsTeu: number;
  cutoff: string;
  departure: string;
  track: string;
  progressPct: number;
  status: 'loading' | 'staged' | 'queued' | 'scheduled';
}

const RAIL_TIMETABLE: RailSchedule[] = [
  {
    id: 'r-01',
    trainId: 'BNSF-CHI-8812',
    railroad: 'BNSF Railway',
    destination: 'Chicago Corwith / Elwood Logistics Park',
    wagonsTeu: 240,
    cutoff: 'Today 19:30 UTC',
    departure: 'Today 21:15 UTC',
    track: 'Track 02 (On-Dock West)',
    progressPct: 88,
    status: 'loading',
  },
  {
    id: 'r-02',
    trainId: 'UP-DAL-4019',
    railroad: 'Union Pacific',
    destination: 'Dallas Intermodal Terminal (DIT, TX)',
    wagonsTeu: 196,
    cutoff: 'Tomorrow 04:00 UTC',
    departure: 'Tomorrow 06:30 UTC',
    track: 'Track 04 (On-Dock East)',
    progressPct: 100,
    status: 'staged',
  },
  {
    id: 'r-03',
    trainId: 'BNSF-KCY-1102',
    railroad: 'BNSF Railway',
    destination: 'Kansas City Argentine Intermodal Yard',
    wagonsTeu: 210,
    cutoff: 'Tomorrow 14:00 UTC',
    departure: 'Tomorrow 16:45 UTC',
    track: 'Track 01 (On-Dock West)',
    progressPct: 35,
    status: 'loading',
  },
  {
    id: 'r-04',
    trainId: 'UP-MEM-6631',
    railroad: 'Union Pacific',
    destination: 'Memphis Marion Intermodal Facility (TN)',
    wagonsTeu: 180,
    cutoff: 'Day +2 02:00 UTC',
    departure: 'Day +2 04:30 UTC',
    track: 'Track 05 (On-Dock Central)',
    progressPct: 0,
    status: 'queued',
  },
];

export const PortAxisIntermodal: React.FC = () => {
  const [selectedTrain, setSelectedTrain] = useState<RailSchedule>(RAIL_TIMETABLE[0]);

  return (
    <section id="rail-intermodal" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Train size={14} />
          <span>ON-DOCK CLASS-1 RAIL CONNECTIONS</span>
        </div>
        <h2 className={styles.sectionTitle}>Intermodal Rail Schedules & Direct Loops</h2>
        <p className={styles.sectionSubtitle}>
          Zero drayage highway transit needed. Direct dock-to-rail transfer with 8 working
          tracks connecting BNSF and Union Pacific double-stack networks across the Midwest.
        </p>
      </div>

      {/* Sustainability and throughput highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            background: 'var(--tmpl-surface)',
            border: '1px solid var(--tmpl-border)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}
        >
          <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
            <Flame size={16} /> CARBON SAVINGS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0.25rem 0', fontFamily: 'monospace' }}>
            -68% CO₂
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
            Direct rail dispatch eliminates up to 450 miles of highway diesel trucking per container.
          </p>
        </div>

        <div
          style={{
            background: 'var(--tmpl-surface)',
            border: '1px solid var(--tmpl-border)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}
        >
          <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
            <Train size={16} /> WORKING TRACKS
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', margin: '0.25rem 0', fontFamily: 'monospace' }}>
            8 Tracks / 28,000 ft
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
            Simultaneous double-stack assembly with electric wide-span rail gantries.
          </p>
        </div>

        <div
          style={{
            background: 'var(--tmpl-surface)',
            border: '1px solid var(--tmpl-border)',
            borderRadius: '6px',
            padding: '1.25rem',
          }}
        >
          <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 700 }}>
            <Clock size={16} /> TRANSIT SPEED
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0.25rem 0', fontFamily: 'monospace' }}>
            54h to Chicago
          </div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
            Dedicated express corridor direct from berth hoist to midwestern intermodal hub.
          </p>
        </div>
      </div>

      <div className={styles.berthBoardCard}>
        <div className={styles.railTableWrapper}>
          <table className={styles.railTable}>
            <thead>
              <tr>
                <th>Train Service / ID</th>
                <th>Operator</th>
                <th>Destination Hub</th>
                <th>Capacity</th>
                <th>Loading Staging</th>
                <th>Cutoff Window</th>
                <th>Departure UTC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {RAIL_TIMETABLE.map((row) => {
                const isSelected = selectedTrain.id === row.id;
                return (
                  <tr
                    key={row.id}
                    style={{
                      background: isSelected ? 'rgba(56, 189, 248, 0.08)' : undefined,
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedTrain(row)}
                  >
                    <td>
                      <div style={{ fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
                        {row.trainId}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#38bdf8' }}>{row.track}</div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{row.railroad}</td>
                    <td>
                      <div style={{ color: '#f8fafc', fontWeight: 600 }}>{row.destination}</div>
                    </td>
                    <td style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
                      {row.wagonsTeu} TEU
                    </td>
                    <td style={{ minWidth: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '0.25rem', fontFamily: 'monospace' }}>
                        <span>{row.progressPct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.progressPct}%`, height: '100%', background: row.progressPct === 100 ? '#10b981' : '#38bdf8' }} />
                      </div>
                    </td>
                    <td style={{ color: 'var(--tmpl-text-muted)', fontSize: '0.8125rem' }}>{row.cutoff}</td>
                    <td style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.8125rem' }}>{row.departure}</td>
                    <td>
                      {row.status === 'staged' && (
                        <span className={styles.statusCleared}>
                          <CheckCircle2 size={12} /> STAGED
                        </span>
                      )}
                      {row.status === 'loading' && (
                        <span className={styles.statusWorking}>
                          LOADING
                        </span>
                      )}
                      {row.status === 'queued' && (
                        <span className={styles.statusPending}>
                          QUEUED
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected train detail banner */}
        {selectedTrain && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--tmpl-border-light)',
              borderRadius: '6px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                INTERMODAL BOOKING CODE: {selectedTrain.trainId}
              </span>
              <div style={{ fontSize: '0.9375rem', color: '#f8fafc', fontWeight: 600, marginTop: '0.25rem' }}>
                Assigned to {selectedTrain.track} • Pre-Mount Slot Reservation Open
              </div>
            </div>
            <a
              href="#gate-turnaround"
              className={styles.btnSteel}
              style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem', flex: '0 0 auto' }}
            >
              <span>Match Container to Rail Car</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import styles from './ShipFlow.module.css';

const SAILINGS = [
  {
    id: 'sf-101',
    vessel: 'Nordic Aurora',
    imo: 'IMO 9840219',
    originPort: 'Shanghai (CNSHA)',
    destPort: 'Rotterdam (NLRTM)',
    departure: '2026-09-14',
    transitDays: '21 Days',
    serviceLoop: 'AE-10 Northern Europe Express',
    availability: 'Guaranteed Slots (42 TEU left)',
    status: 'guaranteed',
  },
  {
    id: 'sf-102',
    vessel: 'Oslo Pioneer',
    imo: 'IMO 9791840',
    originPort: 'Singapore (SGSIN)',
    destPort: 'Antwerp (BEANR)',
    departure: '2026-09-16',
    transitDays: '19 Days',
    serviceLoop: 'Malacca-North Sea Direct',
    availability: 'Tight Capacity (8 TEU left)',
    status: 'tight',
  },
  {
    id: 'sf-103',
    vessel: 'Viking Voyager',
    imo: 'IMO 9901423',
    originPort: 'Shanghai (CNSHA)',
    destPort: 'Long Beach (USLGB)',
    departure: '2026-09-18',
    transitDays: '13 Days',
    serviceLoop: 'Trans-Pacific Pearl Express',
    availability: 'Guaranteed Slots (110 TEU left)',
    status: 'guaranteed',
  },
  {
    id: 'sf-104',
    vessel: 'Baltic Sovereign',
    imo: 'IMO 9823901',
    originPort: 'Rotterdam (NLRTM)',
    destPort: 'New York (USNYC)',
    departure: '2026-09-20',
    transitDays: '9 Days',
    serviceLoop: 'Trans-Atlantic Express West',
    availability: 'Guaranteed Slots (65 TEU left)',
    status: 'guaranteed',
  },
  {
    id: 'sf-105',
    vessel: 'Copenhagen Breeze',
    imo: 'IMO 9760124',
    originPort: 'Singapore (SGSIN)',
    destPort: 'Hamburg (DEHAM)',
    departure: '2026-09-22',
    transitDays: '22 Days',
    serviceLoop: 'Euro-Asia Green Steaming',
    availability: 'Waitlist Only (Full Allocation)',
    status: 'tight',
  },
];

export function ShipFlowSchedules() {
  const [selectedPort, setSelectedPort] = useState('ALL');
  const [bookedId, setBookedId] = useState<string | null>(null);

  const filtered =
    selectedPort === 'ALL'
      ? SAILINGS
      : SAILINGS.filter((s) => s.originPort.includes(selectedPort));

  return (
    <div className={styles.section} id="schedules">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Calendar size={14} />
          GLOBAL SAILING SCHEDULES
        </div>
        <h2 className={styles.sectionTitle}>Direct Port-to-Port Vessel Rotations</h2>
        <p className={styles.sectionSubtitle}>
          Real-time liner schedules with guaranteed container allocations and direct carrier transit times across primary trade corridors.
        </p>
      </div>

      <div className={styles.matrixContainer}>
        <div className={styles.portFilterRow}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--tmpl-text-muted)', marginRight: '0.5rem' }}>
            Filter Origin Port:
          </span>
          {['ALL', 'Shanghai', 'Singapore', 'Rotterdam'].map((port) => (
            <button
              key={port}
              type="button"
              onClick={() => setSelectedPort(port)}
              className={`${styles.portChip} ${
                selectedPort === port ? styles.portChipActive : ''
              }`}
            >
              {port === 'ALL' ? 'All Global Hubs' : port}
            </button>
          ))}
        </div>

        <div className={styles.schedulesTableWrapper}>
          <table className={styles.schedulesTable}>
            <thead>
              <tr>
                <th>Vessel / IMO</th>
                <th>Trade Corridor</th>
                <th>Est. Departure</th>
                <th>Transit</th>
                <th>Liner Allocation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className={styles.vesselName}>{s.vessel}</div>
                    <div className={styles.vesselImo}>{s.imo}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--tmpl-text)' }}>
                      {s.originPort} &rarr; {s.destPort}
                    </div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--tmpl-text-muted)' }}>
                      {s.serviceLoop}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontFamily: 'monospace' }}>{s.departure}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--tmpl-accent-secondary)' }}>
                      {s.transitDays}
                    </span>
                  </td>
                  <td>
                    <span className={s.status === 'guaranteed' ? styles.slotAvailable : styles.slotTight}>
                      {s.status === 'guaranteed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {s.availability}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setBookedId(s.id)}
                      className={styles.btnNordic}
                      style={{
                        padding: '0.375rem 0.875rem',
                        fontSize: '0.75rem',
                        minHeight: '32px',
                        background: bookedId === s.id ? '#10b981' : undefined,
                      }}
                    >
                      {bookedId === s.id ? 'Slot Reserved' : 'Hold Space'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

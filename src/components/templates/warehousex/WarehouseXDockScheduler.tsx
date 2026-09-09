'use client';

import React from 'react';
import { Truck, Clock } from 'lucide-react';
import styles from './WarehouseX.module.css';

interface DockDoor {
  id: string;
  name: string;
  carrier: string;
  type: 'Inbound Offload' | 'Outbound Dispatch' | 'Cross-Dock';
  status: 'In Progress' | 'Scheduled' | 'Available';
  turnaroundEst: string;
  trailerId: string;
}

const DOCKS: DockDoor[] = [
  { id: 'd1', name: 'DOCK 01', carrier: 'FleetOne Logistics', type: 'Inbound Offload', status: 'In Progress', turnaroundEst: '14 Mins Remaining', trailerId: 'TR-8812' },
  { id: 'd2', name: 'DOCK 02', carrier: 'CargoNova Freight', type: 'Inbound Offload', status: 'In Progress', turnaroundEst: '08 Mins Remaining', trailerId: 'TR-4402' },
  { id: 'd3', name: 'DOCK 03', carrier: 'SwiftDrop Express', type: 'Cross-Dock', status: 'Scheduled', turnaroundEst: 'Next: 14:00 (In 22 min)', trailerId: 'SD-9912' },
  { id: 'd4', name: 'DOCK 04', carrier: 'National Reefer Direct', type: 'Inbound Offload', status: 'In Progress', turnaroundEst: '26 Mins Remaining', trailerId: 'RF-3011' },
  { id: 'd5', name: 'DOCK 05', carrier: 'Apex Heavy Haul', type: 'Outbound Dispatch', status: 'In Progress', turnaroundEst: '19 Mins Remaining', trailerId: 'AP-1029' },
  { id: 'd6', name: 'DOCK 06', carrier: 'Open Bay', type: 'Cross-Dock', status: 'Available', turnaroundEst: 'Ready for Staging', trailerId: '—' },
  { id: 'd7', name: 'DOCK 07', carrier: 'Penske Dedicated', type: 'Outbound Dispatch', status: 'Scheduled', turnaroundEst: 'Next: 14:15', trailerId: 'PK-7740' },
  { id: 'd8', name: 'DOCK 08', carrier: 'Ryder Logistics', type: 'Inbound Offload', status: 'In Progress', turnaroundEst: '11 Mins Remaining', trailerId: 'RY-6610' },
];

export const WarehouseXDockScheduler: React.FC = () => {
  return (
    <section id="docks" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Truck size={14} />
          <span>FACILITY YARD & APPOINTMENT MANAGEMENT</span>
        </div>
        <h2 className={styles.sectionTitle}>Inbound & Outbound Dock Scheduling</h2>
        <p className={styles.sectionSubtitle}>
          Real-time trailer turnaround tracking across receiving and shipping bays with automated WMS cross-dock allocation.
        </p>
      </div>

      <div className={styles.dockGrid}>
        {DOCKS.map((dock) => (
          <div
            key={dock.id}
            className={`${styles.dockCard} ${dock.status === 'In Progress' ? styles.dockCardActive : ''}`}
          >
            <div className={styles.dockTop}>
              <span className={styles.dockNumber}>{dock.name}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: dock.status === 'In Progress' ? '#10b981' : dock.status === 'Scheduled' ? '#f59e0b' : '#94a3b8',
                }}
              >
                {dock.status.toUpperCase()}
              </span>
            </div>

            <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9375rem' }}>
              {dock.carrier}
            </div>

            <div className={styles.trailerInfo}>
              <strong>Trailer:</strong> {dock.trailerId} • {dock.type}
            </div>

            <div className={styles.timeTurnaround}>
              <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
              {dock.turnaroundEst}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

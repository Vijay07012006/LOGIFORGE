'use client';

import React from 'react';
import { Truck, Bike, Footprints, BatteryCharging } from 'lucide-react';
import styles from './SwiftDrop.module.css';

const FLEET_VEHICLES = [
  {
    icon: Truck,
    name: 'Rivian EDV-700 Electric Vans',
    type: 'Heavy Urban Delivery',
    specs: ['660 cu ft Cargo Volume', '150-Mile Battery Range', 'Automated Bulkhead Doors', 'Regenerative Braking'],
  },
  {
    icon: Bike,
    name: 'Heavy-Duty Cargo E-Trikes',
    type: 'Congestion Bypass Fleet',
    specs: ['250 kg Payload Capacity', 'Bike-Lane & Pedestrian Zone Permitted', 'Pedal-Assist 750W Motor', 'Locking Insulated Box'],
  },
  {
    icon: Footprints,
    name: 'High-Rise Foot Messengers',
    type: 'Skyscraper Vertical Delivery',
    specs: ['Direct Elevator Security Passes', 'Average 6-Minute Floor Drop', 'Dedicated District Wardens', 'Hand-to-Hand Verification'],
  },
];

export function SwiftDropFleet() {
  return (
    <div className={styles.section} id="fleet">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <BatteryCharging size={14} />
          ZERO-EMISSION LOGISTICS
        </div>
        <h2 className={styles.sectionTitle}>Metropolitan Courier Fleet</h2>
        <p className={styles.sectionSubtitle}>
          Custom electric vehicles and foot couriers navigating inner-city grids with maximum agility and minimal noise.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {FLEET_VEHICLES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.name} className={styles.bentoCard}>
              <div className={styles.bentoIconBox}>
                <Icon size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-accent)', fontWeight: 700 }}>
                  {f.type}
                </span>
                <h3 className={styles.bentoTitle} style={{ marginTop: '0.25rem' }}>
                  {f.name}
                </h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--tmpl-text-muted)', borderTop: '1px solid var(--tmpl-border-light)', paddingTop: '1rem' }}>
                {f.specs.map((s) => (
                  <li key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--tmpl-accent)' }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

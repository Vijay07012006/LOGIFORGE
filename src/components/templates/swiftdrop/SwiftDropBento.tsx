'use client';

import React from 'react';
import { Zap, Lock, ThermometerSnowflake, Route, Leaf } from 'lucide-react';
import styles from './SwiftDrop.module.css';

const BENTO_CARDS = [
  {
    icon: Zap,
    title: '45-Minute Hyper-Local Flash SLA',
    description:
      'High-velocity point-to-point courier dispatch utilizing automated rider pairing within a 5-mile urban radius. Guaranteed delivery within under an hour for urgent business parcels.',
    span2: true,
  },
  {
    icon: Lock,
    title: 'Smart Parcel Locker Network',
    description:
      '24/7 automated pickup stations across 180+ subway hubs and residential complexes with instant one-time Bluetooth/QR release pins.',
  },
  {
    icon: ThermometerSnowflake,
    title: 'Validated Cold-Chain Micro-Totes',
    description:
      'Insulated passive cryogenic containers ensuring 2°C - 8°C stability for biomedical samples, pharmaceuticals, and fresh groceries.',
  },
  {
    icon: Route,
    title: 'Dynamic AI Route Re-Sequencing',
    description:
      'Algorithms continuously re-route active couriers in real time to bypass construction, parades, and localized metropolitan traffic jams.',
  },
  {
    icon: Leaf,
    title: '100% Zero-Emission Urban Fleet',
    description:
      'Dedicated fleet of custom Rivian electric vans, e-cargo trikes, and walking messengers reducing downtown carbon footprint to zero.',
  },
];

export function SwiftDropBento() {
  return (
    <div className={styles.section} id="features">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>MODERN BENTO ARCHITECTURE</div>
        <h2 className={styles.sectionTitle}>Engineered for Metropolitan Speed</h2>
        <p className={styles.sectionSubtitle}>
          Modular technology stack designed to fulfill the expectations of modern hyper-local e-commerce and immediate courier delivery.
        </p>
      </div>

      <div className={styles.bentoGrid}>
        {BENTO_CARDS.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.title}
              className={`${styles.bentoCard} ${b.span2 ? styles.bentoColSpan2 : ''}`}
            >
              <div className={styles.bentoIconBox}>
                <Icon size={22} />
              </div>
              <h3 className={styles.bentoTitle}>{b.title}</h3>
              <p className={styles.bentoDesc}>{b.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

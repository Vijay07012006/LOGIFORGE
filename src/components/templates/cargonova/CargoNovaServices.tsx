'use client';

import React from 'react';
import { Ship, Plane, FileCheck2, Box, Warehouse, ThermometerSnowflake, Check } from 'lucide-react';
import styles from './CargoNova.module.css';

const SERVICES = [
  {
    icon: Ship,
    title: 'Global Ocean Freight',
    description:
      'Full Container Load (FCL) and Less than Container Load (LCL) consolidation across 38 global shipping alliances with guaranteed space allocation.',
    features: [
      'Direct carrier service contracts',
      'Port-to-port and door-to-door drayage',
      'Continuous AIS satellite tracking',
    ],
  },
  {
    icon: Plane,
    title: 'Expedited Air Charter',
    description:
      'Priority next-flight-out and scheduled air freight chartering for high-value machinery, aerospace AOG, and critical electronics.',
    features: [
      'IATA certified dangerous goods',
      'Airport tarmac direct transfers',
      'Guaranteed transit time SLAs',
    ],
  },
  {
    icon: FileCheck2,
    title: 'Customs Brokerage',
    description:
      'In-house licensed customs brokers managing automated duty drawback, Harmonized Tariff Schedule (HTS) binding rulings, and C-TPAT audits.',
    features: [
      'Electronic Automated Commercial System (ACE)',
      'Carnet ATA and temporary imports',
      'Pre-clearance before port arrival',
    ],
  },
  {
    icon: Box,
    title: 'Breakbulk & Project Cargo',
    description:
      'Engineered transport solutions for oversized industrial equipment, wind turbine assemblies, and infrastructure construction modules.',
    features: [
      'Bespoke heavy-lift route surveys',
      'Barge transshipment and crane rigging',
      'On-site marine cargo warranty surveyors',
    ],
  },
  {
    icon: Warehouse,
    title: 'Foreign Trade Zone Storage',
    description:
      'Bonded warehousing facilities positioned adjacent to primary deepwater terminals for duty-deferred storage and automated pick-and-pack.',
    features: [
      'Automated WMS inventory integration',
      'Cross-docking and container devanning',
      'High-security biometric monitoring',
    ],
  },
  {
    icon: ThermometerSnowflake,
    title: 'Pharma & Cold-Chain Logistics',
    description:
      'Temperature-controlled active reefer and cryogenic transport validated according to GDP (Good Distribution Practice) standards.',
    features: [
      'Real-time GPS temp/humidity data logging',
      'Dry ice replenishment networks',
      'Dedicated cold room tarmac staging',
    ],
  },
];

export function CargoNovaServices() {
  return (
    <div className={styles.section} id="services">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>SPECIALIZED CAPABILITIES</div>
        <h2 className={styles.sectionTitle}>Engineered Multimodal Freight Solutions</h2>
        <p className={styles.sectionSubtitle}>
          Tailored logistics architecture combining deep ocean carrying capacity with time-critical aviation agility and regulatory rigor.
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={styles.serviceCard}>
              <div className={styles.serviceIconBox}>
                <Icon size={24} />
              </div>
              <h3 className={styles.serviceTitle}>{s.title}</h3>
              <p className={styles.serviceDesc}>{s.description}</p>
              <ul className={styles.serviceFeatures}>
                {s.features.map((f) => (
                  <li key={f} className={styles.serviceFeatureItem}>
                    <Check size={14} color="var(--tmpl-accent)" />
                    <span>{f}</span>
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

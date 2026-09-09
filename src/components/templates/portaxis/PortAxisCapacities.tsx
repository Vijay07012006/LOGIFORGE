'use client';

import React from 'react';
import { Anchor, ShieldCheck, Zap, Thermometer, Layers, Cpu } from 'lucide-react';
import styles from './PortAxis.module.css';

const INFRASTRUCTURE_SPECS = [
  {
    icon: <Anchor size={22} />,
    title: '16.5m Natural Depth Draft',
    value: '16.5m CD',
    desc: 'Tide-independent deepwater channel engineered to accommodate fully laden 24,000 TEU Megamax container vessels.',
  },
  {
    icon: <Zap size={22} />,
    title: 'Super Post-Panamax Cranes',
    value: '24 STS Units',
    desc: 'Electric ship-to-shore gantry cranes with 26-row outreach, twin-twenty lift spreaders, and 35+ gross moves/hr velocity.',
  },
  {
    icon: <Thermometer size={22} />,
    title: 'Active Reefer Yard Plugs',
    value: '2,400 Plugs',
    desc: 'Dedicated cold-chain monitoring yard with 24/7 automated telemetry, backup generators, and USDA cold-treatment logging.',
  },
  {
    icon: <Layers size={22} />,
    title: 'On-Dock Intermodal Yard',
    value: '28,000 Track Ft',
    desc: '8 on-dock Class-1 rail tracks connecting BNSF and Union Pacific direct to key Midwestern consumer distribution centers.',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Automated Optical Gates',
    value: '16 Lanes',
    desc: 'High-speed OCR camera portals with integrated weigh-in-motion scales and automated TWIC / ISPS credential verification.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'ISPS & CBP Security Portal',
    value: 'Level 1 ISPS',
    desc: '100% RPM radiation portal inspection, CSI compliance, and bonded perimeter security meeting highest maritime safety protocols.',
  },
];

export const PortAxisCapacities: React.FC = () => {
  return (
    <section id="infrastructure" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Layers size={14} />
          <span>TERMINAL ASSETS & SPECIFICATIONS</span>
        </div>
        <h2 className={styles.sectionTitle}>Engineered for Global Mega-Vessels</h2>
        <p className={styles.sectionSubtitle}>
          From 16.5-meter deepwater approaches to electrified rail intermodal sidings,
          explore the infrastructure powering our 4.2 million TEU annual throughput.
        </p>
      </div>

      <div className={styles.specGrid}>
        {INFRASTRUCTURE_SPECS.map((spec, idx) => (
          <div key={idx} className={styles.specCard}>
            <div className={styles.specIconBox}>{spec.icon}</div>
            <div className={styles.specValue}>{spec.value}</div>
            <h3 className={styles.specTitle}>{spec.title}</h3>
            <p className={styles.specDesc}>{spec.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

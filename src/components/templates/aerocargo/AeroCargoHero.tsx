'use client';

import React from 'react';
import { Plane, Compass } from 'lucide-react';
import styles from './AeroCargo.module.css';

interface AeroCargoHeroProps {
  onAwbClick: () => void;
  onUldClick: () => void;
}

export function AeroCargoHero({ onAwbClick, onUldClick }: AeroCargoHeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroInner}>
        <div className={styles.aviationTicker}>
          <span className={styles.tickerRadar} />
          <span>IATA CARRIER CODE: AC / 020</span>
          <span>•</span>
          <span>MAINDECK B777-F FREIGHTERS: 28 ACTIVE</span>
          <span>•</span>
          <span>CRUISE: MACH 0.84</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Time-Definite Aviation Cargo &amp; <span className={styles.heroHeadlineSky}>Airway Telematics</span>.
        </h1>

        <p className={styles.heroLead}>
          Scheduled international air freight corridors, Nose-Door heavy charter operations, and IATA CEIV Pharma certified tarmac cold-chains connecting Frankfurt, Chicago, Incheon, and Dubai.
        </p>

        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.btnAero}
            onClick={onAwbClick}
          >
            Track Airway Bill (AWB)
            <Plane size={16} />
          </button>
          <button
            type="button"
            className={styles.btnCockpit}
            onClick={onUldClick}
          >
            Aircraft ULD Calculator
            <Compass size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { Ship, Calendar } from 'lucide-react';
import styles from './ShipFlow.module.css';

interface ShipFlowHeroProps {
  onSchedulesClick: () => void;
  onContainersClick: () => void;
}

export function ShipFlowHero({
  onSchedulesClick,
  onContainersClick,
}: ShipFlowHeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroInner}>
        <div className={styles.vesselTicker}>
          <span className={styles.tickerPulse} />
          <span>NORDIC OCEAN CARRIER ALLIANCE</span>
          <span>•</span>
          <span>164 ACTIVE LINERS</span>
          <span>•</span>
          <span>AVG PORT QUEUE: 2.8 HRS</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Pure Ocean Freight &amp; <span className={styles.heroHeadlineAccent}>Nordic Maritime Precision</span>.
        </h1>

        <p className={styles.heroLead}>
          High-transparency container shipping schedules, live berth congestion telemetry, and dual-fuel bio-methanol liner deployments connecting Europe, Asia, and North America.
        </p>

        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.btnNordic}
            onClick={onSchedulesClick}
          >
            Inspect Sailing Matrix
            <Calendar size={16} />
          </button>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={onContainersClick}
          >
            Container Specifications
            <Ship size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

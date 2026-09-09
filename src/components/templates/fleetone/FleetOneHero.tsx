'use client';

import React from 'react';
import { Gauge, Radio } from 'lucide-react';
import styles from './FleetOne.module.css';

interface FleetOneHeroProps {
  onTelematicsClick: () => void;
  onDispatchClick: () => void;
}

export function FleetOneHero({
  onTelematicsClick,
  onDispatchClick,
}: FleetOneHeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroInner}>
        <div className={styles.commandHudStatus}>
          <span className={styles.hudPulse} />
          <span>COMMAND SYSTEM: ONLINE</span>
          <span>•</span>
          <span>ACTIVE POWER UNITS: 840 TRACTORS</span>
          <span>•</span>
          <span>TELEMETRY SYNC: 100ms</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Industrial Heavy Transport &amp; <span className={styles.heroHeadlineHighlight}>Fleet Telematics</span>.
        </h1>

        <p className={styles.heroLead}>
          Engineered for mission-critical freight corridors, heavy haul lowboys, and temperature-controlled reefer fleets. Real-time ECM engine telemetry, automated FMCSA electronic logs, and dynamic corridor dispatch.
        </p>

        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.btnHazard}
            onClick={onTelematicsClick}
          >
            Inspect Live Diagnostics
            <Gauge size={16} />
          </button>
          <button
            type="button"
            className={styles.btnTechnical}
            onClick={onDispatchClick}
          >
            Launch Dispatch Console
            <Radio size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

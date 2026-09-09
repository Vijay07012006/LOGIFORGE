'use client';

import React from 'react';
import { Compass, ArrowRight, Orbit, Radio } from 'lucide-react';
import styles from './MoveSphere.module.css';

interface MoveSphereHeroProps {
  onTrackContainer?: () => void;
  onExploreCorridors?: () => void;
  onSmartPack?: () => void;
}

export const MoveSphereHero: React.FC<MoveSphereHeroProps> = ({
  onTrackContainer,
  onExploreCorridors,
  onSmartPack,
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.quantumTicker}>
          <span className={styles.pulseDot} />
          <span>AUTONOMOUS SPHERE STATUS: 4.8B TELEMETRY PINGS / DAY</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>100% ZERO-EMISSION NETWORK</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>QUANTUM SENSOR SEAL ACTIVE</span>
        </div>

        <div className={styles.eyebrow}>
          <Orbit size={14} />
          <span>FUTURISTIC AUTONOMOUS LOGISTICS</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Intermodal Transport Grid of the <br />
          <span className={styles.heroHeadlineAccent}>Next Century</span>
        </h1>

        <p className={styles.heroLead}>
          Autonomous containerized vessels, maglev freight corridors, and smart atmospheric
          monitoring containers orchestrated into a synchronized global cyber-physical grid.
        </p>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onTrackContainer}
          >
            <span>Track Quantum Smart Container</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onExploreCorridors}
          >
            <Compass size={18} />
            <span>Autonomous Corridors</span>
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onSmartPack}
          >
            <Radio size={18} />
            <span>Smart Payload Packager</span>
          </button>
        </div>

        <div className={styles.heroMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>4.8B</div>
            <div className={styles.metricLbl}>Daily Sensor Pings</div>
            <div className={styles.metricSub}>Sub-minute satellite uplink</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>100%</div>
            <div className={styles.metricLbl}>Zero-Emission Propulsion</div>
            <div className={styles.metricSub}>Hydrogen fuel cell & electric maglev</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>0.001g</div>
            <div className={styles.metricLbl}>Shock Inertial Damping</div>
            <div className={styles.metricSub}>Active magnetic levitation pod</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>16 Nodes</div>
            <div className={styles.metricLbl}>Interplanetary Gateways</div>
            <div className={styles.metricSub}>Sub-orbital & spaceport ready</div>
          </div>
        </div>
      </div>
    </section>
  );
};

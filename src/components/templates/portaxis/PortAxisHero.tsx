'use client';

import React from 'react';
import { Anchor, ArrowRight, Compass, ShieldCheck, Cpu } from 'lucide-react';
import styles from './PortAxis.module.css';

interface PortAxisHeroProps {
  onExploreBerths?: () => void;
  onGateLookup?: () => void;
  onIntermodal?: () => void;
}

export const PortAxisHero: React.FC<PortAxisHeroProps> = ({
  onExploreBerths,
  onGateLookup,
  onIntermodal,
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.terminalTicker}>
          <span className={styles.terminalPulse} />
          <span>PORTAXIS TERMINAL STATUS: CHANNEL 16.5m DRAFT OPEN</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>6 ACTIVE BERTHS</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>AVG GATE TURN: 24.2 MIN</span>
        </div>

        <div className={styles.eyebrow}>
          <Anchor size={14} />
          <span>DEEPWATER MARITIME & INTERMODAL HUB</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Deepwater Intermodal Gateway to{' '}
          <span className={styles.heroHeadlineBlue}>Global Trade</span>
        </h1>

        <p className={styles.heroLead}>
          Operating at 16.5m natural chart datum with 4.2M TEU annual capacity.
          Direct on-dock Class-1 rail dispatch, automated Super Post-Panamax STS
          gantry cranes, and seamless truck gate turnarounds.
        </p>

        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.btnSteel}
            onClick={onExploreBerths}
          >
            <span>Live Berth Schedule</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.btnHarbor}
            onClick={onGateLookup}
          >
            <Compass size={18} />
            <span>Gate & PIN Lookup</span>
          </button>
          <button
            type="button"
            className={styles.btnHarbor}
            onClick={onIntermodal}
          >
            <Cpu size={18} />
            <span>Intermodal Rail</span>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--tmpl-text-muted)',
            marginTop: '1.5rem',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <ShieldCheck size={16} color="#38bdf8" /> ISPS Code Level 1 Certified
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Anchor size={16} color="#38bdf8" /> 24,000 TEU Ultra Large Container Vessels
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Cpu size={16} color="#38bdf8" /> Automated Optical Gate Lanes
          </span>
        </div>
      </div>
    </section>
  );
};

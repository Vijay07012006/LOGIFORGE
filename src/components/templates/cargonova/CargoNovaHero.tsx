'use client';

import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import styles from './CargoNova.module.css';

interface CargoNovaHeroProps {
  onTrackClick: () => void;
  onQuoteClick: () => void;
}

export function CargoNovaHero({ onTrackClick, onQuoteClick }: CargoNovaHeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroInner}>
        <div className={styles.heroTicker}>
          <span className={styles.tickerDot} />
          <span>CARGONOVA MARITIME &amp; AIRWAYS NETWORK</span>
          <span>•</span>
          <span>LIVE CORRIDORS: 142 ACTIVE BERTHS</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Architecting Precision in <span className={styles.heroHeadlineEm}>Global Multimodal Freight</span>.
        </h1>

        <p className={styles.heroLead}>
          Autonomous ocean container scheduling, expedited air-charter logistics, and bonded
          customs brokerage engineered for Tier-1 supply chains operating across Trans-Pacific,
          Trans-Atlantic, and Eurasian trade lanes.
        </p>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.btnGold}
            onClick={onQuoteClick}
          >
            Request Corridor Quotation
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={onTrackClick}
          >
            Track Active Waybill
            <Search size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

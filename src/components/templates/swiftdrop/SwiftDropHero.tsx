'use client';

import React from 'react';
import { Package, Zap } from 'lucide-react';
import styles from './SwiftDrop.module.css';

interface SwiftDropHeroProps {
  onQuoteClick: () => void;
  onTrackClick: () => void;
}

export function SwiftDropHero({ onQuoteClick, onTrackClick }: SwiftDropHeroProps) {
  return (
    <section className={styles.hero} id="home">
      <div className={styles.heroInner}>
        <div className={styles.courierTicker}>
          <span className={styles.tickerPulse} />
          <span>URBAN COURIER NETWORK: LIVE DISPATCH</span>
          <span>•</span>
          <span>AVG DOORSTEP SLA: 46 MINS</span>
          <span>•</span>
          <span>100% ELECTRIC FLEET</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Hyper-Local Same-Day Courier &amp; <span className={styles.heroHeadlineOrange}>Last-Mile Precision</span>.
        </h1>

        <p className={styles.heroLead}>
          On-demand urban courier dispatch, micro-fulfillment parcel delivery, and automated contactless locker infrastructure engineered for modern e-commerce and medical supply chains.
        </p>

        <div className={styles.heroButtons}>
          <button
            type="button"
            className={styles.btnOrange}
            onClick={onQuoteClick}
          >
            Calculate Parcel Rate
            <Zap size={16} />
          </button>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={onTrackClick}
          >
            Track Doorstep Courier
            <Package size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

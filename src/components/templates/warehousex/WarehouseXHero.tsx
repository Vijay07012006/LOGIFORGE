'use client';

import React from 'react';
import { Warehouse, ArrowRight, Layers, Cpu } from 'lucide-react';
import styles from './WarehouseX.module.css';

interface WarehouseXHeroProps {
  onTrackAsn?: () => void;
  onExploreRacks?: () => void;
  onDockSchedule?: () => void;
}

export const WarehouseXHero: React.FC<WarehouseXHeroProps> = ({
  onTrackAsn,
  onExploreRacks,
  onDockSchedule,
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.asrsLiveTicker}>
          <span className={styles.pulseDot} />
          <span>ASRS AUTOMATION LIVE: 14 REGIONAL HUBS ONLINE</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>45 SEC AVG RETRIEVAL</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>99.96% PICK ACCURACY</span>
        </div>

        <div className={styles.eyebrow}>
          <Warehouse size={14} />
          <span>HIGH-DENSITY AUTOMATED FULFILLMENT</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Automated Storage & <br />
          <span className={styles.heroHeadlineAccent}>Omni-Channel Distribution</span>
        </h1>

        <p className={styles.heroLead}>
          Operating 3.8M sq ft of high-velocity robotic warehousing. Multi-node ASRS bay
          storage, cold-chain temperature compartmentalization, and same-day pick-and-pack SLAs.
        </p>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onTrackAsn}
          >
            <span>Track Pallet / ASN Ingestion</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onExploreRacks}
          >
            <Layers size={18} />
            <span>Rack Density Visualizer</span>
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onDockSchedule}
          >
            <Cpu size={18} />
            <span>Dock Scheduling Hub</span>
          </button>
        </div>

        <div className={styles.heroMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>3.8M Sq Ft</div>
            <div className={styles.metricLbl}>Storage Under Management</div>
            <div className={styles.metricSub}>14 automated distribution nodes</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>99.96%</div>
            <div className={styles.metricLbl}>Barcode Pick Accuracy</div>
            <div className={styles.metricSub}>Computer-vision scan verified</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>45 Sec</div>
            <div className={styles.metricLbl}>ASRS Pallet Retrieval</div>
            <div className={styles.metricSub}>Sub-minute crane throughput</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>12 Docks</div>
            <div className={styles.metricLbl}>Automated Turnaround</div>
            <div className={styles.metricSub}>Average 28-minute trailer offload</div>
          </div>
        </div>
      </div>
    </section>
  );
};

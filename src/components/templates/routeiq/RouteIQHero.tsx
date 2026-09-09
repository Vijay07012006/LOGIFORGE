'use client';

import React from 'react';
import { Cpu, ArrowRight, GitBranch, Zap } from 'lucide-react';
import styles from './RouteIQ.module.css';

interface RouteIQHeroProps {
  onSimulateRoute?: () => void;
  onTspSolver?: () => void;
  onTelemetry?: () => void;
}

export const RouteIQHero: React.FC<RouteIQHeroProps> = ({
  onSimulateRoute,
  onTspSolver,
  onTelemetry,
}) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <div className={styles.neuralTicker}>
          <span className={styles.pulseDot} />
          <span>NEURAL DISPATCH CORE: 42ms HEURISTIC TIME</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>-23.4% DEADHEAD MILES</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>1,200+ ACTIVE SATELLITE FLEET PINGS</span>
        </div>

        <div className={styles.eyebrow}>
          <Cpu size={14} />
          <span>AI ROUTE OPTIMIZATION & TELEMETRY</span>
        </div>

        <h1 className={styles.heroHeadline}>
          Autonomous Dispatch & <br />
          <span className={styles.heroHeadlineAccent}>Predictive Route Intelligence</span>
        </h1>

        <p className={styles.heroLead}>
          Eliminate manual fleet dispatching with machine-learning heuristics.
          Sub-second multi-stop TSP solving, dynamic weather/traffic avoidance,
          and continuous CAN-bus vehicle telemetry ingestion.
        </p>

        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onSimulateRoute}
          >
            <span>Simulate Algorithmic Route</span>
            <ArrowRight size={18} />
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onTspSolver}
          >
            <GitBranch size={18} />
            <span>Interactive TSP Solver</span>
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onTelemetry}
          >
            <Zap size={18} />
            <span>CAN-Bus Telemetry Feed</span>
          </button>
        </div>

        <div className={styles.heroMetrics}>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>-23.4%</div>
            <div className={styles.metricLbl}>Deadhead Mile Reduction</div>
            <div className={styles.metricSub}>Across 12 million simulated miles</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>42 ms</div>
            <div className={styles.metricLbl}>Heuristic Compute Time</div>
            <div className={styles.metricSub}>GPU accelerated genetic solver</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>± 3 Mins</div>
            <div className={styles.metricLbl}>ETA Prediction Variance</div>
            <div className={styles.metricSub}>Within 98% confidence intervals</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricVal}>10,000+</div>
            <div className={styles.metricLbl}>Concurrent Dispatches</div>
            <div className={styles.metricSub}>Real-time streaming telemetry</div>
          </div>
        </div>
      </div>
    </section>
  );
};

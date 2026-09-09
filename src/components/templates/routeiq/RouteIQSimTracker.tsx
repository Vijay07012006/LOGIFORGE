'use client';

import React, { useState } from 'react';
import { Search, Cpu, Zap, Clock } from 'lucide-react';
import styles from './RouteIQ.module.css';

interface RouteSimulationRecord {
  streamKey: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  stopsCount: number;
  originalMiles: number;
  optimizedMiles: number;
  savedFuelGal: number;
  status: 'In Transit • Algorithmic Green' | 'Rerouting Triggered' | 'Completed';
  currentMilestone: string;
  nextRecalculation: string;
}

const PRESET_ROUTES: Record<string, RouteSimulationRecord> = {
  'RQ-2048-AI': {
    streamKey: 'RQ-2048-AI',
    vehicleId: 'FLEET-TRUCK-882 (Cascadia EV Semi)',
    driverId: 'Autonomous Level-4 Escort #104',
    origin: 'Seattle Regional DC (SEA-01)',
    destination: 'Salt Lake City Mega-Terminal (SLC-04)',
    stopsCount: 7,
    originalMiles: 840,
    optimizedMiles: 672,
    savedFuelGal: 28.5,
    status: 'In Transit • Algorithmic Green',
    currentMilestone: 'I-84 Eastbound Mile 142 (Passing Boise River Junction)',
    nextRecalculation: 'In 3 mins (Real-time wind gradient check)',
  },
  'RQ-9012-NEO': {
    streamKey: 'RQ-9012-NEO',
    vehicleId: 'FLEET-VAN-412 (Electric Urban Sprinter)',
    driverId: 'Operator J. Vance (ID: 9940)',
    origin: 'Chicago Loop Hub (ORD-EXPRESS)',
    destination: 'Milwaukee Industrial Quad',
    stopsCount: 22,
    originalMiles: 198,
    optimizedMiles: 142,
    savedFuelGal: 9.8,
    status: 'Rerouting Triggered',
    currentMilestone: 'Detoured around I-94 congestion via Route 41 corridor',
    nextRecalculation: 'In 45 seconds (Adaptive traffic camera telemetry)',
  },
  'RQ-4481-VEX': {
    streamKey: 'RQ-4481-VEX',
    vehicleId: 'REEFER-LONGHAUL-109 (Cold Link Dedicated)',
    driverId: 'Driver Team #44 (ELD Compliant)',
    origin: 'Dallas Intermodal Rail Yard (DFW-7)',
    destination: 'Atlanta Perimeter Distribution Hub',
    stopsCount: 5,
    originalMiles: 780,
    optimizedMiles: 620,
    savedFuelGal: 26.2,
    status: 'In Transit • Algorithmic Green',
    currentMilestone: 'I-20 Eastbound Mile 218 (Cruising at optimal 62 MPH)',
    nextRecalculation: 'In 8 mins (Weigh station wait-time polling)',
  },
};

interface RouteIQSimTrackerProps {
  initialKey?: string;
}

export const RouteIQSimTracker: React.FC<RouteIQSimTrackerProps> = ({
  initialKey = 'RQ-2048-AI',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialKey);
  const [activeRecord, setActiveRecord] = useState<RouteSimulationRecord | null>(
    PRESET_ROUTES[initialKey] || PRESET_ROUTES['RQ-2048-AI']
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (PRESET_ROUTES[clean]) {
      setActiveRecord(PRESET_ROUTES[clean]);
    } else {
      setActiveRecord({
        streamKey: clean,
        vehicleId: 'TELEMETRY-UNIT-CUSTOM',
        driverId: 'Assigned Neural Dispatch Node',
        origin: 'Origin Node Dispatch',
        destination: 'Destination Multi-Drop Hub',
        stopsCount: 12,
        originalMiles: 450,
        optimizedMiles: 360,
        savedFuelGal: 14.5,
        status: 'In Transit • Algorithmic Green',
        currentMilestone: 'Autonomous route optimization synced across cellular IoT',
        nextRecalculation: 'In 2 minutes',
      });
    }
  };

  return (
    <section id="tracking" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Cpu size={14} />
          <span>NEURAL TELEMETRY STREAM INSPECTOR</span>
        </div>
        <h2 className={styles.sectionTitle}>Algorithmic Dispatch Simulation</h2>
        <p className={styles.sectionSubtitle}>
          Query telemetry stream keys to inspect dynamic rerouting milestones, deadhead reduction,
          and predictive arrival confidence intervals.
        </p>
      </div>

      <div className={styles.simCard}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchInputIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Stream Key (e.g. RQ-2048-AI)"
              aria-label="RouteIQ Telemetry Key Input"
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>
            <span>Inspect Neural Stream</span>
          </button>
        </form>

        <div className={styles.samplePills}>
          <span>Live Algorithmic Streams:</span>
          {Object.keys(PRESET_ROUTES).map((key) => (
            <button
              key={key}
              type="button"
              className={styles.pillBtn}
              onClick={() => {
                setSearchQuery(key);
                setActiveRecord(PRESET_ROUTES[key]);
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {activeRecord && (
          <div style={{ background: '#0a0d18', border: '1px solid var(--tmpl-border)', borderRadius: '10px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--tmpl-border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 700, textTransform: 'uppercase' }}>TELEMETRY DISPATCH STREAM</span>
                <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeRecord.streamKey} — {activeRecord.vehicleId}
                </div>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  background: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  padding: '0.25rem 0.625rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                <Zap size={14} /> {activeRecord.status}
              </span>
            </div>

            <div className={styles.routeResultGrid}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>CORRIDOR ROUTE SPECS</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                    {activeRecord.origin} → {activeRecord.destination}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Total Stops: <strong>{activeRecord.stopsCount} Waypoints</strong> • Assigned: {activeRecord.driverId}
                  </div>
                </div>

                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>LIVE CORRIDOR MILESTONE</div>
                  <div style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.9375rem', marginTop: '0.25rem' }}>
                    {activeRecord.currentMilestone}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> Next Genetic Re-weighting: {activeRecord.nextRecalculation}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>MILEAGE EFFICIENCY COMPARISON</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Un-optimized Miles</div>
                      <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.125rem', textDecoration: 'line-through' }}>
                        {activeRecord.originalMiles} mi
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Neural Optimized</div>
                      <div style={{ color: '#10b981', fontWeight: 800, fontSize: '1.5rem' }}>
                        {activeRecord.optimizedMiles} mi
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>ENERGY CONSERVATION</div>
                  <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.25rem' }}>
                    +{activeRecord.savedFuelGal} Gallons Fuel Equivalent Preserved
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                    -20% deadhead miles eliminated on this delivery sequence.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

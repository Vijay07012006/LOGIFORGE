'use client';

import React, { useState } from 'react';
import { MapPin, Radio, CheckCircle2 } from 'lucide-react';
import styles from './FleetOne.module.css';

const ROUTES = [
  {
    id: 'i80',
    name: 'I-80 Midwest High-Velocity Belt',
    endpoints: 'Chicago, IL (ORD Hub) &rarr; Salt Lake City, UT',
    distance: '1,390 Miles',
    unitId: 'FLT-4091',
    driver: 'Marcus Vance (CDL-A Master)',
    hosRemaining: '06h 40m',
    weighStation: 'Drivewyze PreClear Approved (Green Light Bypass)',
    speedMph: 64,
    fuelLevel: '78%',
    waypoints: [
      { name: 'Chicago Intermodal Yard (Depot 01)', status: 'passed', time: '04:15 CST' },
      { name: 'Des Moines Weigh Station & Scale', status: 'passed', time: '08:30 CST' },
      { name: 'Omaha Westbound Telematics Beacon', status: 'current', time: '11:15 CST' },
      { name: 'North Platte Fuel & Inspection Terminal', status: 'ahead', time: 'Est. 15:45 CST' },
      { name: 'Salt Lake City Freight Distribution', status: 'ahead', time: 'Est. 23:30 MST' },
    ],
  },
  {
    id: 'i10',
    name: 'I-10 Gulf-to-Pacific Energy Artery',
    endpoints: 'Houston, TX (Energy Corridor) &rarr; Los Angeles, CA',
    distance: '1,540 Miles',
    unitId: 'FLT-8820',
    driver: 'Elena Rostova (HazMat Endorsed)',
    hosRemaining: '08h 15m',
    weighStation: 'Texas DOT Automated Scale Verified',
    speedMph: 66,
    fuelLevel: '91%',
    waypoints: [
      { name: 'Houston Petrochemical Depot', status: 'passed', time: '02:00 CST' },
      { name: 'San Antonio Bypass Corridor', status: 'passed', time: '05:40 CST' },
      { name: 'El Paso Border Patrol Checkpoint', status: 'current', time: '12:10 MST' },
      { name: 'Tucson Heavy Maintenance Depot', status: 'ahead', time: 'Est. 16:30 MST' },
      { name: 'Port of Long Beach Gate 4', status: 'ahead', time: 'Est. 02:00 PST' },
    ],
  },
  {
    id: 'i95',
    name: 'I-95 Atlantic Coast Super-Corridor',
    endpoints: 'Jacksonville, FL (JAXPORT) &rarr; Newark, NJ',
    distance: '940 Miles',
    unitId: 'FLT-2194',
    driver: 'David Sterling (Reefer Specialist)',
    hosRemaining: '05h 20m',
    weighStation: 'PreClear Bypass Active in GA, NC, VA',
    speedMph: 62,
    fuelLevel: '65%',
    waypoints: [
      { name: 'JAXPORT Container Terminal', status: 'passed', time: '06:00 EST' },
      { name: 'Savannah Gateway Distribution', status: 'passed', time: '08:45 EST' },
      { name: 'Richmond North Interchange', status: 'current', time: '14:20 EST' },
      { name: 'Baltimore Harbor Tunnel Bypass', status: 'ahead', time: 'Est. 17:00 EST' },
      { name: 'Newark Metro Cold Storage', status: 'ahead', time: 'Est. 20:30 EST' },
    ],
  },
];

export function FleetOneDispatch() {
  const [activeRouteId, setActiveRouteId] = useState(ROUTES[0].id);
  const route = ROUTES.find((r) => r.id === activeRouteId) || ROUTES[0];

  return (
    <div className={styles.section} id="dispatch">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Radio size={14} />
          AUTOMATED HIGHWAY DISPATCH
        </div>
        <h2 className={styles.sectionTitle}>Interstate Route Coordination Console</h2>
        <p className={styles.sectionSubtitle}>
          Real-time GPS tracking, weigh station bypass monitoring, and electronic bill of lading telemetry across North American freight lanes.
        </p>
      </div>

      <div className={styles.dispatchContainer}>
        <div className={styles.dispatchHeaderRow}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
              Active Corridor Simulation
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--tmpl-accent)' }}>
              {route.name}
            </div>
          </div>

          <div className={styles.dispatchSelector}>
            {ROUTES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRouteId(r.id)}
                className={`${styles.routeTab} ${
                  activeRouteId === r.id ? styles.routeTabActive : ''
                }`}
              >
                {r.id.toUpperCase()} CORRIDOR
              </button>
            ))}
          </div>
        </div>

        <div className={styles.telemetryStream}>
          {/* Active Tractor Telemetry */}
          <div className={styles.activeTruckBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
                  Assigned Power Unit
                </span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--tmpl-text)' }}>
                  {route.unitId}
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--tmpl-radius)',
                }}
              >
                EN ROUTE ({route.speedMph} MPH)
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'var(--tmpl-text-muted)' }}>Lead Driver:</div>
                <div style={{ fontWeight: 600 }}>{route.driver}</div>
              </div>
              <div>
                <div style={{ color: 'var(--tmpl-text-muted)' }}>ELD Drive Time Remaining:</div>
                <div style={{ fontWeight: 600, color: 'var(--tmpl-accent)' }}>{route.hosRemaining}</div>
              </div>
              <div>
                <div style={{ color: 'var(--tmpl-text-muted)' }}>Diesel Fuel Reserve:</div>
                <div style={{ fontWeight: 600 }}>{route.fuelLevel}</div>
              </div>
              <div>
                <div style={{ color: 'var(--tmpl-text-muted)' }}>Corridor Distance:</div>
                <div style={{ fontWeight: 600 }}>{route.distance}</div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid var(--tmpl-border)',
                borderRadius: 'var(--tmpl-radius)',
                padding: '0.75rem',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} color="var(--tmpl-accent)" />
              <span>{route.weighStation}</span>
            </div>
          </div>

          {/* Waypoints List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Corridor Telemetry Waypoints
            </div>
            <div className={styles.waypointList}>
              {route.waypoints.map((w, idx) => (
                <div key={idx} className={styles.waypointItem}>
                  {w.status === 'passed' ? (
                    <CheckCircle2 size={16} className={styles.waypointBadgePassed} />
                  ) : w.status === 'current' ? (
                    <Radio size={16} className={styles.waypointBadgeCurrent} />
                  ) : (
                    <MapPin size={16} className={styles.waypointBadgeAhead} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: w.status === 'current' ? 700 : 500,
                        color: w.status === 'current' ? 'var(--tmpl-accent)' : 'var(--tmpl-text)',
                      }}
                    >
                      {w.name}
                    </div>
                    <div style={{ color: 'var(--tmpl-text-muted)', fontSize: '0.6875rem' }}>
                      {w.time} • {w.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

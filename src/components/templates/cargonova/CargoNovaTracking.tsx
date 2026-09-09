'use client';

import React, { useState } from 'react';
import type { SimulatedShipment } from '@/types/template';
import { lookupSimulatedShipment } from '@/lib/tracking';
import { Search, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './CargoNova.module.css';

const SAMPLE_WAYBILLS = [
  { code: 'CN-8924-US', label: 'Trans-Pacific (Ocean FCL)' },
  { code: 'AC-9901-FRA', label: 'Frankfurt Direct (Air Cargo)' },
  { code: 'FO-4091-TX', label: 'Gulf Intermodal (Heavy)' },
  { code: 'SD-4421-EU', label: 'Rotterdam Hub (Ocean LCL)' },
  { code: 'PA-7714-SGP', label: 'Strait of Malacca (Pharma)' },
];

interface CargoNovaTrackingProps {
  initialTracking?: string;
  onSearchPerformed?: (trackingNumber: string, found: boolean) => void;
}

export function CargoNovaTracking({
  initialTracking = 'CN-8924-US',
  onSearchPerformed,
}: CargoNovaTrackingProps) {
  const [query, setQuery] = useState(initialTracking);
  const [activeNumber, setActiveNumber] = useState(initialTracking);
  const [shipment, setShipment] = useState<SimulatedShipment | null>(() =>
    lookupSimulatedShipment(initialTracking)
  );

  const handleSearch = (num: string) => {
    const trimmed = num.trim().toUpperCase();
    setActiveNumber(trimmed);
    const result = lookupSimulatedShipment(trimmed);
    setShipment(result);
    onSearchPerformed?.(trimmed, !!result);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className={styles.section} id="tracking">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <ShieldCheck size={14} />
          TELEMETRY &amp; CONSIGNMENT AUDIT
        </div>
        <h2 className={styles.sectionTitle}>Live Global Cargo Milestone Tracking</h2>
        <p className={styles.sectionSubtitle}>
          Real-time automated AIS vessel position, customs clearance timestamps, and temperature-controlled container telemetry.
        </p>
      </div>

      <div className={styles.trackingSection}>
        <form onSubmit={onSubmit} className={styles.trackInputRow}>
          <div className={styles.trackInputWrapper}>
            <Search size={18} className={styles.trackIcon} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Bill of Lading or Container ID (e.g. CN-8924-US)"
              className={styles.trackInput}
              aria-label="Waybill Number Input"
            />
          </div>
          <button type="submit" className={styles.btnGold} style={{ flex: '0 0 auto', minHeight: '46px' }}>
            Locate Cargo
            <ArrowRight size={16} />
          </button>
        </form>

        <div className={styles.sampleWaybills}>
          <span>Verified Demo Waybills:</span>
          {SAMPLE_WAYBILLS.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => {
                setQuery(s.code);
                handleSearch(s.code);
              }}
              className={`${styles.sampleBtn} ${
                activeNumber === s.code ? styles.sampleBtnActive : ''
              }`}
            >
              {s.code}
            </button>
          ))}
        </div>

        {shipment ? (
          <div className={styles.shipmentDetails}>
            <div className={styles.shipmentHeader}>
              <div>
                <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--tmpl-text-muted)' }}>
                  Waybill Manifest
                </div>
                <div className={styles.shipmentId}>{shipment.trackingNumber}</div>
                {shipment.containerId && (
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--tmpl-text-muted)' }}>
                    Container / Unit: {shipment.containerId}
                  </div>
                )}
              </div>
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid var(--tmpl-border)',
                  color: 'var(--tmpl-accent)',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                }}
              >
                {shipment.currentStatus.toUpperCase()} • {shipment.carrier}
              </div>
            </div>

            {/* Route & Vessel Info */}
            <div className={styles.corridorDisplay}>
              <div className={styles.portBlock}>
                <span className={styles.portCode}>{shipment.origin.code}</span>
                <span className={styles.portCity}>{shipment.origin.city}, {shipment.origin.country}</span>
                <span className={styles.portVessel}>Facility: Port of {shipment.origin.city}</span>
              </div>

              <div className={styles.corridorArrow}>
                <span style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {shipment.transportMode.toUpperCase()} FREIGHT
                </span>
                <span style={{ fontSize: '1.25rem' }}>&rarr;</span>
                {shipment.vesselOrFlight && (
                  <span style={{ fontSize: '0.6875rem', color: 'var(--tmpl-text-muted)' }}>
                    {shipment.vesselOrFlight}
                  </span>
                )}
              </div>

              <div className={styles.portBlock} style={{ textAlign: 'right' }}>
                <span className={styles.portCode}>{shipment.destination.code}</span>
                <span className={styles.portCity}>{shipment.destination.city}, {shipment.destination.country}</span>
                <span className={styles.portVessel}>Est. ETA: {shipment.eta}</span>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', color: 'var(--tmpl-text)' }}>
                Milestone Verification Audit
              </div>
              <div className={styles.timeline}>
                {shipment.milestones.map((m) => {
                  const isCompleted = m.status === 'completed';
                  const isActive = m.status === 'in-transit';
                  return (
                    <div
                      key={m.id}
                      className={`${styles.milestone} ${
                        isCompleted ? styles.milestoneCompleted : isActive ? styles.milestoneActive : ''
                      }`}
                    >
                      <div className={styles.milestoneDot}>
                        {isCompleted ? (
                          <CheckCircle2 size={10} color="#090d16" />
                        ) : (
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor' }} />
                        )}
                      </div>
                      <div className={styles.milestoneTitle}>{m.description}</div>
                      <div className={styles.milestoneMeta}>
                        <span>{m.location}</span>
                        <span>•</span>
                        <span>{m.facility}</span>
                        <span>•</span>
                        <span>{m.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--tmpl-text-muted)' }}>
            <AlertCircle size={32} color="var(--tmpl-accent)" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--tmpl-text)', marginBottom: '0.25rem' }}>
              No manifest found for identifier: {activeNumber}
            </div>
            <p style={{ fontSize: '0.8125rem', maxWidth: '400px', margin: '0 auto' }}>
              Please test with one of our sample waybills above to view simulated AIS telematics and milestone audits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

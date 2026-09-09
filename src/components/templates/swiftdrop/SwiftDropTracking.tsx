'use client';

import React, { useState } from 'react';
import type { SimulatedShipment } from '@/types/template';
import { lookupSimulatedShipment } from '@/lib/tracking';
import { Search, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import styles from './SwiftDrop.module.css';

interface SwiftDropTrackingProps {
  initialTracking?: string;
  onSearchPerformed?: (trackingNumber: string, found: boolean) => void;
}

export function SwiftDropTracking({
  initialTracking = 'SD-4421-EU',
  onSearchPerformed,
}: SwiftDropTrackingProps) {
  const [query, setQuery] = useState(initialTracking);
  const [shipment, setShipment] = useState<SimulatedShipment | null>(() =>
    lookupSimulatedShipment(initialTracking)
  );

  const handleSearch = (num: string) => {
    const trimmed = num.trim().toUpperCase();
    const res = lookupSimulatedShipment(trimmed);
    setShipment(res);
    onSearchPerformed?.(trimmed, !!res);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className={styles.section} id="tracking">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <MapPin size={14} />
          DOORSTEP TELEMETRY
        </div>
        <h2 className={styles.sectionTitle}>Real-Time Urban Courier Tracking</h2>
        <p className={styles.sectionSubtitle}>
          Live GPS location of your last-mile courier, estimated arrival countdown, and photographic proof-of-delivery (POD).
        </p>
      </div>

      <div className={styles.trackingCard}>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--tmpl-text-muted)' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Delivery Waybill (e.g. SD-4421-EU)"
              className={styles.rateInput}
              style={{ paddingLeft: '2.75rem', width: '100%', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" className={styles.btnOrange} style={{ flex: '0 0 auto', minHeight: '44px' }}>
            Locate Courier
          </button>
        </form>

        {shipment ? (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--tmpl-border-light)', paddingBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.6875rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
                  Waybill Number
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--tmpl-accent)' }}>
                  {shipment.trackingNumber}
                </div>
              </div>
              <span
                style={{
                  background: 'rgba(255, 87, 34, 0.12)',
                  border: '1px solid var(--tmpl-border)',
                  color: 'var(--tmpl-accent)',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {shipment.currentStatus.toUpperCase()}
              </span>
            </div>

            {/* Courier Profile Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 0',
                borderBottom: '1px solid var(--tmpl-border-light)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(255, 87, 34, 0.15)',
                  border: '2px solid var(--tmpl-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--tmpl-accent)',
                }}
              >
                <UserCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>
                  Assigned Courier: Alex Morgan (Swift Rider #408)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
                  Vehicle: Rivian Electric Cargo Van • Rating: 4.96 ★ (1,420 deliveries)
                </div>
              </div>
            </div>

            {/* Proof of Delivery / Signature Verification */}
            <div className={styles.podBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Electronic Proof of Delivery (e-POD)
                </span>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} /> Tamper-Proof Cryptographic Lock
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
                Recipient Digital Signature on Glass:
              </div>
              <div className={styles.signatureMock}>A. Morgan - Verified Recipient</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--tmpl-text-muted)' }}>
                Handover coordinates: Lat 40.7589° N, Lon 73.9851° W • Geotagged &amp; Timestamped
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--tmpl-text-muted)' }}>
            No parcel found for identifier: {query}. Try sample <strong>SD-4421-EU</strong>.
          </div>
        )}
      </div>
    </div>
  );
}

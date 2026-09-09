'use client';

import React, { useState } from 'react';
import { Zap, Mail, Package, Box, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import styles from './SwiftDrop.module.css';

const PARCEL_TYPES = [
  { id: 'envelope', label: 'Document Envelope', icon: Mail, baseRate: 14.5, weightCap: 'Up to 0.5 kg' },
  { id: 'small', label: 'Small Parcel', icon: Package, baseRate: 18.0, weightCap: 'Up to 3 kg' },
  { id: 'medium', label: 'Medium Carton', icon: Box, baseRate: 26.5, weightCap: 'Up to 10 kg' },
  { id: 'heavy', label: 'Bulk Freight Unit', icon: Truck, baseRate: 48.0, weightCap: 'Up to 35 kg' },
];

export function SwiftDropRateCalc() {
  const [selectedType, setSelectedType] = useState('small');
  const [originZip, setOriginZip] = useState('10001');
  const [destZip, setDestZip] = useState('10019');
  const [speedTier, setSpeedTier] = useState<'flash' | 'same-day' | 'next-day'>('flash');
  const [booked, setBooked] = useState(false);

  const parcel = PARCEL_TYPES.find((p) => p.id === selectedType) || PARCEL_TYPES[1];

  const speedMultiplier = speedTier === 'flash' ? 1.6 : speedTier === 'same-day' ? 1.2 : 1.0;
  const calculatedPrice = (parcel.baseRate * speedMultiplier).toFixed(2);
  const slaText =
    speedTier === 'flash'
      ? 'Doorstep SLA: 45 - 90 Minutes'
      : speedTier === 'same-day'
      ? 'Guaranteed Delivery: Today by 8:00 PM'
      : 'Guaranteed Delivery: Tomorrow by 10:30 AM';

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className={styles.section} id="rates">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Zap size={14} />
          INSTANT PARCEL CALCULATOR
        </div>
        <h2 className={styles.sectionTitle}>On-Demand Urban Courier Quotation</h2>
        <p className={styles.sectionSubtitle}>
          Transparent flat rates with zero surcharge for dynamic urban routing, electric fleet handling, and instant SMS driver tracking.
        </p>
      </div>

      <div className={styles.rateCard}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.875rem' }}>
          1. Select Parcel Dimensions
        </div>
        <div className={styles.parcelTypeGrid}>
          {PARCEL_TYPES.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedType === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedType(p.id);
                  setBooked(false);
                }}
                className={`${styles.parcelTypeBtn} ${
                  isSelected ? styles.parcelTypeBtnActive : ''
                }`}
              >
                <Icon size={22} />
                <span>{p.label}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--tmpl-text-muted)' }}>
                  {p.weightCap}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleBooking}>
          <div className={styles.rateFormRow}>
            <div className={styles.rateField}>
              <label className={styles.rateLabel}>Pickup ZIP Code</label>
              <input
                type="text"
                value={originZip}
                onChange={(e) => {
                  setOriginZip(e.target.value);
                  setBooked(false);
                }}
                className={styles.rateInput}
                placeholder="e.g. 10001"
                maxLength={5}
              />
            </div>

            <div className={styles.rateField}>
              <label className={styles.rateLabel}>Drop-off ZIP Code</label>
              <input
                type="text"
                value={destZip}
                onChange={(e) => {
                  setDestZip(e.target.value);
                  setBooked(false);
                }}
                className={styles.rateInput}
                placeholder="e.g. 10019"
                maxLength={5}
              />
            </div>

            <div className={styles.rateField}>
              <label className={styles.rateLabel}>Delivery Service Tier</label>
              <select
                value={speedTier}
                onChange={(e) => {
                  setSpeedTier(e.target.value as 'flash' | 'same-day' | 'next-day');
                  setBooked(false);
                }}
                className={styles.rateSelect}
              >
                <option value="flash">Flash 2-Hour (Express Courier)</option>
                <option value="same-day">Same-Day Evening (By 8 PM)</option>
                <option value="next-day">Next-Day Priority (By 10:30 AM)</option>
              </select>
            </div>
          </div>

          <div className={styles.rateResultBox}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--tmpl-text-muted)' }}>
                Estimated Direct Doorstep Rate
              </div>
              <div className={styles.priceTag}>${calculatedPrice}</div>
              <div style={{ fontSize: '0.8125rem', color: '#10b981', fontWeight: 600, marginTop: '0.25rem' }}>
                {slaText} • 100% Zero-Emission Cargo Van
              </div>
            </div>

            <button
              type="submit"
              className={styles.btnOrange}
              style={{ flex: '0 0 auto', minHeight: '44px' }}
            >
              {booked ? (
                <>
                  <CheckCircle2 size={16} />
                  Courier Dispatched!
                </>
              ) : (
                <>
                  Request Courier Pickup
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {booked && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--tmpl-radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.8125rem',
              color: '#10b981',
            }}
          >
            <CheckCircle2 size={18} />
            <span>
              Courier <strong>#SWIFT-409</strong> has accepted pickup at ZIP <strong>{originZip}</strong>. Live driver ETA: 12 minutes. Track via SMS pin or below.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

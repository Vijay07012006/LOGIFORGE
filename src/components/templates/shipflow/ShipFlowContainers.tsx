'use client';

import React, { useState } from 'react';
import { Box } from 'lucide-react';
import styles from './ShipFlow.module.css';

const CONTAINER_TYPES = [
  {
    id: '20ft',
    label: '20ft Standard Dry',
    isoCode: 'ISO 1CC',
    volume: '33.2 m³ (1,172 cu ft)',
    payload: '28,250 kg (62,280 lbs)',
    internalLength: '5.898 m (19.35 ft)',
    internalWidth: '2.352 m (7.71 ft)',
    internalHeight: '2.393 m (7.85 ft)',
    maxGross: '30,480 kg',
    bestFor: 'High-density dry goods, raw materials, heavy machinery parts, canned beverages.',
  },
  {
    id: '40hc',
    label: '40ft High Cube Dry',
    isoCode: 'ISO 1AAA',
    volume: '76.4 m³ (2,700 cu ft)',
    payload: '28,600 kg (63,050 lbs)',
    internalLength: '12.032 m (39.47 ft)',
    internalWidth: '2.352 m (7.71 ft)',
    internalHeight: '2.698 m (8.85 ft)',
    maxGross: '32,500 kg',
    bestFor: 'Volumetric light manufactured products, consumer electronics, apparel, furniture.',
  },
  {
    id: '40reefer',
    label: '40ft CA Cold Reefer',
    isoCode: 'ISO 1EEE',
    volume: '59.3 m³ (2,094 cu ft)',
    payload: '29,400 kg (64,815 lbs)',
    internalLength: '11.583 m (38.00 ft)',
    internalWidth: '2.294 m (7.52 ft)',
    internalHeight: '2.544 m (8.34 ft)',
    maxGross: '34,000 kg',
    bestFor: 'Chilled perishables, pharmaceutical vaccines, fresh seafood, controlled atmosphere flora.',
  },
  {
    id: '40flat',
    label: '40ft Heavy Flat Rack',
    isoCode: 'ISO 1BB',
    volume: 'Open Top / Out-of-Gauge',
    payload: '45,000 kg (99,200 lbs)',
    internalLength: '12.080 m (39.63 ft)',
    internalWidth: '2.438 m (8.00 ft)',
    internalHeight: 'Collapsible End Walls',
    maxGross: '50,000 kg',
    bestFor: 'Oversized turbines, transformers, construction excavators, yacht hull transport.',
  },
];

export function ShipFlowContainers() {
  const [activeTab, setActiveTab] = useState(CONTAINER_TYPES[1].id);
  const container = CONTAINER_TYPES.find((c) => c.id === activeTab) || CONTAINER_TYPES[1];

  return (
    <div className={styles.section} id="containers">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Box size={14} />
          INTERMODAL CARGO UNITS
        </div>
        <h2 className={styles.sectionTitle}>Marine Container Specifications</h2>
        <p className={styles.sectionSubtitle}>
          ISO-certified ocean container equipment engineered for intermodal seamlessness across vessel, rail, and port cranes.
        </p>
      </div>

      <div className={styles.containerTabs}>
        {CONTAINER_TYPES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveTab(c.id)}
            className={`${styles.containerTab} ${
              activeTab === c.id ? styles.containerTabActive : ''
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.containerInspectorCard}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'var(--tmpl-accent-secondary)',
                background: 'rgba(2, 132, 199, 0.15)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
              }}
            >
              {container.isoCode}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--tmpl-text)' }}>
              {container.label}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--tmpl-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {container.bestFor}
          </p>

          <div className={styles.containerSpecsList}>
            <div className={styles.containerSpecItem}>
              <span className={styles.specLabel}>Cubic Capacity</span>
              <span className={styles.specValue}>{container.volume}</span>
            </div>
            <div className={styles.containerSpecItem}>
              <span className={styles.specLabel}>Maximum Net Payload</span>
              <span className={styles.specValue}>{container.payload}</span>
            </div>
            <div className={styles.containerSpecItem}>
              <span className={styles.specLabel}>Internal Length</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tmpl-text)' }}>
                {container.internalLength}
              </span>
            </div>
            <div className={styles.containerSpecItem}>
              <span className={styles.specLabel}>Internal Height</span>
              <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--tmpl-text)' }}>
                {container.internalHeight}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Structural Dimension Wireframe */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--tmpl-border-light)',
            borderRadius: 'var(--tmpl-radius)',
            padding: '2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <Box size={56} color="var(--tmpl-accent-secondary)" />
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--tmpl-text)' }}>
            Max Gross Rating: {container.maxGross}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>
            Cort-Ten Steel Anti-Corrosive Construction • CSC Safety Plated
          </div>
        </div>
      </div>
    </div>
  );
}

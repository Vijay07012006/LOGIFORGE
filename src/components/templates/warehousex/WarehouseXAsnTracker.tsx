'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, Box } from 'lucide-react';
import styles from './WarehouseX.module.css';

interface PalletRecord {
  asn: string;
  sku: string;
  description: string;
  palletCount: number;
  grossWeight: string;
  status: 'racked' | 'receiving' | 'staging';
  bayLocation: string;
  aisle: string;
  level: string;
  zone: string;
  facility: string;
  inboundTimestamp: string;
}

const PRESET_ASNS: Record<string, PalletRecord> = {
  'WX-5510-IL': {
    asn: 'WX-5510-IL',
    sku: 'SKU-MED-8821 (Cold Pharma)',
    description: '48 Pallets • Temperature-controlled Vaccines & Biologics',
    palletCount: 48,
    grossWeight: '18,400 kg',
    status: 'racked',
    bayLocation: 'BAY 14-C',
    aisle: 'Aisle 04 (Cold Zone)',
    level: 'Tier 3 (ASRS Crane 2)',
    zone: 'Zone C (-20°C Vault)',
    facility: 'Chicago Central Fulfillment Hub (ORD-01)',
    inboundTimestamp: 'Today, 08:42 AM (Dock 04)',
  },
  'WX-1029-TX': {
    asn: 'WX-1029-TX',
    sku: 'SKU-ECOM-4402 (Consumer Electronics)',
    description: '120 Pallets • Micro-controllers & Smart Home Sensors',
    palletCount: 120,
    grossWeight: '32,100 kg',
    status: 'receiving',
    bayLocation: 'STAGING DOCK 02',
    aisle: 'Inbound De-palletizing Line',
    level: 'Floor Sorting Conveyor',
    zone: 'Zone A (Ambient Dry)',
    facility: 'Dallas Metro Logistics Mega-Node (DFW-03)',
    inboundTimestamp: 'Today, 11:15 AM (Dock 02)',
  },
  'WX-8840-CA': {
    asn: 'WX-8840-CA',
    sku: 'SKU-AUTO-9931 (EV Battery Cells)',
    description: '36 Pallets • Hazardous Class 9 Lithium Ion Modules',
    palletCount: 36,
    grossWeight: '24,800 kg',
    status: 'racked',
    bayLocation: 'BAY 08-HAZ',
    aisle: 'Aisle 09 (Isolated High-Bay)',
    level: 'Tier 1 (Automated Fire-Suppression Bay)',
    zone: 'Zone D (Hazmat Certified)',
    facility: 'Ontario Inland Empire Center (ONT-02)',
    inboundTimestamp: 'Yesterday, 16:30 PM (Dock 08)',
  },
};

interface WarehouseXAsnTrackerProps {
  initialAsn?: string;
}

export const WarehouseXAsnTracker: React.FC<WarehouseXAsnTrackerProps> = ({
  initialAsn = 'WX-5510-IL',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAsn);
  const [activeRecord, setActiveRecord] = useState<PalletRecord | null>(
    PRESET_ASNS[initialAsn] || PRESET_ASNS['WX-5510-IL']
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (PRESET_ASNS[clean]) {
      setActiveRecord(PRESET_ASNS[clean]);
    } else {
      setActiveRecord({
        asn: clean,
        sku: 'SKU-GEN-9901 (General Freight)',
        description: '30 Pallets • Inbound verified against WMS manifest',
        palletCount: 30,
        grossWeight: '12,500 kg',
        status: 'staging',
        bayLocation: 'BAY 02-BUFFER',
        aisle: 'Aisle 01 (Cross-dock)',
        level: 'Tier 1 Staging',
        zone: 'Zone A (Ambient Dry)',
        facility: 'WarehouseX Regional Facility Node',
        inboundTimestamp: 'Today, Just Now',
      });
    }
  };

  return (
    <section id="tracking" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Box size={14} />
          <span>WMS REAL-TIME PALLET LOOKUP</span>
        </div>
        <h2 className={styles.sectionTitle}>Inbound ASN & Rack Placement</h2>
        <p className={styles.sectionSubtitle}>
          Query Advance Shipping Notices to identify receiving status, ASRS crane bay allocation,
          and storage zone temperatures.
        </p>
      </div>

      <div className={styles.trackerCard}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchInputIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter ASN Number (e.g. WX-5510-IL)"
              aria-label="Advance Shipping Notice Number Input"
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>
            <span>Locate In Warehouse</span>
          </button>
        </form>

        <div className={styles.samplePills}>
          <span>Quick Samples:</span>
          {Object.keys(PRESET_ASNS).map((asn) => (
            <button
              key={asn}
              type="button"
              className={styles.pillBtn}
              onClick={() => {
                setSearchQuery(asn);
                setActiveRecord(PRESET_ASNS[asn]);
              }}
            >
              {asn}
            </button>
          ))}
        </div>

        {activeRecord && (
          <div className={styles.resultGrid}>
            <div className={styles.resultBlock}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>MANIFEST ASN ID</span>
                <span
                  className={`${styles.badgeStatus} ${
                    activeRecord.status === 'racked' ? styles.badgeSuccess : styles.badgeWarning
                  }`}
                >
                  {activeRecord.status === 'racked' ? (
                    <>
                      <CheckCircle2 size={13} /> Racked in ASRS
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} /> Dock Ingesting
                    </>
                  )}
                </span>
              </div>

              <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.5rem', fontWeight: 800 }}>
                {activeRecord.asn}
              </div>

              <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#10b981' }}>
                {activeRecord.sku}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                {activeRecord.description}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                <div><strong>Pallets:</strong> {activeRecord.palletCount}</div>
                <div><strong>Weight:</strong> {activeRecord.grossWeight}</div>
              </div>
            </div>

            <div className={styles.resultBlock}>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>AUTOMATED STORAGE COORDINATES</span>
              <div className={styles.coordDisplay}>
                <div className={styles.coordRow}>
                  <span>FACILITY:</span>
                  <span style={{ color: '#fff' }}>{activeRecord.facility}</span>
                </div>
                <div className={styles.coordRow}>
                  <span>STORAGE ZONE:</span>
                  <span style={{ color: '#fff' }}>{activeRecord.zone}</span>
                </div>
                <div className={styles.coordRow}>
                  <span>BAY / AISLE:</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>
                    {activeRecord.bayLocation} • {activeRecord.aisle}
                  </span>
                </div>
                <div className={styles.coordRow}>
                  <span>VERTICAL TIER:</span>
                  <span style={{ color: '#10b981' }}>{activeRecord.level}</span>
                </div>
                <div className={styles.coordRow}>
                  <span>SCAN TIMESTAMP:</span>
                  <span style={{ color: '#94a3b8' }}>{activeRecord.inboundTimestamp}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

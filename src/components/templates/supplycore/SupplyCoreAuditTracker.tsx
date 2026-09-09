'use client';

import React, { useState } from 'react';
import { Search, Layers, Check } from 'lucide-react';
import styles from './SupplyCore.module.css';

interface SupplyAuditRecord {
  poNumber: string;
  project: string;
  contractValue: string;
  resilienceIndex: string;
  tier1Supplier: string;
  tier2Fabricator: string;
  tier3RawMinerals: string;
  esgScore: string;
  customsSanctionCheck: 'Passed' | 'Flagged';
  contingencyStatus: string;
}

const PRESET_AUDITS: Record<string, SupplyAuditRecord> = {
  'SC-7700-GL': {
    poNumber: 'SC-7700-GL',
    project: 'Project Helios: High-Voltage Grid Inverters',
    contractValue: '$14,250,000 USD',
    resilienceIndex: '98.4 / 100 (Exceptional Tier-3 Insulation)',
    tier1Supplier: 'Siemens Energy GMBH (Erlangen, Germany)',
    tier2Fabricator: 'Kyocera Precision Ceramics (Kyoto, Japan)',
    tier3RawMinerals: 'Pilbara Minerals Ltd (Lithium Hydroxide, Western Australia)',
    esgScore: 'A+ (GLEC & GRI Standards Audited)',
    customsSanctionCheck: 'Passed',
    contingencyStatus: 'Dual-source failover active in Arizona facility (4-hour switchover)',
  },
  'SC-9104-EU': {
    poNumber: 'SC-9104-EU',
    project: 'Aerospace Avionics Fiber Sub-Assemblies',
    contractValue: '$8,920,000 EUR',
    resilienceIndex: '94.1 / 100 (Robust Defense Standard)',
    tier1Supplier: 'Thales Group (Toulouse, France)',
    tier2Fabricator: 'Radiall Optoelectronics (Geneva, Switzerland)',
    tier3RawMinerals: 'Sumitomo Metal Mining (High-Purity Silicon, Japan)',
    esgScore: 'AA (Zero Conflict Minerals Certified)',
    customsSanctionCheck: 'Passed',
    contingencyStatus: 'Secondary buffer staged in Rotterdam bonded vault',
  },
  'SC-3382-AP': {
    poNumber: 'SC-3382-AP',
    project: 'Consumer Semiconductor Logic Chips (5nm)',
    contractValue: '$22,400,000 USD',
    resilienceIndex: '91.8 / 100 (Geopolitical Hedged)',
    tier1Supplier: 'TSMC Intermodal (Hsinchu Science Park, Taiwan)',
    tier2Fabricator: 'Tokyo Electron Lithography (Tokyo, Japan)',
    tier3RawMinerals: 'Belgian Specialty Gases & Rare Earths (Antwerp)',
    esgScore: 'A (ISO 14001 Compliant)',
    customsSanctionCheck: 'Passed',
    contingencyStatus: 'Tri-node foundry backup verified in Kumamoto Fab',
  },
};

interface SupplyCoreAuditTrackerProps {
  initialPo?: string;
}

export const SupplyCoreAuditTracker: React.FC<SupplyCoreAuditTrackerProps> = ({
  initialPo = 'SC-7700-GL',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialPo);
  const [activeRecord, setActiveRecord] = useState<SupplyAuditRecord | null>(
    PRESET_AUDITS[initialPo] || PRESET_AUDITS['SC-7700-GL']
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (PRESET_AUDITS[clean]) {
      setActiveRecord(PRESET_AUDITS[clean]);
    } else {
      setActiveRecord({
        poNumber: clean,
        project: 'Custom Global Procurement Line Audit',
        contractValue: '$5,000,000 USD (Estimated)',
        resilienceIndex: '92.0 / 100 (Standard Tier-2 Coverage)',
        tier1Supplier: 'Audited Global Tier-1 Partner Node',
        tier2Fabricator: 'Certified Regional Component Fabricator',
        tier3RawMinerals: 'Verified Conflict-Free Smelter List (CFSL)',
        esgScore: 'A- Aligned',
        customsSanctionCheck: 'Passed',
        contingencyStatus: 'Standard SLA secondary vendor active',
      });
    }
  };

  return (
    <section id="tracking" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Layers size={14} />
          <span>MULTI-TIER PROVENANCE VERIFICATION</span>
        </div>
        <h2 className={styles.sectionTitle}>Enterprise PO & Supply Line Audit</h2>
        <p className={styles.sectionSubtitle}>
          Enter purchase order or contract reference to inspect end-to-end component bills of material,
          supplier risk scores, and ESG compliance.
        </p>
      </div>

      <div className={styles.auditCard}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchInputIcon} size={18} />
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter PO Reference (e.g. SC-7700-GL)"
              aria-label="Supply Chain PO Reference Input"
            />
          </div>
          <button type="submit" className={styles.btnPrimary}>
            <span>Run Provenance Audit</span>
          </button>
        </form>

        <div className={styles.samplePills}>
          <span>Audited Contract Samples:</span>
          {Object.keys(PRESET_AUDITS).map((po) => (
            <button
              key={po}
              type="button"
              className={styles.pillBtn}
              onClick={() => {
                setSearchQuery(po);
                setActiveRecord(PRESET_AUDITS[po]);
              }}
            >
              {po}
            </button>
          ))}
        </div>

        {activeRecord && (
          <div style={{ background: '#0b1020', border: '1px solid var(--tmpl-border)', borderRadius: '8px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--tmpl-border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>PURCHASE ORDER CONTRACT</span>
                <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>
                  {activeRecord.poNumber} — {activeRecord.project}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  <Check size={14} /> SANCTIONS CLEARED
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                  ESG: {activeRecord.esgScore}
                </span>
              </div>
            </div>

            <div className={styles.auditResultGrid}>
              <div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600 }}>MULTI-TIER BILL OF MATERIALS (BOM)</div>
                <div className={styles.bomList}>
                  <div className={styles.bomItem}>
                    <div>
                      <strong style={{ color: '#818cf8' }}>Tier-1 System Assembly:</strong>
                      <div style={{ color: '#f8fafc' }}>{activeRecord.tier1Supplier}</div>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED</span>
                  </div>
                  <div className={styles.bomItem}>
                    <div>
                      <strong style={{ color: '#818cf8' }}>Tier-2 Sub-Component:</strong>
                      <div style={{ color: '#f8fafc' }}>{activeRecord.tier2Fabricator}</div>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED</span>
                  </div>
                  <div className={styles.bomItem}>
                    <div>
                      <strong style={{ color: '#818cf8' }}>Tier-3 Raw Smelting / Mines:</strong>
                      <div style={{ color: '#f8fafc' }}>{activeRecord.tier3RawMinerals}</div>
                    </div>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>VERIFIED</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>RESILIENCE INDEX SCORE</div>
                  <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#818cf8', marginTop: '0.25rem' }}>
                    {activeRecord.resilienceIndex}
                  </div>
                </div>

                <div style={{ background: 'var(--tmpl-surface-elevated)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--tmpl-border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>ACTIVE FAILOVER & CONTINGENCY</div>
                  <div style={{ fontSize: '0.875rem', color: '#f8fafc', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {activeRecord.contingencyStatus}
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

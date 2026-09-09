'use client';

import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, ShieldCheck, MapPin, QrCode } from 'lucide-react';
import styles from './PortAxis.module.css';

interface ContainerRecord {
  id: string;
  type: string;
  status: 'cleared' | 'customs_hold' | 'staged';
  yardSlot: string;
  weightGross: string;
  line: string;
  vessel: string;
  freeTimeDays: number;
  demurrageStatus: string;
  reeferTemp?: string;
  gatePin: string;
}

const PRESET_CONTAINERS: Record<string, ContainerRecord> = {
  'MSCU-928192-3': {
    id: 'MSCU-928192-3',
    type: '40ft High-Cube Reefer',
    status: 'cleared',
    yardSlot: 'BAY 44 • ROW 08 • TIER 03 (Zone C-Reefer)',
    weightGross: '28,450 kg',
    line: 'Mediterranean Shipping Co',
    vessel: 'MSC Gülsün (Voyage 241E)',
    freeTimeDays: 4,
    demurrageStatus: 'Standard Free Time Active',
    reeferTemp: '-22.4°C Setpoint (-22.5°C Measured)',
    gatePin: 'PIN-88219-OK',
  },
  'EMCU-551029-8': {
    id: 'EMCU-551029-8',
    type: '40ft General Purpose Dry',
    status: 'cleared',
    yardSlot: 'BAY 12 • ROW 04 • TIER 02 (Zone A-Dry)',
    weightGross: '21,120 kg',
    line: 'Evergreen Line',
    vessel: 'Ever Golden (Voyage 099W)',
    freeTimeDays: 2,
    demurrageStatus: 'Expiring in 48 Hours',
    gatePin: 'PIN-44391-OK',
  },
  'CMAU-102948-2': {
    id: 'CMAU-102948-2',
    type: '20ft Heavy Machinery Flat Rack',
    status: 'staged',
    yardSlot: 'INTERMODAL RAIL TRACK 3 • SLOT R-14',
    weightGross: '30,500 kg',
    line: 'CMA CGM',
    vessel: 'CMA CGM Jacques Saadé (Voyage 104N)',
    freeTimeDays: 5,
    demurrageStatus: 'Class-1 Rail Pre-Mount Active',
    gatePin: 'PIN-77209-RAIL',
  },
};

export const PortAxisGateTurn: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('MSCU-928192-3');
  const [activeRecord, setActiveRecord] = useState<ContainerRecord | null>(
    PRESET_CONTAINERS['MSCU-928192-3']
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    if (PRESET_CONTAINERS[clean]) {
      setActiveRecord(PRESET_CONTAINERS[clean]);
    } else {
      // Create synthetic fallback container record
      setActiveRecord({
        id: clean || 'PA-DEMO-CONTAINER',
        type: '40ft High-Cube Standard',
        status: 'cleared',
        yardSlot: 'BAY 28 • ROW 05 • TIER 02 (Zone B)',
        weightGross: '24,300 kg',
        line: 'PortAxis Verified Drayage',
        vessel: 'Deepwater Terminal Stock',
        freeTimeDays: 3,
        demurrageStatus: 'Standard Free Time Active',
        gatePin: `PIN-${Math.floor(10000 + Math.random() * 90000)}-VALID`,
      });
    }
  };

  const handleSelectPreset = (id: string) => {
    setSearchQuery(id);
    setActiveRecord(PRESET_CONTAINERS[id]);
  };

  return (
    <section id="gate-turnaround" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Truck size={14} />
          <span>SMART DRAYAGE & GATE TELEMETRY</span>
        </div>
        <h2 className={styles.sectionTitle}>Gate Turnaround & Container PIN Lookup</h2>
        <p className={styles.sectionSubtitle}>
          Industry-leading 24.2-minute average truck gate turnaround. 16 automated optical
          OCR gate lanes, real-time yard stack positioning, and frictionless pre-clearance PINs.
        </p>
      </div>

      {/* Terminal gate live KPI metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--tmpl-border)',
            padding: '1.25rem',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)', textTransform: 'uppercase' }}>
            Average Turn Time
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
            24.2 min
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981' }}>-4.8 min vs industry benchmark</div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--tmpl-border)',
            padding: '1.25rem',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)', textTransform: 'uppercase' }}>
            Optical OCR Lanes
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>
            16 / 16
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981' }}>100% Operational Status</div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--tmpl-border)',
            padding: '1.25rem',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)', textTransform: 'uppercase' }}>
            Pedestal Scan SLA
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
            48 sec
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>Automated biometric kiosk</div>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--tmpl-border)',
            padding: '1.25rem',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)', textTransform: 'uppercase' }}>
            Daily Gate Volume
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'monospace' }}>
            6,420
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--tmpl-text-muted)' }}>Truck transactions / 24h</div>
        </div>
      </div>

      <div className={styles.gateCard}>
        <form onSubmit={handleSearch}>
          <div className={styles.gateFormRow}>
            <div className={styles.gateInputWrapper}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--tmpl-text-muted)',
                }}
              />
              <input
                type="text"
                className={styles.gateInput}
                placeholder="Enter Container ID (e.g. MSCU-928192-3) or Bill of Lading PIN"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Container ID or Bill of Lading PIN Input"
              />
            </div>
            <button
              type="submit"
              className={styles.btnSteel}
              style={{ flex: '0 0 auto', padding: '0.875rem 2rem' }}
            >
              Verify Yard & PIN
            </button>
          </div>
        </form>

        {/* Quick select presets */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--tmpl-text-muted)',
          }}
        >
          <span>Sample Dispatches:</span>
          {Object.keys(PRESET_CONTAINERS).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSelectPreset(id)}
              style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '0.25rem 0.625rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Active Yard Result */}
        {activeRecord && (
          <div className={styles.yardResultBox}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderBottom: '1px solid var(--tmpl-border-light)',
                paddingBottom: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                    }}
                  >
                    {activeRecord.id}
                  </span>
                  <span className={styles.statusCleared}>
                    <CheckCircle2 size={13} /> {activeRecord.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--tmpl-text-muted)', marginTop: '0.25rem' }}>
                  {activeRecord.type} • {activeRecord.line}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textAlign: 'right',
                }}
              >
                <div style={{ fontSize: '0.6875rem', color: '#38bdf8', textTransform: 'uppercase' }}>
                  Gate Access PIN
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 800, color: '#ffffff' }}>
                  {activeRecord.gatePin}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                fontSize: '0.8125rem',
              }}
            >
              <div>
                <div style={{ color: 'var(--tmpl-text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <MapPin size={14} color="#38bdf8" /> Precise Yard Stack Slot
                </div>
                <div style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>
                  {activeRecord.yardSlot}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--tmpl-text-muted)', marginBottom: '0.25rem' }}>
                  Gross Tare / Cargo Weight
                </div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                  {activeRecord.weightGross} (VGM Certified)
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--tmpl-text-muted)', marginBottom: '0.25rem' }}>
                  Discharge Vessel
                </div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>
                  {activeRecord.vessel}
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--tmpl-text-muted)', marginBottom: '0.25rem' }}>
                  Free Time Clock & Demurrage
                </div>
                <div style={{ fontWeight: 700, color: '#10b981' }}>
                  {activeRecord.freeTimeDays} Days Remaining ({activeRecord.demurrageStatus})
                </div>
              </div>

              {activeRecord.reeferTemp && (
                <div style={{ gridColumn: '1 / -1', background: 'rgba(56, 189, 248, 0.06)', padding: '0.75rem', borderRadius: '4px' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.75rem' }}>
                    REEFER MONITORING PLUG ACTIVE
                  </div>
                  <div style={{ color: '#f8fafc', marginTop: '0.125rem' }}>
                    {activeRecord.reeferTemp}
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                borderTop: '1px solid var(--tmpl-border-light)',
                paddingTop: '1rem',
                fontSize: '0.75rem',
                color: 'var(--tmpl-text-muted)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <QrCode size={16} color="#38bdf8" /> Scan PIN or barcode at In-Gate Optical Kiosk
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                <ShieldCheck size={16} color="#10b981" /> US Customs & Border Protection Seal Intact
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

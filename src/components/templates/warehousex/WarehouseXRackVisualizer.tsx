'use client';

import React, { useState } from 'react';
import { Layers, Thermometer } from 'lucide-react';
import styles from './WarehouseX.module.css';

interface RackBay {
  id: string;
  name: string;
  status: 'occupied' | 'reserved' | 'empty';
  sku: string;
  weightLoad: string;
  temp: string;
}

const ZONES_DATA: Record<string, { name: string; temp: string; occupancy: string; bays: RackBay[] }> = {
  ambient: {
    name: 'Zone A — High-Velocity Ambient Dry',
    temp: '19.5°C Controlled',
    occupancy: '91.4% Capacity (1,820 / 2,000 Bays)',
    bays: [
      { id: 'b1', name: 'BAY A-01', status: 'occupied', sku: 'SKU-DRY-101', weightLoad: '1,200 kg', temp: '19.5°C' },
      { id: 'b2', name: 'BAY A-02', status: 'occupied', sku: 'SKU-DRY-102', weightLoad: '950 kg', temp: '19.4°C' },
      { id: 'b3', name: 'BAY A-03', status: 'reserved', sku: 'RESERVED (PO-881)', weightLoad: '—', temp: '19.5°C' },
      { id: 'b4', name: 'BAY A-04', status: 'occupied', sku: 'SKU-DRY-104', weightLoad: '1,400 kg', temp: '19.5°C' },
      { id: 'b5', name: 'BAY A-05', status: 'empty', sku: 'AVAILABLE', weightLoad: '0 kg', temp: '19.5°C' },
      { id: 'b6', name: 'BAY A-06', status: 'occupied', sku: 'SKU-DRY-106', weightLoad: '820 kg', temp: '19.6°C' },
      { id: 'b7', name: 'BAY A-07', status: 'occupied', sku: 'SKU-DRY-107', weightLoad: '1,100 kg', temp: '19.4°C' },
      { id: 'b8', name: 'BAY A-08', status: 'empty', sku: 'AVAILABLE', weightLoad: '0 kg', temp: '19.5°C' },
      { id: 'b9', name: 'BAY A-09', status: 'occupied', sku: 'SKU-DRY-109', weightLoad: '1,320 kg', temp: '19.5°C' },
      { id: 'b10', name: 'BAY A-10', status: 'occupied', sku: 'SKU-DRY-110', weightLoad: '980 kg', temp: '19.5°C' },
      { id: 'b11', name: 'BAY A-11', status: 'reserved', sku: 'RESERVED (PO-902)', weightLoad: '—', temp: '19.5°C' },
      { id: 'b12', name: 'BAY A-12', status: 'occupied', sku: 'SKU-DRY-112', weightLoad: '1,250 kg', temp: '19.5°C' },
    ],
  },
  cold: {
    name: 'Zone C — Pharmaceutical Cold-Chain Vault',
    temp: '-22.0°C Deep Freeze',
    occupancy: '87.2% Capacity (436 / 500 Bays)',
    bays: [
      { id: 'c1', name: 'VAULT C-01', status: 'occupied', sku: 'SKU-VAX-771', weightLoad: '720 kg', temp: '-22.1°C' },
      { id: 'c2', name: 'VAULT C-02', status: 'occupied', sku: 'SKU-BIO-802', weightLoad: '840 kg', temp: '-22.0°C' },
      { id: 'c3', name: 'VAULT C-03', status: 'occupied', sku: 'SKU-BIO-803', weightLoad: '690 kg', temp: '-21.9°C' },
      { id: 'c4', name: 'VAULT C-04', status: 'reserved', sku: 'RESERVED CLINICAL', weightLoad: '—', temp: '-22.0°C' },
      { id: 'c5', name: 'VAULT C-05', status: 'empty', sku: 'AVAILABLE CRYOGENIC', weightLoad: '0 kg', temp: '-22.0°C' },
      { id: 'c6', name: 'VAULT C-06', status: 'occupied', sku: 'SKU-INS-440', weightLoad: '580 kg', temp: '-22.2°C' },
      { id: 'c7', name: 'VAULT C-07', status: 'occupied', sku: 'SKU-INS-441', weightLoad: '610 kg', temp: '-22.1°C' },
      { id: 'c8', name: 'VAULT C-08', status: 'empty', sku: 'AVAILABLE CRYOGENIC', weightLoad: '0 kg', temp: '-22.0°C' },
      { id: 'c9', name: 'VAULT C-09', status: 'occupied', sku: 'SKU-SER-220', weightLoad: '790 kg', temp: '-22.0°C' },
      { id: 'c10', name: 'VAULT C-10', status: 'occupied', sku: 'SKU-SER-221', weightLoad: '810 kg', temp: '-21.8°C' },
      { id: 'c11', name: 'VAULT C-11', status: 'occupied', sku: 'SKU-SER-222', weightLoad: '770 kg', temp: '-22.0°C' },
      { id: 'c12', name: 'VAULT C-12', status: 'reserved', sku: 'RESERVED COLD-CHAIN', weightLoad: '—', temp: '-22.0°C' },
    ],
  },
  automated: {
    name: 'Zone H — 12-Tier High-Bay Robotic ASRS',
    temp: '18.0°C Automated Crane Airflow',
    occupancy: '94.8% Capacity (4,740 / 5,000 Bays)',
    bays: [
      { id: 'h1', name: 'ASRS H-01', status: 'occupied', sku: 'SKU-ROBO-01', weightLoad: '1,500 kg', temp: '18.1°C' },
      { id: 'h2', name: 'ASRS H-02', status: 'occupied', sku: 'SKU-ROBO-02', weightLoad: '1,450 kg', temp: '18.0°C' },
      { id: 'h3', name: 'ASRS H-03', status: 'occupied', sku: 'SKU-ROBO-03', weightLoad: '1,500 kg', temp: '18.0°C' },
      { id: 'h4', name: 'ASRS H-04', status: 'occupied', sku: 'SKU-ROBO-04', weightLoad: '1,380 kg', temp: '18.2°C' },
      { id: 'h5', name: 'ASRS H-05', status: 'occupied', sku: 'SKU-ROBO-05', weightLoad: '1,420 kg', temp: '18.1°C' },
      { id: 'h6', name: 'ASRS H-06', status: 'reserved', sku: 'CRANE 3 BUFFER', weightLoad: '—', temp: '18.0°C' },
      { id: 'h7', name: 'ASRS H-07', status: 'occupied', sku: 'SKU-ROBO-07', weightLoad: '1,490 kg', temp: '18.0°C' },
      { id: 'h8', name: 'ASRS H-08', status: 'empty', sku: 'CRANE ACCESSIBLE', weightLoad: '0 kg', temp: '18.0°C' },
      { id: 'h9', name: 'ASRS H-09', status: 'occupied', sku: 'SKU-ROBO-09', weightLoad: '1,500 kg', temp: '18.0°C' },
      { id: 'h10', name: 'ASRS H-10', status: 'occupied', sku: 'SKU-ROBO-10', weightLoad: '1,470 kg', temp: '17.9°C' },
      { id: 'h11', name: 'ASRS H-11', status: 'occupied', sku: 'SKU-ROBO-11', weightLoad: '1,500 kg', temp: '18.0°C' },
      { id: 'h12', name: 'ASRS H-12', status: 'occupied', sku: 'SKU-ROBO-12', weightLoad: '1,440 kg', temp: '18.0°C' },
    ],
  },
};

export const WarehouseXRackVisualizer: React.FC = () => {
  const [activeZoneKey, setActiveZoneKey] = useState<'ambient' | 'cold' | 'automated'>('ambient');
  const [selectedBay, setSelectedBay] = useState<RackBay>(ZONES_DATA['ambient'].bays[0]);

  const zone = ZONES_DATA[activeZoneKey];

  return (
    <section id="racks" className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>
          <Layers size={14} />
          <span>FACILITY TELEMETRY & DIGITAL TWIN</span>
        </div>
        <h2 className={styles.sectionTitle}>High-Density Rack Density Visualizer</h2>
        <p className={styles.sectionSubtitle}>
          Interactive bay telemetry reflecting live occupancy, vertical weight distribution,
          and HVAC microclimate conditions across zones.
        </p>
      </div>

      <div className={styles.rackTabs}>
        <button
          type="button"
          className={`${styles.rackTabBtn} ${activeZoneKey === 'ambient' ? styles.rackTabActive : ''}`}
          onClick={() => {
            setActiveZoneKey('ambient');
            setSelectedBay(ZONES_DATA['ambient'].bays[0]);
          }}
        >
          Zone A (Ambient Dry)
        </button>
        <button
          type="button"
          className={`${styles.rackTabBtn} ${activeZoneKey === 'cold' ? styles.rackTabActive : ''}`}
          onClick={() => {
            setActiveZoneKey('cold');
            setSelectedBay(ZONES_DATA['cold'].bays[0]);
          }}
        >
          Zone C (Cold Pharma -20°C)
        </button>
        <button
          type="button"
          className={`${styles.rackTabBtn} ${activeZoneKey === 'automated' ? styles.rackTabActive : ''}`}
          onClick={() => {
            setActiveZoneKey('automated');
            setSelectedBay(ZONES_DATA['automated'].bays[0]);
          }}
        >
          Zone H (High-Bay ASRS)
        </button>
      </div>

      <div style={{ background: '#0a1018', border: '1px solid var(--tmpl-border)', borderRadius: '4px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>SELECTED ZONE:</span>
          <div style={{ fontFamily: 'var(--tmpl-font-heading)', fontWeight: 700, color: '#f8fafc', fontSize: '1.125rem' }}>
            {zone.name}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ZONE CLIMATE</span>
            <div style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Thermometer size={15} /> {zone.temp}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>OCCUPANCY DENSITY</span>
            <div style={{ color: '#f8fafc', fontWeight: 600 }}>{zone.occupancy}</div>
          </div>
        </div>
      </div>

      <div className={styles.rackVisualizerGrid}>
        {zone.bays.map((bay) => {
          let statusClass = styles.rackBayCellOccupied;
          if (bay.status === 'reserved') statusClass = styles.rackBayCellReserved;
          if (bay.status === 'empty') statusClass = styles.rackBayCellEmpty;

          const isSelected = selectedBay.id === bay.id;

          return (
            <div
              key={bay.id}
              className={`${styles.rackBayCell} ${statusClass}`}
              style={{
                outline: isSelected ? '2px solid #10b981' : 'none',
                background: isSelected ? '#152433' : undefined,
              }}
              onClick={() => setSelectedBay(bay)}
            >
              <div className={styles.bayName}>{bay.name}</div>
              <div className={styles.bayDetail}>{bay.status.toUpperCase()}</div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '0.25rem' }}>
                {bay.temp}
              </div>
            </div>
          );
        })}
      </div>

      {selectedBay && (
        <div style={{ background: 'var(--tmpl-surface)', border: '1px solid var(--tmpl-border)', borderRadius: '4px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BAY TELEMETRY INSPECTION:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.125rem', fontWeight: 700, color: '#10b981' }}>
              {selectedBay.name} • {selectedBay.sku}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem' }}>
            <div><span style={{ color: '#94a3b8' }}>Payload Weight:</span> <strong>{selectedBay.weightLoad}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Sensor Temp:</span> <strong style={{ color: '#10b981' }}>{selectedBay.temp}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Structural Integrity:</span> <strong style={{ color: '#10b981' }}>100% Calibrated</strong></div>
          </div>
        </div>
      )}
    </section>
  );
};

'use client';

import React from 'react';
import styles from './FleetOne.module.css';

const VEHICLES = [
  {
    category: 'CLASS 8 LONG-HAUL',
    title: 'Aerodynamic Sleeper Tractors',
    description:
      'Engineered for maximum interstate uptime, fuel efficiency, and long-range operator endurance. Equipped with radar adaptive cruise and active lane mitigation.',
    specs: [
      { key: 'Powertrain', val: 'Cummins X15 565 HP / 2,050 lb-ft' },
      { key: 'Transmission', val: 'Eaton Endurant 12-Speed Automated' },
      { key: 'Gross Rating', val: '80,000 lbs GCWR' },
      { key: 'Telematics', val: 'Omnitracs J1939 Dual High-Speed CAN' },
    ],
  },
  {
    category: 'TEMPERATURE CONTROLLED',
    title: '53ft Multi-Temp Reefers',
    description:
      'Tri-zone insulated trailers capable of carrying frozen, refrigerated, and ambient freight simultaneously with real-time remote setpoint manipulation.',
    specs: [
      { key: 'Reefer Unit', val: 'Thermo King Precedent S-600' },
      { key: 'Temp Range', val: '-20°F to +70°F (Continuous)' },
      { key: 'Volume', val: '3,850 Cubic Feet / 26 Pallets' },
      { key: 'Monitoring', val: 'TracKing Cellular GPS / Temp Audit' },
    ],
  },
  {
    category: 'HEAVY HAUL SPECIALIZED',
    title: '55-Ton RGN Lowboys',
    description:
      'Hydraulic removable gooseneck trailers designed for drive-on loading of heavy industrial earthmoving machinery, transformers, and mining equipment.',
    specs: [
      { key: 'Payload Cap', val: '110,000 lbs in 12ft Span' },
      { key: 'Deck Height', val: '18 inches Loaded Ground Clearance' },
      { key: 'Axle Config', val: '3-Axle + Pin-On 4th Flip Bogie' },
      { key: 'Permits', val: 'Automated 48-State Oversize Routing' },
    ],
  },
  {
    category: 'FLATBED & STEP-DECK',
    title: '48ft Aluminum Combo Decks',
    description:
      'Engineered for structural steel, lumber, modular trusses, and building materials with sliding tandem axles and integrated steel coil wells.',
    specs: [
      { key: 'Capacity', val: '48,000 lbs Concentrated Load' },
      { key: 'Tarping', val: 'Fast-Roller Retractable Curtains' },
      { key: 'Tie-Downs', val: 'Recessed Chain Ties / Winch Track' },
      { key: 'Deck Material', val: 'Apitong Hardwood / Extruded Alum' },
    ],
  },
  {
    category: 'HAZMAT LIQUID BULK',
    title: 'DOT-407 Stainless Tankers',
    description:
      'Heavy-duty insulated chemical transport tankers with nitrogen purge capabilities, internal vapor recovery, and emergency safety shut-off systems.',
    specs: [
      { key: 'Vessel Spec', val: '316L High-Polished Stainless Steel' },
      { key: 'Capacity', val: '7,000 Gallons Single Compartment' },
      { key: 'Heating', val: 'External Steam Panel Heat Run' },
      { key: 'Driver Cert', val: 'Tanker & HazMat Endorsed (X)' },
    ],
  },
  {
    category: 'PORT INTERMODAL',
    title: 'Severe-Duty Drayage Chassis',
    description:
      'Ruggedized port terminal chassis equipped with twist locks for standard 20ft, 40ft, and 45ft high-cube ocean containers.',
    specs: [
      { key: 'Tare Weight', val: '6,600 lbs Lightweight High-Tensile' },
      { key: 'Lighting', val: 'Vibration-Damped Solid State LED' },
      { key: 'Suspension', val: 'Heavy Mechanical Multi-Leaf Spring' },
      { key: 'Security', val: 'Integrated RFID Electronic Seal' },
    ],
  },
];

export function FleetOneVehicles() {
  return (
    <div className={styles.section} id="vehicles">
      <div className={styles.sectionHeader}>
        <div className={styles.eyebrow}>INDUSTRIAL FLEET ROSTER</div>
        <h2 className={styles.sectionTitle}>Engineered Commercial Transport Assets</h2>
        <p className={styles.sectionSubtitle}>
          Specialized heavy transport equipment inspected, maintained, and operated to the most demanding industrial safety tolerances.
        </p>
      </div>

      <div className={styles.vehicleGrid}>
        {VEHICLES.map((v) => (
          <div key={v.title} className={styles.vehicleCard}>
            <span className={styles.vehicleClassBadge}>{v.category}</span>
            <h3 className={styles.vehicleTitle}>{v.title}</h3>
            <p className={styles.vehicleDesc}>{v.description}</p>
            <div className={styles.specTable}>
              {v.specs.map((s) => (
                <div key={s.key} className={styles.specRow}>
                  <span className={styles.specKey}>{s.key}</span>
                  <span className={styles.specVal}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

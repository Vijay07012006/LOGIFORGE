const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const TEMPLATES = [
  {
    slug: 'cargo-nova',
    name: 'CargoNova',
    industry: 'International Freight Forwarding',
    accent: '#D4AF37',
    accentSec: '#1B2A4A',
    bg: '#090D16',
    surface: '#0F172A',
    operationsTitle: 'Multimodal Trade Corridor & Tariff Matrix',
    operationsMetric1: '184 Active Corridors',
    operationsMetric2: '$1,840 / TEU Rate Index',
    operationsMetric3: '99.4% On-Time Customs Clearance',
    analyticsTitle: 'Global Air & Ocean TEU Throughput Analytics',
    analyticsMetric1: '42,910 TEU MTD',
    analyticsMetric2: '14.2 Days Avg Maritime Transit',
    analyticsMetric3: '1.24 tCO2e / TEU Scope-3 Avg',
    mobileTitle: 'CargoNova Mobile Consignment Companion',
  },
  {
    slug: 'fleet-one',
    name: 'FleetOne',
    industry: 'Heavy Fleet & Asset Telematics',
    accent: '#E11D48',
    accentSec: '#38BDF8',
    bg: '#090E17',
    surface: '#0F172A',
    operationsTitle: 'CAN-Bus ECM Telematics & Highway Convoy Dispatch',
    operationsMetric1: '240 Active Tractors',
    operationsMetric2: '94.2% Telematics Health',
    operationsMetric3: '6.8 MPG Fleet Avg Fuel',
    analyticsTitle: 'Preventative Maintenance & EV Battery Telemetry',
    analyticsMetric1: '89.6% Battery SOH',
    analyticsMetric2: '0 Critical Fault Codes',
    analyticsMetric3: '4.2 hrs Daily Engine Idle Reduction',
    mobileTitle: 'FleetOne Driver HOS Duty & Pre-Trip App',
  },
  {
    slug: 'ship-flow',
    name: 'ShipFlow',
    industry: 'Ocean Carrier & Maritime Shipping',
    accent: '#0284C7',
    accentSec: '#10B981',
    bg: '#06101E',
    surface: '#0B1B2B',
    operationsTitle: 'Global AIS Vessel Radar & Deepwater Berth Schedule',
    operationsMetric1: '38 Active Container Vessels',
    operationsMetric2: '19.4 kts Cruising Speed',
    operationsMetric3: '4.8 hrs Avg Berth Dwell',
    analyticsTitle: 'Maritime Fuel Burn & CII Carbon Rating Analysis',
    analyticsMetric1: '98.2% Schedule Reliability',
    analyticsMetric2: 'Rating A CII Compliance',
    analyticsMetric3: '18,400 TEU Max Vessel Capacity',
    mobileTitle: 'ShipFlow Port Agent Berth & Gate Terminal App',
  },
  {
    slug: 'swift-drop',
    name: 'SwiftDrop',
    industry: 'Last-Mile Urban Courier Dispatch',
    accent: '#FF5722',
    accentSec: '#8B5CF6',
    bg: '#0A0B12',
    surface: '#0D0E15',
    operationsTitle: 'Urban Micro-Fulfillment & Courier Routing Matrix',
    operationsMetric1: '14.2 min Avg Delivery Time',
    operationsMetric2: '1,280 Drops Dispatched',
    operationsMetric3: '99.8% First-Attempt Success',
    analyticsTitle: 'Last-Mile Velocity & Route Density Analysis',
    analyticsMetric1: '4.8 Drops / Hour / Courier',
    analyticsMetric2: '12.4 km Avg Courier Daily Radius',
    analyticsMetric3: '4.98 / 5.0 Customer Rating',
    mobileTitle: 'SwiftDrop Customer Live Courier & Digital POD',
  },
  {
    slug: 'port-axis',
    name: 'PortAxis',
    industry: 'Automated Port & Intermodal Terminal',
    accent: '#38BDF8',
    accentSec: '#F59E0B',
    bg: '#050914',
    surface: '#070C18',
    operationsTitle: 'TOS Ship-to-Shore Crane & Container Stack Matrix',
    operationsMetric1: '34.2 Crane Moves / Hour',
    operationsMetric2: '8 Container Cranes Active',
    operationsMetric3: '22 min Gate Truck Turnaround',
    analyticsTitle: 'Terminal Dwell Time & Intermodal Rail Yard Throughput',
    analyticsMetric1: '2.1 Days Avg Container Dwell',
    analyticsMetric2: '98.9% Yard Capacity Utilization',
    analyticsMetric3: '14 Trains / Day Dispatched',
    mobileTitle: 'PortAxis Trucker Appointment & OCR Gate Pass',
  },
  {
    slug: 'aero-cargo',
    name: 'AeroCargo',
    industry: 'Air Freight Charter & Pharma Logistics',
    accent: '#0EA5E9',
    accentSec: '#F97316',
    bg: '#050811',
    surface: '#070A14',
    operationsTitle: 'Air Cargo ULD Load Master & Ramp Dispatch Deck',
    operationsMetric1: '128 ULDs Staged',
    operationsMetric2: '104.2 Tonnes Payload Capacity',
    operationsMetric3: '-20.0°C Deep Frozen Vault',
    analyticsTitle: 'Air Charter Yield & Belly Freight Utilization Metrics',
    analyticsMetric1: '94.2% Cargo Load Factor',
    analyticsMetric2: '48.2 Tonne-Km Yield / Flight',
    analyticsMetric3: '42 min Aircraft Ramp Turnaround',
    mobileTitle: 'AeroCargo Ramp Barcode & Dangerous Goods App',
  },
  {
    slug: 'warehouse-x',
    name: 'WarehouseX',
    industry: '3PL Fulfillment & Automated Storage',
    accent: '#10B981',
    accentSec: '#06B6D4',
    bg: '#04080F',
    surface: '#060B12',
    operationsTitle: '3D High-Density ASRS Rack Grid & Pallet Ingestion',
    operationsMetric1: '42,000 Pallet Positions',
    operationsMetric2: '380 Picks / Hour Shuttles',
    operationsMetric3: '100% Inbound ASN Verified',
    analyticsTitle: 'Warehouse Inventory Turnover & Dock Turnaround Analysis',
    analyticsMetric1: '99.98% Inventory Accuracy',
    analyticsMetric2: '18.4 Days Inventory Turnover',
    analyticsMetric3: '14 Dock Doors Operating',
    mobileTitle: 'WarehouseX Picker WMS & RFID Forklift Tablet',
  },
  {
    slug: 'supply-core',
    name: 'SupplyCore',
    industry: 'Enterprise Supply Chain & ESG Resiliency',
    accent: '#6366F1',
    accentSec: '#F43F5E',
    bg: '#060913',
    surface: '#080B14',
    operationsTitle: 'Multi-Tier Supplier Disruption Risk Heatmap',
    operationsMetric1: '428 Monitored Suppliers',
    operationsMetric2: '12 Low Risk Corridors',
    operationsMetric3: '0 Single Points of Failure',
    analyticsTitle: 'Scope-3 ESG Carbon Audit & Tier-1/2 Compliance Matrix',
    analyticsMetric1: '84.2 ESG Compliance Score',
    analyticsMetric2: '-18.4% Scope-3 Emissions YoY',
    analyticsMetric3: '$14.2M Disruption Value Hedged',
    mobileTitle: 'SupplyCore Executive Supply Chain Risk Radar',
  },
  {
    slug: 'route-iq',
    name: 'RouteIQ',
    industry: 'AI Route Optimization & Algorithmic Dispatch',
    accent: '#A855F7',
    accentSec: '#EC4899',
    bg: '#04050D',
    surface: '#05070E',
    operationsTitle: 'Neural Genetic TSP Multi-Stop Route Solver',
    operationsMetric1: '50 Waypoints Optimized',
    operationsMetric2: '42.8 ms Heuristic Compute',
    operationsMetric3: '24.2% Miles Saved vs Static',
    analyticsTitle: 'Fleet Mileage Efficiency & Algorithmic Dispatch Yield',
    analyticsMetric1: '184.2 Tonnes CO2 Avoided',
    analyticsMetric2: '99.2% ETA Prediction Accuracy',
    analyticsMetric3: '$48,200 Monthly Fuel Savings',
    mobileTitle: 'RouteIQ Turn-by-Turn Commercial Driver Navigator',
  },
  {
    slug: 'move-sphere',
    name: 'MoveSphere',
    industry: 'Autonomous Electric Freight & Smart Containers',
    accent: '#14B8A6',
    accentSec: '#818CF8',
    bg: '#02050B',
    surface: '#03060D',
    operationsTitle: 'Autonomous Platooning Convoy & IoT Sensor Matrix',
    operationsMetric1: '4 Autonomous Trucks Platooned',
    operationsMetric2: '10.2 ms LiDAR Telemetry Latency',
    operationsMetric3: '100% Cryptographic Custody',
    analyticsTitle: 'Zero-Emission Autonomous Energy & Transit Metrics',
    analyticsMetric1: '1.18 kWh / Mile Efficiency',
    analyticsMetric2: '98.4% Autonomous Mode Driven',
    analyticsMetric3: '0 PSI Container Pressure Deviation',
    mobileTitle: 'MoveSphere Biometric Container Seal & Sensor Log',
  },
];

function generateOperationsSvg(t) {
  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.surface}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.accentSec}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="675" fill="url(#bgGrad)"/>

  <!-- Subtle Industrial Grid -->
  <g stroke="rgba(255,255,255,0.03)" stroke-width="1">
    ${Array.from({ length: 15 }, (_, i) => `<line x1="${(i + 1) * 80}" y1="0" x2="${(i + 1) * 80}" y2="675"/>`).join('')}
    ${Array.from({ length: 9 }, (_, i) => `<line x1="0" y1="${(i + 1) * 75}" x2="1200" y2="${(i + 1) * 75}"/>`).join('')}
  </g>

  <!-- Top Hardware Chrome Bar -->
  <rect x="40" y="30" width="1120" height="52" rx="8" fill="#141923" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <circle cx="68" cy="56" r="6" fill="#ef4444"/>
  <circle cx="88" cy="56" r="6" fill="#f59e0b"/>
  <circle cx="108" cy="56" r="6" fill="#10b981"/>

  <text x="140" y="62" fill="#ffffff" font-size="14" font-weight="700" font-family="system-ui, -apple-system, sans-serif" letter-spacing="1.5">LOGIFORGE // ${t.name.toUpperCase()} OPERATIONS CONSOLE</text>
  <rect x="880" y="42" width="120" height="28" rx="14" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1"/>
  <circle cx="900" cy="56" r="4" fill="#10b981"/>
  <text x="914" y="61" fill="#10b981" font-size="12" font-weight="700" font-family="monospace">LIVE FEED</text>

  <rect x="1015" y="42" width="130" height="28" rx="4" fill="rgba(255,255,255,0.05)"/>
  <text x="1080" y="60" fill="#a0aec0" font-size="11" font-family="monospace" text-anchor="middle">UTC 14:32:09</text>

  <!-- Main Hero Console Window -->
  <g transform="translate(40, 102)">
    <!-- Left KPI & Controls Column -->
    <rect x="0" y="0" width="340" height="530" rx="8" fill="#111622" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <text x="24" y="38" fill="${t.accent}" font-size="11" font-weight="700" font-family="monospace" letter-spacing="2">ACTIVE SPECIFICATION</text>
    <text x="24" y="68" fill="#ffffff" font-size="18" font-weight="800" font-family="system-ui, -apple-system, sans-serif">${t.name}</text>
    <text x="24" y="90" fill="#718096" font-size="12" font-family="system-ui, -apple-system, sans-serif">${t.industry}</text>

    <!-- KPI Card 1 -->
    <rect x="20" y="115" width="300" height="85" rx="6" fill="#182030" stroke="rgba(255,255,255,0.04)"/>
    <text x="36" y="142" fill="#a0aec0" font-size="11" font-family="system-ui, -apple-system, sans-serif">METRIC FOCUS</text>
    <text x="36" y="174" fill="${t.accent}" font-size="20" font-weight="800" font-family="monospace">${t.operationsMetric1}</text>

    <!-- KPI Card 2 -->
    <rect x="20" y="215" width="300" height="85" rx="6" fill="#182030" stroke="rgba(255,255,255,0.04)"/>
    <text x="36" y="242" fill="#a0aec0" font-size="11" font-family="system-ui, -apple-system, sans-serif">REAL-TIME INDEX</text>
    <text x="36" y="274" fill="#ffffff" font-size="19" font-weight="800" font-family="monospace">${t.operationsMetric2}</text>

    <!-- KPI Card 3 -->
    <rect x="20" y="315" width="300" height="85" rx="6" fill="#182030" stroke="rgba(255,255,255,0.04)"/>
    <text x="36" y="342" fill="#a0aec0" font-size="11" font-family="system-ui, -apple-system, sans-serif">SERVICE RELIABILITY</text>
    <text x="36" y="374" fill="#10b981" font-size="19" font-weight="800" font-family="monospace">${t.operationsMetric3}</text>

    <!-- Quick Action Button -->
    <rect x="20" y="425" width="300" height="50" rx="25" fill="url(#accentGrad)"/>
    <text x="170" y="456" fill="#ffffff" font-size="13" font-weight="700" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle" letter-spacing="1">LAUNCH LIVE SANDBOX →</text>
  </g>

  <!-- Right Visual Stage -->
  <g transform="translate(400, 102)">
    <rect x="0" y="0" width="760" height="530" rx="8" fill="#0d121c" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

    <!-- Section Header -->
    <text x="30" y="42" fill="#ffffff" font-size="18" font-weight="700" font-family="system-ui, -apple-system, sans-serif">${t.operationsTitle}</text>
    <text x="30" y="66" fill="#718096" font-size="12" font-family="system-ui, -apple-system, sans-serif">Deterministic telemetry feed synchronized with LOGIFORGE Contract State Engine</text>

    <!-- Center Interactive Graphic Radar / Flow -->
    <g transform="translate(30, 90)">
      <!-- Outer Display Frame -->
      <rect x="0" y="0" width="700" height="400" rx="8" fill="#121824" stroke="${t.accent}" stroke-width="1" stroke-opacity="0.3"/>
      
      <!-- Coordinate Axes & Radar Circles -->
      <circle cx="350" cy="200" r="140" fill="none" stroke="${t.accent}" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.3"/>
      <circle cx="350" cy="200" r="90" fill="none" stroke="${t.accent}" stroke-width="1" stroke-dasharray="2 2" stroke-opacity="0.4"/>
      <circle cx="350" cy="200" r="40" fill="none" stroke="${t.accent}" stroke-width="1.5" stroke-opacity="0.6"/>

      <!-- Sweep Line -->
      <line x1="350" y1="200" x2="480" y2="100" stroke="${t.accent}" stroke-width="2" filter="url(#glow)"/>

      <!-- Data Nodes on Map -->
      <g transform="translate(100, 80)">
        <rect x="0" y="0" width="140" height="60" rx="6" fill="#1a2233" stroke="${t.accent}" stroke-width="1"/>
        <text x="14" y="24" fill="${t.accent}" font-size="11" font-weight="700" font-family="monospace">ORIGIN HUB</text>
        <text x="14" y="46" fill="#ffffff" font-size="13" font-weight="700" font-family="monospace">GATEWAY #01</text>
      </g>
      <line x1="240" y1="110" x2="330" y2="170" stroke="${t.accent}" stroke-width="2" stroke-dasharray="6 4"/>

      <g transform="translate(480, 240)">
        <rect x="0" y="0" width="160" height="60" rx="6" fill="#1a2233" stroke="${t.accentSec}" stroke-width="1"/>
        <text x="14" y="24" fill="${t.accentSec}" font-size="11" font-weight="700" font-family="monospace">DESTINATION</text>
        <text x="14" y="46" fill="#ffffff" font-size="13" font-weight="700" font-family="monospace">INTERMODAL #04</text>
      </g>
      <line x1="380" y1="220" x2="480" y2="270" stroke="${t.accentSec}" stroke-width="2" stroke-dasharray="6 4"/>

      <!-- Floating Waypoint Markers -->
      <circle cx="350" cy="200" r="7" fill="${t.accent}" filter="url(#glow)"/>
      <circle cx="350" cy="200" r="14" fill="none" stroke="${t.accent}" stroke-width="2">
        <animate attributeName="r" values="7;22;7" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite"/>
      </circle>

      <!-- Bottom Status Stream -->
      <rect x="20" y="335" width="660" height="44" rx="6" fill="#161e2e"/>
      <circle cx="42" cy="357" r="4" fill="#10b981"/>
      <text x="56" y="361" fill="#e2e8f0" font-size="12" font-family="monospace">STATUS: ACTIVE TELEMETRY STREAM // PROTOCOL ZERO-LATENCY // ISO 27001 AUDITED</text>
    </g>
  </g>
</svg>`;
}

function generateAnalyticsSvg(t) {
  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.surface}"/>
    </linearGradient>
    <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${t.accent}" stop-opacity="0.0"/>
    </linearGradient>
    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.accentSec}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="675" fill="url(#bgGrad)"/>

  <!-- Top Title -->
  <g transform="translate(50, 45)">
    <text x="0" y="24" fill="${t.accent}" font-size="12" font-weight="700" font-family="monospace" letter-spacing="2">ENTERPRISE TELEMETRY ANALYTICS</text>
    <text x="0" y="60" fill="#ffffff" font-size="24" font-weight="800" font-family="system-ui, -apple-system, sans-serif">${t.analyticsTitle}</text>
  </g>

  <!-- 3 Top KPI Badges -->
  <g transform="translate(50, 130)">
    <!-- KPI 1 -->
    <rect x="0" y="0" width="340" height="100" rx="8" fill="#121824" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="24" y="36" fill="#a0aec0" font-size="12" font-family="system-ui, -apple-system, sans-serif">MONTH-TO-DATE VOLUME</text>
    <text x="24" y="74" fill="${t.accent}" font-size="28" font-weight="800" font-family="monospace">${t.analyticsMetric1}</text>

    <!-- KPI 2 -->
    <rect x="380" y="0" width="340" height="100" rx="8" fill="#121824" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="24" y="36" fill="#a0aec0" font-size="12" font-family="system-ui, -apple-system, sans-serif">EFFICIENCY INDEX</text>
    <text x="24" y="74" fill="#ffffff" font-size="26" font-weight="800" font-family="monospace">${t.analyticsMetric2}</text>

    <!-- KPI 3 -->
    <rect x="760" y="0" width="340" height="100" rx="8" fill="#121824" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="24" y="36" fill="#a0aec0" font-size="12" font-family="system-ui, -apple-system, sans-serif">ESG / QUALITY RATING</text>
    <text x="24" y="74" fill="#10b981" font-size="26" font-weight="800" font-family="monospace">${t.analyticsMetric3}</text>
  </g>

  <!-- Main Chart Section (Area Chart + Bar Chart Combo) -->
  <g transform="translate(50, 260)">
    <rect x="0" y="0" width="720" height="360" rx="8" fill="#101520" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    
    <text x="28" y="38" fill="#ffffff" font-size="15" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Throughput Velocity Curve (Real-Time vs Historic Baseline)</text>
    <text x="28" y="58" fill="#718096" font-size="11" font-family="monospace">TIME INTERVAL: PAST 30 DAYS // INTERVAL: 24H ACCUMULATOR</text>

    <!-- Chart Grid -->
    <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
      <line x1="40" y1="100" x2="680" y2="100"/>
      <line x1="40" y1="160" x2="680" y2="160"/>
      <line x1="40" y1="220" x2="680" y2="220"/>
      <line x1="40" y1="280" x2="680" y2="280"/>
    </g>

    <!-- Simulated Wave Area -->
    <path d="M 50 260 Q 150 140 250 190 T 450 120 T 650 90 L 650 300 L 50 300 Z" fill="url(#areaGrad)"/>
    <path d="M 50 260 Q 150 140 250 190 T 450 120 T 650 90" fill="none" stroke="${t.accent}" stroke-width="3"/>

    <!-- Data points -->
    <circle cx="50" cy="260" r="5" fill="#ffffff" stroke="${t.accent}" stroke-width="2"/>
    <circle cx="250" cy="190" r="5" fill="#ffffff" stroke="${t.accent}" stroke-width="2"/>
    <circle cx="450" cy="120" r="5" fill="#ffffff" stroke="${t.accent}" stroke-width="2"/>
    <circle cx="650" cy="90" r="6" fill="${t.accent}" stroke="#ffffff" stroke-width="2"/>

    <!-- X Axis Labels -->
    <text x="50" y="325" fill="#718096" font-size="10" font-family="monospace">WK 01</text>
    <text x="250" y="325" fill="#718096" font-size="10" font-family="monospace">WK 02</text>
    <text x="450" y="325" fill="#718096" font-size="10" font-family="monospace">WK 03</text>
    <text x="650" y="325" fill="#718096" font-size="10" font-family="monospace">WK 04</text>
  </g>

  <!-- Side Breakdown Column -->
  <g transform="translate(800, 260)">
    <rect x="0" y="0" width="350" height="360" rx="8" fill="#101520" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
    <text x="24" y="38" fill="#ffffff" font-size="15" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Corridor Breakdown</text>

    <!-- Bar 1 -->
    <text x="24" y="85" fill="#cbd5e0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Trans-Pacific Corridors (88%)</text>
    <rect x="24" y="95" width="300" height="12" rx="6" fill="#1a2233"/>
    <rect x="24" y="95" width="264" height="12" rx="6" fill="url(#barGrad)"/>

    <!-- Bar 2 -->
    <text x="24" y="145" fill="#cbd5e0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Europe-Asia Express (74%)</text>
    <rect x="24" y="155" width="300" height="12" rx="6" fill="#1a2233"/>
    <rect x="24" y="155" width="222" height="12" rx="6" fill="url(#barGrad)"/>

    <!-- Bar 3 -->
    <text x="24" y="205" fill="#cbd5e0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Trans-Atlantic Freight (62%)</text>
    <rect x="24" y="215" width="300" height="12" rx="6" fill="#1a2233"/>
    <rect x="24" y="215" width="186" height="12" rx="6" fill="url(#barGrad)"/>

    <!-- Bar 4 -->
    <text x="24" y="265" fill="#cbd5e0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Intermodal Rail Inbound (91%)</text>
    <rect x="24" y="275" width="300" height="12" rx="6" fill="#1a2233"/>
    <rect x="24" y="275" width="273" height="12" rx="6" fill="url(#barGrad)"/>

    <text x="24" y="330" fill="#10b981" font-size="12" font-weight="600" font-family="monospace">✓ ALL CHANNELS VERIFIED ZERO PACKET LOSS</text>
  </g>
</svg>`;
}

function generateMobileSvg(t) {
  return `<svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.bg}"/>
      <stop offset="100%" stop-color="${t.surface}"/>
    </linearGradient>
    <linearGradient id="phoneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${t.accent}"/>
      <stop offset="100%" stop-color="${t.accentSec}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="1200" height="675" fill="url(#bgGrad)"/>

  <!-- Left Copy & Description -->
  <g transform="translate(80, 160)">
    <rect x="0" y="0" width="160" height="28" rx="14" fill="rgba(255,255,255,0.06)" stroke="${t.accent}" stroke-width="1"/>
    <text x="80" y="18" fill="${t.accent}" font-size="11" font-weight="700" font-family="monospace" text-anchor="middle">RESPONSIVE BLUEPRINT</text>

    <text x="0" y="70" fill="#ffffff" font-size="36" font-weight="800" font-family="system-ui, -apple-system, sans-serif">Mobile-First</text>
    <text x="0" y="112" fill="${t.accent}" font-size="34" font-weight="800" font-family="system-ui, -apple-system, sans-serif">Logistics Precision</text>
    
    <text x="0" y="165" fill="#a0aec0" font-size="15" font-family="system-ui, -apple-system, sans-serif" width="460">
      Every LOGIFORGE template adapts fluidly to modern smartphones.
    </text>
    <text x="0" y="195" fill="#a0aec0" font-size="15" font-family="system-ui, -apple-system, sans-serif" width="460">
      Engineered for dispatchers in the field, marine port agents,
    </text>
    <text x="0" y="225" fill="#a0aec0" font-size="15" font-family="system-ui, -apple-system, sans-serif" width="460">
      and drivers verifying digital POD signatures on mobile viewports.
    </text>

    <!-- Checklist -->
    <g transform="translate(0, 270)">
      <circle cx="10" cy="10" r="8" fill="rgba(16,185,129,0.2)"/>
      <path d="M6 10 L9 13 L15 7" stroke="#10b981" stroke-width="2" fill="none"/>
      <text x="28" y="14" fill="#e2e8f0" font-size="14" font-family="system-ui, -apple-system, sans-serif">100% Touch-Target Compliant (Min 48px)</text>

      <circle cx="10" cy="45" r="8" fill="rgba(16,185,129,0.2)"/>
      <path d="M6 45 L9 48 L15 42" stroke="#10b981" stroke-width="2" fill="none"/>
      <text x="28" y="49" fill="#e2e8f0" font-size="14" font-family="system-ui, -apple-system, sans-serif">WAI-ARIA Focus Trapping on Mobile Filter Drawer</text>

      <circle cx="10" cy="80" r="8" fill="rgba(16,185,129,0.2)"/>
      <path d="M6 80 L9 83 L15 77" stroke="#10b981" stroke-width="2" fill="none"/>
      <text x="28" y="84" fill="#e2e8f0" font-size="14" font-family="system-ui, -apple-system, sans-serif">Zero Horizontal Overflow (320px–430px Validated)</text>
    </g>
  </g>

  <!-- Right Smartphone Mockup Hardware Frame -->
  <g transform="translate(740, 45)" filter="url(#shadow)">
    <!-- Ambient Phone Glow -->
    <rect x="-15" y="-15" width="370" height="610" rx="55" fill="url(#phoneGlow)"/>

    <!-- Phone Chassis Outer Frame -->
    <rect x="0" y="0" width="340" height="580" rx="42" fill="#181e2b" stroke="#334155" stroke-width="3"/>
    <!-- Phone Bezel -->
    <rect x="8" y="8" width="324" height="564" rx="36" fill="#090d16"/>

    <!-- Dynamic Island / Top Speaker -->
    <rect x="110" y="18" width="120" height="24" rx="12" fill="#000000"/>
    <circle cx="210" cy="30" r="4" fill="#1e293b"/>

    <!-- Phone Screen Content -->
    <g transform="translate(20, 52)">
      <!-- App Header -->
      <text x="14" y="24" fill="#ffffff" font-size="15" font-weight="800" font-family="system-ui, -apple-system, sans-serif">${t.name}</text>
      <circle cx="280" cy="20" r="14" fill="#1e293b"/>
      <line x1="274" y1="16" x2="286" y2="16" stroke="#ffffff" stroke-width="2"/>
      <line x1="274" y1="20" x2="286" y2="20" stroke="#ffffff" stroke-width="2"/>
      <line x1="274" y1="24" x2="286" y2="24" stroke="#ffffff" stroke-width="2"/>

      <!-- Mobile Hero Card -->
      <rect x="10" y="44" width="284" height="120" rx="12" fill="#141c2c" stroke="rgba(255,255,255,0.06)"/>
      <text x="24" y="72" fill="${t.accent}" font-size="10" font-weight="700" font-family="monospace">MOBILE CONSOLE</text>
      <text x="24" y="98" fill="#ffffff" font-size="16" font-weight="800" font-family="system-ui, -apple-system, sans-serif">Active Consignment</text>
      <text x="24" y="122" fill="#94a3b8" font-size="11" font-family="monospace">ID: CN-8924-US // TRANSIT</text>
      <circle cx="260" cy="74" r="5" fill="#10b981"/>

      <!-- Milestone Timeline Card -->
      <rect x="10" y="178" width="284" height="180" rx="12" fill="#141c2c" stroke="rgba(255,255,255,0.06)"/>
      
      <!-- Step 1 -->
      <circle cx="34" cy="208" r="7" fill="#10b981"/>
      <line x1="34" y1="215" x2="34" y2="248" stroke="#10b981" stroke-width="2"/>
      <text x="52" y="212" fill="#ffffff" font-size="12" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Customs Released</text>
      <text x="52" y="226" fill="#64748b" font-size="10" font-family="monospace">Shanghai Hub • 08:30</text>

      <!-- Step 2 -->
      <circle cx="34" cy="255" r="7" fill="${t.accent}"/>
      <line x1="34" y1="262" x2="34" y2="295" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <text x="52" y="259" fill="#ffffff" font-size="12" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Trans-Pacific In Transit</text>
      <text x="52" y="273" fill="#64748b" font-size="10" font-family="monospace">19.4 kts • ETA Tomorrow</text>

      <!-- Step 3 -->
      <circle cx="34" cy="302" r="7" fill="#334155"/>
      <text x="52" y="306" fill="#94a3b8" font-size="12" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Port Long Beach Gate</text>
      <text x="52" y="320" fill="#475569" font-size="10" font-family="monospace">Pending Discharge</text>

      <!-- Action Button -->
      <rect x="10" y="375" width="284" height="48" rx="24" fill="url(#btnGrad)"/>
      <text x="152" y="405" fill="#ffffff" font-size="13" font-weight="700" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">VERIFY CONTAINER SEAL</text>
    </g>

    <!-- Bottom Home Indicator Bar -->
    <rect x="110" y="560" width="120" height="4" rx="2" fill="#64748b"/>
  </g>
</svg>`;
}

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeTemplate(t) {
  const sanitized = {};
  for (const [key, val] of Object.entries(t)) {
    sanitized[key] = typeof val === 'string' ? escapeXml(val) : val;
  }
  return sanitized;
}

async function main() {
  console.log('Generating Rich Domain Images for LOGIFORGE Flagships...');

  for (const rawT of TEMPLATES) {
    const t = sanitizeTemplate(rawT);
    const targetDir = path.join(PUBLIC_DIR, 'images', 'templates', t.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 1. screen-operations.webp
    const opsSvg = generateOperationsSvg(t);
    const opsPath = path.join(targetDir, 'screen-operations.webp');
    await sharp(Buffer.from(opsSvg)).webp({ quality: 92 }).toFile(opsPath);
    console.log(`✓ Generated ${t.slug}/screen-operations.webp`);

    // 2. screen-analytics.webp
    const analyticsSvg = generateAnalyticsSvg(t);
    const analyticsPath = path.join(targetDir, 'screen-analytics.webp');
    await sharp(Buffer.from(analyticsSvg)).webp({ quality: 92 }).toFile(analyticsPath);
    console.log(`✓ Generated ${t.slug}/screen-analytics.webp`);

    // 3. screen-mobile.webp
    const mobileSvg = generateMobileSvg(t);
    const mobilePath = path.join(targetDir, 'screen-mobile.webp');
    await sharp(Buffer.from(mobileSvg)).webp({ quality: 92 }).toFile(mobilePath);
    console.log(`✓ Generated ${t.slug}/screen-mobile.webp`);
  }

  console.log('All 30 rich flagship images generated successfully!');
}

main().catch(console.error);

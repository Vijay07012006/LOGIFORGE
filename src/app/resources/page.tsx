'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GuideModal, Guide } from '@/components/platform/GuideModal';
import { BookOpen, Compass } from 'lucide-react';
import styles from './resources.module.css';

const GUIDES: Guide[] = [
  {
    id: 'res-patterns',
    title: 'Logistics UX Design Patterns',
    category: 'Design Systems',
    description:
      'Best practices for displaying multi-modal waybill progress, port schedules, vessel berth statuses, and telematics cards without cluttering the screen.',
    readTime: '8 min read',
    sections: [
      {
        heading: '1. Information Hierarchy in Freight Interfaces',
        content:
          'Freight dashboards suffer from severe data density challenges. A single ocean consignment entails container prefixes, vessel IMO identifiers, terminal berth allocations, customs releases, and demurrage timestamps. Presenting all parameters on a single plane induces cognitive fatigue.',
        bulletPoints: [
          'Group telemetry into progressive disclosure tiers: primary status first, sub-legs on expansion.',
          'Use monospace fonts exclusively for waybills, container ISO codes, and airport IATA tags.',
          'Leverage high-contrast color indicators for exception states (hold, customs inspection, weather delay).',
        ],
      },
      {
        heading: '2. Multi-Modal Progress Tracking Visuals',
        content:
          'Unlike consumer parcel deliveries, global logistics moves across intermodal junctions. A shipment transitions from road drayage to container ship, railhead ramp, and final regional distribution center.',
        bulletPoints: [
          'Represent handoff nodes with distinct transport glyphs (truck, vessel, rail, air).',
          'Clearly differentiate completed legs, current active transit segments, and scheduled future handoffs.',
          'Ensure the active milestone features animated pulse rings for instant optical recognition.',
        ],
      },
    ],
  },
  {
    id: 'res-tracking',
    title: 'Building Stateful Waybill Milestone Trackers',
    category: 'Engineering',
    description:
      'Architectural blueprint for implementing accessible, responsive multi-stage milestone indicators across road, ocean, and air freight pipelines.',
    readTime: '12 min read',
    sections: [
      {
        heading: '1. State Machine Representation',
        content:
          'A reliable tracking interface must treat consignment state transitions as a deterministic state machine rather than an arbitrary list of timestamps. Milestones exist in strictly validated enumerations: completed, in-transit, or pending.',
        bulletPoints: [
          'Every milestone contains unique geographic coordinates, ISO country codes, and facility timestamps.',
          'State transitions trigger live regions with aria-live="polite" to notify assistive technologies.',
          'Failed or intercepted shipments render explicit exception alert cards with resolution contact triggers.',
        ],
      },
      {
        heading: '2. Responsive Linear to Vertical Collapse',
        content:
          'Horizontal transit ribbons work on desktop screens wider than 1024px, but become unusable on mobile devices. A robust tracker transforms from an airport-style horizontal flight path into an accessible vertical timeline on screens narrower than 768px.',
      },
    ],
  },
  {
    id: 'res-isolation',
    title: 'Scoped CSS Tokens in Multi-Theme Platforms',
    category: 'Architecture',
    description:
      'How LogiForge maintains total style isolation between the platform host shell (--lf-*) and customer template primitives (--tmpl-*).',
    readTime: '6 min read',
    sections: [
      {
        heading: '1. The Two-Tier Token Problem',
        content:
          'When building a design studio where customer templates are loaded alongside the host platform shell, CSS variable collisions are catastrophic. If a customer template overrides --bg-base, the platform navigation header breaks.',
        bulletPoints: [
          'Tier 1 (--lf-*): Platform studio host tokens governing header, catalog filters, and device frames.',
          'Tier 2 (--tmpl-*): Customer template primitives dynamically bound per-template via CSS properties.',
          'Zero style leakage guaranteed across all 10 independent aesthetic directions.',
        ],
      },
    ],
  },
];

export default function ResourcesPage() {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);

  return (
    <div className={styles.page}>
      <div className="lf-container">
        {/* Header */}
        <div className={styles.header}>
          <Badge variant="primary" size="sm">
            DEVELOPER &amp; DESIGN RESOURCES
          </Badge>
          <h1 className={styles.title}>Logistics Web Engineering Guides</h1>
          <p className={styles.subtitle}>
            Documentation, design patterns, and starter kit references for developers, designers, and agencies building on the LogiForge platform foundation.
          </p>
        </div>

        {/* Resources Grid */}
        <div className={styles.grid}>
          {GUIDES.map((res) => (
            <article key={res.id} className={styles.card}>
              <div className={styles.cardHead}>
                <Badge variant="secondary" size="sm">
                  {res.category}
                </Badge>
                <span className={styles.readTime}>{res.readTime}</span>
              </div>
              <h2 className={styles.cardTitle}>{res.title}</h2>
              <p className={styles.cardDesc}>{res.description}</p>
              <div className={styles.cardFooter}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveGuide(res)}
                  aria-label={`Read guide: ${res.title}`}
                >
                  <BookOpen size={14} />
                  <span>Read Guide</span>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Starter Kits Banner */}
        <div className={styles.starterBanner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>Ready to build with LogiForge Starters?</h2>
            <p className={styles.bannerDesc}>
              Every template includes a standalone React + Next.js + TypeScript starter bundle with clean component primitives and sample simulated logistics tracking.
            </p>
          </div>
          <Link href="/templates">
            <Button variant="primary" size="md">
              <Compass size={16} />
              <span>Explore Starters</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Guide Reader Modal */}
      <GuideModal guide={activeGuide} onClose={() => setActiveGuide(null)} />
    </div>
  );
}

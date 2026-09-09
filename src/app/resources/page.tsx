import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Compass } from 'lucide-react';
import styles from './resources.module.css';

export const metadata = {
  title: 'Logistics Design Resources & Starter Guides',
  description: 'Design patterns, interactive component blueprints, and development guidelines for modern logistics websites.',
};

export default function ResourcesPage() {
  const resources = [
    {
      id: 'res-patterns',
      title: 'Logistics UX Design Patterns',
      category: 'Design Systems',
      description: 'Best practices for displaying multi-modal waybill progress, port schedules, vessel berth statuses, and telematics cards without cluttering the screen.',
      readTime: '8 min read',
    },
    {
      id: 'res-tracking',
      title: 'Building Stateful Waybill Milestone Trackers',
      category: 'Engineering',
      description: 'Architectural blueprint for implementing accessible, responsive multi-stage milestone indicators across road, ocean, and air freight pipelines.',
      readTime: '12 min read',
    },
    {
      id: 'res-isolation',
      title: 'Scoped CSS Tokens in Multi-Theme Platforms',
      category: 'Architecture',
      description: 'How LogiForge maintains total style isolation between the platform host shell (--lf-*) and customer template primitives (--tmpl-*).',
      readTime: '6 min read',
    },
  ];

  return (
    <div className={styles.page}>
      <div className="lf-container">
        {/* Header */}
        <div className={styles.header}>
          <Badge variant="primary" size="sm">
            DEVELOPER & DESIGN RESOURCES
          </Badge>
          <h1 className={styles.title}>Logistics Web Engineering Guides</h1>
          <p className={styles.subtitle}>
            Documentation, design patterns, and starter kit references for developers, designers, and agencies building on the LogiForge platform foundation.
          </p>
        </div>

        {/* Resources Grid */}
        <div className={styles.grid}>
          {resources.map((res) => (
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
                <Button variant="outline" size="sm">
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
    </div>
  );
}

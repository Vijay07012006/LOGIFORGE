import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import styles from './about.module.css';

export const metadata = {
  title: 'About LOGIFORGE | Architecture & Standards',
  description: 'The architectural standards, engineering principles, and vision behind the LOGIFORGE logistics template platform.',
};

export default function AboutPage() {
  const principles = [
    'TypeScript-first across all template manifests and filters.',
    'Strict token isolation: platform shell (--lf-*) and template (--tmpl-*) tokens never collide.',
    'No fake functionality presented as real. Simulated tracking is explicitly marked as simulated demo data.',
    'Zero broken buttons, dead links, or placeholder-looking UI.',
    'Mobile and responsive viewports are first-class architectural citizens.',
    'High accessibility standards: semantic HTML, contrast ratios, and accessible focus states.',
    'Every template has a distinct typographic and aesthetic identity.',
    'Maintainability is never sacrificed for superficial visual effects.',
  ];

  return (
    <div className={styles.page}>
      <div className="lf-container">
        {/* Header */}
        <div className={styles.header}>
          <Badge variant="primary" size="sm">
            PLATFORM MANIFESTO
          </Badge>
          <h1 className={styles.title}>Engineered for Real-World Logistics</h1>
          <p className={styles.subtitle}>
            LOGIFORGE was created to solve a persistent problem in web design: the lack of high-fidelity, production-grade website templates tailored specifically for freight operators, shipping lines, 3PL warehouses, and aviation cargo fleets.
          </p>
        </div>

        {/* Content Columns */}
        <div className={styles.grid}>
          <div className={styles.main}>
            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>The Core Philosophy</h2>
              <p className={styles.paragraph}>
                Generic marketplace templates typically swap accent colors on identical grid cards and call it a new theme. LOGIFORGE rejects this approach. Each of our 10 flagship templates is designed from the ground up to reflect the authentic workflows, data density, and aesthetic expectations of its specific logistics sub-niche.
              </p>
              <p className={styles.paragraph}>
                Whether it is the editorial luxury of CargoNova, the high-density telematics readouts of FleetOne, or the clean Scandinavian vessel schedules of ShipFlow, every template delivers a bespoke experience while sharing a robust, typed architectural foundation.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionHeading}>Platform Engineering Rules</h2>
              <div className={styles.principleList}>
                {principles.map((rule, idx) => (
                  <div key={idx} className={styles.principleItem}>
                    <CheckCircle2 size={18} className={styles.checkIcon} />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="licensing" className={styles.section}>
              <h2 className={styles.sectionHeading}>Licensing & Usage</h2>
              <p className={styles.paragraph}>
                LogiForge templates are distributed under commercial developer licenses allowing developers, design agencies, and enterprise logistics firms to use them as starting foundations for client deliveries and internal company portals.
              </p>
            </section>
          </div>

          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <div className={styles.cardHeader}>
                <ShieldCheck size={20} className={styles.shieldIcon} />
                <h3 className={styles.cardTitle}>Phase 02 Architecture Status</h3>
              </div>
              <p className={styles.cardText}>
                The platform foundation, core design token system, 11-category registry, and 10 flagship template manifests are fully verified.
              </p>
              <div className={styles.cardMeta}>
                <div className={styles.metaRow}>
                  <span>Framework</span>
                  <strong>Next.js 15+ / React 19</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Strict TypeScript</span>
                  <strong>Verified 100%</strong>
                </div>
                <div className={styles.metaRow}>
                  <span>Token Namespaces</span>
                  <strong>--lf-* &amp; --tmpl-*</strong>
                </div>
              </div>
              <Link href="/templates">
                <Button variant="primary" size="sm" fullWidth>
                  <Compass size={14} />
                  <span>Browse Templates</span>
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

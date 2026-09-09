import Link from 'next/link';
import { Box, ShieldCheck, ExternalLink } from 'lucide-react';
import { LOGISTICS_CATEGORIES } from '@/data/categories';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Top Section */}
        <div className={styles.top}>
          {/* Brand Identity & Mission */}
          <div className={styles.brandColumn}>
            <Link href="/" className={styles.brand}>
              <div className={styles.logoIcon}>
                <Box size={20} />
              </div>
              <span className={styles.brandName}>LOGIFORGE</span>
            </Link>
            <p className={styles.tagline}>
              The category-defining logistics website template platform and interactive design studio. Built for freight operators, shipping lines, 3PL warehouses, aviation cargo fleets, and digital agencies.
            </p>
            <div className={styles.repoLink}>
              <a
                href="https://github.com/Vijay07012006/LOGIFORGE"
                target="_blank"
                rel="noreferrer"
                className={styles.githubBadge}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span>GitHub Repository</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className={styles.linksGrid}>
            {/* Column 1: Platform */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>Platform</h4>
              <ul className={styles.linkList}>
                <li><Link href="/templates">Templates Catalog (10)</Link></li>
                <li><Link href="/templates?tier=premium">Premium Flagships</Link></li>
                <li><Link href="/demo/cargo-nova">Live Demo Studio</Link></li>
                <li><Link href="/resources">Design Patterns &amp; Guides</Link></li>
                <li><Link href="/about">Platform Manifesto</Link></li>
              </ul>
            </div>

            {/* Column 2: Logistics Categories */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>Disciplines</h4>
              <ul className={styles.linkList}>
                {LOGISTICS_CATEGORIES.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/templates?category=${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: More Disciplines */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>More Sectors</h4>
              <ul className={styles.linkList}>
                {LOGISTICS_CATEGORIES.slice(6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/templates?category=${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Architecture & Specs */}
            <div className={styles.column}>
              <h4 className={styles.colTitle}>Architecture</h4>
              <ul className={styles.linkList}>
                <li><Link href="/about#principles">Engineering Rules</Link></li>
                <li><Link href="/about#licensing">Commercial Licensing</Link></li>
                <li><Link href="/resources">Starter Kit Schemas</Link></li>
                <li><Link href="/demo/cargo-nova">Simulated Waybill API</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Verification Signals */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LOGIFORGE Platform. All 10 flagship template manifests and architectural contracts maintained.
          </p>
          <div className={styles.statusBadges}>
            <div className={styles.status}>
              <span className={styles.statusDot} />
              <span>Core v0.3.0 • Phase 03 Shell Verified</span>
            </div>
            <div className={styles.shield}>
              <ShieldCheck size={14} className={styles.shieldIcon} />
              <span>WCAG 2.1 AA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

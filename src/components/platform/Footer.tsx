import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Box } from 'lucide-react';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandColumn}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>
                <Box size={18} />
              </div>
              <span className={styles.brandName}>LOGIFORGE</span>
            </div>
            <p className={styles.tagline}>
              The premium logistics website template platform & live design studio. Built for freight operators, shipping lines, telematics teams, and digital agencies.
            </p>
          </div>

          <div className={styles.linksGrid}>
            <div className={styles.column}>
              <h4 className={styles.colTitle}>Platform</h4>
              <ul className={styles.linkList}>
                <li><Link href="/templates">All Templates</Link></li>
                <li><Link href="/templates?tier=premium">Premium Flagships</Link></li>
                <li><Link href="/demo/cargo-nova">Live Demo Studio</Link></li>
                <li><Link href="/resources">Design Patterns</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.colTitle}>Categories</h4>
              <ul className={styles.linkList}>
                <li><Link href="/templates?category=freight-forwarding">Freight Forwarding</Link></li>
                <li><Link href="/templates?category=fleet-management">Fleet & Telematics</Link></li>
                <li><Link href="/templates?category=ocean-freight">Ocean Freight</Link></li>
                <li><Link href="/templates?category=last-mile">Last Mile & Courier</Link></li>
              </ul>
            </div>

            <div className={styles.column}>
              <h4 className={styles.colTitle}>Documentation</h4>
              <ul className={styles.linkList}>
                <li><Link href="/about">Platform Architecture</Link></li>
                <li><Link href="/about#licensing">Commercial Licensing</Link></li>
                <li><Link href="/resources#starter-kits">Starter Kits</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} LOGIFORGE Platform. All architectural standards and template contracts maintained.
          </p>
          <div className={styles.status}>
            <span className={styles.statusDot} />
            <span>Platform Core v0.1.0 • Phase 02 Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

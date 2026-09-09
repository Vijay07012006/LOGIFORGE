import React from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Compass, Box } from 'lucide-react';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand Logo */}
        <Link href="/" className={styles.brand}>
          <div className={styles.logoIcon}>
            <Box size={20} className={styles.boxIcon} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>LOGIFORGE</span>
            <Badge variant="primary" size="sm" className={styles.badge}>
              STUDIO
            </Badge>
          </div>
        </Link>

        {/* Primary Navigation */}
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/templates" className={styles.navLink}>
            Templates
          </Link>
          <Link href="/demo/cargo-nova" className={styles.navLink}>
            Live Demo
          </Link>
          <Link href="/resources" className={styles.navLink}>
            Resources
          </Link>
          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className={styles.actions}>
          <Link href="/templates">
            <Button variant="primary" size="sm">
              <Compass size={16} />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

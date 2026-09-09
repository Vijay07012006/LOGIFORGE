'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Compass, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { MobileDrawer } from './MobileDrawer';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          {/* Brand Logo & Studio Identity */}
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.brand} aria-label="LOGIFORGE Home">
              <div className={styles.logoIcon}>
                <Box size={20} className={styles.boxIcon} />
                <span className={styles.logoPulse} />
              </div>
              <div className={styles.brandText}>
                <span className={styles.brandName}>LOGIFORGE</span>
                <span className={styles.brandTag}>STUDIO</span>
              </div>
            </Link>

            {/* Platform Status Indicator */}
            <div className={styles.statusIndicator} title="All 10 Flagship Contracts Initialized">
              <span className={styles.statusDot} />
              <span className={styles.statusText}>10 Flagships</span>
            </div>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className={styles.nav} aria-label="Main Navigation">
            <Link
              href="/templates"
              className={`${styles.navLink} ${pathname === '/templates' ? styles.active : ''}`}
            >
              Templates
            </Link>
            <Link
              href="/demo/cargo-nova"
              className={`${styles.navLink} ${pathname.startsWith('/demo') ? styles.active : ''}`}
            >
              Live Demo
            </Link>
            <Link
              href="/resources"
              className={`${styles.navLink} ${pathname === '/resources' ? styles.active : ''}`}
            >
              Resources
            </Link>
            <Link
              href="/about"
              className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}
            >
              About
            </Link>
          </nav>

          {/* Action CTAs & Mobile Hamburger */}
          <div className={styles.actions}>
            <Link href="/templates" className={styles.desktopCta}>
              <Button variant="primary" size="sm">
                <Compass size={15} />
                <span>Explore Catalog</span>
              </Button>
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

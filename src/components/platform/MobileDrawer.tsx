'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Box, Compass, Play, BookOpen, Info, ArrowRight } from 'lucide-react';
import { LOGISTICS_CATEGORIES } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './MobileDrawer.module.css';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.brand} onClick={onClose}>
            <div className={styles.logoIcon}>
              <Box size={18} />
            </div>
            <span className={styles.brandName}>LOGIFORGE</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className={styles.navSection} aria-label="Mobile Primary Navigation">
          <Link
            href="/templates"
            className={`${styles.navItem} ${pathname === '/templates' ? styles.active : ''}`}
            onClick={onClose}
          >
            <Compass size={18} />
            <span>Templates Catalog</span>
            <Badge variant="primary" size="sm" className={styles.countBadge}>
              10
            </Badge>
          </Link>

          <Link
            href="/demo/cargo-nova"
            className={`${styles.navItem} ${pathname.startsWith('/demo') ? styles.active : ''}`}
            onClick={onClose}
          >
            <Play size={18} />
            <span>Live Demo Studio</span>
          </Link>

          <Link
            href="/resources"
            className={`${styles.navItem} ${pathname === '/resources' ? styles.active : ''}`}
            onClick={onClose}
          >
            <BookOpen size={18} />
            <span>Design Patterns &amp; Docs</span>
          </Link>

          <Link
            href="/about"
            className={`${styles.navItem} ${pathname === '/about' ? styles.active : ''}`}
            onClick={onClose}
          >
            <Info size={18} />
            <span>Manifesto &amp; Standards</span>
          </Link>
        </nav>

        {/* Quick Category Browser */}
        <div className={styles.categoriesSection}>
          <div className={styles.catHeader}>
            <span className={styles.catTitle}>Logistics Disciplines</span>
            <Link href="/templates" className={styles.viewAll} onClick={onClose}>
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className={styles.catList}>
            {LOGISTICS_CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/templates?category=${cat.slug}`}
                className={styles.catLink}
                onClick={onClose}
              >
                <span>{cat.name}</span>
                <span className={styles.catDot} style={{ backgroundColor: cat.accentColor }} />
              </Link>
            ))}
          </div>
        </div>

        {/* Drawer Footer CTA */}
        <div className={styles.footer}>
          <Link href="/templates" onClick={onClose} style={{ width: '100%' }}>
            <Button variant="primary" size="md" fullWidth>
              <Compass size={16} />
              <span>Explore All Templates</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

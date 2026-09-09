'use client';

import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import styles from './TemplateHeader.module.css';

export interface NavItem {
  id: string;
  label: string;
}

interface TemplateHeaderProps {
  brandName: string;
  tagline?: string;
  navItems: NavItem[];
  activeId?: string;
  onSelectNav: (id: string) => void;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export function TemplateHeader({
  brandName,
  tagline,
  navItems,
  activeId,
  onSelectNav,
  ctaLabel = 'Book Transport',
  onCtaClick,
}: TemplateHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleItemClick = (id: string) => {
    onSelectNav(id);
    setMobileOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => handleItemClick('home')}
        >
          <span className={styles.brandDot} />
          <span className={styles.brandName}>{brandName}</span>
          {tagline && <span className={styles.brandTagline}>{tagline}</span>}
        </button>

        <nav className={styles.navLinks} aria-label="Template navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`${styles.navLink} ${
                activeId === item.id ? styles.navLinkActive : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.navActions}>
          {ctaLabel && (
            <button
              type="button"
              className={styles.ctaBtn}
              onClick={onCtaClick}
            >
              {ctaLabel}
              <ArrowUpRight size={14} />
            </button>
          )}

          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileDrawer}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`${styles.mobileLink} ${
                activeId === item.id ? styles.mobileLinkActive : ''
              }`}
            >
              {item.label}
            </button>
          ))}
          {ctaLabel && (
            <button
              type="button"
              className={styles.mobileCta}
              onClick={() => {
                setMobileOpen(false);
                onCtaClick?.();
              }}
            >
              {ctaLabel}
            </button>
          )}
        </div>
      )}
    </header>
  );
}

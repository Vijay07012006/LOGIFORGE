'use client';

import React from 'react';
import styles from './TemplateFooter.module.css';

interface FooterColumn {
  title: string;
  links: { label: string; href?: string; onClick?: () => void }[];
}

interface TemplateFooterProps {
  brandName: string;
  description: string;
  certifications?: string[];
  columns: FooterColumn[];
  dispatchCenterName?: string;
  dispatchInfo?: string;
}

export function TemplateFooter({
  brandName,
  description,
  certifications = ['ISO 9001', 'IATA CARGO', 'FIATA', 'C-TPAT TIER 3'],
  columns,
  dispatchCenterName = 'Global Operations Center',
  dispatchInfo = 'Continuous 24/7/365 satellite telemetry and customs dispatch coordination.',
}: TemplateFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <div className={styles.brandTitle}>
              <span className={styles.brandDot} />
              {brandName}
            </div>
            <p className={styles.brandDesc}>{description}</p>
            {certifications && certifications.length > 0 && (
              <div className={styles.certBadges}>
                {certifications.map((cert) => (
                  <span key={cert} className={styles.badge}>
                    {cert}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div className={styles.colTitle}>{col.title}</div>
              <ul className={styles.linkList}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        type="button"
                        onClick={link.onClick}
                        className={styles.linkItem}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a href={link.href || '#'} className={styles.linkItem}>
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Operations / Dispatch Card */}
          <div>
            <div className={styles.colTitle}>Command Status</div>
            <div className={styles.dispatchCard}>
              <div className={styles.dispatchHead}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                  {dispatchCenterName}
                </span>
                <span className={styles.dispatchLive}>
                  <span className={styles.livePulse} />
                  ACTIVE
                </span>
              </div>
              <p className={styles.dispatchDesc}>{dispatchInfo}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div>
            &copy; {currentYear} {brandName} Logistics Worldwide. Template Architecture by LOGIFORGE.
          </div>
          <div className={styles.legalLinks}>
            <a href="#privacy" className={styles.legalLink}>
              Privacy & Cookie Notice
            </a>
            <a href="#terms" className={styles.legalLink}>
              Terms of Carriage
            </a>
            <a href="#compliance" className={styles.legalLink}>
              Sanctions & Export Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import type { TemplateProductMetadata } from '@/types/template';
import { CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import styles from './CommercialScopeCard.module.css';

export interface CommercialScopeCardProps {
  product: TemplateProductMetadata;
}

export function CommercialScopeCard({ product }: CommercialScopeCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Layers size={20} className={styles.headerIcon} />
          <div>
            <h2 className={styles.title}>Commercial Architecture & Scope</h2>
            <p className={styles.subtitle}>
              Clear demarcation of included starter capabilities versus external production services.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.columnsGrid}>
        {/* Included Capabilities */}
        <div className={styles.columnIncluded}>
          <div className={styles.columnHeader}>
            <div className={styles.badgeIncluded}>
              <CheckCircle2 size={14} />
              <span>Included in Starter Package</span>
            </div>
          </div>
          <ul className={styles.list}>
            {product.includedFeatures.map((feat, idx) => (
              <li key={idx} className={styles.itemIncluded}>
                <CheckCircle2 size={16} className={styles.iconIncluded} />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requires External Integration */}
        <div className={styles.columnExcluded}>
          <div className={styles.columnHeader}>
            <div className={styles.badgeExcluded}>
              <AlertCircle size={14} />
              <span>Requires External Integration</span>
            </div>
          </div>
          <ul className={styles.list}>
            {product.excludedFeatures.map((feat, idx) => (
              <li key={idx} className={styles.itemExcluded}>
                <span className={styles.dotExcluded}>—</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
          <div className={styles.disclaimerBox}>
            <span className={styles.disclaimerTitle}>Production Note:</span>
            <p className={styles.disclaimerText}>
              All interactive waybills, tracking statuses, and operational telemetry are powered by deterministic in-memory fixtures ready to connect to your live ERP, TMS, or carrier Webhooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import styles from './SectionHeading.module.css';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  action,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        styles.wrapper,
        styles[align],
        action && styles.hasAction,
        className
      )}
      {...props}
    >
      <div className={styles.textGroup}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

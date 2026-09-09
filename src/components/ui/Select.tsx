import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  icon?: React.ReactNode;
}

export function Select({
  label,
  options,
  icon,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={generatedId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.selectContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <select
          id={generatedId}
          className={cn(styles.select, icon && styles.hasIcon, className)}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.arrow} aria-hidden="true" />
      </div>
    </div>
  );
}

import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './SearchField.module.css';

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  id?: string;
  autoFocus?: boolean;
}

export function SearchField({
  value,
  onChange,
  onClear,
  placeholder = 'Search logistics templates by name, tag, or feature...',
  className,
  id = 'catalog-search',
  autoFocus,
}: SearchFieldProps) {
  return (
    <div className={cn(styles.wrapper, className)}>
      <label htmlFor={id} className={styles.srOnly}>
        Search Templates
      </label>
      <Search size={18} className={styles.searchIcon} aria-hidden="true" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          className={styles.clearBtn}
          aria-label="Clear search query"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

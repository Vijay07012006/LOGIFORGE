import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function Badge({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        styles.badge,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

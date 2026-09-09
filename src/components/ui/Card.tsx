import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'glass' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'surface',
  padding = 'md',
  hover = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        hover && styles.hover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'secondary' | 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  'aria-label': string;
  children: React.ReactNode;
}

export function IconButton({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

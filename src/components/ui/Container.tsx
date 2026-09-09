import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Container.module.css';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export function Container({
  size = 'lg',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

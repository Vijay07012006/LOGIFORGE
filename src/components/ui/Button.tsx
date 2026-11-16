import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

export type ButtonProps = BaseButtonProps &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  );

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const combinedClassName = cn(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  );

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = props as { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>;
    const isExternal = href.startsWith('http://') || href.startsWith('https://') || anchorProps.target === '_blank';
    if (isExternal) {
      return (
        <a href={href} className={combinedClassName} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}

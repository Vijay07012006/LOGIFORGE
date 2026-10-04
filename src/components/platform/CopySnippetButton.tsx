'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopySnippetButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: 'button' | 'icon' | 'compact';
  className?: string;
  ariaLabel?: string;
}

export function CopySnippetButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied!',
  variant = 'button',
  className = '',
  ariaLabel,
}: CopySnippetButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-secure / older environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel || label}
        title={copied ? copiedLabel : label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          borderRadius: '4px',
          background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
          border: `1px solid ${copied ? '#10b981' : 'var(--lf-border-subtle, #2e241b)'}`,
          color: copied ? '#10b981' : 'var(--lf-text-secondary, #b8a99a)',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        className={className}
      >
        {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={ariaLabel || label}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '3px 8px',
          fontSize: '11px',
          fontFamily: 'var(--lf-font-mono, monospace)',
          borderRadius: '4px',
          background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.4)' : 'var(--lf-border-subtle, #2e241b)'}`,
          color: copied ? '#34d399' : 'var(--lf-text-muted, #8c7e70)',
          cursor: 'pointer',
          transition: 'all 150ms ease',
        }}
        className={className}
      >
        {copied ? (
          <>
            <Check size={12} style={{ color: '#10b981' }} aria-hidden="true" />
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <Copy size={12} aria-hidden="true" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel || label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'var(--lf-font-sans, system-ui)',
        borderRadius: '6px',
        background: copied ? 'rgba(16, 185, 129, 0.12)' : 'var(--lf-bg-elevated, #241c16)',
        border: `1px solid ${copied ? '#10b981' : 'var(--lf-border-subtle, #2e241b)'}`,
        color: copied ? '#10b981' : 'var(--lf-text-primary, #f5efe6)',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
      className={className}
    >
      {copied ? (
        <>
          <Check size={14} style={{ color: '#10b981' }} aria-hidden="true" />
          <span>{copiedLabel}</span>
        </>
      ) : (
        <>
          <Copy size={14} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

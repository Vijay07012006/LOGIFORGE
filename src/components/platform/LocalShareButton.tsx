'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Share2, Check, Copy } from 'lucide-react';

export interface LocalShareButtonProps {
  slug: string;
  name: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  mode?: 'template' | 'demo' | 'embed';
}

export function LocalShareButton({
  slug,
  name,
  variant = 'outline',
  size = 'md',
  className,
  mode = 'template',
}: LocalShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getPath = () => {
    switch (mode) {
      case 'demo':
        return `/demo/${slug}`;
      case 'embed':
        return `/demo/${slug}/embed`;
      case 'template':
      default:
        return `/templates/${slug}`;
    }
  };

  const getLabel = () => {
    if (copied) return 'Copied!';
    switch (mode) {
      case 'demo':
        return 'Share Demo URL';
      case 'embed':
        return 'Copy Embed URL';
      case 'template':
      default:
        return 'Share Template';
    }
  };

  const handleCopy = async () => {
    const relativePath = getPath();
    const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${relativePath}` : relativePath;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = fullUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      variant={copied ? 'secondary' : variant}
      size={size}
      onClick={handleCopy}
      className={className}
      aria-label={`Copy local link for ${name}`}
      title={`Copy ${mode} URL to clipboard`}
    >
      {copied ? (
        <>
          <Check size={size === 'sm' ? 14 : 16} style={{ color: '#10b981' }} />
          <span>{getLabel()}</span>
        </>
      ) : (
        <>
          {mode === 'embed' ? (
            <Copy size={size === 'sm' ? 14 : 16} />
          ) : (
            <Share2 size={size === 'sm' ? 14 : 16} />
          )}
          <span>{getLabel()}</span>
        </>
      )}
    </Button>
  );
}

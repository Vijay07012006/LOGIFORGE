'use client';

import React, { useState } from 'react';
import type { Template } from '@/types/template';
import { getTemplateDownloadUrl, getTemplatePackageFilename } from '@/lib/templates';
import { cn } from '@/lib/utils';
import buttonStyles from '@/components/ui/Button.module.css';
import { Download, CheckCircle2 } from 'lucide-react';

export interface StarterDownloadButtonProps {
  template: Template;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function StarterDownloadButton({
  template,
  size = 'lg',
  variant = 'secondary',
  className,
}: StarterDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const downloadUrl = template.downloadUrl || getTemplateDownloadUrl(template);
  const filename = getTemplatePackageFilename(template);

  const handleClick = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 3500);
  };

  return (
    <a
      href={downloadUrl}
      download={filename}
      onClick={handleClick}
      className={cn(
        buttonStyles.button,
        buttonStyles[downloading ? 'outline' : variant],
        buttonStyles[size],
        className
      )}
      aria-label={`Download ${template.name} Starter Package (${filename})`}
      title={`Download ${filename}`}
    >
      {downloading ? (
        <>
          <CheckCircle2 size={size === 'sm' ? 14 : 18} style={{ color: '#10b981' }} aria-hidden="true" />
          <span>Starter Package Ready</span>
        </>
      ) : (
        <>
          <Download size={size === 'sm' ? 14 : 18} aria-hidden="true" />
          <span>Download Starter Package</span>
        </>
      )}
    </a>
  );
}

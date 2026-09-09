'use client';

import React, { useState } from 'react';
import type { Template } from '@/types/template';
import { Button } from '@/components/ui/Button';
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
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const starterPackage = {
      name: template.name,
      slug: template.slug,
      version: template.version,
      category: template.category,
      style: template.style,
      industry: template.industry,
      theme: template.theme,
      pages: template.pages,
      features: template.features,
      starterConfig: {
        framework: 'Next.js 15+ App Router',
        language: 'TypeScript Strict',
        styling: 'CSS Modules + Scoped Tokens',
        license: `${template.tier.toUpperCase()} Commercial Developer License`,
        instructions: [
          'Unpack template files into your project src directory.',
          'Import theme tokens from src/styles/tokens.css.',
          'Customize sections and simulated logistics tracking in src/data/tracking.',
        ],
      },
      exportedAt: new Date().toISOString(),
      architecture: 'LOGIFORGE v0.3.0 Platform Foundation',
    };

    const blob = new Blob([JSON.stringify(starterPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.slug}-starter-manifest.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3500);
  };

  return (
    <Button
      variant={downloaded ? 'outline' : variant}
      size={size}
      onClick={handleDownload}
      className={className}
      aria-label={`Download starter package for ${template.name}`}
    >
      {downloaded ? (
        <>
          <CheckCircle2 size={size === 'sm' ? 14 : 18} style={{ color: '#10b981' }} />
          <span>Starter Package Saved</span>
        </>
      ) : (
        <>
          <Download size={size === 'sm' ? 14 : 18} />
          <span>Download Starter Package</span>
        </>
      )}
    </Button>
  );
}

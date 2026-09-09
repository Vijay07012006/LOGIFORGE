'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { getSampleTrackingNumbers } from '@/lib/tracking';
import { Badge } from '@/components/ui/Badge';
import { StarterDownloadButton } from '@/components/platform/StarterDownloadButton';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Presentation,
  Search,
} from 'lucide-react';
import styles from './demo-studio.module.css';

interface DemoStudioProps {
  params: Promise<{ slug: string }>;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile' | 'fluid';

export default function DemoStudioPage({ params }: DemoStudioProps) {
  const { slug } = use(params);
  const template = getTemplateBySlug(slug);
  const allTemplates = getAllTemplates();
  const sampleTrackingNumbers = getSampleTrackingNumbers();

  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('CN-8924-US');

  if (!template) {
    notFound();
  }

  // Keyboard shortcut: Press 'P' for Presentation Mode
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'p' || e.key === 'P') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setPresentationMode((prev) => !prev);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const deviceDimensions: Record<DeviceMode, { width: string; height: string }> = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '390px', height: '844px' },
    fluid: { width: '100%', height: '100%' },
  };

  const embedUrl = `/demo/${template.slug}/embed?tracking=${encodeURIComponent(activeTrackingNumber)}`;

  return (
    <div className={`${styles.studio} ${presentationMode ? styles.presentationActive : ''}`}>
      {/* Studio Header Toolbar */}
      <header className={styles.toolbar}>
        <div className={styles.toolLeft}>
          <Link href={`/templates/${template.slug}`} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Specs</span>
          </Link>

          <div className={styles.divider} />

          <div className={styles.templateSelector}>
            <span className={styles.templateLabel}>Active Demo:</span>
            <select
              value={template.slug}
              onChange={(e) => {
                window.location.href = `/demo/${e.target.value}`;
              }}
              className={styles.select}
              aria-label="Switch Template Demo"
            >
              {allTemplates.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.name} ({t.style})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Viewport Switcher Controls */}
        <div className={styles.toolCenter}>
          <div className={styles.deviceGroup} role="group" aria-label="Device Viewport Switcher">
            <button
              onClick={() => setDevice('desktop')}
              className={`${styles.deviceBtn} ${device === 'desktop' ? styles.deviceActive : ''}`}
              title="Desktop 1440px"
              aria-label="Desktop View"
            >
              <Monitor size={16} />
              <span>1440px</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`${styles.deviceBtn} ${device === 'tablet' ? styles.deviceActive : ''}`}
              title="Tablet 768px"
              aria-label="Tablet View"
            >
              <Tablet size={16} />
              <span>768px</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`${styles.deviceBtn} ${device === 'mobile' ? styles.deviceActive : ''}`}
              title="Mobile 390px"
              aria-label="Mobile View"
            >
              <Smartphone size={16} />
              <span>390px</span>
            </button>
            <button
              onClick={() => setDevice('fluid')}
              className={`${styles.deviceBtn} ${device === 'fluid' ? styles.deviceActive : ''}`}
              title="Fluid Responsive 100%"
              aria-label="Fluid Responsive"
            >
              <Maximize2 size={16} />
              <span>Fluid</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className={styles.toolRight}>
          <button
            onClick={() => setPresentationMode((prev) => !prev)}
            className={`${styles.presBtn} ${presentationMode ? styles.presActive : ''}`}
            title="Toggle Client Presentation Mode (Hotkey: P)"
          >
            <Presentation size={16} />
            <span>Client Mode</span>
            <Badge variant="outline" size="sm" className={styles.keyBadge}>
              P
            </Badge>
          </button>

          <StarterDownloadButton template={template} size="sm" variant="primary" />
        </div>
      </header>

      {/* Simulated Tracking Quick Trigger Bar */}
      <div className={styles.simulationBar}>
        <div className={styles.simLabelGroup}>
          <Search size={14} className={styles.simIcon} />
          <span className={styles.simTitle}>Simulate Waybill Milestone Lookup:</span>
        </div>
        <div className={styles.simPills}>
          {sampleTrackingNumbers.map((no) => (
            <button
              key={no}
              onClick={() => setActiveTrackingNumber(no)}
              className={`${styles.simPill} ${activeTrackingNumber === no ? styles.simPillActive : ''}`}
            >
              {no}
            </button>
          ))}
        </div>
        <div className={styles.simNotice}>
          <Badge variant="warning" size="sm">
            Simulated Demo Engine
          </Badge>
        </div>
      </div>

      {/* Viewport Frame Sandbox */}
      <div className={styles.viewportContainer}>
        <div
          className={`${styles.viewportFrame} ${device !== 'desktop' && device !== 'fluid' ? styles.framedBezel : ''}`}
          style={{
            width: deviceDimensions[device].width,
            maxWidth: deviceDimensions[device].width,
            height: deviceDimensions[device].height,
          }}
        >
          <iframe
            src={embedUrl}
            title={`${template.name} Live Sandbox`}
            className={styles.iframe}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}

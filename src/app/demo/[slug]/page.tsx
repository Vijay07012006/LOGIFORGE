'use client';

import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { getSampleTrackingNumbers } from '@/lib/tracking';
import { Badge } from '@/components/ui/Badge';
import { StarterDownloadButton } from '@/components/platform/StarterDownloadButton';
import type {
  ViewportPreset,
  ViewportOrientation,
  ZoomLevel,
  HostToTemplateMessage,
} from '@/components/studio/types';
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Presentation,
  RotateCw,
  Search,
  ExternalLink,
  X,
  Radio,
  Layers,
} from 'lucide-react';
import styles from './demo-studio.module.css';

interface DemoStudioProps {
  params: Promise<{ slug: string }>;
}

export default function DemoStudioPage({ params }: DemoStudioProps) {
  const { slug } = use(params);
  const router = useRouter();
  const template = getTemplateBySlug(slug);
  const allTemplates = getAllTemplates();
  const sampleTrackingNumbers = getSampleTrackingNumbers();

  const [device, setDevice] = useState<ViewportPreset>('desktop');
  const [orientation, setOrientation] = useState<ViewportOrientation>('portrait');
  const [zoom, setZoom] = useState<ZoomLevel>(1);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('CN-8924-US');
  const [trackingSearchInput, setTrackingSearchInput] = useState<string>('');
  const [activePageSlug, setActivePageSlug] = useState<string>('home');
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  if (!template) {
    notFound();
  }

  // Frame protection: prevent Demo Studio shell from ever being loaded inside an iframe (breaks recursive nesting)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.top !== window.self) {
      window.location.replace(`/demo/${slug}/embed`);
    }
  }, [slug]);

  // Safe postMessage dispatcher to embedded iframe
  const sendToIframe = useCallback((message: HostToTemplateMessage) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, '*');
    }
  }, []);

  // Synchronize tracking query change
  const handleTrackingSelect = (trackingNo: string) => {
    setActiveTrackingNumber(trackingNo);
    sendToIframe({
      type: 'INJECT_TRACKING_QUERY',
      trackingNumber: trackingNo,
    });
  };

  // Synchronize custom tracking search submission
  const handleCustomTrackingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingSearchInput.trim()) {
      handleTrackingSelect(trackingSearchInput.trim().toUpperCase());
      setTrackingSearchInput('');
    }
  };

  // Synchronize template page change
  const handlePageChange = (pageSlug: string) => {
    setActivePageSlug(pageSlug);
    sendToIframe({
      type: 'NAVIGATE_TEMPLATE_PAGE',
      pageSlug,
    });
  };

  // Toggle Presentation Mode
  const togglePresentationMode = useCallback(() => {
    setPresentationMode((prev) => {
      const next = !prev;
      sendToIframe({
        type: 'SET_CLIENT_PRESENTATION_MODE',
        enabled: next,
      });
      return next;
    });
  }, [sendToIframe]);

  // Toggle Browser Fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (studioRef.current?.requestFullscreen) {
          await studioRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
    } catch {
      // Graceful fallback if fullscreen is blocked by browser policy
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts: 'P' for Presentation Mode, 'Escape' to exit
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePresentationMode();
      }

      if (e.key === 'Escape') {
        if (presentationMode) {
          e.preventDefault();
          setPresentationMode(false);
          sendToIframe({
            type: 'SET_CLIENT_PRESENTATION_MODE',
            enabled: false,
          });
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, togglePresentationMode, sendToIframe]);

  // Listen for postMessage from embedded template
  useEffect(() => {
    function handleTemplateMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'TEMPLATE_MOUNTED') {
        setIframeLoaded(true);
      }

      if (data.type === 'TEMPLATE_PAGE_CHANGED' && typeof data.pageSlug === 'string') {
        setActivePageSlug(data.pageSlug);
      }

      if (data.type === 'TRACKING_SEARCH_PERFORMED' && typeof data.trackingNumber === 'string') {
        setActiveTrackingNumber(data.trackingNumber);
      }
    }

    window.addEventListener('message', handleTemplateMessage);
    return () => window.removeEventListener('message', handleTemplateMessage);
  }, []);

  // Compute Viewport Dimensions based on Preset and Orientation
  const getDimensions = () => {
    switch (device) {
      case 'desktop':
        return { width: '100%', height: '100%', maxWidth: '1440px', isDevice: false };
      case 'tablet':
        return orientation === 'portrait'
          ? { width: '100%', height: '1024px', maxWidth: '768px', isDevice: true }
          : { width: '100%', height: '768px', maxWidth: '1024px', isDevice: true };
      case 'mobile':
        return orientation === 'portrait'
          ? { width: '100%', height: '812px', maxWidth: '375px', isDevice: true }
          : { width: '100%', height: '375px', maxWidth: '812px', isDevice: true };
      case 'fluid':
      default:
        return { width: '100%', height: '100%', maxWidth: '100%', isDevice: false };
    }
  };

  const { width, height, maxWidth, isDevice } = getDimensions();
  const embedUrl = `/demo/${template.slug}/embed?tracking=${encodeURIComponent(activeTrackingNumber)}&page=${encodeURIComponent(activePageSlug)}`;

  return (
    <div
      ref={studioRef}
      className={`${styles.studio} ${presentationMode ? styles.presentationActive : ''}`}
    >
      {/* 1. Client Presentation Mode Floating Top HUD */}
      {presentationMode && (
        <div className={styles.presentationHud}>
          <div className={styles.hudLeft}>
            <span className={styles.hudBeacon} />
            <div className={styles.hudTitleGroup}>
              <span className={styles.hudLabel}>CLIENT PREVIEW • LOGIFORGE STUDIO</span>
              <span className={styles.hudTemplateName}>{template.name} ({template.industry})</span>
            </div>
          </div>

          <div className={styles.hudCenter}>
            {/* Viewport Toggles in Presentation HUD */}
            <div className={styles.hudDeviceGroup}>
              <button
                onClick={() => setDevice('desktop')}
                className={`${styles.hudDeviceBtn} ${device === 'desktop' ? styles.hudDeviceActive : ''}`}
                title="Desktop (1440px)"
              >
                <Monitor size={14} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`${styles.hudDeviceBtn} ${device === 'tablet' ? styles.hudDeviceActive : ''}`}
                title="Tablet (768px)"
              >
                <Tablet size={14} />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`${styles.hudDeviceBtn} ${device === 'mobile' ? styles.hudDeviceActive : ''}`}
                title="Mobile (375px)"
              >
                <Smartphone size={14} />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          <div className={styles.hudRight}>
            <button
              onClick={toggleFullscreen}
              className={styles.hudActionBtn}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Maximize2 size={14} />
              <span>{isFullscreen ? 'Window' : 'Fullscreen'}</span>
            </button>

            <button
              onClick={togglePresentationMode}
              className={styles.hudExitBtn}
              title="Exit Presentation Mode (Esc)"
            >
              <X size={14} />
              <span>Exit Mode</span>
              <Badge variant="outline" size="sm" className={styles.hudBadge}>
                ESC
              </Badge>
            </button>
          </div>
        </div>
      )}

      {/* 2. Standard Studio Header Toolbar */}
      {!presentationMode && (
        <header className={styles.toolbar}>
          <div className={styles.toolLeft}>
            <Link href={`/templates/${template.slug}`} className={styles.backLink}>
              <ArrowLeft size={16} />
              <span>Back to Specs</span>
            </Link>

            <div className={styles.divider} />

            <div className={styles.templateSelector}>
              <span className={styles.templateLabel}>Template:</span>
              <select
                value={template.slug}
                onChange={(e) => {
                  router.push(`/demo/${e.target.value}`);
                }}
                className={styles.select}
                aria-label="Switch Template Demo"
              >
                {allTemplates.map((t) => (
                  <option key={t.id} value={t.slug}>
                    {t.name} — {t.industry}
                  </option>
                ))}
              </select>
              <span
                className={`${styles.runtimeBadge} ${iframeLoaded ? styles.runtimeOnline : styles.runtimeSync}`}
                title={iframeLoaded ? 'Connected to isolated sandbox frame' : 'Connecting to sandbox runtime...'}
              >
                <span className={styles.runtimeDot} />
                <span>{iframeLoaded ? 'Live' : 'Syncing'}</span>
              </span>
            </div>
          </div>

          {/* Device & Viewport Switcher Controls */}
          <div className={styles.toolCenter}>
            <div className={styles.deviceGroup} role="group" aria-label="Device Viewport Switcher">
              <button
                onClick={() => setDevice('desktop')}
                className={`${styles.deviceBtn} ${device === 'desktop' ? styles.deviceActive : ''}`}
                title="Desktop 1440px"
                aria-label="Desktop View"
              >
                <Monitor size={15} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`${styles.deviceBtn} ${device === 'tablet' ? styles.deviceActive : ''}`}
                title="Tablet 768px"
                aria-label="Tablet View"
              >
                <Tablet size={15} />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`${styles.deviceBtn} ${device === 'mobile' ? styles.deviceActive : ''}`}
                title="Mobile 375px"
                aria-label="Mobile View"
              >
                <Smartphone size={15} />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDevice('fluid')}
                className={`${styles.deviceBtn} ${device === 'fluid' ? styles.deviceActive : ''}`}
                title="Fluid Responsive 100%"
                aria-label="Fluid Responsive"
              >
                <Maximize2 size={15} />
                <span>Fluid</span>
              </button>
            </div>

            {/* Orientation Switcher (Tablet & Mobile only) */}
            {isDevice && (
              <button
                onClick={() =>
                  setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))
                }
                className={styles.controlIconBtn}
                title={`Orientation: ${orientation} (Click to rotate)`}
                aria-label="Toggle Orientation"
              >
                <RotateCw size={15} />
                <span className={styles.controlLabel}>{orientation}</span>
              </button>
            )}

            {/* Zoom Controls */}
            <div className={styles.zoomGroup}>
              <button
                onClick={() => setZoom(0.5)}
                className={`${styles.zoomBtn} ${zoom === 0.5 ? styles.zoomActive : ''}`}
                title="Zoom 50%"
              >
                50%
              </button>
              <button
                onClick={() => setZoom(0.75)}
                className={`${styles.zoomBtn} ${zoom === 0.75 ? styles.zoomActive : ''}`}
                title="Zoom 75%"
              >
                75%
              </button>
              <button
                onClick={() => setZoom(1)}
                className={`${styles.zoomBtn} ${zoom === 1 ? styles.zoomActive : ''}`}
                title="Zoom 100%"
              >
                100%
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className={styles.toolRight}>
            <a
              href={`/demo/${template.slug}/embed`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.isolatedBtn}
              title="Open Sandboxed Template in New Tab"
            >
              <ExternalLink size={15} />
              <span>Isolated</span>
            </a>

            <button
              onClick={togglePresentationMode}
              className={`${styles.presBtn} ${presentationMode ? styles.presActive : ''}`}
              title="Toggle Client Presentation Mode (Hotkey: P)"
            >
              <Presentation size={15} />
              <span>Client Mode</span>
              <Badge variant="outline" size="sm" className={styles.keyBadge}>
                P
              </Badge>
            </button>

            <StarterDownloadButton template={template} size="sm" variant="primary" />
          </div>
        </header>
      )}

      {/* 3. Template Included Pages Navigation Bar */}
      {!presentationMode && (
        <div className={styles.pageNavBar}>
          <div className={styles.pageNavInner}>
            <div className={styles.pageNavTitle}>
              <Layers size={14} className={styles.pageNavIcon} />
              <span>Included Blueprint Views:</span>
            </div>
            <div className={styles.pageNavTabs}>
              <button
                onClick={() => handlePageChange('home')}
                className={`${styles.pageTab} ${activePageSlug === 'home' ? styles.pageTabActive : ''}`}
              >
                Home Overview
              </button>
              <button
                onClick={() => handlePageChange('services')}
                className={`${styles.pageTab} ${activePageSlug === 'services' ? styles.pageTabActive : ''}`}
              >
                Services Matrix
              </button>
              <button
                onClick={() => handlePageChange('tracking')}
                className={`${styles.pageTab} ${activePageSlug === 'tracking' ? styles.pageTabActive : ''}`}
              >
                Shipment Tracking
              </button>
              {template.sections.globalNetwork && (
                <button
                  onClick={() => handlePageChange('network')}
                  className={`${styles.pageTab} ${activePageSlug === 'network' ? styles.pageTabActive : ''}`}
                >
                  Global Corridors
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Simulated Logistics Waybill Engine Bar */}
      {!presentationMode && (
        <div className={styles.simulationBar}>
          <div className={styles.simLabelGroup}>
            <Radio size={14} className={styles.simIcon} />
            <span className={styles.simTitle}>Simulate Waybill Milestone Lookup:</span>
          </div>

          <div className={styles.simPills}>
            {sampleTrackingNumbers.map((no) => (
              <button
                key={no}
                onClick={() => handleTrackingSelect(no)}
                className={`${styles.simPill} ${activeTrackingNumber === no ? styles.simPillActive : ''}`}
              >
                {no}
              </button>
            ))}
          </div>

          {/* Quick Custom Tracking Search */}
          <form onSubmit={handleCustomTrackingSubmit} className={styles.simCustomForm}>
            <Search size={13} className={styles.simSearchIcon} />
            <input
              type="text"
              value={trackingSearchInput}
              onChange={(e) => setTrackingSearchInput(e.target.value)}
              placeholder="Test Waybill..."
              className={styles.simCustomInput}
              aria-label="Custom Waybill Number to test"
            />
          </form>

          <div className={styles.simNotice}>
            <Badge variant="warning" size="sm">
              Simulated Demo Engine
            </Badge>
          </div>
        </div>
      )}

      {/* 5. Viewport Frame Sandbox Workspace */}
      <div className={styles.viewportContainer}>
        <div
          className={`${styles.viewportFrame} ${isDevice ? styles.framedBezel : ''} ${device === 'mobile' ? styles.mobileBezel : ''} ${device === 'tablet' ? styles.tabletBezel : ''}`}
          style={{
            width,
            maxWidth,
            height,
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {/* Hardware Device Bezels (Speakers & Cameras) */}
          {device === 'mobile' && (
            <div className={styles.deviceHeaderBezel}>
              <span className={styles.speakerSlot} />
              <span className={styles.cameraNotch} />
            </div>
          )}
          {device === 'tablet' && (
            <div className={styles.tabletCameraSlot}>
              <span className={styles.cameraNotch} />
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={`${template.name} Live Sandbox Studio`}
            className={styles.iframe}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />

          {/* Mobile Device Home Bar */}
          {device === 'mobile' && (
            <div className={styles.deviceFooterBezel}>
              <span className={styles.homeIndicator} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

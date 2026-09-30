'use client';

import React, { useState, useEffect, useRef, useCallback, use, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { getSampleTrackingNumbers } from '@/lib/tracking';
import { Badge } from '@/components/ui/Badge';
import { StarterDownloadButton } from '@/components/platform/StarterDownloadButton';
import { LocalShareButton } from '@/components/platform/LocalShareButton';
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
  RotateCcw,
  Search,
  ExternalLink,
  X,
  Radio,
  Layers,
  Palette,
} from 'lucide-react';
import styles from './demo-studio.module.css';

interface DemoStudioProps {
  params: Promise<{ slug: string }>;
}

const DEFAULT_TRACKING_BY_SLUG: Record<string, string> = {
  'cargo-nova': 'CN-8924-US',
  'fleet-one': 'FO-4091-TX',
  'ship-flow': 'SF-1049-HK',
  'swift-drop': 'SD-4421-EU',
  'aero-cargo': 'AC-9901-FRA',
  'port-axis': 'PA-3301-SG',
  'warehouse-x': 'WX-5510-IL',
  'supply-core': 'SC-7700-GL',
  'route-iq': 'RQ-2048-AI',
  'move-sphere': 'MS-9900-QUANTUM',
};

const parseDevice = (val: string | null): ViewportPreset => {
  if (val === 'desktop' || val === 'tablet' || val === 'mobile' || val === 'fluid') {
    return val;
  }
  return 'desktop';
};

const parseOrientation = (val: string | null): ViewportOrientation => {
  if (val === 'portrait' || val === 'landscape') {
    return val;
  }
  return 'portrait';
};

const parseZoom = (val: string | null): ZoomLevel => {
  if (val === '50' || val === '0.5') return 0.5;
  if (val === '75' || val === '0.75') return 0.75;
  if (val === '100' || val === '1') return 1;
  return 1;
};

function DemoStudioInner({ params }: DemoStudioProps) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const template = getTemplateBySlug(slug);
  const allTemplates = getAllTemplates();
  const sampleTrackingNumbers = getSampleTrackingNumbers();

  const defaultTracking = DEFAULT_TRACKING_BY_SLUG[slug] || 'CN-8924-US';

  // Initialize viewport states with validated URL query params
  const [device, setDevice] = useState<ViewportPreset>(() => parseDevice(searchParams.get('device')));
  const [orientation, setOrientation] = useState<ViewportOrientation>(() => parseOrientation(searchParams.get('orientation')));
  const [zoom, setZoom] = useState<ZoomLevel>(() => parseZoom(searchParams.get('zoom')));
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>(
    searchParams.get('tracking') || defaultTracking
  );
  const [trackingSearchInput, setTrackingSearchInput] = useState<string>('');
  const [activePageSlug, setActivePageSlug] = useState<string>(
    searchParams.get('page') || 'home'
  );

  // Live Theme Accent Customizer states
  const [themeCustomizerOpen, setThemeCustomizerOpen] = useState<boolean>(false);
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>(
    template?.theme.primaryAccent || '#d4af37'
  );
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>(
    template?.theme.secondaryAccent || '#1b2a4a'
  );
  const [isThemeOverridden, setIsThemeOverridden] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  // Synchronize state changes to URL query string without page reloads
  const syncStudioUrl = useCallback(
    (newDevice: ViewportPreset, newOrientation: ViewportOrientation, newZoom: ZoomLevel) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);

      const zoomStr = newZoom === 0.5 ? '50' : newZoom === 0.75 ? '75' : '100';

      url.searchParams.set('device', newDevice);
      url.searchParams.set('orientation', newOrientation);
      url.searchParams.set('zoom', zoomStr);

      window.history.replaceState(
        null,
        '',
        url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '')
      );
    },
    []
  );

  const handleDeviceChange = (nextDevice: ViewportPreset) => {
    setDevice(nextDevice);
    syncStudioUrl(nextDevice, orientation, zoom);
  };

  const handleOrientationToggle = () => {
    const next = orientation === 'portrait' ? 'landscape' : 'portrait';
    setOrientation(next);
    syncStudioUrl(device, next, zoom);
  };

  const handleZoomChange = (nextZoom: ZoomLevel) => {
    setZoom(nextZoom);
    syncStudioUrl(device, orientation, nextZoom);
  };

  // Popstate listener for browser back/forward history navigation
  useEffect(() => {
    function handlePopState() {
      const url = new URL(window.location.href);
      setDevice(parseDevice(url.searchParams.get('device')));
      setOrientation(parseOrientation(url.searchParams.get('orientation')));
      setZoom(parseZoom(url.searchParams.get('zoom')));
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync active tracking default and active tab when slug changes
  useEffect(() => {
    const nextDefault = DEFAULT_TRACKING_BY_SLUG[slug] || 'CN-8924-US';
    setActiveTrackingNumber(nextDefault);
    setActivePageSlug('home');
    if (template) {
      setCustomPrimaryColor(template.theme.primaryAccent);
      setCustomSecondaryColor(template.theme.secondaryAccent);
      setIsThemeOverridden(false);
    }
  }, [slug, template]);

  if (!template) {
    notFound();
  }

  // Frame protection: prevent Demo Studio shell from ever being loaded inside an iframe (breaks recursive nesting)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.top !== window.self) {
      window.location.replace(`/demo/${slug}/embed`);
    }
  }, [slug]);

  // Safe postMessage dispatcher to embedded iframe with origin protection
  const sendToIframe = useCallback((message: HostToTemplateMessage) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const targetOrigin = typeof window !== 'undefined' ? window.location.origin : '*';
      iframeRef.current.contentWindow.postMessage(message, targetOrigin);
    }
  }, []);

  // Theme Customizer actions
  const handlePrimaryColorChange = (color: string) => {
    setCustomPrimaryColor(color);
    setIsThemeOverridden(true);
    sendToIframe({
      type: 'THEME_UPDATE',
      primaryAccent: color,
      secondaryAccent: customSecondaryColor,
    });
  };

  const handleSecondaryColorChange = (color: string) => {
    setCustomSecondaryColor(color);
    setIsThemeOverridden(true);
    sendToIframe({
      type: 'THEME_UPDATE',
      primaryAccent: customPrimaryColor,
      secondaryAccent: color,
    });
  };

  const handleResetTheme = () => {
    setCustomPrimaryColor(template.theme.primaryAccent);
    setCustomSecondaryColor(template.theme.secondaryAccent);
    setIsThemeOverridden(false);
    sendToIframe({
      type: 'THEME_RESET',
    });
  };

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

  // Synchronize template section navigation
  const handlePageChange = (pageSlug: string) => {
    setActivePageSlug(pageSlug);
    sendToIframe({
      type: 'NAVIGATE_TEMPLATE_PAGE',
      pageSlug,
    });
  };

  // Toggle Presentation Mode HUD
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
        if (themeCustomizerOpen) {
          e.preventDefault();
          setThemeCustomizerOpen(false);
          return;
        }

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
  }, [presentationMode, themeCustomizerOpen, sendToIframe, togglePresentationMode]);

  // Bidirectional postMessage listener from embedded template
  useEffect(() => {
    function handleTemplateMessage(event: MessageEvent) {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'TEMPLATE_MOUNTED') {
        // If theme is currently overridden, synchronize with newly mounted iframe
        if (isThemeOverridden) {
          sendToIframe({
            type: 'THEME_UPDATE',
            primaryAccent: customPrimaryColor,
            secondaryAccent: customSecondaryColor,
          });
        }
      }

      if (data.type === 'TRACKING_SEARCH_PERFORMED' && typeof data.trackingNumber === 'string') {
        setActiveTrackingNumber(data.trackingNumber);
      }

      if (data.type === 'TEMPLATE_PAGE_CHANGED' && typeof data.pageSlug === 'string') {
        setActivePageSlug(data.pageSlug);
      }
    }

    window.addEventListener('message', handleTemplateMessage);
    return () => window.removeEventListener('message', handleTemplateMessage);
  }, [isThemeOverridden, customPrimaryColor, customSecondaryColor, sendToIframe]);

  // Dimension calculations for viewport simulation
  const isLandscape = orientation === 'landscape';
  const isDevice = device === 'tablet' || device === 'mobile';

  let width = '100%';
  let maxWidth = '100%';
  let height = '100%';

  if (device === 'desktop') {
    width = '100%';
    maxWidth = '100%';
    height = '100%';
  } else if (device === 'tablet') {
    width = isLandscape ? '1024px' : '768px';
    maxWidth = '100%';
    height = isLandscape ? '768px' : '1024px';
  } else if (device === 'mobile') {
    width = isLandscape ? '844px' : '390px';
    maxWidth = '100%';
    height = isLandscape ? '390px' : '844px';
  } else if (device === 'fluid') {
    width = '100%';
    maxWidth = '100%';
    height = '100%';
  }

  const embedUrl = `/demo/${template.slug}/embed?tracking=${encodeURIComponent(activeTrackingNumber)}&page=${encodeURIComponent(activePageSlug)}`;

  // Centralized blueprint navigation from template manifest
  const blueprintNavItems = template.blueprintNav && template.blueprintNav.length > 0
    ? template.blueprintNav
    : [
        { id: 'home', label: 'Home Overview' },
        { id: 'services', label: 'Services Matrix' },
        { id: 'tracking', label: 'Consignment Tracking' },
      ];

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
              <span className={styles.hudLabel}>LIVE CLIENT SANDBOX</span>
              <span className={styles.hudTemplateName}>{template.name}</span>
            </div>
            <Badge variant="outline" size="sm" className={styles.hudBadge}>
              {device.toUpperCase()} {isDevice ? `• ${orientation.toUpperCase()}` : ''}
            </Badge>
          </div>

          <div className={styles.hudCenter}>
            <span className={styles.hudHint}>
              Press <kbd className={styles.hudKbd}>P</kbd> or <kbd className={styles.hudKbd}>ESC</kbd> to exit presentation view
            </span>
          </div>

          <div className={styles.hudRight}>
            <button
              onClick={toggleFullscreen}
              className={styles.hudActionBtn}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Browser Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Browser Fullscreen'}
            >
              <Maximize2 size={14} />
              <span>{isFullscreen ? 'Windowed' : 'Fullscreen'}</span>
            </button>
            <button
              onClick={togglePresentationMode}
              className={styles.hudExitBtn}
              title="Exit Client Presentation Mode (Escape)"
              aria-label="Exit Client Presentation Mode"
            >
              <X size={14} />
              <span>Exit HUD</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Platform Studio Shell Standard Header Controls */}
      {!presentationMode && (
        <header className={styles.toolbar}>
          {/* Brand & Template Selector */}
          <div className={styles.toolLeft}>
            <Link href="/templates" className={styles.backBtn} title="Return to Templates Catalog">
              <ArrowLeft size={16} />
              <span className={styles.backBtnText}>Catalog</span>
            </Link>

            <div className={styles.templateSwitcher}>
              <span className={styles.switcherLabel}>Active Sandbox:</span>
              <select
                value={template.slug}
                onChange={(e) => router.push(`/demo/${e.target.value}`)}
                className={styles.templateSelect}
                aria-label="Switch active logistics template sandbox"
              >
                {allTemplates.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} ({t.industry})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Device & Viewport Switchers */}
          <div className={styles.toolCenter}>
            <div className={styles.deviceGroup}>
              <button
                onClick={() => handleDeviceChange('desktop')}
                className={`${styles.deviceBtn} ${device === 'desktop' ? styles.deviceActive : ''}`}
                title="Desktop 1440px"
                aria-label="Desktop View"
              >
                <Monitor size={15} />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => handleDeviceChange('tablet')}
                className={`${styles.deviceBtn} ${device === 'tablet' ? styles.deviceActive : ''}`}
                title="Tablet 768px"
                aria-label="Tablet View"
              >
                <Tablet size={15} />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => handleDeviceChange('mobile')}
                className={`${styles.deviceBtn} ${device === 'mobile' ? styles.deviceActive : ''}`}
                title="Mobile 390px"
                aria-label="Mobile View"
              >
                <Smartphone size={15} />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => handleDeviceChange('fluid')}
                className={`${styles.deviceBtn} ${device === 'fluid' ? styles.deviceActive : ''}`}
                title="Fluid Responsive 100%"
                aria-label="Fluid Responsive"
              >
                <Maximize2 size={15} />
                <span>Fluid</span>
              </button>
            </div>

            {/* Orientation Switcher (Tablet & Mobile only) with Workstream 5 accessible label */}
            {isDevice && (
              <button
                onClick={handleOrientationToggle}
                className={styles.controlIconBtn}
                title={`Orientation: ${orientation} (Click to rotate)`}
                aria-label={`Rotate viewport orientation to ${orientation === 'portrait' ? 'landscape' : 'portrait'}`}
                aria-pressed={orientation === 'landscape'}
              >
                <RotateCw size={15} />
                <span className={styles.controlLabel}>{orientation}</span>
              </button>
            )}

            {/* Zoom Controls */}
            <div className={styles.zoomGroup}>
              <button
                onClick={() => handleZoomChange(0.5)}
                className={`${styles.zoomBtn} ${zoom === 0.5 ? styles.zoomActive : ''}`}
                title="Zoom 50%"
              >
                50%
              </button>
              <button
                onClick={() => handleZoomChange(0.75)}
                className={`${styles.zoomBtn} ${zoom === 0.75 ? styles.zoomActive : ''}`}
                title="Zoom 75%"
              >
                75%
              </button>
              <button
                onClick={() => handleZoomChange(1)}
                className={`${styles.zoomBtn} ${zoom === 1 ? styles.zoomActive : ''}`}
                title="Zoom 100%"
              >
                100%
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className={styles.toolRight}>
            {/* Live Theme Accent Customizer Trigger (Workstream 4) */}
            <button
              onClick={() => setThemeCustomizerOpen((prev) => !prev)}
              className={`${styles.themeBtn} ${themeCustomizerOpen || isThemeOverridden ? styles.themeBtnActive : ''}`}
              title="Customize Template Accent Colors"
              aria-label="Customize Template Accent Colors"
              aria-expanded={themeCustomizerOpen}
            >
              <Palette size={14} />
              <span>Theme</span>
              {isThemeOverridden && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--lf-accent-amber)',
                    display: 'inline-block',
                  }}
                />
              )}
            </button>

            <LocalShareButton slug={template.slug} name={template.name} mode="demo" size="sm" variant="ghost" />

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

          {/* Theme Accent Customizer Popover (Workstream 4) */}
          {themeCustomizerOpen && (
            <div
              className={styles.customizerPopover}
              role="dialog"
              aria-label="Brand Theme Accent Customizer"
            >
              <div className={styles.customizerHeader}>
                <div className={styles.customizerTitle}>
                  <Palette size={15} color="var(--lf-accent-amber)" />
                  <span>Live Brand Customizer</span>
                </div>
                <button
                  onClick={() => setThemeCustomizerOpen(false)}
                  className={styles.customizerCloseBtn}
                  aria-label="Close brand customizer"
                >
                  <X size={15} />
                </button>
              </div>

              <p className={styles.customizerDescription}>
                Preview how {template.name} adapts to your agency or corporate brand palette in real time.
              </p>

              <div className={styles.colorPickerGroup}>
                <div className={styles.colorPickerRow}>
                  <div className={styles.colorPickerLabel}>
                    <label htmlFor="theme-primary-accent">Primary Accent</label>
                    <span className={styles.tokenTag}>--tmpl-accent</span>
                  </div>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      id="theme-primary-accent"
                      value={customPrimaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className={styles.nativeColorInput}
                      aria-label="Primary accent color picker"
                    />
                    <input
                      type="text"
                      value={customPrimaryColor.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                          setCustomPrimaryColor(val);
                          if (val.length === 7) {
                            handlePrimaryColorChange(val);
                          }
                        }
                      }}
                      className={styles.colorHexInput}
                      maxLength={7}
                      aria-label="Primary accent hex code"
                    />
                  </div>
                </div>

                <div className={styles.colorPickerRow}>
                  <div className={styles.colorPickerLabel}>
                    <label htmlFor="theme-secondary-accent">Secondary Accent</label>
                    <span className={styles.tokenTag}>--tmpl-accent-secondary</span>
                  </div>
                  <div className={styles.colorInputWrapper}>
                    <input
                      type="color"
                      id="theme-secondary-accent"
                      value={customSecondaryColor}
                      onChange={(e) => handleSecondaryColorChange(e.target.value)}
                      className={styles.nativeColorInput}
                      aria-label="Secondary accent color picker"
                    />
                    <input
                      type="text"
                      value={customSecondaryColor.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                          setCustomSecondaryColor(val);
                          if (val.length === 7) {
                            handleSecondaryColorChange(val);
                          }
                        }
                      }}
                      className={styles.colorHexInput}
                      maxLength={7}
                      aria-label="Secondary accent hex code"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Brand Presets */}
              <div className={styles.presetsSection}>
                <span className={styles.presetsLabel}>Palette Presets</span>
                <div className={styles.presetChipsRow}>
                  {[
                    { name: 'Imperial Gold', primary: '#D4AF37', secondary: '#1B2A4A' },
                    { name: 'Hazard Amber', primary: '#EAB308', secondary: '#18181B' },
                    { name: 'Nordic Ocean', primary: '#0284C7', secondary: '#0E1726' },
                    { name: 'Urban Pulse', primary: '#F97316', secondary: '#0F172A' },
                    { name: 'Emerald Hub', primary: '#10B981', secondary: '#064E3B' },
                    { name: 'Neural Violet', primary: '#A855F7', secondary: '#3B0764' },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setCustomPrimaryColor(p.primary);
                        setCustomSecondaryColor(p.secondary);
                        setIsThemeOverridden(true);
                        sendToIframe({
                          type: 'THEME_UPDATE',
                          primaryAccent: p.primary,
                          secondaryAccent: p.secondary,
                        });
                      }}
                      className={styles.presetChip}
                      type="button"
                    >
                      <span className={styles.presetSwatch} style={{ backgroundColor: p.primary }} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.customizerFooter}>
                <button
                  onClick={handleResetTheme}
                  className={styles.resetBtn}
                  type="button"
                  aria-label="Reset theme to template default"
                >
                  <RotateCcw size={12} />
                  <span>Reset Defaults</span>
                </button>
                {isThemeOverridden && (
                  <span className={styles.statusIndicator}>● Active Override</span>
                )}
              </div>
            </div>
          )}
        </header>
      )}

      {/* 3. Template Included Pages Navigation Bar (Workstream 2 Centralized) */}
      {!presentationMode && (
        <div className={styles.pageNavBar}>
          <div className={styles.pageNavInner}>
            <div className={styles.pageNavTitle}>
              <Layers size={14} className={styles.pageNavIcon} />
              <span>Included Blueprint Views:</span>
            </div>
            <div className={styles.pageNavTabs}>
              {blueprintNavItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handlePageChange(tab.id)}
                  className={`${styles.pageTab} ${activePageSlug === tab.id ? styles.pageTabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Shipment Telematics Simulator Toolbar */}
      {!presentationMode && (
        <div className={styles.simulationBar}>
          <div className={styles.simLeft}>
            <div className={styles.simTitle}>
              <Radio size={14} className={styles.simIconPulse} />
              <span>Live Telematics Injection:</span>
            </div>

            <div className={styles.sampleQueries}>
              <span className={styles.sampleLabel}>Suggested Injections:</span>
              {(template.sections.tracking.sampleTrackingNumbers || sampleTrackingNumbers.slice(0, 3)).map((num) => (
                <button
                  key={num}
                  onClick={() => handleTrackingSelect(num)}
                  className={`${styles.queryPill} ${activeTrackingNumber === num ? styles.queryPillActive : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCustomTrackingSubmit} className={styles.simRight}>
            <div className={styles.searchInputWrapper}>
              <Search size={14} className={styles.searchIcon} />
              <input
                type="text"
                value={trackingSearchInput}
                onChange={(e) => setTrackingSearchInput(e.target.value)}
                placeholder="Simulate Waybill / Asset..."
                className={styles.simInput}
              />
            </div>
            <button type="submit" className={styles.injectBtn}>
              Inject Telematics
            </button>
          </form>
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

export default function DemoStudioPage(props: DemoStudioProps) {
  return (
    <Suspense fallback={<div className={styles.studio} style={{ minHeight: '100vh', background: '#080605' }} />}>
      <DemoStudioInner {...props} />
    </Suspense>
  );
}

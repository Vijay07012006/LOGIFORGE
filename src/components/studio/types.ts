/**
 * LOGIFORGE: Live Demo Studio & Sandbox Types
 * Phase 04: Live Demo Sandbox Enhancements & Client Presentation Mode
 */

export type ViewportPreset = 'desktop' | 'tablet' | 'mobile' | 'fluid';

export type ViewportOrientation = 'portrait' | 'landscape';

export type ZoomLevel = 0.5 | 0.75 | 1;

export interface ViewportDimension {
  width: string;
  height: string;
  label: string;
  bezelRadius: string;
}

// Platform Studio Shell -> Embedded Template postMessage Protocol
export type HostToTemplateMessage =
  | { type: 'SET_CLIENT_PRESENTATION_MODE'; enabled: boolean }
  | { type: 'INJECT_TRACKING_QUERY'; trackingNumber: string }
  | { type: 'NAVIGATE_TEMPLATE_PAGE'; pageSlug: string }
  | { type: 'SET_SIMULATED_DELAY'; delayMs: number };

// Embedded Template -> Platform Studio Shell postMessage Protocol
export type TemplateToHostMessage =
  | { type: 'TEMPLATE_MOUNTED'; slug: string; title: string; currentRoute: string }
  | { type: 'TRACKING_SEARCH_PERFORMED'; trackingNumber: string; resultFound: boolean }
  | { type: 'TEMPLATE_PAGE_CHANGED'; pageSlug: string };

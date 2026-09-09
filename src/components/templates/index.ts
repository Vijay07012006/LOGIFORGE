import React from 'react';
import type { Template } from '@/types/template';

/**
 * Common contract for template component implementations.
 * In Phase 05 & 06, each template (CargoNova, FleetOne, etc.)
 * implements this structure for modular rendering.
 */
export interface TemplateComponentManifest {
  slug: string;
  name: string;
  HeroComponent: React.ComponentType<{ template: Template }>;
  TrackingComponent: React.ComponentType<{ template: Template; activeTracking?: string }>;
  ServicesComponent: React.ComponentType<{ template: Template }>;
  FooterComponent: React.ComponentType<{ template: Template }>;
}

export const REGISTERED_TEMPLATE_COMPONENTS: Record<string, TemplateComponentManifest> = {};

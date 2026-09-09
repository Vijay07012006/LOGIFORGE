'use client';

import React from 'react';
import type { Template } from '@/types/template';
import { EmbeddedTemplateView } from '@/components/studio/EmbeddedTemplateView';
import { CargoNovaWebsite } from '@/components/templates/cargonova/CargoNovaWebsite';
import { FleetOneWebsite } from '@/components/templates/fleetone/FleetOneWebsite';
import { ShipFlowWebsite } from '@/components/templates/shipflow/ShipFlowWebsite';

interface TemplateRendererProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

export function TemplateRenderer({
  template,
  initialTracking,
  initialPage = 'home',
}: TemplateRendererProps) {
  if (template.slug === 'cargo-nova') {
    return (
      <CargoNovaWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'fleet-one') {
    return (
      <FleetOneWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'ship-flow') {
    return (
      <ShipFlowWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  // Fallback for remaining templates until implemented in this phase
  return (
    <EmbeddedTemplateView
      template={template}
      initialTracking={initialTracking}
      initialPage={initialPage}
    />
  );
}

'use client';

import React from 'react';
import type { Template } from '@/types/template';
import { EmbeddedTemplateView } from '@/components/studio/EmbeddedTemplateView';
import { CargoNovaWebsite } from '@/components/templates/cargonova/CargoNovaWebsite';
import { FleetOneWebsite } from '@/components/templates/fleetone/FleetOneWebsite';
import { ShipFlowWebsite } from '@/components/templates/shipflow/ShipFlowWebsite';
import { SwiftDropWebsite } from '@/components/templates/swiftdrop/SwiftDropWebsite';
import { AeroCargoWebsite } from '@/components/templates/aerocargo/AeroCargoWebsite';
import { PortAxisWebsite } from '@/components/templates/portaxis/PortAxisWebsite';

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

  if (template.slug === 'swift-drop') {
    return (
      <SwiftDropWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'aero-cargo') {
    return (
      <AeroCargoWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'port-axis') {
    return (
      <PortAxisWebsite
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

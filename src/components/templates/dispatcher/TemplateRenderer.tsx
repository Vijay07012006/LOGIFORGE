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
import { WarehouseXWebsite } from '@/components/templates/warehousex/WarehouseXWebsite';
import { SupplyCoreWebsite } from '@/components/templates/supplycore/SupplyCoreWebsite';

import { RouteIQWebsite } from '@/components/templates/routeiq/RouteIQWebsite';
import { MoveSphereWebsite } from '@/components/templates/movesphere/MoveSphereWebsite';

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

  if (template.slug === 'warehouse-x') {
    return (
      <WarehouseXWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'supply-core') {
    return (
      <SupplyCoreWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'route-iq') {
    return (
      <RouteIQWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  if (template.slug === 'move-sphere') {
    return (
      <MoveSphereWebsite
        template={template}
        initialTracking={initialTracking}
        initialPage={initialPage}
      />
    );
  }

  // Graceful fallback for any unknown template slug
  return (
    <EmbeddedTemplateView
      template={template}
      initialTracking={initialTracking}
      initialPage={initialPage}
    />
  );
}

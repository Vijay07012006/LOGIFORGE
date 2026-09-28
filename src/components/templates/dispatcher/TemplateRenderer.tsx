'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import type { Template } from '@/types/template';
import { EmbeddedTemplateView } from '@/components/studio/EmbeddedTemplateView';

const LoadingTemplateSkeleton = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#090d16',
      color: '#8c7e70',
      fontFamily: 'monospace',
      fontSize: '12px',
      letterSpacing: '0.08em',
    }}
  >
    INITIALIZING TEMPLATE RUNTIME...
  </div>
);

// Dynamic code-splitting for each flagship website to reduce initial bundle size
const CargoNovaWebsite = dynamic(
  () => import('@/components/templates/cargonova/CargoNovaWebsite').then((m) => m.CargoNovaWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const FleetOneWebsite = dynamic(
  () => import('@/components/templates/fleetone/FleetOneWebsite').then((m) => m.FleetOneWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const ShipFlowWebsite = dynamic(
  () => import('@/components/templates/shipflow/ShipFlowWebsite').then((m) => m.ShipFlowWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const SwiftDropWebsite = dynamic(
  () => import('@/components/templates/swiftdrop/SwiftDropWebsite').then((m) => m.SwiftDropWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const AeroCargoWebsite = dynamic(
  () => import('@/components/templates/aerocargo/AeroCargoWebsite').then((m) => m.AeroCargoWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const PortAxisWebsite = dynamic(
  () => import('@/components/templates/portaxis/PortAxisWebsite').then((m) => m.PortAxisWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const WarehouseXWebsite = dynamic(
  () => import('@/components/templates/warehousex/WarehouseXWebsite').then((m) => m.WarehouseXWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const SupplyCoreWebsite = dynamic(
  () => import('@/components/templates/supplycore/SupplyCoreWebsite').then((m) => m.SupplyCoreWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const RouteIQWebsite = dynamic(
  () => import('@/components/templates/routeiq/RouteIQWebsite').then((m) => m.RouteIQWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

const MoveSphereWebsite = dynamic(
  () => import('@/components/templates/movesphere/MoveSphereWebsite').then((m) => m.MoveSphereWebsite),
  { loading: () => <LoadingTemplateSkeleton /> }
);

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

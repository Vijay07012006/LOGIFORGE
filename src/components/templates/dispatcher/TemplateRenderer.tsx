'use client';

import React, { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type { Template } from '@/types/template';

function isValidHexColor(color: unknown): color is string {
  if (typeof color !== 'string') return false;
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color.trim());
}

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

const EmbeddedTemplateView = dynamic(
  () => import('@/components/studio/EmbeddedTemplateView').then((m) => m.EmbeddedTemplateView),
  { loading: () => <LoadingTemplateSkeleton /> }
);

interface TemplateRendererProps {
  template: Template;
  initialTracking?: string;
  initialPage?: string;
}

function TemplateRendererInner({
  template,
  initialTracking,
  initialPage = 'home',
}: TemplateRendererProps) {
  const searchParams = useSearchParams();
  const effectiveTracking = searchParams.get('tracking') || initialTracking;
  const effectivePage = searchParams.get('page') || initialPage || 'home';

  const [customTheme, setCustomTheme] = useState<{ primary?: string; secondary?: string } | null>(null);

  useEffect(() => {
    function handleHostMessage(event: MessageEvent) {
      if (typeof window !== 'undefined' && event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'THEME_UPDATE') {
        const nextTheme: { primary?: string; secondary?: string } = {};
        if (isValidHexColor(data.primaryAccent)) {
          nextTheme.primary = data.primaryAccent.trim();
        }
        if (isValidHexColor(data.secondaryAccent)) {
          nextTheme.secondary = data.secondaryAccent.trim();
        }

        setCustomTheme(nextTheme);

        const targets = [
          document.documentElement,
          document.body,
          ...Array.from(document.querySelectorAll<HTMLElement>('[class*="Root"], [class*="root"], #lf-template-mount-root')),
        ];

        targets.forEach((el) => {
          if (nextTheme.primary) {
            el.style.setProperty('--tmpl-accent', nextTheme.primary);
            el.style.setProperty('--tmpl-accent-primary', nextTheme.primary);
          }
          if (nextTheme.secondary) {
            el.style.setProperty('--tmpl-accent-secondary', nextTheme.secondary);
          }
        });
      }

      if (data.type === 'THEME_RESET') {
        setCustomTheme(null);
        const targets = [
          document.documentElement,
          document.body,
          ...Array.from(document.querySelectorAll<HTMLElement>('[class*="Root"], [class*="root"], #lf-template-mount-root')),
        ];

        targets.forEach((el) => {
          el.style.removeProperty('--tmpl-accent');
          el.style.removeProperty('--tmpl-accent-primary');
          el.style.removeProperty('--tmpl-accent-secondary');
        });
      }
    }

    window.addEventListener('message', handleHostMessage);
    return () => {
      window.removeEventListener('message', handleHostMessage);
      const targets = [
        document.documentElement,
        document.body,
        ...Array.from(document.querySelectorAll<HTMLElement>('[class*="Root"], [class*="root"], #lf-template-mount-root')),
      ];
      targets.forEach((el) => {
        el.style.removeProperty('--tmpl-accent');
        el.style.removeProperty('--tmpl-accent-primary');
        el.style.removeProperty('--tmpl-accent-secondary');
      });
    };
  }, []);

  const renderInnerTemplate = () => {
    if (template.slug === 'cargo-nova') {
      return (
        <CargoNovaWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'fleet-one') {
      return (
        <FleetOneWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'ship-flow') {
      return (
        <ShipFlowWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'swift-drop') {
      return (
        <SwiftDropWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'aero-cargo') {
      return (
        <AeroCargoWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'port-axis') {
      return (
        <PortAxisWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'warehouse-x') {
      return (
        <WarehouseXWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'supply-core') {
      return (
        <SupplyCoreWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'route-iq') {
      return (
        <RouteIQWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    if (template.slug === 'move-sphere') {
      return (
        <MoveSphereWebsite
          template={template}
          initialTracking={effectiveTracking}
          initialPage={effectivePage}
        />
      );
    }

    // Graceful fallback for any unknown template slug
    return (
      <EmbeddedTemplateView
        template={template}
        initialTracking={effectiveTracking}
        initialPage={effectivePage}
      />
    );
  };

  return (
    <div
      id="lf-template-mount-root"
      style={
        customTheme
          ? ({
              '--tmpl-accent': customTheme.primary,
              '--tmpl-accent-primary': customTheme.primary,
              '--tmpl-accent-secondary': customTheme.secondary,
              width: '100%',
              minHeight: '100%',
            } as React.CSSProperties)
          : { width: '100%', minHeight: '100%' }
      }
    >
      {renderInnerTemplate()}
    </div>
  );
}

export function TemplateRenderer(props: TemplateRendererProps) {
  return (
    <Suspense fallback={<LoadingTemplateSkeleton />}>
      <TemplateRendererInner {...props} />
    </Suspense>
  );
}

import { TEMPLATE_MANIFESTS } from '@/data/templates';
import type {
  Template,
  LogisticsCategorySlug,
  TemplateProductMetadata,
  TemplateReleaseMetadata,
} from '@/types/template';

export function getAllTemplates(): Template[] {
  return TEMPLATE_MANIFESTS;
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return TEMPLATE_MANIFESTS.find((tmpl) => tmpl.slug === slug);
}

export function getFeaturedTemplates(): Template[] {
  return TEMPLATE_MANIFESTS.filter((tmpl) => tmpl.featured);
}

export function getTemplatesByCategory(categorySlug: LogisticsCategorySlug | string): Template[] {
  return TEMPLATE_MANIFESTS.filter(
    (tmpl) => tmpl.category === categorySlug || tmpl.categories.includes(categorySlug as LogisticsCategorySlug)
  );
}

export function getPopularTemplates(limit = 4): Template[] {
  return [...TEMPLATE_MANIFESTS]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

export function getRelatedTemplates(currentSlug: string, limit = 3): Template[] {
  const current = getTemplateBySlug(currentSlug);
  if (!current) return [];

  return TEMPLATE_MANIFESTS.filter((tmpl) => tmpl.slug !== currentSlug)
    .filter(
      (tmpl) =>
        tmpl.category === current.category ||
        tmpl.style === current.style ||
        tmpl.categories.some((c) => current.categories.includes(c))
    )
    .slice(0, limit);
}

/**
 * Authoritative template package filename (e.g. "cargo-nova-v1.0.0.zip")
 */
export function getTemplatePackageFilename(
  template: Pick<Template, 'slug'> & { packageConfig?: { version?: string }; version?: string }
): string {
  const version = template.packageConfig?.version || template.version || '1.0.0';
  return `${template.slug}-v${version}.zip`;
}

/**
 * Authoritative marketplace static download URL (e.g. "/downloads/cargo-nova-v1.0.0.zip")
 */
export function getTemplateDownloadUrl(
  template: Pick<Template, 'slug'> & { packageConfig?: { version?: string }; version?: string }
): string {
  return `/downloads/${getTemplatePackageFilename(template)}`;
}

/**
 * Authoritative commercial release metadata
 */
export function getTemplateReleaseMetadata(template: Template): TemplateReleaseMetadata {
  if (template.releaseMetadata) {
    return template.releaseMetadata;
  }

  const version = template.packageConfig?.version || template.version || '1.0.0';
  const packageFilename = getTemplatePackageFilename(template);

  return {
    version,
    releaseChannel: 'stable',
    releasedAt: template.releaseDate || '2026-08-15',
    changes: [
      'Initial LOGIFORGE commercial template release',
      'Standalone Next.js starter package',
      'Local template assets included',
      'Production build verification completed',
    ],
    frameworkCompatibility: 'Next.js >=14.0.0 <16.0.0',
    nodeCompatibility: template.packageConfig?.minNodeVersion || '>=20.0.0',
    packageFilename,
    checksumAlgorithm: 'SHA-256',
  };
}

/**
 * Authoritative commercial product metadata
 */
export function getTemplateProductMetadata(template: Template): TemplateProductMetadata {
  if (template.productMetadata) {
    return template.productMetadata;
  }

  const version = template.packageConfig?.version || template.version || '1.0.0';
  const release = getTemplateReleaseMetadata(template);
  const packageSlug = template.packageConfig?.packageSlug || template.slug;
  const packageName = template.packageConfig?.packageName || `${packageSlug}-starter`;
  const packageUrl = getTemplateDownloadUrl(template);

  return {
    productType: 'commercial-starter-template',
    productStatus: 'stable',
    version,
    releaseChannel: release.releaseChannel,
    licenseType: 'LOGIFORGE Commercial Developer License',
    framework: 'Next.js',
    frameworkVersion: template.packageConfig?.frameworkVersion || '^15.5.0',
    runtimeRequirement: `Node.js ${template.packageConfig?.minNodeVersion || '>=20.0.0'}`,
    packageName,
    packageSlug,
    packageUrl,
    checksumUrl: '/downloads/checksums.txt',
    includedFeatures: [
      'Full TypeScript source code with strict typechecking',
      'Tailwind CSS and scoped CSS Modules design tokens',
      'Standalone Next.js App Router architecture',
      'Self-contained static hero & showcase image assets',
      'Simulated logistics tracking and interactive workflows',
      'Production-ready build, lint, and formatting configuration',
    ],
    excludedFeatures: [
      'Live carrier API integrations (e.g. FedEx, Maersk, DHL live APIs)',
      'Production payment gateway credentials',
      'Authentication and database backends',
      'License activation server requirements or DRM telemetry',
    ],
    requirements: {
      node: template.packageConfig?.minNodeVersion || '>=20.0.0',
      npm: '>=10.0.0',
    },
    documentation: {
      readme: 'README.md',
      gettingStarted: 'GETTING_STARTED.md',
      changelog: 'CHANGELOG.md',
      license: 'LICENSE',
    },
    support: {
      documentationUrl: 'https://github.com/Vijay07012006/LOGIFORGE#readme',
      issuesUrl: 'https://github.com/Vijay07012006/LOGIFORGE/issues',
    },
  };
}

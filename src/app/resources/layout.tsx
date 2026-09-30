import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Logistics Web Engineering Guides & UX Patterns',
  description:
    'Technical guides on logistics UX design patterns, waybill hierarchy, scoped design token architectures, and regulatory freight UI compliance.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'Logistics Web Engineering Guides & UX Patterns | LOGIFORGE',
    description:
      'Technical guides on logistics UX design patterns, waybill hierarchy, scoped design token architectures, and regulatory freight UI compliance.',
    url: 'https://logiforge.dev/resources',
    type: 'website',
    images: [
      {
        url: '/images/templates/cargo-nova/preview.webp',
        width: 1200,
        height: 630,
        alt: 'LOGIFORGE Engineering Guides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logistics Web Engineering Guides & UX Patterns | LOGIFORGE',
    description:
      'Technical guides on logistics UX design patterns, waybill hierarchy, scoped design token architectures, and regulatory freight UI compliance.',
    images: ['/images/templates/cargo-nova/preview.webp'],
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

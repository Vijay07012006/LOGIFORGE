import React from 'react';
import type { Metadata } from 'next';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { SITE_URL } from '@/lib/utils';

interface DemoLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return {
      title: 'Interactive Demo Studio',
    };
  }

  const canonicalPath = `/demo/${template.slug}`;
  const title = `${template.name} — Interactive Demo Studio`;
  const description = `Preview and test the ${template.name} logistics website template in interactive desktop, tablet, and mobile device sandboxes.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${title} | LOGIFORGE`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: 'website',
      images: [
        {
          url: template.previewImage,
          width: 1200,
          height: 630,
          alt: `${template.name} Interactive Demo Studio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | LOGIFORGE`,
      description,
      images: [template.previewImage],
    },
  };
}

export default function DemoStudioLayout({ children }: DemoLayoutProps) {
  return <>{children}</>;
}

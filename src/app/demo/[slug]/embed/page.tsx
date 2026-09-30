import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { TemplateRenderer } from '@/components/templates/dispatcher/TemplateRenderer';

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return { title: 'Live Sandbox Embed' };
  }

  return {
    title: `${template.name} — Live Sandbox Preview`,
    description: template.shortDescription,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function TemplateEmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  return <TemplateRenderer template={template} />;
}

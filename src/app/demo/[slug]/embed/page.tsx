import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTemplateBySlug, getAllTemplates } from '@/lib/templates';
import { EmbeddedTemplateView } from '@/components/studio/EmbeddedTemplateView';

interface EmbedPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tracking?: string; page?: string }>;
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
    title: `${template.name} — Live Sandbox Preview | LOGIFORGE`,
    description: template.shortDescription,
  };
}

export default async function TemplateEmbedPage({ params, searchParams }: EmbedPageProps) {
  const { slug } = await params;
  const { tracking, page } = await searchParams;

  const template = getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  return (
    <EmbeddedTemplateView
      template={template}
      initialTracking={tracking}
      initialPage={page || 'home'}
    />
  );
}

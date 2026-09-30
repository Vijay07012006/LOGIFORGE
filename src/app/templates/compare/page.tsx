import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getAllTemplates } from '@/lib/templates';
import { Container } from '@/components/ui/Container';
import { CompareMatrixClient } from './CompareMatrixClient';
import styles from './compare.module.css';

export const metadata: Metadata = {
  title: 'Compare Logistics Website Templates | LOGIFORGE',
  description:
    'Side-by-side technical comparison of LOGIFORGE logistics website templates. Compare responsive architectures, bundle sizes, feature sets, and design tokens.',
  alternates: {
    canonical: '/templates/compare',
  },
  robots: {
    index: false,
    follow: true,
  },
};

function CompareLoadingFallback() {
  return (
    <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--lf-text-muted)', fontFamily: 'var(--lf-font-mono)', fontSize: '0.85rem' }}>
      LOADING TEMPLATE COMPARISON RUNTIME...
    </div>
  );
}

export default function ComparePage() {
  const allTemplates = getAllTemplates();

  return (
    <div className={styles.page}>
      <Container size="lg">
        <Suspense fallback={<CompareLoadingFallback />}>
          <CompareMatrixClient allTemplates={allTemplates} />
        </Suspense>
      </Container>
    </div>
  );
}

'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AlertTriangle size={24} />
      </div>
      <h2 style={{ fontSize: 'var(--lf-text-xl)', color: 'var(--lf-text-primary)' }}>
        Application Error
      </h2>
      <p
        style={{
          color: 'var(--lf-text-secondary)',
          maxWidth: '500px',
          fontSize: 'var(--lf-text-sm)',
        }}
      >
        {error.message || 'An unexpected error occurred while executing the studio platform.'}
      </p>
      <Button variant="primary" size="md" onClick={() => reset()}>
        Retry Action
      </Button>
    </div>
  );
}

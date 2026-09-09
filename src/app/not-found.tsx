import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '65vh',
        padding: '24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          color: '#60A5FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <HelpCircle size={28} />
      </div>
      <h1
        style={{
          fontSize: 'var(--lf-text-3xl)',
          fontWeight: 700,
          color: 'var(--lf-text-primary)',
        }}
      >
        404 — Entity Not Found
      </h1>
      <p
        style={{
          color: 'var(--lf-text-secondary)',
          maxWidth: '480px',
          fontSize: 'var(--lf-text-base)',
          lineHeight: 1.6,
        }}
      >
        The requested template, route, or resource does not exist in the LOGIFORGE directory.
      </p>
      <Link href="/templates">
        <Button variant="primary" size="md">
          <Compass size={16} />
          <span>Return to Catalog Directory</span>
        </Button>
      </Link>
    </div>
  );
}

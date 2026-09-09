'use client';

import React from 'react';

interface MetricItem {
  value: string;
  label: string;
  detail?: string;
  trend?: string;
}

interface StatMetricBlockProps {
  metrics: MetricItem[];
  accentColor?: string;
  columns?: 2 | 3 | 4;
}

export function StatMetricBlock({
  metrics,
  accentColor = 'var(--tmpl-accent, #d4af37)',
}: StatMetricBlockProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
        gap: '1.25rem',
        width: '100%',
      }}
    >
      {metrics.map((m, idx) => (
        <div
          key={idx}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--tmpl-radius, 6px)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          <div
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              fontFamily: 'var(--tmpl-font-heading, inherit)',
              color: accentColor,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {m.value}
          </div>
          <div
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--tmpl-text, #ffffff)',
            }}
          >
            {m.label}
          </div>
          {m.detail && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--tmpl-text-muted, rgba(255, 255, 255, 0.55))',
                lineHeight: 1.4,
              }}
            >
              {m.detail}
            </div>
          )}
          {m.trend && (
            <div
              style={{
                fontSize: '0.6875rem',
                color: '#10b981',
                fontWeight: 600,
                marginTop: '0.25rem',
              }}
            >
              {m.trend}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

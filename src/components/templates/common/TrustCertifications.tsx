'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface Certification {
  name: string;
  authority: string;
  description: string;
  code: string;
}

interface TrustCertificationsProps {
  items?: Certification[];
  title?: string;
  subtitle?: string;
}

const DEFAULT_CERTS: Certification[] = [
  {
    name: 'AEO-F Certified',
    authority: 'World Customs Organization',
    description: 'Authorized Economic Operator Full security & customs simplification.',
    code: 'AEO-F/EU-90812',
  },
  {
    name: 'C-TPAT Tier 3',
    authority: 'U.S. Customs & Border Protection',
    description: 'Highest tier supply-chain security validation and green lane priority clearance.',
    code: 'C-TPAT/VAL-8841',
  },
  {
    name: 'IATA Cargo Agent',
    authority: 'International Air Transport Assoc.',
    description: 'Endorsed dangerous goods handling, cold-chain pharma, and air waybill issuance.',
    code: 'IATA-01-2-9921',
  },
  {
    name: 'ISO 9001 & 14001',
    authority: 'Bureau Veritas Quality',
    description: 'Certified international quality control & sustainable multimodal fleet governance.',
    code: 'ISO/BV-44102',
  },
];

export function TrustCertifications({
  items = DEFAULT_CERTS,
  title = 'Regulatory Accreditations & Customs Trust',
  subtitle = 'Operating with full compliance across 140+ sovereign customs jurisdictions and aviation security treaties.',
}: TrustCertificationsProps) {
  return (
    <div style={{ width: '100%' }}>
      {(title || subtitle) && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {title && (
            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 700,
                fontFamily: 'var(--tmpl-font-heading, inherit)',
                color: 'var(--tmpl-text, #ffffff)',
                marginBottom: '0.5rem',
              }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--tmpl-text-muted, rgba(255, 255, 255, 0.6))',
                maxWidth: '640px',
                margin: '0 auto',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {items.map((c) => (
          <div
            key={c.name}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--tmpl-radius, 4px)',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--tmpl-accent, #d4af37)" />
                <span
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: 'var(--tmpl-text, #ffffff)',
                  }}
                >
                  {c.name}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.625rem',
                  fontFamily: 'monospace',
                  color: 'var(--tmpl-text-muted, rgba(255, 255, 255, 0.45))',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.125rem 0.375rem',
                  borderRadius: '2px',
                }}
              >
                {c.code}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--tmpl-accent, #d4af37)',
              }}
            >
              {c.authority}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--tmpl-text-muted, rgba(255, 255, 255, 0.6))',
                lineHeight: 1.45,
              }}
            >
              {c.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

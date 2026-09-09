import React from 'react';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: '12px',
        color: 'var(--lf-text-secondary)',
        fontFamily: 'var(--lf-font-mono)',
        fontSize: 'var(--lf-text-sm)',
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: 'var(--lf-accent-primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <span>Loading LogiForge Studio...</span>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

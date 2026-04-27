import React from 'react';

const companies = ['AWS', 'PayPal', 'Uber', 'Cisco', 'Chegg', 'Fortinet'];

export default function SocialProof() {
  return (
    <section style={{
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-6) var(--space-16)',
    }}>
      <p style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-6)',
      }}>
        Used by security teams at
      </p>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-12)',
        maskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 15%, black 85%, transparent)',
      }}>
        {companies.map((name) => (
          <span key={name} style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            opacity: 0.4,
            whiteSpace: 'nowrap',
            letterSpacing: '-0.01em',
          }}>
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

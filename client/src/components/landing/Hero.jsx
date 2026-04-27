import React from 'react';

export default function Hero() {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 var(--space-6) var(--space-20)',
      position: 'relative',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse 600px 300px at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-4xl)',
        fontWeight: 700,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: '0 0 var(--space-6)',
        maxWidth: '800px',
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{ color: 'var(--color-text-primary)', display: 'block' }}>Continuous Security</span>
        <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>On Every Deploy.</span>
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: 'var(--text-md)',
        color: 'var(--color-text-secondary)',
        maxWidth: '500px',
        lineHeight: 1.6,
        margin: '0 auto var(--space-10)',
        position: 'relative',
        zIndex: 1,
      }}>
        Secure your entire stack with autonomous pentesting. Find and fix vulnerabilities 24/7.
      </p>

      {/* CTA row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-3)',
        position: 'relative',
        zIndex: 1,
      }}>
        <input
          type="text"
          placeholder="Enter your domain for a pentest"
          style={{
            width: '320px',
            height: '48px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '0 var(--space-5)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            outline: 'none',
            transition: 'border-color var(--transition-base)',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-text-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
        <button style={{
          height: '48px',
          padding: '0 var(--space-6)',
          backgroundColor: 'var(--color-btn-primary-bg)',
          color: 'var(--color-btn-primary-text)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          fontFamily: 'var(--font-sans)',
          whiteSpace: 'nowrap',
          transition: 'opacity var(--transition-base)',
        }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Start testing
        </button>
      </div>
    </section>
  );
}

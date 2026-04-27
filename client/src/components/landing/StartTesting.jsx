import React from 'react';
import { Link } from 'react-router-dom';

export default function StartTesting() {
  return (
    <section style={{ textAlign: 'center', padding: 'var(--space-20) var(--space-6)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
        Start testing in minutes
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
        No credit card required. Free plan includes 1 domain scan per month.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
        <Link to="/register" style={{ padding: '12px 28px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-btn-primary-bg)', color: 'var(--color-btn-primary-text)', fontSize: 'var(--text-base)', fontWeight: 600, textDecoration: 'none', transition: 'opacity var(--transition-base)' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          Start for free
        </Link>
        <Link to="/login" style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', textDecoration: 'none', fontWeight: 500, transition: 'color var(--transition-fast)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}>
          Get a demo →
        </Link>
      </div>
    </section>
  );
}

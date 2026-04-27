import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Features: [
    { label: 'Autonomous Pentesting', to: '/#features' },
    { label: 'PR Security Reviews', to: '/#features' },
    { label: 'Auto-Fix', to: '/#features' },
    { label: 'Continuous Coverage', to: '/#features' },
  ],
  Product: [
    { label: 'Pricing', to: '/pricing' },
    { label: 'Enterprise', to: '/enterprise' },
    { label: 'Get a Demo', to: '/login' },
    { label: 'Status', to: '#' },
  ],
  Company: [
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '#' },
    { label: 'Support', to: '#' },
    { label: 'Trust Center', to: '#' },
  ],
  Community: [
    { label: 'Open Source', to: '#' },
    { label: 'Discord', to: '#' },
  ],
};

function FooterLink({ to, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to={to} style={{ fontSize: 'var(--text-sm)', color: hovered ? 'var(--color-text-primary)' : 'var(--color-text-muted)', textDecoration: 'none', transition: 'color var(--transition-fast)', display: 'block', marginBottom: 'var(--space-2)' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--space-16) var(--space-6) var(--space-8)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top row: logo + status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-10)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '0.08em', color: 'var(--color-text-primary)' }}>SENTINELOPS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)', display: 'inline-block' }} />
            All systems operational
          </div>
        </div>

        {/* Link columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>{category}</div>
              {links.map((link) => <FooterLink key={link.label} to={link.to}>{link.label}</FooterLink>)}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>© 2025 SentinelOps Security Inc.</span>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>SOC 2</span>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

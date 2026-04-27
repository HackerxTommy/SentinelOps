import React from 'react';

const deployCards = [
  { title: 'Internal Infrastructure Pentesting', desc: 'Scan internal networks, APIs, and services behind your firewall.' },
  { title: 'Zero Data Retention', desc: 'Your source code and scan results never leave your infrastructure.' },
  { title: 'Bring Your Own Model', desc: 'Use your own LLM — Gemini, GPT-4, Claude — for AI-powered analysis.' },
];

const trustCards = [
  { title: 'Private Deployment', desc: 'Self-hosted or dedicated cloud instance within your VPC.' },
  { title: 'SOC 2 · GDPR · ISO 27001', desc: 'Enterprise-grade compliance certifications across all regions.' },
  { title: 'Dedicated Support & SLA', desc: '24/7 dedicated security engineering support with guaranteed SLAs.' },
];

const cardStyle = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', transition: 'border-color var(--transition-base)' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-20)' };
const sectionStyle = { backgroundColor: 'var(--color-bg)', padding: 'var(--space-20) var(--space-6)', maxWidth: '1200px', margin: '0 auto' };

export default function LandingEnterprise() {
  return (
    <section style={sectionStyle}>
      {/* Section 1: Deployment */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
        Full control over your deployment
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '600px' }}>
        Run Sentinel anywhere — on-premise, private cloud, or air-gapped environments.
      </p>
      <div style={gridStyle}>
        {deployCards.map((c) => (
          <div key={c.title} style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{c.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2: Trust */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
        Trusted by security teams at scale
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '600px' }}>
        Enterprise-grade security, compliance, and support for teams of any size.
      </p>
      <div style={gridStyle}>
        {trustCards.map((c) => (
          <div key={c.title} style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>{c.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Testimonial */}
      <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
        <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.4, maxWidth: '700px', margin: '0 auto var(--space-8)', letterSpacing: '-0.01em' }}>
          "Sentinel found 23 critical vulnerabilities in our first scan that our previous tool missed entirely. The AI-powered fix suggestions saved our team weeks of work."
        </blockquote>
        <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>Priya Sharma</div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Head of Security, TechCorp India</div>
      </div>
    </section>
  );
}

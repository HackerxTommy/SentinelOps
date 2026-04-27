import React from 'react';

const deployCards = [
  { icon: '🏢', title: 'Internal infrastructure pentesting', desc: 'Scan internal networks, APIs, and services behind your firewall with our on-prem agent.' },
  { icon: '🔐', title: 'Zero data retention', desc: 'Your source code and scan results never leave your infrastructure. Full data sovereignty.' },
  { icon: '🤖', title: 'Bring your own model', desc: 'Use your own LLM — Gemini, GPT-4, Claude, or Llama — for AI-powered analysis.' },
];

const trustCards = [
  { icon: '☁️', title: 'Private deployment', desc: 'Self-hosted or dedicated cloud instance within your VPC. Air-gapped environments supported.' },
  { icon: '✅', title: 'SOC 2 · GDPR · ISO 27001', desc: 'Enterprise-grade compliance certifications across all regions.' },
  { icon: '🎧', title: 'Dedicated support & SLA', desc: '24/7 dedicated security engineering support with guaranteed response time SLAs.' },
];

const cardStyle = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', transition: 'border-color var(--transition-base)', cursor: 'default' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-20)' };

function CardGrid({ title, subtitle, cards }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>{title}</h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '600px' }}>{subtitle}</p>
      <div style={gridStyle}>
        {cards.map((c) => (
          <div key={c.title} style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
            <div style={{ fontSize: '24px', marginBottom: 'var(--space-4)' }}>{c.icon}</div>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{c.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EnterpriseSections() {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' }}>
      <CardGrid title="Full control over your deployment" subtitle="Run SentinelOps anywhere — on-premise, private cloud, or air-gapped environments." cards={deployCards} />
      <CardGrid title="Trusted by security teams at scale" subtitle="Enterprise-grade security, compliance, and support for teams of any size." cards={trustCards} />
    </section>
  );
}

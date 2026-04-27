import React from 'react';

const features = [
  { icon: '📋', title: 'Every PR reviewed', desc: 'Automatic security review on every pull request. No vulnerability reaches production.' },
  { icon: '🛡️', title: 'Blocks vulnerable deploys', desc: 'CI/CD gate that prevents deployments with critical or high severity findings.' },
  { icon: '🌐', title: 'Monitors your attack surface', desc: 'Continuous asset discovery and monitoring across all your domains and subdomains.' },
  { icon: '⚡', title: 'Runtime validation', desc: 'Validates fixes in production with live retesting after each remediation.' },
  { icon: '🎯', title: 'Context-aware pentesting', desc: 'AI understands your tech stack and business logic for deeper, smarter testing.' },
  { icon: '🧠', title: 'Continuous learning', desc: 'Gets smarter with each scan. Learns your codebase patterns to reduce false positives.' },
];

export default function DeployWithConfidence() {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' }}>
      <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-10)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          Deploy with confidence
        </h2>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '500px' }}>
          Security that moves at the speed of your development team.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
          {features.map((f) => (
            <div key={f.title} style={{ padding: 'var(--space-4)' }}>
              <div style={{ fontSize: '18px', marginBottom: 'var(--space-3)' }}>{f.icon}</div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
                {f.title}
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

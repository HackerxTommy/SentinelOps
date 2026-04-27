import React from 'react';

const steps = [
  { num: '01', title: 'Connect your stack', desc: 'Link your repos, domains, and cloud accounts in one click. GitHub, GitLab, AWS, GCP — all supported.', icon: '🔗' },
  { num: '02', title: 'Continuous scanning', desc: 'SentinelOps monitors every push, every PR, every deploy. Autonomous pentesting runs 24/7 against your attack surface.', icon: '🔄' },
  { num: '03', title: 'AI-powered fixes', desc: 'Get remediation code diffs, not just vulnerability reports. One-click apply fixes directly in your codebase.', icon: '🤖' },
];

export default function HowItWorks() {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
        How it works
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--space-12)', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
        Three steps to continuous security coverage.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', position: 'relative' }}>
        {/* Connecting line */}
        <div style={{ position: 'absolute', top: '40px', left: '16.6%', right: '16.6%', height: '1px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />

        {steps.map((step) => (
          <div key={step.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', margin: '0 auto var(--space-6)',
            }}>
              {step.icon}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '0.08em', marginBottom: 'var(--space-2)' }}>
              STEP {step.num}
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              {step.title}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: '280px', margin: '0 auto' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';

export default function Testimonial() {
  return (
    <section style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-6)', maxWidth: '800px', margin: '0 auto' }}>
      <blockquote style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xl)',
        fontWeight: 500,
        fontStyle: 'italic',
        color: 'var(--color-text-primary)',
        lineHeight: 1.4,
        letterSpacing: '-0.01em',
        maxWidth: '700px',
        margin: '0 auto var(--space-8)',
      }}>
        "SentinelOps found 23 critical vulnerabilities in our first scan that our previous tool missed entirely. The AI-powered fix suggestions saved our team weeks of remediation work."
      </blockquote>
      <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: '#f97316', marginBottom: 'var(--space-1)' }}>Chegg</div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Priya Sharma, Head of Application Security</div>
    </section>
  );
}

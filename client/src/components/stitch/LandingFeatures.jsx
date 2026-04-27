import React from 'react';

const featureCards = [
  {
    title: 'APIs & Web Apps',
    description: 'Automated black-box and gray-box pentesting for web applications and APIs.',
    mockRows: ['GET /api/users', 'POST /api/auth/login', 'PUT /api/settings'],
    icons: ['🔒', '🌐', '⚡'],
  },
  {
    title: 'Code & Pull Requests',
    description: 'AI-powered code review that catches vulnerabilities before they ship.',
    mockRows: ['- password = req.body.pass', '+ password = hash(req.body.pass)', '  validate(token)'],
    icons: ['📝', '🔍', '✅'],
  },
  {
    title: 'Infrastructure & Cloud',
    description: 'Scan cloud configs, Docker images, and infrastructure-as-code.',
    mockRows: ['AWS S3 Bucket: Public', 'Docker: Root user', 'IAM: Overprivileged'],
    icons: ['☁️', '🐳', '🏗️'],
  },
];

const gridFeatures = [
  { icon: '🔄', label: 'CI/CD Integration', desc: 'Trigger scans on every push, PR, or deploy automatically.' },
  { icon: '🤖', label: 'AI-Powered Fixes', desc: 'Get remediation code diffs, not just vulnerability reports.' },
  { icon: '📊', label: 'CVSS Scoring', desc: 'Industry-standard severity scoring with contextual risk analysis.' },
  { icon: '🔔', label: 'Real-time Alerts', desc: 'Slack, email, and webhook notifications for critical findings.' },
  { icon: '📋', label: 'Compliance Reports', desc: 'SOC 2, OWASP Top 10, and custom compliance mapping.' },
  { icon: '🔗', label: 'API-First', desc: 'Full REST API to build custom workflows and integrations.' },
];

const styles = {
  section: {
    backgroundColor: 'var(--color-bg)',
    padding: 'var(--space-20) var(--space-6)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-2xl)',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-3)',
    letterSpacing: '-0.02em',
  },
  subline: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-secondary)',
    marginBottom: 'var(--space-12)',
    maxWidth: '600px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-6)',
    marginBottom: 'var(--space-20)',
  },
  card: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    transition: 'border-color var(--transition-base)',
    cursor: 'default',
  },
  cardMock: {
    backgroundColor: 'var(--color-surface-raised)',
    padding: 'var(--space-4)',
    borderBottom: '1px solid var(--color-border)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-text-muted)',
    lineHeight: 1.8,
  },
  cardBody: {
    padding: 'var(--space-6)',
  },
  cardTitle: {
    fontSize: 'var(--text-md)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  },
  cardDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
    marginBottom: 'var(--space-4)',
  },
  iconRow: {
    display: 'flex',
    gap: 'var(--space-2)',
    fontSize: '16px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--space-6)',
  },
  featureCard: {
    padding: 'var(--space-6)',
  },
  featureIcon: {
    fontSize: '24px',
    marginBottom: 'var(--space-3)',
  },
  featureLabel: {
    fontSize: 'var(--text-base)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-2)',
  },
  featureDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-secondary)',
    lineHeight: 1.5,
  },
};

export default function LandingFeatures() {
  return (
    <section style={styles.section}>
      {/* Platform Cards */}
      <h2 style={styles.headline}>Your full-stack security platform</h2>
      <p style={styles.subline}>
        One platform for pentesting, code review, and vulnerability management across your entire stack.
      </p>

      <div style={styles.cardGrid}>
        {featureCards.map((card) => (
          <div
            key={card.title}
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
          >
            <div style={styles.cardMock}>
              {card.mockRows.map((row, i) => (
                <div key={i}>{row}</div>
              ))}
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardDesc}>{card.description}</div>
              <div style={styles.iconRow}>
                {card.icons.map((icon, i) => (
                  <span key={i}>{icon}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Grid */}
      <h2 style={styles.headline}>Deploy with confidence</h2>
      <p style={{ ...styles.subline, marginBottom: 'var(--space-10)' }}>
        Everything you need to find, fix, and prevent security vulnerabilities.
      </p>

      <div style={styles.featureGrid}>
        {gridFeatures.map((f) => (
          <div key={f.label} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <div style={styles.featureLabel}>{f.label}</div>
            <div style={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

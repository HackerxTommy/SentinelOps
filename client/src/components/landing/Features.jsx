import React from 'react';

/* ── Mock UI data for each card ── */
const pentestRows = [
  { name: 'api.acme.io', status: 'Completed', statusColor: 'var(--color-success)', issues: '3 Critical · 5 High', date: '2h ago' },
  { name: 'staging.app.dev', status: 'Running', statusColor: 'var(--color-accent)', issues: '1 High · 2 Med', date: '15m ago' },
  { name: 'payments.svc', status: 'Completed', statusColor: 'var(--color-success)', issues: '0 Critical · 1 High', date: '1d ago' },
  { name: 'auth-gateway', status: 'Queued', statusColor: 'var(--color-text-muted)', issues: '—', date: 'Scheduled' },
];

const codeDiffLines = [
  { type: 'context', text: '// GET /api/users/:id' },
  { type: 'context', text: 'router.get("/users/:id", async (req, res) => {' },
  { type: 'remove',  text: '  const user = await User.findById(req.params.id);' },
  { type: 'add',     text: '  if (req.user.id !== req.params.id && req.user.role !== "admin") {' },
  { type: 'add',     text: '    return res.status(403).json({ error: "Forbidden" });' },
  { type: 'add',     text: '  }' },
  { type: 'add',     text: '  const user = await User.findById(req.params.id);' },
];

const infraRows = [
  { issue: 'S3 Bucket Public ACL', severity: 'Critical', svColor: 'var(--color-critical)', cvss: '9.1', tested: '2h ago' },
  { issue: 'Docker Root User', severity: 'High', svColor: 'var(--color-high)', cvss: '7.8', tested: '4h ago' },
  { issue: 'IAM Overprivileged', severity: 'Medium', svColor: 'var(--color-medium)', cvss: '5.3', tested: '1d ago' },
  { issue: 'TLS 1.0 Enabled', severity: 'Low', svColor: 'var(--color-low)', cvss: '3.1', tested: '2d ago' },
];

const techBubbles = {
  card1: [
    { label: 'REST', color: '#3b82f6' },
    { label: 'GraphQL', color: '#e535ab' },
    { label: 'gRPC', color: '#22c55e' },
  ],
  card2: [
    { label: 'GitHub', color: '#ffffff' },
    { label: 'GitLab', color: '#fc6d26' },
    { label: 'Caido', color: '#06b6d4' },
  ],
  card3: [
    { label: 'AWS', color: '#ff9900' },
    { label: 'GCP', color: '#4285f4' },
    { label: 'Azure', color: '#0078d4' },
    { label: 'K8s', color: '#326ce5' },
  ],
};

const s = {
  section: { maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' },
  h2: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center', letterSpacing: '-0.025em', margin: '0 0 var(--space-3)' },
  sub: { fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--space-12)', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' },
  card: { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', transition: 'border-color var(--transition-base)' },
  mockArea: { backgroundColor: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.8 },
  body: { padding: 'var(--space-6)' },
  cardTitle: { fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' },
  cardDesc: { fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-4)' },
  techRow: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
  /* Mini table inside mock area */
  th: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' },
  td: { fontSize: '11px', padding: '5px 8px', borderBottom: '1px solid var(--color-border-subtle)' },
};

function TechBubble({ label, color }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

function StatusDot({ color, pulse }) {
  return <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color, display: 'inline-block', animation: pulse ? 'pulse 2s ease infinite' : 'none' }} />;
}

export default function Features() {
  return (
    <section id="features" style={s.section}>
      <h2 style={s.h2}>Your full-stack security platform</h2>
      <p style={s.sub}>One platform for pentesting, code review, and vulnerability management across your entire stack.</p>

      <div style={s.grid}>
        {/* Card 1 — Pentest table */}
        <div style={s.card} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
          <div style={s.mockArea}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['PENTEST', 'STATUS', 'ISSUES', 'DATE'].map((h) => <th key={h} style={s.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {pentestRows.map((r) => (
                  <tr key={r.name}>
                    <td style={{ ...s.td, color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.name}</td>
                    <td style={s.td}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: r.statusColor }}><StatusDot color={r.statusColor} pulse={r.status === 'Running'} /> {r.status}</span></td>
                    <td style={{ ...s.td, color: 'var(--color-text-muted)' }}>{r.issues}</td>
                    <td style={{ ...s.td, color: 'var(--color-text-muted)' }}>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={s.body}>
            <div style={s.cardTitle}>APIs & Web Apps</div>
            <div style={s.cardDesc}>Automated black-box and gray-box pentesting for web applications, REST APIs, and GraphQL endpoints.</div>
            <div style={s.techRow}>{techBubbles.card1.map((t) => <TechBubble key={t.label} {...t} />)}</div>
          </div>
        </div>

        {/* Card 2 — Code diff */}
        <div style={s.card} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
          <div style={s.mockArea}>
            <div style={{ marginBottom: '6px', color: 'var(--color-text-muted)', fontSize: '10px' }}>
              <span style={{ color: 'var(--color-accent)' }}>sentinel-bot</span> flagged an IDOR vulnerability
            </div>
            {codeDiffLines.map((line, i) => (
              <div key={i} style={{
                padding: '1px 6px',
                borderRadius: '2px',
                backgroundColor: line.type === 'remove' ? 'rgba(239,68,68,0.1)' : line.type === 'add' ? 'rgba(34,197,94,0.1)' : 'transparent',
                color: line.type === 'remove' ? 'var(--color-error)' : line.type === 'add' ? 'var(--color-success)' : 'var(--color-text-muted)',
              }}>
                {line.type === 'remove' ? '- ' : line.type === 'add' ? '+ ' : '  '}{line.text}
              </div>
            ))}
          </div>
          <div style={s.body}>
            <div style={s.cardTitle}>Code & Pull Requests</div>
            <div style={s.cardDesc}>AI-powered code review that catches vulnerabilities before they ship. Get fix diffs, not just reports.</div>
            <div style={s.techRow}>{techBubbles.card2.map((t) => <TechBubble key={t.label} {...t} />)}</div>
          </div>
        </div>

        {/* Card 3 — Infra table */}
        <div style={s.card} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
          <div style={s.mockArea}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                {['ISSUE', 'SEVERITY', 'CVSS', 'TESTED'].map((h) => <th key={h} style={s.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {infraRows.map((r) => (
                  <tr key={r.issue}>
                    <td style={{ ...s.td, color: 'var(--color-text-primary)', fontWeight: 500 }}>{r.issue}</td>
                    <td style={s.td}><span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: 'var(--radius-full)', color: r.svColor, backgroundColor: r.svColor.replace(')', ',0.12)').replace('var(', '').replace('--color-', '') }}>{r.severity}</span></td>
                    <td style={{ ...s.td, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{r.cvss}</td>
                    <td style={{ ...s.td, color: 'var(--color-text-muted)' }}>{r.tested}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={s.body}>
            <div style={s.cardTitle}>Infrastructure & Cloud</div>
            <div style={s.cardDesc}>Scan cloud configs, Docker images, Kubernetes manifests, and infrastructure-as-code.</div>
            <div style={s.techRow}>{techBubbles.card3.map((t) => <TechBubble key={t.label} {...t} />)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

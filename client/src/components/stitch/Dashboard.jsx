import React from 'react';
import AppShell from '../layout/AppShell';
import StatCard from '../ui/StatCard';
import SeverityBadge from '../ui/SeverityBadge';
import SeverityDot from '../ui/SeverityDot';
import DataTable from '../ui/DataTable';

const stats = [
  { label: 'Security Score', value: '43.0', sub: '/100' },
  { label: 'Vulnerabilities', value: '15', sub: '4 critical', subColor: 'var(--color-critical)' },
  { label: 'Open Issues', value: '11' },
  { label: 'Pentests', value: '5' },
  { label: 'PRs Reviewed', value: '25' },
];

const topIssues = [
  { id: 1, title: 'SQL Injection in /api/users', cvss: 9.8, severity: 'CRITICAL' },
  { id: 2, title: 'Broken Authentication', cvss: 8.1, severity: 'HIGH' },
  { id: 3, title: 'XSS in Search Component', cvss: 6.5, severity: 'MEDIUM' },
  { id: 4, title: 'Missing Rate Limiting', cvss: 5.3, severity: 'MEDIUM' },
  { id: 5, title: 'Verbose Error Messages', cvss: 3.1, severity: 'LOW' },
];

const topAssets = [
  { id: 1, name: 'api.sentinel.dev', critical: 2, high: 3, medium: 1 },
  { id: 2, name: 'app.sentinel.dev', critical: 1, high: 1, medium: 2 },
  { id: 3, name: 'auth-service', critical: 1, high: 0, medium: 3 },
];

const issueColumns = [
  { key: 'title', label: 'Issue', render: (v) => <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</span> },
  { key: 'cvss', label: 'CVSS', render: (v, row) => <SeverityBadge severity={row.severity} /> },
];

const assetColumns = [
  { key: 'name', label: 'Asset', render: (v) => <span style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{v}</span> },
  { key: 'severity', label: 'Severity', render: (_, row) => (
    <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {Array(row.critical).fill(null).map((_, i) => <SeverityDot key={`c${i}`} severity="CRITICAL" />)}
      {Array(row.high).fill(null).map((_, i) => <SeverityDot key={`h${i}`} severity="HIGH" />)}
      {Array(row.medium).fill(null).map((_, i) => <SeverityDot key={`m${i}`} severity="MEDIUM" />)}
    </span>
  )},
];

const cardStyle = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' };
const cardTitle = { fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' };

/* Simple SVG donut */
const DonutChart = () => {
  const data = [
    { pct: 28, color: 'var(--color-critical)' },
    { pct: 22, color: 'var(--color-high)' },
    { pct: 30, color: 'var(--color-medium)' },
    { pct: 20, color: 'var(--color-low)' },
  ];
  let offset = 0;
  return (
    <svg width="160" height="160" viewBox="0 0 36 36" style={{ margin: '0 auto', display: 'block' }}>
      {data.map((d, i) => {
        const el = <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={d.color} strokeWidth="4" strokeDasharray={`${d.pct} ${100 - d.pct}`} strokeDashoffset={-offset} strokeLinecap="round" />;
        offset += d.pct;
        return el;
      })}
    </svg>
  );
};

/* Simple line chart placeholder */
const LineChart = ({ title, color }) => (
  <div style={cardStyle}>
    <div style={cardTitle}>{title}</div>
    <svg width="100%" height="120" viewBox="0 0 300 120" preserveAspectRatio="none">
      <line x1="0" y1="119" x2="300" y2="119" stroke="var(--color-chart-grid)" strokeWidth="1"/>
      <line x1="0" y1="80" x2="300" y2="80" stroke="var(--color-chart-grid)" strokeWidth="0.5"/>
      <line x1="0" y1="40" x2="300" y2="40" stroke="var(--color-chart-grid)" strokeWidth="0.5"/>
      <polyline fill="none" stroke={color} strokeWidth="2" points="0,90 50,85 100,70 150,75 200,50 250,45 300,55" />
    </svg>
  </div>
);

export default function Dashboard() {
  return (
    <AppShell currentPage="dashboard">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, fontFamily: 'var(--font-display)' }}>Security Dashboard</h1>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'transparent', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'inherit' }}>Last 30 days</button>
          <button style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-btn-primary-bg)', color: 'var(--color-btn-primary-text)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'inherit' }}>+ New Pentest</button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Middle: Issues + Assets + Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <div style={cardStyle}>
          <div style={cardTitle}>Top Issues</div>
          <DataTable columns={issueColumns} rows={topIssues} />
        </div>
        <div style={cardStyle}>
          <div style={cardTitle}>Top Affected Assets</div>
          <DataTable columns={assetColumns} rows={topAssets} />
        </div>
        <div style={cardStyle}>
          <div style={cardTitle}>Severity Breakdown</div>
          <DonutChart />
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
            {[['Critical', 'critical'], ['High', 'high'], ['Medium', 'medium'], ['Low', 'low']].map(([l, k]) => (
              <span key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <SeverityDot severity={k.toUpperCase()} size={6} /> {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: 3 Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
        <LineChart title="Security Score" color="var(--color-chart-1)" />
        <LineChart title="Open vs Fixed Issues" color="var(--color-chart-2)" />
        <LineChart title="Mean Time to Remediate" color="var(--color-chart-5)" />
      </div>
    </AppShell>
  );
}

import React from 'react';

const styles = {
  card: {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-6)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
    transition: 'border-color var(--transition-base)',
    cursor: 'default',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    fontWeight: 400,
  },
  icon: {
    color: 'var(--color-text-muted)',
    width: '16px',
    height: '16px',
  },
  value: {
    fontSize: 'var(--text-3xl)',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--color-text-primary)',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  sub: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
  },
};

export default function StatCard({ label, value, sub, subColor, icon: Icon }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        {Icon && <Icon style={styles.icon} />}
      </div>
      <span style={styles.value}>{value}</span>
      {sub && (
        <span style={{ ...styles.sub, color: subColor || 'var(--color-text-muted)' }}>
          {sub}
        </span>
      )}
    </div>
  );
}

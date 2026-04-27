import React from 'react';

const statusConfig = {
  completed: { color: 'var(--color-success)', label: 'Completed', pulse: false },
  running:   { color: 'var(--color-accent)',  label: 'Running',   pulse: true },
  pending:   { color: 'var(--color-text-muted)', label: 'Pending', pulse: false },
  failed:    { color: 'var(--color-error)',   label: 'Failed',    pulse: false },
  open:      { color: 'var(--color-error)',   label: 'Open',      pulse: false },
  fix_pending: { color: 'var(--color-warning)', label: 'Fix Pending', pulse: false },
  fixed:     { color: 'var(--color-success)', label: 'Fixed',     pulse: false },
};

const styles = {
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    lineHeight: 1,
    padding: '3px 10px',
    borderRadius: 'var(--radius-full)',
    whiteSpace: 'nowrap',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
};

export default function StatusPill({ status = 'pending' }) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return (
    <span
      style={{
        ...styles.pill,
        backgroundColor: 'transparent',
        color: config.color,
      }}
    >
      <span
        style={{
          ...styles.dot,
          backgroundColor: config.color,
          animation: config.pulse ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none',
        }}
      />
      {config.label}
    </span>
  );
}

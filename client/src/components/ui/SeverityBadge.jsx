import React from 'react';

const severityMap = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    lineHeight: 1,
    borderRadius: 'var(--radius-full)',
    padding: '3px 8px',
    whiteSpace: 'nowrap',
  },
};

export default function SeverityBadge({ severity = 'INFO' }) {
  const key = severityMap[severity.toUpperCase()] || 'info';

  const dynamicStyles = {
    ...styles.badge,
    backgroundColor: `var(--color-${key}-subtle)`,
    color: `var(--color-${key})`,
  };

  return (
    <span style={dynamicStyles}>
      {severity.toUpperCase()}
    </span>
  );
}

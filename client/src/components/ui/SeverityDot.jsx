import React from 'react';

const severityMap = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  INFO: 'info',
};

export default function SeverityDot({ severity = 'INFO', size = 8 }) {
  const key = severityMap[severity.toUpperCase()] || 'info';

  return (
    <span
      style={{
        display: 'inline-flex',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: `var(--color-${key})`,
        flexShrink: 0,
      }}
      title={severity}
    />
  );
}

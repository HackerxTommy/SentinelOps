import React from 'react';

export default function AnnouncementStrip() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-3) var(--space-4)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-muted)',
      borderBottom: '1px solid var(--color-border-subtle)',
      marginBottom: 'var(--space-12)',
    }}>
      SentinelOps Launch Week 1
      <span style={{ color: 'var(--color-accent)', cursor: 'pointer', marginLeft: '6px' }}>
        | See what's new →
      </span>
    </div>
  );
}

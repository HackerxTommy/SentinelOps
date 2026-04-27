import React from 'react';

export default function Skeleton({ width = '100%', height = '16px', borderRadius }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius: borderRadius || 'var(--radius-sm)',
      }}
    />
  );
}

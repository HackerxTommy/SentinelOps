import React from 'react';
import Skeleton from './Skeleton';

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: 'var(--text-xs)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-text-muted)',
    padding: 'var(--space-3) var(--space-4)',
    textAlign: 'left',
    borderBottom: '1px solid var(--color-border)',
    whiteSpace: 'nowrap',
  },
  td: {
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-secondary)',
    padding: 'var(--space-3) var(--space-4)',
    borderBottom: '1px solid var(--color-border-subtle)',
    verticalAlign: 'middle',
  },
  row: {
    transition: 'background-color var(--transition-fast)',
    cursor: 'default',
  },
  empty: {
    textAlign: 'center',
    padding: 'var(--space-12) var(--space-4)',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--text-sm)',
  },
};

export default function DataTable({ columns = [], rows = [], onRowClick, loading, emptyMessage = 'No data found' }) {
  const clickable = typeof onRowClick === 'function';

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={styles.th}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <tr key={`skel-${i}`}>
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  <Skeleton height="16px" />
                </td>
              ))}
            </tr>
          ))
        ) : rows.length === 0 ? (
          <tr>
            <td style={styles.empty} colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <tr
              key={row.id || i}
              style={{
                ...styles.row,
                cursor: clickable ? 'pointer' : 'default',
              }}
              onClick={() => clickable && onRowClick(row)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {columns.map((col) => (
                <td key={col.key} style={styles.td}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

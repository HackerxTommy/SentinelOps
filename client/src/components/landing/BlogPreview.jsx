import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
  {
    id: 1,
    thumbnail: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-high-subtle)', color: 'var(--color-high)' }}>HIGH 8.8</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>CVE-2026-33413</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', maxWidth: '200px', textAlign: 'center' }}>Authorization bypass in gRPC APIs</span>
      </div>
    ),
    title: 'CVE-2026-33413: Authorization bypass in gRPC APIs',
    author: 'SentinelOps Research', date: 'Dec 12, 2026', avatar: 'S',
  },
  {
    id: 2,
    thumbnail: () => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>Introducing the new</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-muted)' }}>SentinelOps Platform</span>
      </div>
    ),
    title: 'Introducing the new SentinelOps Platform',
    author: 'SentinelOps Team', date: 'Dec 8, 2026', avatar: 'S',
  },
  {
    id: 3,
    thumbnail: () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>SENTINELOPS</span>
        <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)' }}>×</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-md)', fontWeight: 700, color: '#06b6d4' }}>CAIDO</span>
      </div>
    ),
    title: 'Partnering with Caido for precision pentesting',
    author: 'Arjun Patel', date: 'Dec 1, 2026', avatar: 'A',
  },
];

export default function BlogPreview() {
  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
        From the blog
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)' }}>
        Security research, product updates, and engineering insights.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        {posts.map((post) => {
          const Thumb = post.thumbnail;
          return (
            <div key={post.id} style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color var(--transition-base)' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
              <div style={{ height: '200px', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
                <Thumb />
              </div>
              <div style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', lineHeight: 1.4 }}>{post.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-primary)', flexShrink: 0 }}>{post.avatar}</div>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{post.author} · {post.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Link to="/blog" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 500, textDecoration: 'none' }}>See all posts →</Link>
    </section>
  );
}

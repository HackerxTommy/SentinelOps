import React from 'react';

const posts = [
  { id: 1, title: 'CVE-2024-38816: Spring Framework Path Traversal', thumbnail: 'CVE-2024-38816', author: 'Sentinel Research', date: 'Dec 12, 2024', avatar: 'S' },
  { id: 2, title: 'How We Found 47 Vulnerabilities in a Fortune 500 API', thumbnail: 'Case Study', author: 'Arjun Patel', date: 'Dec 8, 2024', avatar: 'A' },
  { id: 3, title: 'Introducing AI-Powered Fix Suggestions', thumbnail: 'Product Update', author: 'Sentinel Team', date: 'Dec 1, 2024', avatar: 'S' },
];

const sectionStyle = { backgroundColor: 'var(--color-bg)', padding: 'var(--space-20) var(--space-6)', maxWidth: '1200px', margin: '0 auto' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' };
const cardStyle = { backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color var(--transition-base)' };

export default function Blog() {
  return (
    <section style={sectionStyle}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>From the blog</h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>Security research, product updates, and engineering insights.</p>

      <div style={gridStyle}>
        {posts.map((post) => (
          <div key={post.id} style={cardStyle} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-border-hover)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}>
            <div style={{ backgroundColor: 'var(--color-surface-raised)', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{post.thumbnail}</span>
            </div>
            <div style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', lineHeight: 1.4 }}>{post.title}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--color-text-primary)', flexShrink: 0 }}>{post.avatar}</div>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{post.author} · {post.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a href="#" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', fontWeight: 500 }}>See all posts →</a>
    </section>
  );
}

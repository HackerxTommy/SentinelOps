import React from 'react';
import Navbar from '../layout/Navbar';

const styles = {
  page: {
    backgroundColor: 'var(--color-bg)',
    minHeight: '100vh',
  },
  announcement: {
    textAlign: 'center',
    padding: 'var(--space-3) var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-muted)',
    borderBottom: '1px solid var(--color-border-subtle)',
  },
  link: {
    color: 'var(--color-accent)',
    cursor: 'pointer',
    marginLeft: '4px',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 'var(--space-20) var(--space-6) var(--space-16)',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -60%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  headlineWrap: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 'var(--space-6)',
  },
  headline: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-4xl)',
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: '-0.03em',
    margin: 0,
  },
  headlineLine1: {
    color: 'var(--color-text-primary)',
    display: 'block',
  },
  headlineLine2: {
    color: 'var(--color-text-faded)',
    display: 'block',
  },
  subline: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-secondary)',
    maxWidth: '520px',
    lineHeight: 1.6,
    marginBottom: 'var(--space-10)',
    position: 'relative',
    zIndex: 1,
  },
  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    position: 'relative',
    zIndex: 1,
  },
  input: {
    backgroundColor: 'var(--color-surface-raised)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    padding: '10px 20px',
    fontSize: 'var(--text-base)',
    color: 'var(--color-text-primary)',
    width: '320px',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color var(--transition-base)',
  },
  ctaBtn: {
    backgroundColor: 'var(--color-btn-primary-bg)',
    color: 'var(--color-btn-primary-text)',
    borderRadius: 'var(--radius-full)',
    padding: '10px 24px',
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--font-sans)',
    whiteSpace: 'nowrap',
    transition: 'opacity var(--transition-base)',
  },
};

export default function LandingHero() {
  return (
    <div style={styles.page}>
      <Navbar />

      {/* Announcement Strip */}
      <div style={styles.announcement}>
        Sentinel Launch Week 1
        <span style={styles.link}>| See what's new →</span>
      </div>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.glow} />

        <div style={styles.headlineWrap}>
          <h1 style={styles.headline}>
            <span style={styles.headlineLine1}>Continuous Security</span>
            <span style={styles.headlineLine2}>On Every Deploy.</span>
          </h1>
        </div>

        <p style={styles.subline}>
          Automated pentesting, code review, and vulnerability management
          for engineering teams that ship fast and stay secure.
        </p>

        <div style={styles.ctaRow}>
          <input
            type="text"
            placeholder="Enter your domain"
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-text-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
          <button
            style={styles.ctaBtn}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Start testing
          </button>
        </div>
      </section>
    </div>
  );
}

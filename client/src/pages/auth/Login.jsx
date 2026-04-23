import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)' },
  card: { width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)' },
  logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' },
  logoCircle: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: 'var(--space-2)' },
  subtitle: { fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 'var(--space-8)' },
  form: { display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' },
  label: { fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-1)', display: 'block' },
  input: { width: '100%', padding: '10px 14px', backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', outline: 'none', transition: 'border-color var(--transition-base)' },
  btn: { width: '100%', padding: '10px 16px', backgroundColor: 'var(--color-btn-primary-bg)', color: 'var(--color-btn-primary-text)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-base)', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'var(--font-sans)', transition: 'opacity var(--transition-base)', marginTop: 'var(--space-2)' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  error: { fontSize: 'var(--text-sm)', color: 'var(--color-error)', textAlign: 'center', padding: 'var(--space-2) 0' },
  footer: { fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-6)' },
  link: { color: 'var(--color-accent)', fontWeight: 500 },
};

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // error is already set in the store
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <div style={styles.logoCircle}><ShieldIcon /></div>
        </div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" placeholder="you@company.com" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} onFocus={(e) => e.target.style.borderColor = 'var(--color-text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} required />
          </div>
          <div>
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" placeholder="••••••••" value={password} onChange={(e) => { setPassword(e.target.value); clearError(); }} onFocus={(e) => e.target.style.borderColor = 'var(--color-text-primary)'} onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'} required />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={{ ...styles.btn, ...(isLoading ? styles.btnDisabled : {}) }} disabled={isLoading} onMouseEnter={(e) => !isLoading && (e.target.style.opacity = '0.9')} onMouseLeave={(e) => (e.target.style.opacity = '1')}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign up →</Link>
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import Navbar from '../../components/layout/Navbar';
import EnterpriseSections from '../../components/landing/EnterpriseSections';
import StartTesting from '../../components/landing/StartTesting';
import Testimonial from '../../components/landing/Testimonial';
import Footer from '../../components/landing/Footer';

export default function Enterprise() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 'var(--space-20) var(--space-6) 0' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.025em', marginBottom: 'var(--space-3)' }}>
          Enterprise Security
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
          Deploy SentinelOps on your infrastructure. Full control, full compliance, full support.
        </p>
      </div>
      <EnterpriseSections />
      <Testimonial />
      <StartTesting />
      <Footer />
    </div>
  );
}

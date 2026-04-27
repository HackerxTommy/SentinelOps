import React, { useState } from 'react';

const plans = [
  { name: 'Free', monthlyPrice: '₹0', annualPrice: '₹0', period: '/month',
    features: ['1 domain scan/month', '5 findings', 'Community support', 'Basic reports'],
    cta: 'Get started', popular: false },
  { name: 'Starter', monthlyPrice: '₹2,499', annualPrice: '₹1,999', period: '/month',
    features: ['10 scans/month', 'Unlimited findings', 'Email support', 'CI/CD integration', 'API access'],
    cta: 'Start free trial', popular: false },
  { name: 'Pro', monthlyPrice: '₹7,499', annualPrice: '₹5,999', period: '/month',
    features: ['Unlimited scans', 'PR code reviews', 'AI-powered fixes', 'Priority support', 'Custom reports', 'Team management', 'Slack integration'],
    cta: 'Start free trial', popular: true },
  { name: 'Enterprise', monthlyPrice: 'Custom', annualPrice: 'Custom', period: '',
    features: ['Private deployment', 'Bring your own model', 'Dedicated support', 'SLA guarantee', 'SOC 2 compliance', 'Custom integrations', 'SSO / SAML'],
    cta: 'Contact sales', popular: false },
];

export default function LandingPricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const sectionStyle = { backgroundColor: 'var(--color-bg)', padding: 'var(--space-20) var(--space-6)', textAlign: 'center' };
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', maxWidth: '1100px', margin: '0 auto', textAlign: 'left' };

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', letterSpacing: '-0.02em' }}>
        Simple, transparent pricing
      </h2>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)' }}>
        Start free. Scale as your team grows.
      </p>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-12)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <button onClick={() => setIsAnnual(false)} style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'inherit', backgroundColor: !isAnnual ? 'var(--color-btn-primary-bg)' : 'transparent', color: !isAnnual ? 'var(--color-btn-primary-text)' : 'var(--color-text-secondary)' }}>Monthly</button>
        <button onClick={() => setIsAnnual(true)} style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', border: 'none', fontFamily: 'inherit', backgroundColor: isAnnual ? 'var(--color-btn-primary-bg)' : 'transparent', color: isAnnual ? 'var(--color-btn-primary-text)' : 'var(--color-text-secondary)' }}>
          Annual <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-success-subtle)', color: 'var(--color-success)', marginLeft: '4px' }}>-20%</span>
        </button>
      </div>

      <div style={gridStyle}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ backgroundColor: 'var(--color-surface)', border: `1px solid ${plan.popular ? 'var(--color-text-primary)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column' }}>
            {plan.popular && <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-bg)', backgroundColor: 'var(--color-text-primary)', padding: '2px 8px', borderRadius: 'var(--radius-full)', alignSelf: 'flex-start', marginBottom: 'var(--space-3)' }}>Most Popular</span>}
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{plan.name}</div>
            <div><span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span><span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{plan.period}</span></div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-6) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
              {plan.features.map((f) => (<li key={f} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}><span style={{ color: 'var(--color-success)' }}>✓</span>{f}</li>))}
            </ul>
            <button style={{ width: '100%', padding: '10px 16px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', backgroundColor: plan.popular ? 'var(--color-btn-primary-bg)' : 'transparent', color: plan.popular ? 'var(--color-btn-primary-text)' : 'var(--color-btn-ghost-text)', border: plan.popular ? 'none' : '1px solid var(--color-btn-ghost-border)' }}>{plan.cta}</button>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from 'react';

const s = {
  section: { maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-20) var(--space-6)' },
  h2: { fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' },
  sub: { fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-10)', maxWidth: '500px' },
  container: { display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' },
  panel: { padding: 'var(--space-6)' },
  divider: { width: '1px', backgroundColor: 'var(--color-border)' },
  label: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)' },
  val: { fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' },
  pill: (bg, color) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600, backgroundColor: bg, color }),
  codeBlock: { backgroundColor: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.7, overflow: 'auto', marginTop: 'var(--space-4)' },
};

export default function FromIssueToFix() {
  return (
    <section style={s.section}>
      <h2 style={s.h2}>From issue to fix in seconds</h2>
      <p style={s.sub}>Every finding comes with a detailed explanation and an AI-generated fix you can apply in one click.</p>

      <div style={s.container}>
        {/* Left: Issue detail */}
        <div style={s.panel}>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', cursor: 'pointer' }}>← Issues / STR-00847</div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>
            SSRF via URL Parameter in /api/proxy
          </h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
            <span style={s.pill('var(--color-success-subtle)', 'var(--color-success)')}>● Open</span>
            <span style={s.pill('var(--color-high-subtle)', 'var(--color-high)')}>High 8.6</span>
            <span style={s.pill('var(--color-surface-raised)', 'var(--color-text-muted)')}>CWE-918</span>
          </div>

          <div style={s.label}>TL;DR</div>
          <p style={{ ...s.val, lineHeight: 1.5 }}>The /api/proxy endpoint accepts an arbitrary URL parameter without validation, allowing an attacker to make requests to internal services.</p>

          <div style={s.label}>IMPACT</div>
          <p style={{ ...s.val, lineHeight: 1.5 }}>Full access to internal network services, cloud metadata APIs, and potential RCE via internal admin panels.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <div style={s.label}>SEVERITY</div>
              <div style={{ ...s.val, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-high)' }} />
                <span style={{ color: 'var(--color-high)', fontWeight: 600 }}>High</span>
              </div>
            </div>
            <div><div style={s.label}>CVSS</div><div style={{ ...s.val, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>8.6</div></div>
            <div><div style={s.label}>FIX EFFORT</div><div style={{ ...s.val, color: 'var(--color-success)' }}>Low</div></div>
            <div><div style={s.label}>DISCOVERED</div><div style={s.val}>2 hours ago</div></div>
          </div>

          <div style={s.label}>LOCATION</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-text-muted)' }}>server/src/routes/proxy.js:24</div>
        </div>

        {/* Right: Fix panel */}
        <div style={{ ...s.panel, borderLeft: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', borderBottom: '2px solid var(--color-text-primary)', paddingBottom: 'var(--space-3)' }}>Fix</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', paddingBottom: 'var(--space-3)', cursor: 'pointer' }}>Reproduction</span>
          </div>

          <div style={{ ...s.label, marginBottom: 'var(--space-3)' }}>HOW DO I FIX IT?</div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
            Validate and whitelist the target URL parameter. Only allow requests to approved external domains, and block access to internal IP ranges and cloud metadata endpoints.
          </p>

          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', fontFamily: 'var(--font-mono)' }}>
            server/src/routes/proxy.js
          </div>
          <div style={s.codeBlock}>
            <div style={{ color: 'var(--color-text-muted)' }}>23  router.post('/proxy', async (req, res) =&gt; {'{'}</div>
            <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', padding: '1px 4px', borderRadius: '2px' }}>24-   const response = await fetch(req.body.url);</div>
            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', padding: '1px 4px', borderRadius: '2px' }}>24+   const parsed = new URL(req.body.url);</div>
            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', padding: '1px 4px', borderRadius: '2px' }}>25+   if (!ALLOWED_HOSTS.includes(parsed.hostname)) {'{'}</div>
            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', padding: '1px 4px', borderRadius: '2px' }}>26+     return res.status(403).json({'{'} error: 'Blocked' {'}'});</div>
            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', padding: '1px 4px', borderRadius: '2px' }}>27+   {'}'}</div>
            <div style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', padding: '1px 4px', borderRadius: '2px' }}>28+   const response = await fetch(parsed.href);</div>
            <div style={{ color: 'var(--color-text-muted)' }}>29    res.json(response.data);</div>
          </div>
          <button style={{ marginTop: 'var(--space-4)', padding: '8px 16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-btn-primary-bg)', color: 'var(--color-btn-primary-text)', fontSize: 'var(--text-sm)', fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            Apply fix →
          </button>
        </div>
      </div>
    </section>
  );
}

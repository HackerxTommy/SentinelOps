# Sentinel Design System

> Phase 0 — Design tokens, component anatomy, and visual language.
> Linear, Vercel Dashboard.

---

## 1. Atmosphere

**Authoritative · Surgical · Restrained · Technical · Impenetrable**

The interface communicates precision and control. Every pixel serves a purpose.
No decoration, no gradients (except a single radial glow on the landing hero),
no box-shadows on cards. Depth is achieved exclusively through tonal layering
and hairline borders.

---

## 2. Color Palette

### Background Layers

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `bg-base`          | `#000000` | Page canvas, main content area           |
| `bg-surface`       | `#111111` | Cards, elevated containers               |
| `bg-raised`        | `#0a0a0a` | Sidebar, code blocks, input fields       |
| `bg-hover`         | `#1a1a1a` | Hover states on rows and nav items       |

### Borders

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `border-default`   | `#222222` | Card borders, table dividers, inputs     |
| `border-subtle`    | `#1a1a1a` | Navbar bottom, section dividers          |
| `border-hover`     | `#444444` | Hover border state                       |

### Text

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `text-primary`     | `#ffffff` | Headlines, active nav, primary content   |
| `text-secondary`   | `#a1a1aa` | Body text, descriptions                  |
| `text-muted`       | `#71717a` | Metadata, timestamps, placeholders       |
| `text-faded`       | `#666666` | Hero second-line, disabled text          |

### Accent

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `accent`           | `#3b82f6` | Links, focus rings, running status       |
| `accent-subtle`    | `rgba(59,130,246,0.15)` | Accent backgrounds       |

### Severity (Dot & Badge Colors)

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `critical`         | `#ef4444` | Critical severity, CVSS 9.0+            |
| `critical-subtle`  | `rgba(239,68,68,0.12)` | Critical badge bg          |
| `high`             | `#f97316` | High severity, CVSS 7.0-8.9             |
| `high-subtle`      | `rgba(249,115,22,0.12)` | High badge bg             |
| `medium`           | `#eab308` | Medium severity, CVSS 4.0-6.9           |
| `medium-subtle`    | `rgba(234,179,8,0.12)` | Medium badge bg            |
| `low`              | `#3b82f6` | Low severity, CVSS 0.1-3.9              |
| `low-subtle`       | `rgba(59,130,246,0.12)` | Low badge bg              |
| `info`             | `#6366f1` | Informational findings                   |
| `info-subtle`      | `rgba(99,102,241,0.12)` | Info badge bg             |

### Status

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `success`          | `#22c55e` | Completed, fixed, passed                 |
| `success-subtle`   | `rgba(34,197,94,0.12)` | Success badge bg           |
| `warning`          | `#eab308` | Fix pending, degraded                    |
| `warning-subtle`   | `rgba(234,179,8,0.12)` | Warning badge bg           |
| `error`            | `#ef4444` | Failed, critical alert                   |
| `error-subtle`     | `rgba(239,68,68,0.12)` | Error badge bg             |

### Button Colors

| Token              | Value     | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `btn-primary-bg`   | `#ffffff` | Primary button background                |
| `btn-primary-text` | `#000000` | Primary button text                      |
| `btn-ghost-border` | `#333333` | Ghost/secondary button border            |
| `btn-ghost-text`   | `#ffffff` | Ghost button text                        |

---

## 3. Typography

### Font Stacks

| Token          | Value                                         |
|----------------|-----------------------------------------------|
| `font-display` | `'Inter', system-ui, -apple-system, sans-serif` |
| `font-sans`    | `'Inter', system-ui, -apple-system, sans-serif` |
| `font-mono`    | `'JetBrains Mono', 'Fira Code', monospace`     |

### Type Scale

| Token      | Size  | Weight | Line Height | Letter Spacing | Usage              |
|------------|-------|--------|-------------|----------------|--------------------|
| `text-4xl` | 72px  | 700    | 1.05        | -0.03em        | Hero headline      |
| `text-3xl` | 56px  | 700    | 1.1         | -0.025em       | Page headlines     |
| `text-2xl` | 40px  | 600    | 1.15        | -0.02em        | Section headlines   |
| `text-xl`  | 28px  | 600    | 1.2         | -0.015em       | Card titles        |
| `text-lg`  | 20px  | 600    | 1.3         | -0.01em        | Subsection titles  |
| `text-md`  | 16px  | 400    | 1.5         | 0              | Large body text    |
| `text-base`| 14px  | 400    | 1.6         | 0              | Default body       |
| `text-sm`  | 13px  | 400    | 1.5         | 0              | Secondary text     |
| `text-xs`  | 11px  | 500    | 1.0         | 0.02em         | Labels, badges     |

---

## 4. Component Anatomy

### Card
```
┌─────────────────────────────────────┐
│  bg: var(--color-surface)           │
│  border: 1px solid var(--border)    │
│  border-radius: var(--radius-lg)    │  ← 12px
│  padding: 24px                      │
│  shadow: none                       │
│  hover: border → var(--border-hover)│
└─────────────────────────────────────┘
```

### Table Row
```
┌─ text-primary ──── text-secondary ──── badge ──── text-muted ─┐
│  border-bottom: 1px solid var(--border-subtle)                  │
│  padding: 12px 16px                                             │
│  hover: bg → var(--bg-hover)                                    │
│  cursor: pointer (if clickable)                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Nav Item (Sidebar)
```
INACTIVE:                          ACTIVE:
┌──────────────────────┐           ┌──────────────────────┐
│ [icon] Label         │           │▎[icon] Label         │
│ icon: text-muted     │           │ border-left: 2px     │
│ label: text-secondary│           │ bg: bg-hover          │
│ px:12 py:8 gap:12    │           │ icon+label: white     │
│ radius: 6px          │           │ font-weight: 500      │
└──────────────────────┘           └──────────────────────┘
```

### Button — Primary
```
bg: white | color: black | border-radius: 9999px
padding: 6px 16px | font-size: 14px | font-weight: 500
hover: opacity 0.9 | transition: 150ms ease
```

### Button — Ghost / Secondary
```
bg: transparent | color: white | border: 1px solid #333
border-radius: 9999px | padding: 6px 16px
hover: bg → var(--bg-hover) | transition: 150ms ease
```

### Severity Badge (Pill)
```
bg: var(--{severity}-subtle) | color: var(--{severity})
padding: 2px 8px | border-radius: 9999px
font-size: 11px | font-weight: 600 | text-transform: uppercase
```

### Severity Dot
```
width: 8px | height: 8px | border-radius: 50%
background: var(--{severity})
display: inline-flex
```

### Status Pill
```
Same shape as Severity Badge
dot: 6px circle of status color | gap: 6px | label text
Running status: dot has CSS pulse animation
```

---

## 5. Spacing Scale

| Token       | Value | Usage                          |
|-------------|-------|--------------------------------|
| `space-1`   | 4px   | Tight inline spacing           |
| `space-2`   | 8px   | Icon-to-label gap              |
| `space-3`   | 12px  | Nav item padding, small gaps   |
| `space-4`   | 16px  | Card internal gaps, gutters    |
| `space-5`   | 20px  | Medium spacing                 |
| `space-6`   | 24px  | Card padding, section gaps     |
| `space-8`   | 32px  | Page padding, large gaps       |
| `space-10`  | 40px  | Section vertical spacing       |
| `space-12`  | 48px  | Hero section spacing           |
| `space-16`  | 64px  | Major section breaks           |
| `space-20`  | 80px  | Hero top/bottom padding        |

---

## 6. Border Radius

| Token         | Value    | Usage                       |
|---------------|----------|-----------------------------|
| `radius-sm`   | 6px      | Badges, small inputs        |
| `radius-md`   | 8px      | Buttons, nav items          |
| `radius-lg`   | 12px     | Cards, containers, modals   |
| `radius-full` | 9999px   | Pills, avatars, CTA buttons |

---

## 7. Chart Colors

| Series       | Hex       | Usage                                    |
|-------------|-----------|------------------------------------------|
| `chart-1`   | `#3b82f6` | Primary metric (Security Score)          |
| `chart-2`   | `#22c55e` | Positive trend (Fixed Issues)            |
| `chart-3`   | `#ef4444` | Negative trend (Open Issues, Critical)   |
| `chart-4`   | `#f97316` | Warning trend (High severity)            |
| `chart-5`   | `#8b5cf6` | Tertiary metric (MTTR)                   |
| `chart-6`   | `#06b6d4` | Cyan accent (PR Reviews)                 |
| `chart-grid` | `#1a1a1a` | Grid lines                              |
| `chart-axis` | `#71717a` | Axis labels                             |

---

## 8. Sidebar Navigation Map

Matches Strix.ai sidebar exactly:

```
Dashboard       → LayoutDashboard
Pentests        → ScanLine
PR Reviews      → GitPullRequest
Issues          → ShieldAlert
Chat            → MessageSquare
Repositories    → BookOpen
Domains         → Globe
Knowledge       → Brain
Integrations    → Plug
── divider ──
Settings        → Settings (+ ChevronRight)
```

---

## 9. Stack

- **Frontend**: React (Vite) — MERN stack
- **Backend**: Express.js + MongoDB
- **Auth**: Google Sign-In (OAuth 2.0)
- **AI**: Gemini API (pentesting), OpenRouter free API (chat)
- **Infra**: Docker + Docker Compose
- **Charts**: Recharts
- **Icons**: Lucide React

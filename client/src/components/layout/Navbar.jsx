import React, { useState } from "react";
import { Link } from "react-router-dom";

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--color-border-subtle)",
    height: "var(--navbar-height)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 var(--space-6)",
  },
  left: { display: "flex", alignItems: "center", gap: "var(--space-4)" },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-2)",
    textDecoration: "none",
  },
  logoText: {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "var(--text-sm)",
    letterSpacing: "0.08em",
    color: "var(--color-text-primary)",
  },
  starBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "2px 8px",
    borderRadius: "var(--radius-full)",
    border: "1px solid var(--color-border)",
    fontSize: "11px",
    color: "var(--color-text-muted)",
    whiteSpace: "nowrap",
  },
  center: { display: "flex", alignItems: "center", gap: "var(--space-8)" },
  navLink: {
    fontSize: "var(--text-sm)",
    cursor: "pointer",
    transition: "color var(--transition-fast)",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    padding: 0,
    textDecoration: "none",
  },
  right: { display: "flex", alignItems: "center", gap: "var(--space-4)" },
  demoLink: {
    fontSize: "var(--text-sm)",
    color: "var(--color-text-muted)",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "inherit",
    textDecoration: "none",
  },
  signUpBtn: {
    backgroundColor: "var(--color-btn-primary-bg)",
    color: "var(--color-btn-primary-text)",
    borderRadius: "var(--radius-full)",
    padding: "6px 16px",
    fontSize: "var(--text-sm)",
    fontWeight: 500,
    cursor: "pointer",
    border: "none",
    fontFamily: "inherit",
    transition: "opacity var(--transition-base)",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  },
};

const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const navLinks = [
  { label: "Features", to: "/#features" },
  { label: "Enterprise", to: "/enterprise" },
  { label: "Blog", to: "/blog" },
  { label: "Pricing", to: "/pricing" },
];

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <nav style={styles.navbar}>
      <div style={styles.left}>
        <Link to="/" style={styles.logo}>
          <ShieldIcon />
          <span style={styles.logoText}>SENTINELOPS</span>
        </Link>
        <span style={styles.starBadge}>24.8K ⭐</span>
      </div>

      <div style={styles.center}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            style={{
              ...styles.navLink,
              color:
                hoveredLink === link.label
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
            }}
            onMouseEnter={() => setHoveredLink(link.label)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        <Link to="/login" style={styles.demoLink}>
          Demo
        </Link>
        <Link
          to="/register"
          style={styles.signUpBtn}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
}

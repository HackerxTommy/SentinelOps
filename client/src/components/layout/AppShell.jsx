import React, { useState } from "react";

/* Lucide icon stubs — inline SVGs to avoid dependency in design phase */
const icons = {
  LayoutDashboard: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  ScanLine: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  ),
  GitPullRequest: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <line x1="6" y1="9" x2="6" y2="21" />
    </svg>
  ),
  ShieldAlert: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  MessageSquare: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  BookOpen: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Globe: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Brain: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  ),
  Plug: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a6 6 0 0 1-12 0V8z" />
    </svg>
  ),
  Settings: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Shield: () => (
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
  ),
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { key: "pentests", label: "Pentests", icon: "ScanLine" },
  { key: "pr-reviews", label: "PR Reviews", icon: "GitPullRequest" },
  { key: "issues", label: "Issues", icon: "ShieldAlert" },
  { key: "chat", label: "Chat", icon: "MessageSquare" },
  { key: "repositories", label: "Repositories", icon: "BookOpen" },
  { key: "domains", label: "Domains", icon: "Globe" },
  { key: "knowledge", label: "Knowledge", icon: "Brain" },
  { key: "integrations", label: "Integrations", icon: "Plug" },
  { key: "divider" },
  { key: "settings", label: "Settings", icon: "Settings", hasChevron: true },
];

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "var(--color-bg)",
  },
  sidebar: {
    width: "var(--sidebar-width)",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    backgroundColor: "var(--color-surface-raised)",
    borderRight: "1px solid var(--color-border)",
    display: "flex",
    flexDirection: "column",
    zIndex: 50,
    overflow: "hidden",
  },
  sidebarTop: {
    padding: "var(--space-4)",
    borderBottom: "1px solid var(--color-border)",
  },
  orgRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    cursor: "pointer",
  },
  orgAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--color-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    flexShrink: 0,
  },
  orgName: {
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    color: "var(--color-text-primary)",
    flex: 1,
  },
  orgBadge: {
    fontSize: "10px",
    fontWeight: 600,
    padding: "1px 6px",
    borderRadius: "var(--radius-full)",
    backgroundColor: "var(--color-accent-subtle)",
    color: "var(--color-accent)",
  },
  nav: {
    padding: "var(--space-2)",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    overflowY: "auto",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
    padding: "8px 12px",
    borderRadius: "var(--radius-sm)",
    fontSize: "var(--text-sm)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    border: "none",
    background: "none",
    width: "100%",
    textAlign: "left",
    position: "relative",
  },
  navItemInactive: {
    color: "var(--color-text-secondary)",
  },
  navItemActive: {
    color: "var(--color-text-primary)",
    backgroundColor: "var(--color-hover)",
    fontWeight: 500,
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "4px",
    bottom: "4px",
    width: "2px",
    backgroundColor: "var(--color-text-primary)",
    borderRadius: "1px",
  },
  divider: {
    height: "1px",
    backgroundColor: "var(--color-border)",
    margin: "4px 12px",
  },
  sidebarBottom: {
    marginTop: "auto",
    padding: "var(--space-4)",
    borderTop: "1px solid var(--color-border)",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: "var(--space-3)",
  },
  userAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "var(--color-accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "var(--text-xs)",
    fontWeight: 700,
    color: "var(--color-text-primary)",
    flexShrink: 0,
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  userEmail: {
    fontSize: "var(--text-sm)",
    color: "var(--color-text-secondary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  freeTrialBtn: {
    fontSize: "var(--text-xs)",
    color: "var(--color-text-muted)",
    padding: "4px 12px",
    marginBottom: "var(--space-3)",
    cursor: "pointer",
  },
  main: {
    marginLeft: "var(--sidebar-width)",
    minHeight: "100vh",
    backgroundColor: "var(--color-bg)",
    padding: "var(--space-8)",
    maxWidth: "calc(100vw - var(--sidebar-width))",
    width: "100%",
  },
};

export default function AppShell({ children, currentPage = "dashboard" }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        {/* Org Switcher */}
        <div style={styles.sidebarTop}>
          <div style={styles.orgRow}>
            <div style={styles.orgAvatar}>S</div>
            <span style={styles.orgName}>Sentinel</span>
            <span style={styles.orgBadge}>Pro</span>
            <icons.ChevronDown />
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            if (item.key === "divider") {
              return <div key="divider" style={styles.divider} />;
            }

            const isActive = currentPage === item.key;
            const isHovered = hoveredItem === item.key;
            const IconComponent = icons[item.icon];

            return (
              <button
                key={item.key}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : styles.navItemInactive),
                  ...(isHovered && !isActive
                    ? {
                        backgroundColor: "var(--color-hover)",
                        color: "var(--color-text-primary)",
                      }
                    : {}),
                }}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {isActive && <span style={styles.activeBar} />}
                {IconComponent && <IconComponent />}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.hasChevron && <icons.ChevronRight />}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div style={styles.sidebarBottom}>
          <div style={styles.freeTrialBtn}>Start free trial</div>
          <div style={styles.userRow}>
            <div style={styles.userAvatar}>U</div>
            <div style={styles.userInfo}>
              <span style={styles.userEmail}>user@sentinel.dev</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

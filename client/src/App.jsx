import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Landing pages
import Home from './pages/landing/Home';
import Pricing from './pages/landing/Pricing';
import BlogPage from './pages/landing/Blog';
import Enterprise from './pages/landing/Enterprise';
import Services from './pages/landing/Services';
import Features from './pages/landing/Features';

// Service detail pages
import WebAppSecurity from './pages/services/WebAppSecurity';
import CodeAnalysis from './pages/services/CodeAnalysis';

// Auth pages
import Auth from './pages/auth/Auth';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import Pentests from './pages/dashboard/Pentests';
import Issues from './pages/dashboard/Issues';
import Chat from './pages/dashboard/Chat';
import ScheduledPentest from './pages/dashboard/ScheduledPentest';
import Repositories from './pages/dashboard/Repositories';
import Domains from './pages/dashboard/Domains';
import Settings from './pages/dashboard/Settings';
import Billing from './pages/dashboard/Billing';
import Reports from './pages/dashboard/Reports';
import Activity from './pages/dashboard/Activity';
import AuditReports from './pages/dashboard/AuditReports';
import AttackSurface from './pages/dashboard/AttackSurface';

// Placeholder pages for routes that need simple views
function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? children : <Navigate to="/auth" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <Routes>
      {/* Public — Landing */}
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/web-security" element={<WebAppSecurity />} />
      <Route path="/services/code-analysis" element={<CodeAnalysis />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/enterprise" element={<Enterprise />} />

      {/* Auth */}
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/login" element={<Navigate to="/auth" />} />
      <Route path="/register" element={<Navigate to="/auth" />} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Protected — Dashboard */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/pentests" element={<PrivateRoute><Pentests /></PrivateRoute>} />
      <Route path="/scheduled" element={<PrivateRoute><ScheduledPentest /></PrivateRoute>} />
      <Route path="/pr-reviews" element={<PrivateRoute><Repositories /></PrivateRoute>} />
      <Route path="/issues" element={<PrivateRoute><Issues /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/repositories" element={<PrivateRoute><Repositories /></PrivateRoute>} />
      <Route path="/domains" element={<PrivateRoute><Domains /></PrivateRoute>} />
      <Route path="/attack-surface" element={<PrivateRoute><AttackSurface /></PrivateRoute>} />
      <Route path="/integrations" element={<PrivateRoute><PlaceholderPage title="Integrations" description="Connect to GitHub, GitLab, Jira, Slack, and more" /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      <Route path="/audit-reports" element={<PrivateRoute><AuditReports /></PrivateRoute>} />
      <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />

      {/* Legacy redirects */}
      <Route path="/scans" element={<Navigate to="/pentests" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const skeletonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  backgroundColor: 'var(--color-bg)',
};

const spinnerStyle = {
  width: '32px',
  height: '32px',
  border: '3px solid var(--color-border)',
  borderTopColor: 'var(--color-text-primary)',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite',
};

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div style={skeletonStyle}>
        <div style={spinnerStyle} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

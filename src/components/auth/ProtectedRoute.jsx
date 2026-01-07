import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useEffect, useState } from 'react';

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="auth-loading">
      <div className="auth-loading-spinner">
        <div className="spinner"></div>
      </div>
      <p>Loading...</p>
      <style>{`
        .auth-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: var(--bg-primary);
          color: var(--text-primary);
        }
        .auth-loading-spinner {
          margin-bottom: 1rem;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Protected route wrapper - requires authentication
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, initialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while checking auth
  if (!initialized || isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Public route wrapper - redirects to dashboard if already authenticated
export function PublicRoute({ children }) {
  const { isAuthenticated, initialized, initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while checking auth
  if (!initialized) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
}

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';

/**
 * ProtectedRoute - Guards routes that require authentication
 * Redirects to login if user is not authenticated
 * Preserves intended destination for redirect after login
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

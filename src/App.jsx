import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DashboardLayout } from './components/layout';
import { ProtectedRoute, PublicRoute } from './components/auth';
import { Login, Register, ForgotPassword, ResetPassword } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { Projects } from './pages/projects';
import { Team } from './pages/team';
import { Analytics } from './pages/analytics';
import { Billing, ProfileSettings } from './pages/settings';

// Placeholder pages for missing routes
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: 'rgba(255,255,255,0.6)' }}>This page is under construction.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
      <Routes>
        {/* Auth Routes - Public only */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/help" element={<PlaceholderPage title="Help Center" />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


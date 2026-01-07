import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { resetPassword, isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isSupabaseConfigured) {
      toast.error('Password reset not available - database not configured');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast.error(error.message || 'Failed to send reset email');
      } else {
        setSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (err) {
      toast.error('Failed to send reset email');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="auth-logo-text">SaaSify</span>
          </div>

          {sent ? (
            /* Success State */
            <div className="forgot-success">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h1 className="auth-title">Check Your Email</h1>
              <p className="auth-subtitle">
                We've sent a password reset link to <strong>{email}</strong>.
                Check your inbox and follow the instructions to reset your password.
              </p>
              <div className="forgot-actions">
                <Button variant="secondary" onClick={() => setSent(false)}>
                  Try another email
                </Button>
                <Link to="/login">
                  <Button>Back to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="auth-header">
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <Input
                  label="Email Address"
                  type="email"
                  icon={Mail}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" fullWidth loading={loading}>
                  Send Reset Link
                </Button>
              </form>

              <div className="auth-footer">
                <Link to="/login" className="auth-back-link">
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Decorative Background */}
        <div className="auth-decoration">
          <div className="auth-decoration-circle circle-1" />
          <div className="auth-decoration-circle circle-2" />
          <div className="auth-decoration-circle circle-3" />
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { updatePassword, supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      // Also handle the hash fragment from email links
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && accessToken) {
        // Set the session from the recovery token
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });

          if (sessionError) {
            setError('Invalid or expired reset link. Please request a new one.');
          }
        } catch (err) {
          setError('Failed to verify reset link. Please try again.');
        }
      } else if (!session && !accessToken) {
        setError('Invalid or expired reset link. Please request a new one.');
      }
    };

    checkSession();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await updatePassword(form.password);

      if (error) {
        toast.error(error.message || 'Failed to reset password');
      } else {
        setSuccess(true);
        toast.success('Password reset successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      toast.error('Failed to reset password');
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

          {error ? (
            /* Error State */
            <div className="reset-error">
              <div className="error-icon">
                <AlertCircle size={48} />
              </div>
              <h1 className="auth-title">Link Expired</h1>
              <p className="auth-subtitle">{error}</p>
              <Button onClick={() => navigate('/forgot-password')}>
                Request New Link
              </Button>
            </div>
          ) : success ? (
            /* Success State */
            <div className="reset-success">
              <div className="success-icon">
                <CheckCircle size={48} />
              </div>
              <h1 className="auth-title">Password Reset!</h1>
              <p className="auth-subtitle">
                Your password has been successfully reset. You will be redirected to the login page.
              </p>
              <Button onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="auth-header">
                <h1 className="auth-title">Set New Password</h1>
                <p className="auth-subtitle">
                  Enter your new password below. Make sure it's at least 6 characters.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="password-field">
                  <Input
                    label="New Password"
                    name="password"
                    type={showPasswords.new ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Enter new password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="password-field">
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Confirm new password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Reset Password
                </Button>
              </form>
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

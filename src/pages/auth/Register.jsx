import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Github, Sparkles } from 'lucide-react';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../stores';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      if (result.message) {
        // Email confirmation required (Supabase)
        toast.success(result.message);
        navigate('/login');
      } else {
        toast.success('Account created successfully!');
        navigate('/');
      }
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel - Branding */}
      <div className="auth-branding">
        <div className="auth-branding-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Sparkles size={32} />
            </div>
            <span className="auth-logo-text">SaaSify</span>
          </div>
          <h1 className="auth-branding-title">
            Start your <span className="gradient-text">free trial</span> today
          </h1>
          <p className="auth-branding-subtitle">
            No credit card required. Get started in minutes and upgrade anytime.
          </p>
          <div className="auth-branding-features">
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              <span>14-day free trial</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              <span>Cancel anytime</span>
            </div>
            <div className="auth-feature">
              <span className="auth-feature-icon">✓</span>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
        <div className="auth-branding-shapes">
          <div className="auth-shape auth-shape-1"></div>
          <div className="auth-shape auth-shape-2"></div>
          <div className="auth-shape auth-shape-3"></div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Create account</h2>
            <p className="auth-form-subtitle">
              Step {step} of 2 - {step === 1 ? 'Basic info' : 'Set password'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="auth-progress">
            <div className="auth-progress-bar" style={{ width: `${step * 50}%` }}></div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  icon={User}
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <Button type="button" fullWidth onClick={handleNext}>
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText="Must be at least 8 characters"
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />

                <label className={`auth-checkbox ${errors.agreeTerms ? 'auth-checkbox-error' : ''}`}>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <span className="auth-checkbox-mark"></span>
                  <span>
                    I agree to the{' '}
                    <Link to="/terms" className="auth-link">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                  </span>
                </label>

                <div className="auth-form-buttons">
                  <Button type="button" variant="secondary" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" loading={isLoading}>
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </form>

          {step === 1 && (
            <>
              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <div className="auth-social">
                <button className="auth-social-btn">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>
                <button className="auth-social-btn">
                  <Github size={20} />
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

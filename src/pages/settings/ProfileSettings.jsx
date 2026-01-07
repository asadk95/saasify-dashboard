import { useState, useEffect, useRef } from 'react';
import { Camera, Mail, User, Briefcase, Shield, Loader2, X, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input, Avatar } from '../../components/common';
import { useAuthStore } from '../../stores';
import { uploadAvatar, updatePassword, isSupabaseConfigured } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Settings.css';

export default function ProfileSettings() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    job_title: '',
    company: '',
    bio: '',
    avatar_url: null
  });

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        job_title: user.job_title || '',
        company: user.company || '',
        bio: user.bio || '',
        avatar_url: user.avatar || user.avatar_url || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    if (!isSupabaseConfigured || !user?.id) {
      toast.error('Cannot upload avatar - not connected to database');
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data, error } = await uploadAvatar(user.id, file);

      if (error) {
        toast.error(error.message || 'Failed to upload avatar');
      } else {
        setProfile(prev => ({ ...prev, avatar_url: data.avatar_url }));
        toast.success('Avatar updated successfully!');
      }
    } catch (err) {
      toast.error('Failed to upload avatar');
      console.error('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      name: profile.name,
      job_title: profile.job_title,
      company: profile.company,
      bio: profile.bio,
    });

    if (result.success) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }

    setLoading(false);
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!isSupabaseConfigured) {
      toast.error('Cannot change password - not connected to database');
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await updatePassword(passwordForm.newPassword);

      if (error) {
        toast.error(error.message || 'Failed to change password');
      } else {
        toast.success('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error('Failed to change password');
      console.error('Password change error:', err);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Profile Settings</h1>
          <p className="page-subtitle">Manage your personal information and preferences</p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Profile Form */}
        <Card className="settings-card">
          <h3 className="settings-section-title">Personal Information</h3>

          {/* Avatar with file upload */}
          <div className="settings-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <div className="avatar-wrapper">
              <Avatar src={profile.avatar_url} name={profile.name} size="2xl" />
              <div className="settings-avatar-overlay">
                {uploadingAvatar ? (
                  <Loader2 size={20} className="spin" />
                ) : (
                  <Camera size={20} />
                )}
              </div>
            </div>
            <div className="settings-avatar-info">
              <p className="settings-avatar-help">
                {uploadingAvatar ? 'Uploading...' : 'Click to upload a new photo'}
              </p>
              <p className="settings-avatar-formats">
                JPG, PNG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="settings-form-row">
              <Input
                label="Full Name"
                name="name"
                icon={User}
                value={profile.name}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                value={profile.email}
                onChange={handleChange}
                disabled
                helperText="Email cannot be changed"
              />
            </div>
            <div className="settings-form-row">
              <Input
                label="Job Title"
                name="job_title"
                icon={Briefcase}
                value={profile.job_title}
                onChange={handleChange}
                placeholder="e.g. Product Manager"
              />
              <Input
                label="Company"
                name="company"
                value={profile.company}
                onChange={handleChange}
                placeholder="e.g. Acme Inc."
              />
            </div>
            <div className="settings-form-actions">
              <Button variant="secondary" type="button">Cancel</Button>
              <Button type="submit" loading={loading || isLoading}>Save Changes</Button>
            </div>
          </form>
        </Card>

        {/* Security Section */}
        <Card className="settings-card">
          <h3 className="settings-section-title">Security</h3>

          <div className="settings-security-item">
            <div className="security-info">
              <Shield size={20} className="security-icon" />
              <div>
                <h4 className="security-title">Password</h4>
                <p className="security-description">Change your account password</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>

          <div className="settings-security-item">
            <div className="security-info">
              <Shield size={20} className="security-icon" />
              <div>
                <h4 className="security-title">Two-Factor Authentication</h4>
                <p className="security-description">Add an extra layer of security</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => toast('2FA coming soon!', { icon: '🔐' })}
            >
              Enable 2FA
            </Button>
          </div>
        </Card>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Change Password</h2>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="password-form">
                <div className="password-field">
                  <Input
                    label="New Password"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    icon={Lock}
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="Enter new password (min 6 characters)"
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
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    icon={Lock}
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <p className="password-requirements">
                Password must be at least 6 characters long.
              </p>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleChangePassword} loading={changingPassword}>
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

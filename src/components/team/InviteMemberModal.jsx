import { useState } from 'react';
import { Mail, User, Shield, X } from 'lucide-react';
import { Modal, Button, Input, Badge } from '../common';
import './InviteMemberModal.css';

const roles = [
  { id: 'admin', name: 'Admin', description: 'Full access to all features', icon: '⚙️' },
  { id: 'member', name: 'Member', description: 'Can edit and create content', icon: '👤' },
  { id: 'viewer', name: 'Viewer', description: 'View-only access', icon: '👁️' },
];

export default function InviteMemberModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);

  const handleAddEmail = () => {
    if (email && !emails.includes(email) && /\S+@\S+\.\S+/.test(email)) {
      setEmails([...emails, email]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleInvite = async () => {
    if (emails.length === 0) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onInvite?.({ emails, role: selectedRole });
    setLoading(false);
    setEmails([]);
    setEmail('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Members"
      size="md"
      footer={
        <div className="invite-modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            loading={loading}
            disabled={emails.length === 0}
          >
            Send {emails.length > 0 ? `${emails.length} ` : ''}Invite{emails.length !== 1 ? 's' : ''}
          </Button>
        </div>
      }
    >
      <div className="invite-modal-content">
        {/* Email Input */}
        <div className="invite-email-section">
          <label className="invite-label">Email Addresses</label>
          <div className="invite-email-input">
            <Input
              type="email"
              placeholder="Enter email address"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button variant="secondary" onClick={handleAddEmail}>
              Add
            </Button>
          </div>

          {/* Email Tags */}
          {emails.length > 0 && (
            <div className="invite-email-tags">
              {emails.map((e, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {e}
                  <button
                    className="email-tag-remove"
                    onClick={() => handleRemoveEmail(e)}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Role Selection */}
        <div className="invite-role-section">
          <label className="invite-label">
            <Shield size={14} />
            Select Role
          </label>
          <div className="invite-roles">
            {roles.map((role) => (
              <button
                key={role.id}
                className={`invite-role-option ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <span className="role-icon">{role.icon}</span>
                <div className="role-info">
                  <span className="role-name">{role.name}</span>
                  <span className="role-description">{role.description}</span>
                </div>
                <div className="role-check">
                  {selectedRole === role.id && '✓'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <p className="invite-info">
          Invited members will receive an email with a link to join your team.
        </p>
      </div>
    </Modal>
  );
}

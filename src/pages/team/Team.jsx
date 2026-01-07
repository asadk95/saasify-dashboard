import { useState } from 'react';
import {
  Plus,
  Search,
  UserPlus,
  Mail,
  Settings,
  Crown,
  Shield
} from 'lucide-react';
import { Button, Card, Badge, Avatar, Input } from '../../components/common';
import { useAuthStore } from '../../stores';
import toast from 'react-hot-toast';
import './Team.css';

// Role configurations
const roleConfig = {
  owner: { label: 'Owner', icon: Crown, color: 'warning' },
  admin: { label: 'Admin', icon: Shield, color: 'primary' },
  member: { label: 'Member', icon: null, color: 'secondary' },
  viewer: { label: 'Viewer', icon: null, color: 'default' },
};

export default function Team() {
  const { user } = useAuthStore();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Current user as the only team member
  const currentMember = {
    id: user?.id,
    name: user?.name || 'User',
    email: user?.email || '',
    avatar: user?.avatar_url || user?.avatar,
    role: 'owner',
    status: 'online',
    joinedDate: 'Account Owner',
    lastActive: 'Now',
    jobTitle: user?.job_title,
    company: user?.company,
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // For now, just show a message since team invites aren't implemented
    toast.success('Team invitations coming soon!');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const RoleIcon = roleConfig[currentMember.role]?.icon;

  return (
    <div className="team-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">Manage your team members and permissions</p>
        </div>
        <div className="page-header-right">
          <Button icon={UserPlus} onClick={() => setShowInviteModal(true)}>
            Invite Member
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="team-content">
        {/* Current User Card */}
        <Card className="team-member-card owner-card">
          <div className="member-card-header">
            <Avatar
              src={currentMember.avatar}
              name={currentMember.name}
              size="xl"
              status={currentMember.status}
            />
            <div className="member-info">
              <div className="member-name-row">
                <h3 className="member-name">{currentMember.name}</h3>
                <Badge variant={roleConfig[currentMember.role].color} size="sm">
                  {RoleIcon && <RoleIcon size={12} />}
                  {roleConfig[currentMember.role].label}
                </Badge>
              </div>
              <p className="member-email">{currentMember.email}</p>
              {currentMember.jobTitle && (
                <p className="member-title">{currentMember.jobTitle}{currentMember.company ? ` at ${currentMember.company}` : ''}</p>
              )}
            </div>
          </div>
          <div className="member-card-meta">
            <div className="meta-item">
              <span className="meta-label">Status</span>
              <Badge variant="success" dot size="sm">Online</Badge>
            </div>
            <div className="meta-item">
              <span className="meta-label">Role</span>
              <span className="meta-value">Account Owner</span>
            </div>
          </div>
        </Card>

        {/* Invite Section */}
        <Card className="team-invite-card">
          <div className="invite-content">
            <div className="invite-icon">
              <UserPlus size={48} />
            </div>
            <h3>Invite Team Members</h3>
            <p>Collaborate with your team by inviting them to join your workspace.</p>

            {showInviteModal ? (
              <div className="invite-form">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  icon={Mail}
                />
                <div className="invite-actions">
                  <Button variant="secondary" size="sm" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleInvite}>
                    Send Invite
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="secondary" icon={Plus} onClick={() => setShowInviteModal(true)}>
                Add Team Member
              </Button>
            )}

            <p className="invite-note">
              <Settings size={14} />
              Team features are coming soon! Stay tuned for updates.
            </p>
          </div>
        </Card>

        {/* Features Coming Soon */}
        <Card className="team-features-card">
          <h3>Team Features Coming Soon</h3>
          <ul className="features-list">
            <li>
              <Badge variant="primary" size="sm">Soon</Badge>
              <span>Invite unlimited team members</span>
            </li>
            <li>
              <Badge variant="primary" size="sm">Soon</Badge>
              <span>Role-based access control</span>
            </li>
            <li>
              <Badge variant="primary" size="sm">Soon</Badge>
              <span>Project-level permissions</span>
            </li>
            <li>
              <Badge variant="primary" size="sm">Soon</Badge>
              <span>Team activity tracking</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

import { MoreHorizontal, Mail, Shield, Calendar } from 'lucide-react';
import { Avatar, Badge, Button } from '../common';
import './MemberCard.css';

const roleColors = {
  owner: 'primary',
  admin: 'secondary',
  member: 'default',
  viewer: 'default'
};

const roleIcons = {
  owner: '👑',
  admin: '⚙️',
  member: '👤',
  viewer: '👁️'
};

export default function MemberCard({
  member,
  onEdit,
  onRemove,
  onViewProfile,
  showActions = true
}) {
  const {
    id,
    name,
    email,
    avatar,
    role = 'member',
    status = 'active',
    joinedDate,
    lastActive,
    projects = []
  } = member;

  const isOnline = status === 'online';

  return (
    <div className="member-card">
      <div className="member-card-header">
        <Avatar
          src={avatar}
          name={name}
          size="lg"
          status={isOnline ? 'online' : 'offline'}
        />
        {showActions && (
          <div className="member-card-menu">
            <button className="member-menu-btn">
              <MoreHorizontal size={16} />
            </button>
            <div className="member-menu-dropdown">
              <button onClick={() => onViewProfile?.(member)}>View Profile</button>
              <button onClick={() => onEdit?.(member)}>Edit Role</button>
              <button className="danger" onClick={() => onRemove?.(member)}>Remove</button>
            </div>
          </div>
        )}
      </div>

      <div className="member-card-body">
        <h3 className="member-name">{name}</h3>
        <p className="member-email">
          <Mail size={12} />
          {email}
        </p>

        <div className="member-role">
          <Badge variant={roleColors[role]} size="sm">
            <span className="role-icon">{roleIcons[role]}</span>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="member-card-footer">
        <div className="member-stat">
          <Shield size={14} />
          <span>{projects.length} projects</span>
        </div>
        <div className="member-stat">
          <Calendar size={14} />
          <span>Joined {joinedDate}</span>
        </div>
      </div>

      <div className={`member-status-bar ${isOnline ? 'online' : ''}`} />
    </div>
  );
}

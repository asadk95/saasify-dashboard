import Avatar from '../common/Avatar';
import './PresenceIndicator.css';

export default function PresenceIndicator({ users = [], maxDisplay = 5 }) {
  const displayUsers = users.slice(0, maxDisplay);
  const remaining = users.length - maxDisplay;
  const onlineCount = users.filter(u => u.status === 'online').length;

  return (
    <div className="presence-indicator">
      <div className="presence-avatars">
        {displayUsers.map((user, index) => (
          <div
            key={user.id}
            className="presence-avatar"
            style={{ zIndex: displayUsers.length - index }}
          >
            <Avatar
              src={user.avatar}
              name={user.name}
              size="sm"
              status={user.status}
            />
          </div>
        ))}
        {remaining > 0 && (
          <div className="presence-avatar presence-more">
            <span>+{remaining}</span>
          </div>
        )}
      </div>
      <div className="presence-info">
        <span className="presence-count">{onlineCount} online</span>
        <span className="presence-dot" />
      </div>
    </div>
  );
}

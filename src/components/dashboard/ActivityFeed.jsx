import Avatar from '../common/Avatar';
import './ActivityFeed.css';

export default function ActivityFeed({ activities = [], limit = 5 }) {
  const displayActivities = activities.slice(0, limit);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project':
        return '📁';
      case 'subscription':
        return '💳';
      case 'team':
        return '👥';
      case 'settings':
        return '⚙️';
      default:
        return '✨';
    }
  };

  return (
    <div className="activity-feed">
      {displayActivities.length > 0 ? (
        <div className="activity-list">
          {displayActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-avatar">
                {activity.user ? (
                  <Avatar
                    src={activity.user.avatar}
                    name={activity.user.name}
                    size="sm"
                  />
                ) : (
                  <span className="activity-icon">{getActivityIcon(activity.type)}</span>
                )}
              </div>
              <div className="activity-content">
                <p className="activity-text">
                  {activity.user && (
                    <span className="activity-user">{activity.user.name}</span>
                  )}
                  {' '}{activity.action}
                  {activity.target && (
                    <span className="activity-target"> {activity.target}</span>
                  )}
                </p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="activity-empty">
          <span className="activity-empty-icon">📭</span>
          <p>No recent activity</p>
        </div>
      )}
    </div>
  );
}

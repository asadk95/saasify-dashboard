import { Calendar, MessageSquare, Paperclip, Clock } from 'lucide-react';
import { Avatar, AvatarGroup, Badge } from '../common';
import './TaskCard.css';

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  urgent: 'error'
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent'
};

// Helper function to get due date status
function getDueDateStatus(dueDate) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return 'future';
}

// Format due date nicely
function formatDueDate(dueDate) {
  if (!dueDate) return null;

  const status = getDueDateStatus(dueDate);
  const date = new Date(dueDate);

  if (status === 'today') return 'Today';
  if (status === 'overdue') {
    const today = new Date();
    const diffDays = Math.ceil((today - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskCard({
  task,
  onDragStart,
  onDragEnd,
  onClick
}) {
  const {
    id,
    title,
    description,
    priority = 'medium',
    due_date,
    assignees = [],
    tags = [],
    commentsCount = 0,
    attachmentsCount = 0,
    cover
  } = task;

  const dueStatus = getDueDateStatus(due_date);
  const formattedDue = formatDueDate(due_date);

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart?.(e, task)}
      onDragEnd={onDragEnd}
      onClick={onClick}
    >
      {cover && (
        <div className="task-cover" style={{ backgroundImage: `url(${cover})` }} />
      )}

      <div className="task-content">
        {/* Tags & Priority */}
        <div className="task-meta">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="primary" size="sm">
              {tag}
            </Badge>
          ))}
          {priority && (
            <Badge variant={priorityColors[priority]} size="sm">
              {priorityLabels[priority]}
            </Badge>
          )}
        </div>

        {/* Title */}
        <h4 className="task-title">{title}</h4>

        {/* Description preview */}
        {description && (
          <p className="task-description">{description}</p>
        )}

        {/* Footer */}
        <div className="task-footer">
          <div className="task-info">
            {due_date && (
              <span className={`task-due ${dueStatus}`}>
                {dueStatus === 'today' ? <Clock size={12} /> : <Calendar size={12} />}
                {formattedDue}
              </span>
            )}
            {commentsCount > 0 && (
              <span className="task-stat">
                <MessageSquare size={12} />
                {commentsCount}
              </span>
            )}
            {attachmentsCount > 0 && (
              <span className="task-stat">
                <Paperclip size={12} />
                {attachmentsCount}
              </span>
            )}
          </div>

          {assignees.length > 0 && (
            <AvatarGroup size="xs" max={3}>
              {assignees.map((assignee) => (
                <Avatar
                  key={assignee.id}
                  src={assignee.avatar}
                  name={assignee.name}
                  size="xs"
                />
              ))}
            </AvatarGroup>
          )}
        </div>
      </div>
    </div>
  );
}

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

  const isOverdue = due_date && new Date(due_date) < new Date();

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
              <span className={`task-due ${isOverdue ? 'overdue' : ''}`}>
                <Calendar size={12} />
                {new Date(due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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

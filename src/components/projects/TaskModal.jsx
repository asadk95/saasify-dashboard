import { useState } from 'react';
import { X, Calendar, Users, Tag, Flag, Paperclip, MessageSquare } from 'lucide-react';
import { Modal, Button, Input, Avatar, Badge, ConfirmModal } from '../common';
import toast from 'react-hot-toast';
import './TaskModal.css';

export default function TaskModal({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  mode = 'view' // 'view', 'edit', 'create'
}) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    due_date: task?.due_date || '',
    status: task?.status || 'todo',
    tags: task?.tags || [],
  });

  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(task?.id);
    toast.success('Task deleted successfully');
    setShowDeleteConfirm(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert empty due_date to null for database compatibility
    const dataToSave = {
      ...task,
      ...formData,
      due_date: formData.due_date || null,
    };
    onSave?.(dataToSave);
    onClose();
  };

  const isViewMode = mode === 'view';

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={mode === 'create' ? 'Create Task' : isViewMode ? task?.title : 'Edit Task'}
        size="lg"
        footer={
          isViewMode ? (
            <div className="task-modal-footer">
              <Button variant="danger" onClick={handleDeleteClick}>
                Delete Task
              </Button>
              <div className="task-modal-footer-right">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="task-modal-footer">
              {mode === 'edit' && (
                <Button variant="danger" onClick={handleDeleteClick}>
                  Delete Task
                </Button>
              )}
              <div className="task-modal-footer-right">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {mode === 'create' ? 'Create Task' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )
        }
      >
        <form className="task-modal-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="task-modal-section">
            {isViewMode ? (
              <h2 className="task-modal-title">{task?.title}</h2>
            ) : (
              <Input
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                required
              />
            )}
          </div>

          {/* Description */}
          <div className="task-modal-section">
            <label className="task-modal-label">Description</label>
            {isViewMode ? (
              <p className="task-modal-description">
                {task?.description || 'No description provided'}
              </p>
            ) : (
              <textarea
                name="description"
                className="task-modal-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add a description..."
                rows={4}
              />
            )}
          </div>

          {/* Properties Grid */}
          <div className="task-modal-properties">
            {/* Status */}
            <div className="task-modal-property">
              <span className="property-label">
                <Flag size={14} /> Status
              </span>
              {isViewMode ? (
                <Badge variant="primary">{task?.status}</Badge>
              ) : (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="property-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="done">Done</option>
                </select>
              )}
            </div>

            {/* Priority */}
            <div className="task-modal-property">
              <span className="property-label">
                <Flag size={14} /> Priority
              </span>
              {isViewMode ? (
                <Badge variant={task?.priority === 'high' ? 'error' : 'warning'}>
                  {task?.priority}
                </Badge>
              ) : (
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="property-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              )}
            </div>

            {/* Due Date */}
            <div className="task-modal-property">
              <span className="property-label">
                <Calendar size={14} /> Due Date
              </span>
              {isViewMode ? (
                <span className="property-value">
                  {task?.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : 'Not set'}
                </span>
              ) : (
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="property-input"
                />
              )}
            </div>

            {/* Assignees */}
            <div className="task-modal-property">
              <span className="property-label">
                <Users size={14} /> Assignees
              </span>
              <div className="property-assignees">
                {task?.assignees?.map((assignee) => (
                  <Avatar
                    key={assignee.id}
                    src={assignee.avatar}
                    name={assignee.name}
                    size="xs"
                  />
                ))}
                {(!task?.assignees || task.assignees.length === 0) && (
                  <span className="property-value">Unassigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="task-modal-section">
            <label className="task-modal-label">
              <Tag size={14} /> Tags
            </label>
            <div className="task-modal-tags">
              {(isViewMode ? task?.tags : formData.tags)?.map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {tag}
                  {!isViewMode && (
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X size={10} />
                    </button>
                  )}
                </Badge>
              ))}
              {!isViewMode && (
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag..."
                    className="tag-input"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Activity (View Mode Only) */}
          {isViewMode && (
            <div className="task-modal-section">
              <label className="task-modal-label">
                <MessageSquare size={14} /> Activity
              </label>
              <div className="task-modal-activity">
                <p className="activity-empty">No comments yet</p>
              </div>
            </div>
          )}
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}

import { useState } from 'react';
import { Folder, Palette, FileText, X } from 'lucide-react';
import { Modal, Button, Input } from '../common';
import { useProjectStore } from '../../stores';
import toast from 'react-hot-toast';
import './CreateProjectModal.css';

const colorOptions = [
  '#6366f1', // Primary purple
  '#8b5cf6', // Secondary purple
  '#06b6d4', // Cyan
  '#22c55e', // Green
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#14b8a6', // Teal
];

export default function CreateProjectModal({ isOpen, onClose }) {
  const { addProject, isLoading } = useProjectStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: colorOptions[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    const result = await addProject(formData);

    if (result.success) {
      toast.success(`Project "${formData.name}" created!`);
      setFormData({ name: '', description: '', color: colorOptions[0] });
      onClose();
    } else {
      toast.error('Failed to create project');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      size="md"
    >
      <form onSubmit={handleSubmit} className="create-project-form">
        <div className="form-group">
          <Input
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            icon={Folder}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FileText size={14} />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief project description..."
            className="form-textarea"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Palette size={14} />
            Color Theme
          </label>
          <div className="color-picker">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}

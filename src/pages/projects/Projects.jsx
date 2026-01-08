import { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  Search,
  Grid3X3,
  List,
  ChevronDown,
  FolderKanban,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, Avatar, AvatarGroup } from '../../components/common';
import { KanbanBoard, TaskModal, CreateProjectModal } from '../../components/projects';
import { useProjectStore, useTaskStore } from '../../stores';
import toast from 'react-hot-toast';
import './Projects.css';

// Mock projects data
const projectsData = [
  {
    id: 1,
    name: 'Marketing Campaign',
    color: '#6366f1',
    tasksCount: 24,
    completedCount: 16,
    members: [
      { id: 1, name: 'Sarah Chen', avatar: null },
      { id: 2, name: 'Mike Johnson', avatar: null },
      { id: 3, name: 'Emily Davis', avatar: null },
    ]
  },
  {
    id: 2,
    name: 'Website Redesign',
    color: '#8b5cf6',
    tasksCount: 18,
    completedCount: 7,
    members: [
      { id: 2, name: 'Mike Johnson', avatar: null },
      { id: 4, name: 'Alex Turner', avatar: null },
    ]
  },
  {
    id: 3,
    name: 'Mobile App v2',
    color: '#06b6d4',
    tasksCount: 32,
    completedCount: 8,
    members: [
      { id: 1, name: 'Sarah Chen', avatar: null },
      { id: 5, name: 'Lisa Wang', avatar: null },
      { id: 4, name: 'Alex Turner', avatar: null },
      { id: 3, name: 'Emily Davis', avatar: null },
    ]
  },
];

// Mock tasks data
const initialTasks = [
  {
    id: 1,
    title: 'Design new landing page',
    description: 'Create a modern landing page design with hero section and features.',
    status: 'todo',
    priority: 'high',
    tags: ['Design', 'UI'],
    dueDate: '2026-01-15',
    assignees: [{ id: 1, name: 'Sarah Chen', avatar: null }],
    commentsCount: 3,
    attachmentsCount: 2,
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Set up JWT authentication with refresh tokens.',
    status: 'in-progress',
    priority: 'high',
    tags: ['Backend', 'Security'],
    dueDate: '2026-01-12',
    assignees: [
      { id: 2, name: 'Mike Johnson', avatar: null },
      { id: 4, name: 'Alex Turner', avatar: null }
    ],
    commentsCount: 5,
    attachmentsCount: 0,
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all REST endpoints with examples.',
    status: 'in-progress',
    priority: 'medium',
    tags: ['Documentation'],
    dueDate: '2026-01-18',
    assignees: [{ id: 3, name: 'Emily Davis', avatar: null }],
    commentsCount: 1,
    attachmentsCount: 1,
  },
  {
    id: 4,
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated deployment.',
    status: 'review',
    priority: 'medium',
    tags: ['DevOps'],
    dueDate: '2026-01-10',
    assignees: [{ id: 4, name: 'Alex Turner', avatar: null }],
    commentsCount: 2,
    attachmentsCount: 0,
  },
  {
    id: 5,
    title: 'Optimize database queries',
    description: 'Improve query performance for dashboard analytics.',
    status: 'done',
    priority: 'low',
    tags: ['Backend', 'Performance'],
    dueDate: '2026-01-05',
    assignees: [{ id: 2, name: 'Mike Johnson', avatar: null }],
    commentsCount: 4,
    attachmentsCount: 1,
  },
  {
    id: 6,
    title: 'Create email templates',
    description: 'Design responsive email templates for notifications.',
    status: 'todo',
    priority: 'low',
    tags: ['Design', 'Email'],
    dueDate: '2026-01-20',
    assignees: [{ id: 1, name: 'Sarah Chen', avatar: null }],
    commentsCount: 0,
    attachmentsCount: 0,
  },
  {
    id: 7,
    title: 'Mobile responsive fixes',
    description: 'Fix layout issues on mobile devices.',
    status: 'todo',
    priority: 'medium',
    tags: ['Frontend', 'Bug'],
    dueDate: '2026-01-14',
    assignees: [{ id: 5, name: 'Lisa Wang', avatar: null }],
    commentsCount: 2,
    attachmentsCount: 0,
  },
];

export default function Projects() {
  const { projects, currentProject, fetchProjects, setCurrentProject, isLoading } = useProjectStore();
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, moveTask, isLoading: tasksLoading } = useTaskStore();
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch tasks when current project changes
  useEffect(() => {
    if (currentProject?.id) {
      fetchTasks(currentProject.id);
    }
  }, [currentProject?.id, fetchTasks]);

  const handleTaskMove = async (taskId, newStatus) => {
    const result = await moveTask(taskId, newStatus);
    if (!result.success) {
      toast.error('Failed to move task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setModalMode('view');
    setShowTaskModal(true);
  };

  const handleAddTask = (columnId) => {
    setSelectedTask({ status: columnId });
    setModalMode('create');
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    if (modalMode === 'create') {
      const result = await addTask({
        ...taskData,
        project_id: currentProject?.id,
      });
      if (result.success) {
        toast.success('Task created successfully');
      } else {
        toast.error(result.error || 'Failed to create task');
      }
    } else {
      const result = await updateTask(taskData.id, taskData);
      if (result.success) {
        toast.success('Task updated successfully');
      } else {
        toast.error(result.error || 'Failed to update task');
      }
    }
    setShowTaskModal(false);
  };

  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      toast.success('Task deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete task');
    }
    setShowTaskModal(false);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">Manage your projects and track progress</p>
        </div>
        <div className="page-header-right">
          <Button icon={Plus} onClick={() => setShowCreateProject(true)}>New Project</Button>
        </div>
      </div>

      {/* Project Tabs */}
      <div className="projects-tabs">
        {projects.length === 0 && !isLoading ? (
          <p className="no-projects-text">No projects yet. Create your first project!</p>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              className={`project-tab ${currentProject?.id === project.id ? 'active' : ''}`}
              onClick={() => setCurrentProject(project)}
            >
              <span
                className="project-tab-indicator"
                style={{ background: project.color || '#6366f1' }}
              />
              <span className="project-tab-name">{project.name}</span>
            </button>
          ))
        )}
        <button className="project-tab project-tab-add" onClick={() => setShowCreateProject(true)}>
          <Plus size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="projects-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <Search size={16} className="toolbar-search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" icon={Filter}>
            Filter
          </Button>
        </div>
        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
          {currentProject?.members && currentProject.members.length > 0 && (
            <AvatarGroup size="sm" max={4}>
              {currentProject.members.map((member) => (
                <Avatar key={member.id} name={member.name} size="sm" />
              ))}
            </AvatarGroup>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'board' && (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
          onAddTask={handleAddTask}
        />
      )}

      {/* List View (simplified) */}
      {viewMode === 'list' && (
        <Card className="projects-list-view">
          <div className="list-header">
            <span>Task</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Due Date</span>
            <span>Assignees</span>
          </div>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="list-row"
              onClick={() => handleTaskClick(task)}
            >
              <span className="list-task-title">{task.title}</span>
              <Badge variant="primary" size="sm">{task.status}</Badge>
              <Badge
                variant={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                size="sm"
              >
                {task.priority}
              </Badge>
              <span className="list-due-date">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
              </span>
              <AvatarGroup size="xs" max={2}>
                {task.assignees.map((a) => (
                  <Avatar key={a.id} name={a.name} size="xs" />
                ))}
              </AvatarGroup>
            </div>
          ))}
        </Card>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        task={selectedTask}
        mode={modalMode}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
      />
    </div>
  );
}

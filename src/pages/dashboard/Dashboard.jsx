import { useEffect } from 'react';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button, Card, Avatar, AvatarGroup, Badge } from '../../components/common';
import { StatsCard, AreaChart, ActivityFeed } from '../../components/dashboard';
import { useProjectStore, useTaskStore, useAuthStore } from '../../stores';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  // Fetch projects on mount
  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user?.id, fetchProjects]);

  // Calculate real stats
  const projectCount = projects.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const totalTasks = tasks.length;

  // Stats data - using real data where available
  const statsData = [
    {
      title: 'Total Projects',
      value: projectCount.toString(),
      change: null,
      changeLabel: 'active projects',
      icon: FolderKanban,
      iconColor: 'primary'
    },
    {
      title: 'Total Tasks',
      value: totalTasks.toString(),
      change: null,
      changeLabel: 'across all projects',
      icon: CheckSquare,
      iconColor: 'accent'
    },
    {
      title: 'Completed',
      value: completedTasks.toString(),
      change: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      changeLabel: '% completion rate',
      icon: TrendingUp,
      iconColor: 'success'
    },
    {
      title: 'Pending',
      value: pendingTasks.toString(),
      change: null,
      changeLabel: 'tasks to complete',
      icon: Clock,
      iconColor: 'warning'
    },
  ];

  // Build activity feed from recent projects and tasks
  const activities = [
    ...projects.slice(0, 3).map(project => ({
      id: `project-${project.id}`,
      user: { name: user?.name || 'You', avatar: user?.avatar_url },
      action: 'created project',
      target: project.name,
      type: 'project',
      time: new Date(project.created_at).toLocaleDateString()
    })),
    ...tasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      user: { name: user?.name || 'You', avatar: user?.avatar_url },
      action: 'added task',
      target: task.title,
      type: 'task',
      time: new Date(task.created_at).toLocaleDateString()
    }))
  ].slice(0, 5);

  // Recent projects (real data)
  const recentProjects = projects.slice(0, 3).map(project => ({
    id: project.id,
    name: project.name,
    status: 'active',
    progress: 0, // We'd need to calculate based on tasks
    members: 1,
    color: project.color
  }));

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name || 'User'}! Here's your project overview.</p>
        </div>
        <div className="page-header-right">
          <Button icon={Plus} onClick={() => navigate('/projects')}>New Project</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 dashboard-stats">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeLabel={stat.changeLabel}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Chart Card - Placeholder for now */}
        <Card className="dashboard-chart-card">
          <div className="card-header-custom">
            <div>
              <h3 className="card-title-custom">Project Activity</h3>
              <p className="card-subtitle-custom">Your project creation over time</p>
            </div>
          </div>
          {projects.length > 0 ? (
            <AreaChart
              data={[
                { name: 'Projects', value: projects.length },
                { name: 'Tasks', value: tasks.length },
                { name: 'Completed', value: completedTasks },
              ]}
              height={280}
            />
          ) : (
            <div className="empty-chart">
              <FolderKanban size={48} className="empty-icon" />
              <p>Create projects to see your activity chart</p>
              <Button size="sm" onClick={() => navigate('/projects')}>Create Project</Button>
            </div>
          )}
        </Card>

        {/* Activity Feed */}
        <Card className="dashboard-activity-card">
          <div className="card-header-custom">
            <h3 className="card-title-custom">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>View all</Button>
          </div>
          {activities.length > 0 ? (
            <ActivityFeed activities={activities} />
          ) : (
            <div className="empty-activity">
              <Clock size={32} className="empty-icon" />
              <p>No recent activity</p>
              <span className="empty-hint">Start by creating a project</span>
            </div>
          )}
        </Card>
      </div>

      {/* Projects & Team Section */}
      <div className="dashboard-bottom-grid">
        {/* Recent Projects */}
        <Card className="dashboard-projects-card">
          <div className="card-header-custom">
            <h3 className="card-title-custom">Recent Projects</h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/projects')}>
              View all
            </Button>
          </div>
          {recentProjects.length > 0 ? (
            <div className="projects-list">
              {recentProjects.map((project) => (
                <div key={project.id} className="project-item" onClick={() => navigate('/projects')}>
                  <div className="project-info">
                    <div className="project-color" style={{ backgroundColor: project.color || '#6366f1' }} />
                    <h4 className="project-name">{project.name}</h4>
                    <Badge variant="success" size="sm">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="project-meta">
                    <Avatar name={user?.name || 'You'} src={user?.avatar_url} size="xs" />
                    <span className="project-members">1 member</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-projects">
              <FolderKanban size={32} className="empty-icon" />
              <p>No projects yet</p>
              <Button size="sm" onClick={() => navigate('/projects')}>Create your first project</Button>
            </div>
          )}
        </Card>

        {/* Current User Card */}
        <Card className="dashboard-team-card">
          <div className="card-header-custom">
            <h3 className="card-title-custom">Your Account</h3>
            <Badge variant="success" dot>Online</Badge>
          </div>
          <div className="team-list">
            <div className="team-member">
              <Avatar
                src={user?.avatar_url || user?.avatar}
                name={user?.name || 'User'}
                size="md"
                status="online"
              />
              <div className="team-member-info">
                <span className="team-member-name">{user?.name || 'User'}</span>
                <span className="team-member-role">{user?.job_title || user?.role || 'Owner'}</span>
              </div>
            </div>
            <div className="team-stats">
              <div className="team-stat">
                <span className="team-stat-value">{projectCount}</span>
                <span className="team-stat-label">Projects</span>
              </div>
              <div className="team-stat">
                <span className="team-stat-value">{totalTasks}</span>
                <span className="team-stat-label">Tasks</span>
              </div>
              <div className="team-stat">
                <span className="team-stat-value">{user?.plan || 'Starter'}</span>
                <span className="team-stat-label">Plan</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

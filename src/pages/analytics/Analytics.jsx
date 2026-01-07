import { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  FolderKanban,
  CheckSquare,
  Clock,
  BarChart3
} from 'lucide-react';
import { Button, Card, Badge } from '../../components/common';
import { AreaChart } from '../../components/dashboard';
import { BarChart, DonutChart } from '../../components/analytics';
import { useProjectStore, useTaskStore, useAuthStore } from '../../stores';
import './Analytics.css';

export default function Analytics() {
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();

  // Calculate real metrics
  const projectCount = projects.length;
  const taskCount = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const completionRate = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  // Real metrics based on actual data
  const metrics = [
    {
      label: 'Total Projects',
      value: projectCount.toString(),
      change: null,
      icon: FolderKanban,
      color: 'primary'
    },
    {
      label: 'Total Tasks',
      value: taskCount.toString(),
      change: null,
      icon: CheckSquare,
      color: 'accent'
    },
    {
      label: 'Completed',
      value: completedTasks.toString(),
      change: completionRate,
      icon: TrendingUp,
      color: 'success'
    },
    {
      label: 'In Progress',
      value: inProgressTasks.toString(),
      change: null,
      icon: Clock,
      color: 'warning'
    },
  ];

  // Task status distribution for donut chart
  const taskStatusData = [
    { name: 'To Do', value: todoTasks || 0 },
    { name: 'In Progress', value: inProgressTasks || 0 },
    { name: 'Completed', value: completedTasks || 0 },
  ].filter(item => item.value > 0);

  // Projects by task count for bar chart
  const projectTaskData = projects.slice(0, 5).map(project => {
    const projectTasks = tasks.filter(t => t.project_id === project.id);
    return {
      name: project.name?.substring(0, 15) || 'Project',
      value: projectTasks.length
    };
  });

  // Activity over time (simplified - just show current counts)
  const activityData = [
    { name: 'Projects', value: projectCount },
    { name: 'Tasks', value: taskCount },
    { name: 'Completed', value: completedTasks },
  ];

  const hasData = projectCount > 0 || taskCount > 0;

  return (
    <div className="analytics-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Track your project progress and productivity</p>
        </div>
        <div className="page-header-right">
          <Button variant="secondary" icon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="analytics-metrics">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="analytics-metric-card">
              <div className="metric-icon-wrapper" data-color={metric.color}>
                <Icon size={20} />
              </div>
              <div className="metric-content">
                <span className="metric-label">{metric.label}</span>
                <div className="metric-row">
                  <span className="metric-value">{metric.value}</span>
                  {metric.change !== null && (
                    <span className="metric-change positive">
                      <TrendingUp size={14} />
                      {metric.change}%
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {hasData ? (
        <>
          {/* Charts Row 1 */}
          <div className="analytics-charts-row">
            <Card className="analytics-chart-card analytics-chart-large">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Project Overview</h3>
                  <p className="chart-subtitle">Your projects and tasks at a glance</p>
                </div>
                <Badge variant="success">{completionRate}% completion</Badge>
              </div>
              <AreaChart data={activityData} height={280} />
            </Card>

            <Card className="analytics-chart-card">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Task Status</h3>
                  <p className="chart-subtitle">Distribution by status</p>
                </div>
              </div>
              {taskStatusData.length > 0 ? (
                <DonutChart
                  data={taskStatusData}
                  height={280}
                  innerRadius={50}
                  outerRadius={90}
                />
              ) : (
                <div className="empty-chart-state">
                  <CheckSquare size={48} className="empty-icon" />
                  <p>No tasks yet</p>
                </div>
              )}
            </Card>
          </div>

          {/* Charts Row 2 */}
          {projectTaskData.length > 0 && (
            <div className="analytics-charts-row">
              <Card className="analytics-chart-card analytics-chart-full">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Tasks by Project</h3>
                    <p className="chart-subtitle">Task distribution across projects</p>
                  </div>
                </div>
                <BarChart
                  data={projectTaskData}
                  layout="vertical"
                  height={250}
                />
              </Card>
            </div>
          )}

          {/* Quick Stats */}
          <div className="analytics-quick-stats">
            <Card className="quick-stat-card">
              <h4>Completion Rate</h4>
              <span className="quick-stat-value">{completionRate}%</span>
              <span className="quick-stat-label">tasks completed</span>
            </Card>
            <Card className="quick-stat-card">
              <h4>Pending Tasks</h4>
              <span className="quick-stat-value">{todoTasks + inProgressTasks}</span>
              <span className="quick-stat-label">tasks remaining</span>
            </Card>
            <Card className="quick-stat-card">
              <h4>Active Projects</h4>
              <span className="quick-stat-value">{projectCount}</span>
              <span className="quick-stat-label">projects created</span>
            </Card>
            <Card className="quick-stat-card">
              <h4>Your Plan</h4>
              <span className="quick-stat-value">{user?.plan || 'Starter'}</span>
              <span className="quick-stat-label">current plan</span>
            </Card>
          </div>
        </>
      ) : (
        /* Empty State */
        <Card className="analytics-empty-state">
          <div className="empty-content">
            <BarChart3 size={64} className="empty-icon" />
            <h3>No Analytics Data Yet</h3>
            <p>Start by creating projects and tasks to see your productivity analytics here.</p>
            <Button onClick={() => window.location.href = '/projects'}>
              Create Your First Project
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

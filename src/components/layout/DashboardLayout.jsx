import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore } from '../../stores';
import './DashboardLayout.css';

// Mock notifications (can be replaced with real data later)
const mockNotifications = [
  { id: 1, message: 'New team member joined your workspace', time: '2 min ago', read: false },
  { id: 2, message: 'Project "Marketing" was updated', time: '1 hour ago', read: false },
  { id: 3, message: 'Your subscription renews in 5 days', time: '3 hours ago', read: true },
];

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('dark');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Background Effects */}
      <div className="app-background" />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
      />

      {/* Main Content */}
      <div className="main-content">
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          theme={theme}
          onThemeToggle={toggleTheme}
          notifications={mockNotifications}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { OnboardingTour } from '../onboarding';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Load theme from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'sidebar-mobile-open' : ''}`} data-theme={theme}>
      {/* Onboarding Tour */}
      <OnboardingTour theme={theme} />

      {/* Background Effects */}
      <div className="app-background" />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        user={user}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
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


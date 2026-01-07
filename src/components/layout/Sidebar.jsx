import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import Avatar from '../common/Avatar';
import './Sidebar.css';

const mainNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FolderKanban, label: 'Projects', path: '/projects' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
];

const bottomNavItems = [
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

export default function Sidebar({ collapsed, onToggle, user, isOpen, onClose }) {
  const location = useLocation();

  // Close sidebar when navigating on mobile
  const handleNavClick = () => {
    if (isOpen && onClose) {
      onClose();
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={24} />
          </div>
          {!collapsed && <span className="sidebar-logo-text">SaaSify</span>}
        </div>

        {/* Desktop collapse toggle */}
        <button
          className="sidebar-toggle desktop-only"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Mobile close button */}
        <button
          className="sidebar-close mobile-only"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {mainNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={handleNavClick}
              >
                <item.icon className="sidebar-nav-icon" size={20} />
                {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <ul className="sidebar-nav-list">
          {bottomNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={handleNavClick}
              >
                <item.icon className="sidebar-nav-icon" size={20} />
                {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Profile */}
        {user && (
          <div className="sidebar-user">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="sm"
              status="online"
            />
            {!collapsed && (
              <div className="sidebar-user-info">
                <span className="sidebar-user-name">{user.name}</span>
                <span className="sidebar-user-email">{user.email}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { useAuthStore } from '../../stores';
import toast from 'react-hot-toast';
import './Header.css';

export default function Header({
  onMenuClick,
  theme,
  onThemeToggle,
  notifications = []
}) {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setShowUserMenu(false);
    navigate('/settings/profile');
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setShowUserMenu(false);
    navigate('/settings');
  };

  // Default user for display
  const displayUser = user || { name: 'John Doe', email: 'john@example.com' };

  return (
    <header className="header">
      {/* Left Section */}
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="header-search">
          <Search className="header-search-icon" size={18} />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="header-search-kbd">⌘K</kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={onThemeToggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="header-dropdown" ref={notificationsRef}>
          <button
            className="header-icon-btn header-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="header-notifications-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="header-dropdown-menu header-notifications-menu">
              <div className="header-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && <Badge variant="primary" size="sm">{unreadCount} new</Badge>}
              </div>
              <div className="header-notifications-list">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`header-notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="header-notification-icon">
                        <Sparkles size={16} />
                      </div>
                      <div className="header-notification-content">
                        <p className="header-notification-text">{notification.message}</p>
                        <span className="header-notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="header-notifications-empty">
                    <Bell size={32} />
                    <p>No notifications</p>
                  </div>
                )}
              </div>
              <div className="header-dropdown-footer">
                <button className="header-dropdown-link">View all notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="header-dropdown" ref={userMenuRef}>
          <button
            className="header-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <Avatar src={displayUser?.avatar} name={displayUser?.name} size="sm" status="online" />
            <span className="header-user-name">{displayUser?.name}</span>
            <ChevronDown size={16} className={`header-user-chevron ${showUserMenu ? 'rotate' : ''}`} />
          </button>

          {showUserMenu && (
            <div className="header-dropdown-menu header-user-menu">
              <div className="header-user-info">
                <Avatar src={displayUser?.avatar} name={displayUser?.name} size="lg" />
                <div>
                  <p className="header-user-info-name">{displayUser?.name}</p>
                  <p className="header-user-info-email">{displayUser?.email}</p>
                </div>
              </div>
              <div className="header-dropdown-divider" />
              <nav className="header-user-nav">
                <a href="/settings/profile" className="header-user-nav-item" onClick={handleProfileClick}>
                  <User size={16} />
                  <span>Profile</span>
                </a>
                <a href="/settings" className="header-user-nav-item" onClick={handleSettingsClick}>
                  <Settings size={16} />
                  <span>Settings</span>
                </a>
              </nav>
              <div className="header-dropdown-divider" />
              <button className="header-user-nav-item header-logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

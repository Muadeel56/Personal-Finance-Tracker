import React from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { NAV_GROUPS } from './navConfig';

export const Brand = ({ showText = true }) => (
  <div className="sidebar-brand-inner">
    <div className="sidebar-logo">
      <SparklesIcon className="h-5 w-5" />
    </div>
    {showText && (
      <div className="sidebar-title-wrap">
        <span className="sidebar-title">Finance Tracker</span>
        <span className="sidebar-title-sub">Personal Finance</span>
      </div>
    )}
  </div>
);

export const NavLink = ({ name, path, Icon, active, iconOnly, onClick }) => (
  <Link
    to={path}
    title={iconOnly ? name : undefined}
    aria-label={iconOnly ? name : undefined}
    className={`sidebar-link${active ? ' active' : ''}`}
    onClick={onClick}
  >
    <span className="sidebar-link-icon">
      <Icon className="h-5 w-5" />
    </span>
    <span className="sidebar-link-label">{name}</span>
  </Link>
);

export const NavGroups = ({ isActive, iconOnly, onNavigate }) => (
  <>
    {NAV_GROUPS.map((group) => (
      <div key={group.label} className="sidebar-group">
        <div className="sidebar-group-label">{group.label}</div>
        {group.items.map(({ name, path, Icon }) => (
          <NavLink
            key={path}
            name={name}
            path={path}
            Icon={Icon}
            active={isActive(path)}
            iconOnly={iconOnly}
            onClick={onNavigate}
          />
        ))}
      </div>
    ))}
  </>
);

export const ThemeToggle = ({ isDarkMode, toggleTheme }) => (
  <button
    type="button"
    onClick={toggleTheme}
    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    className="sidebar-action-btn"
  >
    {isDarkMode ? (
      <SunIcon className="h-5 w-5" style={{ flexShrink: 0 }} />
    ) : (
      <MoonIcon className="h-5 w-5" style={{ flexShrink: 0 }} />
    )}
    <span className="sidebar-action-label">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
  </button>
);

export const UserCard = ({ initials, displayName, email, iconOnly }) => (
  <Link to="/profile" className="sidebar-user-card" title="View profile" style={{ textDecoration: 'none' }}>
    <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '13px', flexShrink: 0 }}>
      {initials}
      <span className="dot" />
    </div>
    {!iconOnly && (
      <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
        <div className="sidebar-user-name">{displayName}</div>
        <div className="sidebar-user-email">{email}</div>
      </div>
    )}
  </Link>
);

export const LogoutButton = ({ onLogout }) => (
  <button
    type="button"
    onClick={onLogout}
    className="sidebar-action-btn sidebar-logout-action"
    title="Logout"
    aria-label="Logout"
  >
    <ArrowRightOnRectangleIcon className="h-5 w-5" style={{ flexShrink: 0 }} />
    <span className="sidebar-action-label">Logout</span>
  </button>
);

export const SidebarFooter = ({ isDarkMode, toggleTheme, iconOnly, initials, displayName, email, onLogout }) => (
  <div className="sidebar-footer">
    <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    <UserCard initials={initials} displayName={displayName} email={email} iconOnly={iconOnly} />
    <LogoutButton onLogout={onLogout} />
  </div>
);

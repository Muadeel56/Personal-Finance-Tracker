import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { Brand, NavGroups, SidebarFooter } from './SidebarParts';

const SidebarRail = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { isMobile, isTablet, isDesktop, sidebarMode } = useLayout();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const iconOnly = isTablet || (isDesktop && collapsed);

  useEffect(() => {
    if (isDesktop) {
      try {
        localStorage.setItem('sidebar-collapsed', String(collapsed));
      } catch {
        // ignore
      }
    }
  }, [collapsed, isDesktop]);

  if (isMobile) return null;

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : (user?.username?.[0] || 'U').toUpperCase();

  const displayName = user?.name || user?.username || 'User';

  return (
    <aside
      className={`sidebar${iconOnly ? ' icon-only' : ''}`}
      data-mode={sidebarMode}
      aria-label="Sidebar navigation"
    >
      <div className="sidebar-brand">
        <Brand showText={!iconOnly} />
        {isDesktop && (
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeftIcon
              className="h-4 w-4"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}
            />
          </button>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <NavGroups isActive={isActive} iconOnly={iconOnly} />
      </nav>

      <SidebarFooter
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        iconOnly={iconOnly}
        initials={initials}
        displayName={displayName}
        email={user?.email || ''}
        onLogout={logout}
      />
    </aside>
  );
};

export default SidebarRail;

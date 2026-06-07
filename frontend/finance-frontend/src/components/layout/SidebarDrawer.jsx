import React from 'react';
import { useLocation } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { Brand, NavGroups, SidebarFooter } from './SidebarParts';

const SidebarDrawer = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { drawerOpen, closeDrawer } = useLayout();

  const isActive = (path) => location.pathname === path;

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'User';
  const initials = displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <>
      <div
        className={`sidebar-overlay${drawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        className={`sidebar-drawer${drawerOpen ? ' open' : ''}`}
        aria-label="Navigation menu"
        aria-hidden={!drawerOpen}
      >
        <div className="sidebar-drawer-header">
          <Brand showText />
          <button
            type="button"
            className="sidebar-drawer-close"
            onClick={closeDrawer}
            aria-label="Close navigation menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="sidebar-nav sidebar-drawer-nav">
          <NavGroups isActive={isActive} iconOnly={false} onNavigate={closeDrawer} />
        </nav>

        <SidebarFooter
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          iconOnly={false}
          initials={initials}
          displayName={displayName}
          email={user?.email || ''}
          onLogout={logout}
        />
      </aside>
    </>
  );
};

export default SidebarDrawer;

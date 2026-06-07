import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useLayout } from '../../contexts/LayoutContext';

const MobileTopbar = () => {
  const { isMobile, isTablet, openDrawer } = useLayout();

  if (!isMobile && !isTablet) return null;

  return (
    <header className="mobile-topbar">
      <Link to="/dashboard" className="mobile-topbar-brand">
        <div className="sidebar-logo mobile-topbar-logo">
          <SparklesIcon className="h-4 w-4" />
        </div>
        <span className="mobile-topbar-title">Finance Tracker</span>
      </Link>
      <button
        type="button"
        className="mobile-menu-btn"
        onClick={openDrawer}
        aria-label="Open navigation menu"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>
    </header>
  );
};

export default MobileTopbar;

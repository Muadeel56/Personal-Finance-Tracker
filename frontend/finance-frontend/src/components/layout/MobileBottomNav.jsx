import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useLayout } from '../../contexts/LayoutContext';
import { MOBILE_NAV } from './navConfig';

const MobileBottomNav = () => {
  const location = useLocation();
  const { isMobile, drawerOpen, openDrawer } = useLayout();

  if (!isMobile) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      <div className="mobile-bottom-nav-inner">
        {MOBILE_NAV.map(({ name, path, Icon }) => (
          <Link
            key={path}
            to={path}
            className={`mobile-nav-item${isActive(path) ? ' active' : ''}`}
          >
            <span className="mobile-nav-icon-wrap">
              <Icon />
            </span>
            <span className="mobile-nav-label">{name}</span>
          </Link>
        ))}
        <button
          type="button"
          className={`mobile-nav-item${drawerOpen ? ' active' : ''}`}
          onClick={openDrawer}
          aria-label="More navigation options"
        >
          <span className="mobile-nav-icon-wrap">
            <EllipsisHorizontalIcon />
          </span>
          <span className="mobile-nav-label">More</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;

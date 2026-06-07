import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';

const LayoutContext = createContext(null);

export const LayoutProvider = ({ children }) => {
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1199px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const sidebarMode = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <LayoutContext.Provider value={{
      sidebarMode,
      isMobile,
      isTablet,
      isDesktop,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within LayoutProvider');
  return ctx;
};

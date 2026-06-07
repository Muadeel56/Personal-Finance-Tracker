import React from 'react';
import { LayoutProvider } from '../../contexts/LayoutContext';
import SidebarRail from './SidebarRail';
import SidebarDrawer from './SidebarDrawer';
import MobileTopbar from './MobileTopbar';
import MobileBottomNav from './MobileBottomNav';

const AppLayoutInner = ({ children }) => {
  return (
    <div className="app-shell">
      <SidebarRail />
      <div className="app-content">
        <MobileTopbar />
        <main className="app-main">
          {children}
        </main>
      </div>
      <SidebarDrawer />
      <MobileBottomNav />
    </div>
  );
};

const AppLayout = ({ children }) => (
  <LayoutProvider>
    <AppLayoutInner>{children}</AppLayoutInner>
  </LayoutProvider>
);

export default AppLayout;

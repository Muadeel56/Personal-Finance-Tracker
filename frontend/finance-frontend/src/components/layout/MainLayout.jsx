import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button/Button';

const MainLayout = ({ children }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Budget', path: '/budget' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Finance Tracker</Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={toggleTheme} className="mr-2">{isDarkMode ? '🌞' : '🌙'}</Button>
              <div className="ml-3 relative">
                <Button variant="ghost">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[var(--color-muted)]" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[var(--color-card)] shadow-sm border-r border-[var(--color-border)] sticky top-16 h-[calc(100vh-4rem)] transition-colors">
          <nav className="mt-5 px-2 flex-1">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[var(--color-primary)] text-white shadow'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[var(--color-bg)] transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
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
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col">
      {/* Header */}
      <header className="bg-[var(--surface-2)] shadow-[var(--card-shadow)] border-b border-[var(--border-subtle)] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-2xl font-bold text-[var(--accent)] tracking-tight">Finance Tracker</Link>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={toggleTheme} className="mr-2" aria-label="Toggle theme">
                {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </Button>
              <div className="ml-3 relative">
                <Button variant="ghost">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[var(--text-secondary)]" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[var(--surface-1)] shadow-[var(--card-shadow)] border-r border-[var(--border-subtle)] sticky top-16 h-[calc(100vh-4rem)] transition-colors">
          <nav className="mt-5 px-2 flex-1">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-[var(--accent)] text-[var(--surface-1)] shadow'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-base)] hover:text-[var(--accent)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[var(--bg-base)] transition-colors">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 
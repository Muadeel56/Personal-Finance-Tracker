import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button/Button';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Categories', path: '/categories' },
    { name: 'Budget', path: '/budget' },
    { name: 'Reports', path: '/reports' },
  ];

  const userMenuItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
    { name: 'Logout', onClick: logout },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-[var(--color-surface)] shadow-sm border-b border-[var(--color-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">Finance Tracker</Link>
            <nav className="hidden md:flex gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-[var(--color-primary)] text-white shadow'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          {/* Right side items */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="mr-2"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </Button>
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center px-2 py-1"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-base font-semibold text-[var(--color-surface)]">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                </Button>
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-[var(--color-card)] border border-[var(--color-border)] z-50 animate-fade-in">
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        item.onClick ? (
                          <button
                            key={item.name}
                            onClick={item.onClick}
                            className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] rounded transition-colors"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)] rounded transition-colors"
                          >
                            {item.name}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </div>
            )}
            {/* Mobile menu button */}
            <div className="md:hidden ml-2">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          {/* Drawer */}
          <nav className={`fixed top-0 left-0 z-50 h-full w-4/5 max-w-xs bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-2xl transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ willChange: 'transform' }}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--color-border)]">
              <span className="text-xl font-bold text-[var(--color-primary)]">Finance Tracker</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]">
                <span className="sr-only">Close menu</span>
                <svg className="h-6 w-6 text-[var(--color-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-[var(--color-primary)] text-white shadow'
                      : 'text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default Header; 
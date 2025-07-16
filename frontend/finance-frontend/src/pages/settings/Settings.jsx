import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    monthly: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Settings</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Customize your experience and manage your preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Theme</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-muted)]">Light</span>
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isDarkMode ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isDarkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-[var(--color-muted)]">Dark</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Email Notifications</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Receive updates via email
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Push Notifications</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Receive browser notifications
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Weekly Reports</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Get weekly financial summaries
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange('weekly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.weekly ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.weekly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Monthly Reports</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Get monthly financial summaries
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationChange('monthly')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.monthly ? 'bg-[var(--color-primary)]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.monthly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Data & Privacy</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Export Data</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Download your financial data
                  </p>
                </div>
                <Button
                  className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
                >
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Delete Account</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Permanently delete your account and data
                  </p>
                </div>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Account Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Change Password</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Update your account password
                  </p>
                </div>
                <Button
                  className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[var(--color-text)] font-medium">Logout</h3>
                  <p className="text-sm text-[var(--color-muted)]">
                    Sign out of your account
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  className="bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">System Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">App Version</span>
                <span className="text-[var(--color-text)]">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Last Updated</span>
                <span className="text-[var(--color-text)]">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">Account ID</span>
                <span className="text-[var(--color-text)] font-mono text-sm">
                  {user?.id || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const SettingRow = ({ title, description, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{title}</div>
      {description && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{description}</div>}
    </div>
    {children}
  </div>
);

const Toggle = ({ on, onToggle }) => (
  <button
    type="button"
    className={`switch ${on ? 'on' : ''}`}
    onClick={onToggle}
    aria-pressed={on}
  >
    <span className="knob" />
  </button>
);

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true, monthly: true });

  const toggle = (key) => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Customize your experience and manage preferences</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Appearance */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="section-title" style={{ marginBottom: '4px' }}>Appearance</div>
          <SettingRow title="Theme" description="Switch between light and dark mode">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Light</span>
              <Toggle on={isDarkMode} onToggle={toggleTheme} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Dark</span>
            </div>
          </SettingRow>
        </div>

        {/* Notifications */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="section-title" style={{ marginBottom: '4px' }}>Notifications</div>
          <SettingRow title="Email Notifications" description="Receive updates via email">
            <Toggle on={notifications.email} onToggle={() => toggle('email')} />
          </SettingRow>
          <SettingRow title="Push Notifications" description="Receive browser notifications">
            <Toggle on={notifications.push} onToggle={() => toggle('push')} />
          </SettingRow>
          <SettingRow title="Weekly Reports" description="Get weekly financial summaries">
            <Toggle on={notifications.weekly} onToggle={() => toggle('weekly')} />
          </SettingRow>
          <SettingRow title="Monthly Reports" description="Get monthly financial summaries">
            <Toggle on={notifications.monthly} onToggle={() => toggle('monthly')} />
          </SettingRow>
        </div>

        {/* Data & Privacy */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="section-title" style={{ marginBottom: '4px' }}>Data &amp; Privacy</div>
          <SettingRow title="Export Data" description="Download all your financial data as CSV">
            <button className="btn btn-secondary btn-sm">Export</button>
          </SettingRow>
          <SettingRow title="Delete Account" description="Permanently delete your account and all data">
            <button className="btn btn-danger btn-sm">Delete</button>
          </SettingRow>
        </div>

        {/* Account Actions */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="section-title" style={{ marginBottom: '4px' }}>Account</div>
          <SettingRow title="Change Password" description="Update your account password">
            <button className="btn btn-secondary btn-sm">Change</button>
          </SettingRow>
          <SettingRow title="Sign out" description="Sign out of your account on this device">
            <button className="btn btn-ghost btn-sm" onClick={() => { if (window.confirm('Sign out?')) logout(); }}>
              Sign out
            </button>
          </SettingRow>
        </div>

        {/* System Info */}
        <div className="card" style={{ padding: '22px 24px' }}>
          <div className="section-title" style={{ marginBottom: '14px' }}>System Information</div>
          {[
            { label: 'App version', value: '1.0.0' },
            { label: 'Last updated', value: new Date().toLocaleDateString() },
            { label: 'Account ID', value: user?.id || 'N/A', mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className={mono ? 'num' : ''} style={{ color: 'var(--text-primary)' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;

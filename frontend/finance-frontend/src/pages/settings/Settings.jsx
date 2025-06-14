import React from 'react';
import Button from '../../components/common/Button/Button';
import { useTheme } from '../../contexts/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Settings</h1>
      <div className="rounded-lg shadow p-6 bg-[var(--color-card)]">
        <div className="flex items-center justify-between mb-6">
          <span className="text-lg text-[var(--color-text)]">Dark Mode</span>
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === 'dark' ? '🌙 Dark' : '🌞 Light'}
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[var(--color-text)]">Mock Setting 1</span>
          <input type="checkbox" className="accent-[var(--color-primary)] w-5 h-5" defaultChecked />
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[var(--color-text)]">Mock Setting 2</span>
          <input type="checkbox" className="accent-[var(--color-primary)] w-5 h-5" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--color-text)]">Mock Setting 3</span>
          <input type="checkbox" className="accent-[var(--color-primary)] w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default Settings; 
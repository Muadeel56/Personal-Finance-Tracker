import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, className = '' }) => {
  const isPositive = trend === 'up';
  const trendColor = isPositive ? 'text-green-500' : 'text-red-500';
  const trendIcon = isPositive ? '↑' : '↓';

  return (
    <div className={`bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-muted)]">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">{value}</p>
        </div>
        {Icon && (
          <div className="p-3 bg-[var(--color-primary)] bg-opacity-10 rounded-lg">
            <Icon className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trendColor}`}>
            {trendIcon} {trendValue}
          </span>
          <span className="ml-2 text-sm text-[var(--color-muted)]">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard; 
import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StatCard = ({ title, value, type, trend }) => {
  // Helper function to format currency in PKR
  const formatCurrencyPKR = (amount) => {
    return `PKR ${Number(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getValueColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600';
      case 'expense':
        return 'text-red-600';
      case 'percentage':
        return value >= 0 ? 'text-green-600' : 'text-red-600';
      default:
        return 'text-[var(--color-text)]';
    }
  };

  const formatValue = () => {
    if (type === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return formatCurrencyPKR(value);
  };

  const getTrendColor = () => {
    if (type === 'expense') {
      return trend < 0 ? 'text-green-600' : 'text-red-600';
    }
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = () => {
    if (type === 'expense') {
      return trend < 0 ? (
        <ArrowDownIcon className="h-4 w-4" />
      ) : (
        <ArrowUpIcon className="h-4 w-4" />
      );
    }
    return trend >= 0 ? (
      <ArrowUpIcon className="h-4 w-4" />
    ) : (
      <ArrowDownIcon className="h-4 w-4" />
    );
  };

  return (
    <div className="bg-[var(--color-card)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
      <h3 className="text-sm font-medium text-[var(--color-muted)]">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className={`text-2xl font-semibold ${getValueColor()}`}>
          {formatValue()}
        </p>
        <div className={`ml-2 flex items-baseline text-sm font-semibold ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="ml-1">{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard; 
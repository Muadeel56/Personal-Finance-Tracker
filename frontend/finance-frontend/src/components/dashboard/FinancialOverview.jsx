import React from 'react';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const FinancialOverview = ({ data }) => {
  const {
    totalIncome = 0,
    totalExpenses = 0,
    netWorth = 0,
    savingsRate = 0,
    monthlyChange = 0,
    budgetUtilization = 0
  } = data || {};

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-[var(--income)]" />;
    if (value < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-[var(--expense)]" />;
    return <ChartBarIcon className="w-4 h-4 text-[var(--text-secondary)]" />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-[var(--income)]';
    if (value < 0) return 'text-[var(--expense)]';
    return 'text-[var(--text-secondary)]';
  };

  const getTrendText = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Net Worth */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Net Worth</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              ${netWorth.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(monthlyChange)}
              <span className={`text-sm font-medium ${getTrendColor(monthlyChange)}`}>
                {getTrendText(monthlyChange)} from last month
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[var(--info-muted)] rounded-full flex items-center justify-center">
            <BanknotesIcon className="w-6 h-6 text-[var(--accent)]" />
          </div>
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Total Income</p>
            <p className="text-2xl font-bold text-[var(--income)]">
              ${totalIncome.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-[var(--income-muted)] rounded-full flex items-center justify-center">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[var(--income)]" />
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Total Expenses</p>
            <p className="text-2xl font-bold text-[var(--expense)]">
              ${totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-[var(--expense-muted)] rounded-full flex items-center justify-center">
            <ArrowTrendingDownIcon className="w-6 h-6 text-[var(--expense)]" />
          </div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-[var(--text-muted)] mt-1">Of total income</p>
          </div>
          <div className="w-12 h-12 bg-[var(--info-muted)] rounded-full flex items-center justify-center">
            <BuildingLibraryIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview; 
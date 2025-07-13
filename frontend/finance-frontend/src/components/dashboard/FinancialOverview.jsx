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
    if (value > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <ChartBarIcon className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendText = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Net Worth */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Worth</p>
            <p className="text-2xl font-bold text-gray-900">
              ${netWorth.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(monthlyChange)}
              <span className={`text-sm font-medium ${getTrendColor(monthlyChange)}`}>
                {getTrendText(monthlyChange)} from last month
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <BanknotesIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Total Income */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Income</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Savings Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {savingsRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Of total income</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <BuildingLibraryIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview; 
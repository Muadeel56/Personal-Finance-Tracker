import React from 'react';
import { 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateNetBalance, 
  calculateSavingsRate 
} from '../../utils/helpers';

const TransactionStats = ({ transactions = [] }) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = calculateNetBalance(transactions);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  const transactionCount = transactions.length;

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{transactionCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
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
          </div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Net Balance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Balance</p>
            <p className={`text-2xl font-bold ${getTrendColor(netBalance)}`}>
              ${netBalance.toLocaleString()}
            </p>
            {totalIncome > 0 && (
              <p className="text-sm text-gray-500">
                {savingsRate.toFixed(1)}% savings rate
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <BanknotesIcon className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats; 
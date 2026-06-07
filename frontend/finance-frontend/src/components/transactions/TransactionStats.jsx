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
    if (value > 0) return <ArrowTrendingUpIcon className="w-4 h-4 text-[var(--income)]" />;
    if (value < 0) return <ArrowTrendingDownIcon className="w-4 h-4 text-[var(--expense)]" />;
    return <ChartBarIcon className="w-4 h-4 text-[var(--text-secondary)]" />;
  };

  const getTrendColor = (value) => {
    if (value > 0) return 'text-[var(--income)]';
    if (value < 0) return 'text-[var(--expense)]';
    return 'text-[var(--text-secondary)]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Transactions */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Total Transactions</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{transactionCount}</p>
          </div>
          <div className="w-12 h-12 bg-[var(--info-muted)] rounded-full flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-[var(--accent)]" />
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
          </div>
          <div className="w-12 h-12 bg-[var(--expense-muted)] rounded-full flex items-center justify-center">
            <ArrowTrendingDownIcon className="w-6 h-6 text-[var(--expense)]" />
          </div>
        </div>
      </div>

      {/* Net Balance */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Net Balance</p>
            <p className={`text-2xl font-bold ${getTrendColor(netBalance)}`}>
              ${netBalance.toLocaleString()}
            </p>
            {totalIncome > 0 && (
              <p className="text-sm text-[var(--text-muted)]">
                {savingsRate.toFixed(1)}% savings rate
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-[var(--surface-2)] rounded-full flex items-center justify-center">
            <BanknotesIcon className="w-6 h-6 text-[var(--text-secondary)]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStats; 
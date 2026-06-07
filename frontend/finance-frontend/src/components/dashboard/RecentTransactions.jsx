import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  ArrowRightIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const RecentTransactions = ({ transactions = [] }) => {
  const getTransactionIcon = (type) => {
    if (type === 'INCOME') return ArrowUpIcon;
    if (type === 'EXPENSE') return ArrowDownIcon;
    if (type === 'TRANSFER') return ArrowsRightLeftIcon;
    return TagIcon;
  };

  const getAmountColor = (type) => {
    if (type === 'INCOME') return 'text-[var(--income)]';
    if (type === 'EXPENSE') return 'text-[var(--expense)]';
    return 'text-[var(--text-secondary)]';
  };

  const getAmountPrefix = (type) => {
    if (type === 'INCOME') return '+';
    if (type === 'EXPENSE') return '-';
    return '';
  };

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Transactions</h2>
        <Link
          to="/transactions"
          className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-4">
            <ChartBarIcon className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No transactions yet</h3>
          <p className="text-[var(--text-muted)] mb-4">Add your first transaction to start tracking your finances</p>
          <Link
            to="/transactions/add"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--surface-1)] px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            Add Transaction
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.transaction_type);
            return (
              <Link
                key={transaction.id}
                to={`/transactions/${transaction.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--surface-2)] transition-colors group"
              >
                <div className="w-10 h-10 bg-[var(--surface-2)] rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--text-primary)] truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <span>{transaction.category?.name || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.date), 'MMM d')}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`font-semibold ${getAmountColor(transaction.transaction_type)}`}>
                        {getAmountPrefix(transaction.transaction_type)}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              to="/transactions/add"
              className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-[var(--border-subtle)] rounded-lg text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Transaction
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;

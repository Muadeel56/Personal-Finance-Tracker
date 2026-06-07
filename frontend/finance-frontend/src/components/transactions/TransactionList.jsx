import React from 'react';
import { format } from 'date-fns';
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const TransactionList = ({
  transactions,
  viewMode,
  selectedTransactions,
  setSelectedTransactions,
  loading
}) => {
  const getTransactionIcon = (type) => {
    if (type === 'INCOME') return ArrowUpIcon;
    if (type === 'EXPENSE') return ArrowDownIcon;
    if (type === 'TRANSFER') return ArrowsRightLeftIcon;
    return TagIcon;
  };

  const getAmountColor = (type, amount) => {
    if (type === 'INCOME') return 'text-[var(--income)]';
    if (type === 'EXPENSE') return 'text-[var(--expense)]';
    return 'text-[var(--text-primary)]';
  };

  const toggleSelection = (id) => {
    const newSelection = new Set(selectedTransactions);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedTransactions(newSelection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-4">
          <ChartBarIcon className="w-8 h-8 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No transactions found</h3>
        <p className="text-[var(--text-muted)]">Try adjusting your filters or add a new transaction.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((transaction) => {
          const Icon = getTransactionIcon(transaction.transaction_type);
          const categoryName = typeof transaction.category === 'object'
            ? transaction.category?.name
            : transaction.category;

          return (
            <div
              key={transaction.id}
              className="bg-[var(--surface-1)] rounded-lg border border-[var(--border-subtle)] p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--text-primary)]">{transaction.description || 'Transaction'}</h4>
                    <p className="text-sm text-[var(--text-muted)]">{categoryName}</p>
                  </div>
                </div>
                <span className={`font-semibold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                  {transaction.transaction_type === 'EXPENSE' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-[var(--surface-2)] rounded"><EyeIcon className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-[var(--surface-2)] rounded"><PencilIcon className="w-4 h-4" /></button>
                  <button className="p-1 hover:bg-[var(--surface-2)] rounded"><TrashIcon className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-[var(--border-subtle)]">
        <thead className="bg-[var(--surface-2)]">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Description</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Category</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[var(--surface-1)] divide-y divide-[var(--border-subtle)]">
          {transactions.map((transaction) => {
            const Icon = getTransactionIcon(transaction.transaction_type);
            const categoryName = typeof transaction.category === 'object'
              ? transaction.category?.name
              : transaction.category;

            return (
              <tr key={transaction.id} className="hover:bg-[var(--surface-2)]">
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">{transaction.description || 'Transaction'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">{categoryName}</td>
                <td className={`px-4 py-3 text-sm font-semibold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                  {transaction.transaction_type === 'EXPENSE' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-[var(--surface-3)] rounded"><EyeIcon className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[var(--surface-3)] rounded"><PencilIcon className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[var(--surface-3)] rounded"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;

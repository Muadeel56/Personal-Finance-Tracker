import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const TransactionList = ({ 
  transactions, 
  onEdit, 
  onDelete,
  onSort,
  sortField,
  sortDirection,
  onExport,
  loading = false
}) => {
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);

  // Helper function to format currency in PKR
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Helper function to get category name safely
  const getCategoryName = (transaction) => {
    if (typeof transaction.category === 'object' && transaction.category?.name) {
      return transaction.category.name;
    }
    return `Category ${transaction.category}`;
  };

  // Helper function to get category badge
  const getCategoryBadge = (transaction) => {
    if (transaction.category && transaction.category.name) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
          {transaction.category.icon && (
            <span className="mr-1">{transaction.category.icon}</span>
          )}
          {transaction.category.name}
        </span>
      );
    }
    return <span className="text-[var(--color-muted)] text-sm">Uncategorized</span>;
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = formatCurrency(Math.abs(amount));
    return (
      <span className={`font-semibold ${type === 'EXPENSE' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
        {type === 'EXPENSE' ? '-' : '+'}{formattedAmount}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleSort = (field) => {
    onSort(field);
  };

  const handleSelectAll = () => {
    if (selectedTransactions.size === transactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(transactions.map(t => t.id)));
    }
  };

  const handleSelectTransaction = (id) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const handleExport = () => {
    const selectedData = transactions.filter(t => selectedTransactions.has(t.id));
    onExport(selectedData);
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-4 w-4 inline-block text-blue-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline-block text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-2xl shadow-lg border border-[var(--color-border)] overflow-hidden">
      {/* Action Bar */}
      <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSelectMode(!isSelectMode)}
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] font-medium transition-colors"
            >
              {isSelectMode ? 'Cancel Selection' : 'Select Transactions'}
            </button>
            {isSelectMode && (
              <button
                onClick={handleSelectAll}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] font-medium transition-colors"
              >
                {selectedTransactions.size === transactions.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
          {isSelectMode && selectedTransactions.size > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Export Selected ({selectedTransactions.size})
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)] text-sm">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              {isSelectMode && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === transactions.length}
                    onChange={handleSelectAll}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
                  />
                </th>
              )}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                onClick={() => handleSort('date')}
              >
                Date <SortIcon field="date" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                onClick={() => handleSort('description')}
              >
                Description <SortIcon field="description" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon field="category" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)] transition-colors"
                onClick={() => handleSort('amount')}
              >
                Amount <SortIcon field="amount" />
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--color-card)] divide-y divide-[var(--color-border)]">
            {transactions.map((transaction) => (
              <tr 
                key={transaction.id} 
                className={`hover:bg-[var(--color-bg)] transition-colors ${
                  selectedTransactions.has(transaction.id) ? 'bg-[var(--color-primary)]/10' : ''
                }`}
              >
                {isSelectMode && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                      className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] bg-[var(--color-surface)]"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)] font-medium">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text)]">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getCategoryBadge(transaction)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatAmount(transaction.amount, transaction.transaction_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors p-1 rounded"
                      title="Edit transaction"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1 rounded"
                      title="Delete transaction"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[var(--color-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowPathIcon className="h-8 w-8 text-[var(--color-muted)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">No transactions found</h3>
          <p className="text-[var(--color-muted)] mb-4">
            Get started by adding your first transaction.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors font-medium">
            Add Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList; 
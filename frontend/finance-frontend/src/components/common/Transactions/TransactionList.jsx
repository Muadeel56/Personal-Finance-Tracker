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
import { formatCurrency } from '../../../utils/helpers';

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

  // Helper function to get category name safely
  const getCategoryName = (transaction) => {
    if (typeof transaction.category === 'object' && transaction.category?.name) {
      return transaction.category.name;
    }
    // If category is just an ID, we'll show a placeholder for now
    // In a real app, you might want to fetch category details or store them in context
    return `Category ${transaction.category}`;
  };

  // Helper function to get category badge
  const getCategoryBadge = (transaction) => {
    if (transaction.category && transaction.category.name) {
      return (
        <span
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: transaction.category.color || '#e5e7eb',
            color: '#fff',
          }}
        >
          {transaction.category.icon && (
            <span className="mr-1">{transaction.category.icon}</span>
          )}
          {transaction.category.name}
        </span>
      );
    }
    return <span className="text-gray-400">Uncategorized</span>;
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = formatCurrency(Math.abs(amount));
    return (
      <span className={`font-medium ${type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'}`}>
        {type === 'EXPENSE' ? '-' : '+'}{formattedAmount}
      </span>
    );
  };

  const formatDate = (dateString) => {
    try {
      // Handle both ISO strings and Date objects
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback to original string if formatting fails
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
      <ChevronUpIcon className="h-4 w-4 inline-block" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 inline-block" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
      {/* Action Bar */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSelectMode(!isSelectMode)}
            className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)]"
          >
            {isSelectMode ? 'Cancel Selection' : 'Select Transactions'}
          </button>
          {isSelectMode && (
            <button
              onClick={handleSelectAll}
              className="text-sm text-[var(--color-text)] hover:text-[var(--color-primary)]"
            >
              {selectedTransactions.size === transactions.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>
        {isSelectMode && selectedTransactions.size > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Export Selected
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-border)]">
          <thead className="bg-[var(--color-surface)]">
            <tr>
              {isSelectMode && (
                <th scope="col" className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.size === transactions.length}
                    onChange={handleSelectAll}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                </th>
              )}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)]"
                onClick={() => handleSort('date')}
              >
                Date <SortIcon field="date" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)]"
                onClick={() => handleSort('description')}
              >
                Description <SortIcon field="description" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)]"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon field="category" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-primary)]"
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
                className={`hover:bg-[var(--color-surface)] transition-colors ${
                  selectedTransactions.has(transaction.id) ? 'bg-[var(--color-primary)] bg-opacity-5' : ''
                }`}
              >
                {isSelectMode && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.has(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                      className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text)]">
                  {getCategoryBadge(transaction)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {formatAmount(transaction.amount, transaction.transaction_type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                      title="Edit transaction"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      title="Delete transaction"
                    >
                      <TrashIcon className="h-5 w-5" />
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
          <ArrowPathIcon className="mx-auto h-12 w-12 text-[var(--color-muted)]" />
          <h3 className="mt-2 text-sm font-medium text-[var(--color-text)]">No transactions</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Get started by adding a new transaction.
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList; 
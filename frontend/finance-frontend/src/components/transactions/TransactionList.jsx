import React from 'react';
import { format } from 'date-fns';
import { 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const TransactionList = ({ 
  transactions, 
  viewMode, 
  selectedTransactions, 
  setSelectedTransactions, 
  loading 
}) => {
  const getTransactionIcon = (type, category) => {
    if (type === 'INCOME') return '💰';
    if (type === 'EXPENSE') return '💸';
    if (type === 'TRANSFER') return '🔄';
    
    // Category-based icons
    const categoryIcons = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Housing': '🏠',
      'Entertainment': '🎬',
      'Shopping': '🛍️',
      'Healthcare': '🏥',
      'Education': '📚',
      'Utilities': '⚡',
      'Insurance': '🛡️',
      'Investment': '📈',
      'Salary': '💼',
      'Freelance': '💻',
      'Gift': '🎁',
      'Travel': '✈️',
      'Sports': '⚽',
      'Pets': '🐕',
      'Childcare': '👶',
      'Taxes': '📋',
      'Debt': '💳',
      'Savings': '🏦'
    };
    
    return categoryIcons[category] || '📊';
  };

  const getAmountColor = (type, amount) => {
    if (type === 'INCOME') return 'text-green-600';
    if (type === 'EXPENSE') return 'text-red-600';
    return 'text-gray-600';
  };

  const getAmountPrefix = (type) => {
    if (type === 'INCOME') return '+';
    if (type === 'EXPENSE') return '-';
    return '';
  };

  const handleSelectTransaction = (transactionId) => {
    if (selectedTransactions.includes(transactionId)) {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    } else {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">Try adjusting your filters or add a new transaction</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedTransactions.length === transactions.length && transactions.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedTransactions.length} of {transactions.length} selected
            </span>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedTransactions.includes(transaction.id)}
                  onChange={() => handleSelectTransaction(transaction.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {getTransactionIcon(transaction.transaction_type, transaction.category?.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {transaction.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{transaction.category?.name || 'Uncategorized'}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.date), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                        {getAmountPrefix(transaction.transaction_type)}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                {getTransactionIcon(transaction.transaction_type, transaction.category?.name)}
              </div>
              <input
                type="checkbox"
                checked={selectedTransactions.includes(transaction.id)}
                onChange={() => handleSelectTransaction(transaction.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            
            <h3 className="font-medium text-gray-900 mb-2 truncate">
              {transaction.description}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Category:</span>
                <span>{transaction.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{format(new Date(transaction.date), 'MMM d')}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className={`text-lg font-semibold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                {getAmountPrefix(transaction.transaction_type)}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <div className="flex items-center gap-1">
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Calendar view (simplified)
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
        <p className="text-gray-500">Calendar view coming soon!</p>
      </div>
    </div>
  );
};

export default TransactionList; 
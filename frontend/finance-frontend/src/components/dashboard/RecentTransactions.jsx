import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const RecentTransactions = ({ transactions = [] }) => {
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <Link 
          to="/transactions"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-500 mb-4">Add your first transaction to start tracking your finances</p>
          <Link
            to="/transactions/add"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Transaction
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Link
              key={transaction.id}
              to={`/transactions/${transaction.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
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
                      <span>{format(new Date(transaction.date), 'MMM d')}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${getAmountColor(transaction.transaction_type, transaction.amount)}`}>
                      {getAmountPrefix(transaction.transaction_type)}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          <div className="pt-2">
            <Link
              to="/transactions/add"
              className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="text-lg">+</span>
              Add New Transaction
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions; 
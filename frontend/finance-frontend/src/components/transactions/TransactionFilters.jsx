import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TransactionFilters = ({ filters, setFilters, transactions }) => {
  // Extract unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category?.name).filter(Boolean))];
  
  // Extract unique transaction types
  const transactionTypes = [...new Set(transactions.map(t => t.transaction_type))];

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      dateRange: 'all',
      amountRange: 'all',
      status: 'all'
    });
  };

  const hasActiveFilters = () => {
    return filters.search || 
           filters.type !== 'all' || 
           filters.category !== 'all' || 
           filters.dateRange !== 'all' || 
           filters.amountRange !== 'all' || 
           filters.status !== 'all';
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Search: "{filters.search}"
              <button
                onClick={() => setFilters({ ...filters, search: '' })}
                className="ml-1 hover:text-blue-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Type: {filters.type}
              <button
                onClick={() => setFilters({ ...filters, type: 'all' })}
                className="ml-1 hover:text-green-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Category: {filters.category}
              <button
                onClick={() => setFilters({ ...filters, category: 'all' })}
                className="ml-1 hover:text-purple-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              Date: {filters.dateRange}
              <button
                onClick={() => setFilters({ ...filters, dateRange: 'all' })}
                className="ml-1 hover:text-orange-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.amountRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              Amount: {filters.amountRange}
              <button
                onClick={() => setFilters({ ...filters, amountRange: 'all' })}
                className="ml-1 hover:text-red-600"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {transactionTypes.map(type => (
              <option key={type} value={type}>
                {type === 'INCOME' ? 'Income' : 
                 type === 'EXPENSE' ? 'Expense' : 
                 type === 'TRANSFER' ? 'Transfer' : type}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount Range
          </label>
          <select
            value={filters.amountRange}
            onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Amounts</option>
            <option value="0-100">$0 - $100</option>
            <option value="100-500">$100 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000-">$5,000+</option>
          </select>
        </div>
      </div>

      {/* Custom Date Range (if needed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Start date"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilters({ ...filters, type: 'INCOME' })}
          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors"
        >
          Income Only
        </button>
        <button
          onClick={() => setFilters({ ...filters, type: 'EXPENSE' })}
          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
        >
          Expenses Only
        </button>
        <button
          onClick={() => setFilters({ ...filters, dateRange: 'month' })}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
        >
          This Month
        </button>
        <button
          onClick={() => setFilters({ ...filters, amountRange: '1000-' })}
          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200 transition-colors"
        >
          Large Transactions
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters; 
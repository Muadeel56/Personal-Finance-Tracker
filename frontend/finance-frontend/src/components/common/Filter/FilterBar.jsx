import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import api from '../../../api/config';

const FilterBar = ({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  onReset,
}) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await api.get('/transactions/categories/');
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-[var(--surface-1)] rounded-xl p-4 shadow-[var(--card-shadow)] border border-[var(--border-subtle)] mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-[var(--text-secondary)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transactions..."
            className="block w-full pl-10 pr-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        {/* Date Range */}
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="block w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="block w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="block w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          disabled={loadingCategories}
        >
          <option value="">{loadingCategories ? 'Loading categories...' : 'All Categories'}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Type */}
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="block w-full px-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <button
            onClick={onReset}
            className="px-3 py-2 border border-[var(--border-subtle)] rounded-lg bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--bg-base)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar; 
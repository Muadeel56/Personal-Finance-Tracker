import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';

const Reports = () => {
  const { transactions, loading } = useTransactions();
  const [timeRange, setTimeRange] = useState('current_month');
  const [reportType, setReportType] = useState('overview');

  // Helper function to format currency in PKR
  const formatCurrency = (amount) => {
    return `PKR ${Number(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Calculate income vs expenses
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + Number(t.amount), 0);
  const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  const netIncome = income - expenses;

  // Group transactions by category
  const categoryData = transactions.reduce((acc, transaction) => {
    const category = transaction.category?.name || 'Uncategorized';
    const amount = Math.abs(Number(transaction.amount));
    
    if (!acc[category]) {
      acc[category] = { income: 0, expenses: 0, count: 0 };
    }
    
    if (transaction.amount > 0) {
      acc[category].income += amount;
    } else {
      acc[category].expenses += amount;
    }
    acc[category].count += 1;
    
    return acc;
  }, {});

  // Monthly trend data
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!acc[monthKey]) {
      acc[monthKey] = { income: 0, expenses: 0, count: 0 };
    }
    
    if (transaction.amount > 0) {
      acc[monthKey].income += Number(transaction.amount);
    } else {
      acc[monthKey].expenses += Math.abs(Number(transaction.amount));
    }
    acc[monthKey].count += 1;
    
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData).sort().slice(-6);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">Reports</h1>
              <p className="mt-2 text-[var(--color-muted)]">
                Analyze your financial data and track your progress
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              >
                <option value="current_month">Current Month</option>
                <option value="previous_month">Previous Month</option>
                <option value="current_year">Current Year</option>
                <option value="all_time">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Type Tabs */}
        <div className="mb-8">
          <div className="flex bg-[var(--color-surface)] rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setReportType('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                reportType === 'overview'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setReportType('categories')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                reportType === 'categories'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setReportType('trends')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                reportType === 'trends'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Trends
            </button>
          </div>
        </div>

        {/* Overview Report */}
        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-muted)]">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(income)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">📈</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-muted)]">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {formatCurrency(expenses)}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 text-xl">📉</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--color-muted)]">Net Income</p>
                    <p className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(netIncome)}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${netIncome >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-xl ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {netIncome >= 0 ? '💰' : '💸'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Transaction Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">Income Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(categoryData)
                      .filter(([_, data]) => data.income > 0)
                      .sort(([_, a], [__, b]) => b.income - a.income)
                      .slice(0, 5)
                      .map(([category, data]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-[var(--color-text)]">{category}</span>
                          <span className="font-semibold text-green-600">{formatCurrency(data.income)}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-text)] mb-4">Expense Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(categoryData)
                      .filter(([_, data]) => data.expenses > 0)
                      .sort(([_, a], [__, b]) => b.expenses - a.expenses)
                      .slice(0, 5)
                      .map(([category, data]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-[var(--color-text)]">{category}</span>
                          <span className="font-semibold text-red-600">{formatCurrency(data.expenses)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Report */}
        {reportType === 'categories' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Category Analysis</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-muted)]">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--color-muted)]">Income</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--color-muted)]">Expenses</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--color-muted)]">Net</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-[var(--color-muted)]">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryData)
                      .sort(([_, a], [__, b]) => (b.income + b.expenses) - (a.income + a.expenses))
                      .map(([category, data]) => (
                        <tr key={category} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                          <td className="py-3 px-4 text-[var(--color-text)]">{category}</td>
                          <td className="py-3 px-4 text-right text-green-600 font-medium">
                            {formatCurrency(data.income)}
                          </td>
                          <td className="py-3 px-4 text-right text-red-600 font-medium">
                            {formatCurrency(data.expenses)}
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${
                            data.income - data.expenses >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(data.income - data.expenses)}
                          </td>
                          <td className="py-3 px-4 text-right text-[var(--color-muted)]">
                            {data.count}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Trends Report */}
        {reportType === 'trends' && (
          <div className="space-y-6">
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Monthly Trends</h2>
              <div className="space-y-4">
                {sortedMonths.map((month) => {
                  const data = monthlyData[month];
                  const net = data.income - data.expenses;
                  return (
                    <div key={month} className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-[var(--color-text)]">{month}</h3>
                        <p className="text-sm text-[var(--color-muted)]">{data.count} transactions</p>
                      </div>
                      <div className="flex gap-8 text-sm">
                        <div className="text-center">
                          <div className="text-green-600 font-semibold">{formatCurrency(data.income)}</div>
                          <div className="text-xs text-[var(--color-muted)]">Income</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-600 font-semibold">{formatCurrency(data.expenses)}</div>
                          <div className="text-xs text-[var(--color-muted)]">Expenses</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(net)}
                          </div>
                          <div className="text-xs text-[var(--color-muted)]">Net</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No Data State */}
        {transactions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[var(--color-primary)] text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No data available</h3>
            <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
              Start adding transactions to see detailed reports and analytics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import StatCard from '../components/common/StatCard';
import LineChart from '../components/common/LineChart';
import CategoryPieChart from '../components/common/CategoryPieChart';
import BudgetProgress from '../components/common/BudgetProgress';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateSavingsRate,
  filterByDateRange,
  generateChartData,
  groupTransactionsByCategory,
  getCurrentMonthRange,
  getPreviousMonthRange,
} from '../utils/helpers';

const Dashboard = () => {
  const { transactions, loading, error } = useTransactions();
  const [timeRange, setTimeRange] = useState('current');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const dateRange = timeRange === 'current' 
      ? getCurrentMonthRange() 
      : getPreviousMonthRange();
    
    const filtered = transactions.filter(t => 
      filterByDateRange(t, new Date(dateRange.start), new Date(dateRange.end))
    );
    setFilteredTransactions(filtered);
  }, [transactions, timeRange]);

  // Calculate statistics
  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpenses = calculateTotalExpenses(filteredTransactions);
  const netBalance = calculateNetBalance(filteredTransactions);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

  // Generate chart data
  const chartData = generateChartData(filteredTransactions);
  const categoryData = groupTransactionsByCategory(filteredTransactions);

  // Sample budget data (replace with actual budget data later)
  const budgetOverview = [
    { category: 'Housing', spent: 1500, budget: 2000 },
    { category: 'Food', spent: 600, budget: 800 },
    { category: 'Transportation', spent: 300, budget: 400 },
    { category: 'Entertainment', spent: 200, budget: 300 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('current')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'current'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Current Month
          </button>
          <button
            onClick={() => setTimeRange('previous')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'previous'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Previous Month
          </button>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={totalIncome}
          type="income"
          trend={10}
        />
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          type="expense"
          trend={-5}
        />
        <StatCard
          title="Net Balance"
          value={netBalance}
          type={netBalance >= 0 ? 'income' : 'expense'}
          trend={netBalance >= 0 ? 15 : -15}
        />
        <StatCard
          title="Savings Rate"
          value={savingsRate}
          type="percentage"
          trend={5}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expenses</h2>
          <LineChart data={chartData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
          <CategoryPieChart data={categoryData} />
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
        <div className="space-y-4">
          {budgetOverview.map((budget) => (
            <BudgetProgress
              key={budget.category}
              category={budget.category}
              spent={budget.spent}
              budget={budget.budget}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
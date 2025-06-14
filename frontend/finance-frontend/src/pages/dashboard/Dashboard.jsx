import React, { useEffect, useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import Card from '../../components/common/Card/Card';
import BudgetProgress from '../../components/common/Budget/BudgetProgress';
import CategoryPieChart from '../../components/common/Charts/CategoryPieChart';
import TransactionList from '../../components/common/Transactions/TransactionList';
import { 
  calculateTotalIncome, 
  calculateTotalExpenses, 
  calculateNetBalance,
  calculateSavingsRate,
  getCurrentMonthRange,
  filterByDateRange
} from '../../utils/helpers';

const Dashboard = () => {
  const { transactions, loading } = useTransactions();
  const [timeRange, setTimeRange] = useState('current');
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    const dateRange = getCurrentMonthRange();
    const filtered = transactions.filter(t => 
      filterByDateRange(t, dateRange.start, dateRange.end)
    );
    setFilteredTransactions(filtered);
  }, [transactions, timeRange]);

  const totalIncome = calculateTotalIncome(filteredTransactions);
  const totalExpenses = calculateTotalExpenses(filteredTransactions);
  const netBalance = calculateNetBalance(filteredTransactions);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);

  // Prepare data for charts
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      const existing = acc.find(item => item.name === transaction.category);
      if (existing) {
        existing.value += Math.abs(transaction.amount);
      } else {
        acc.push({
          name: transaction.category,
          value: Math.abs(transaction.amount)
        });
      }
    }
    return acc;
  }, []);

  // Sample budget data - replace with actual budget data from your backend
  const budgetOverview = [
    { category: 'Housing', spent: 800, budget: 1000 },
    { category: 'Food', spent: 400, budget: 500 },
    { category: 'Transportation', spent: 200, budget: 300 },
    { category: 'Entertainment', spent: 150, budget: 200 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('current')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'current'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Current Month
          </button>
          <button
            onClick={() => setTimeRange('previous')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'previous'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Previous Month
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-[var(--color-muted)]">Total Balance</div>
          <div className="text-2xl font-semibold text-[var(--color-text)]">
            ${netBalance.toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Monthly Income</div>
          <div className="text-2xl font-semibold text-green-500">
            ${totalIncome.toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Monthly Expenses</div>
          <div className="text-2xl font-semibold text-red-500">
            ${totalExpenses.toFixed(2)}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Savings Rate</div>
          <div className="text-2xl font-semibold text-[var(--color-primary)]">
            {savingsRate.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Expense Categories</h2>
          <div className="h-80">
            <CategoryPieChart data={categoryData} />
          </div>
        </div>
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Budget Progress</h2>
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

      {/* Recent Transactions */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Recent Transactions</h2>
        <TransactionList
          transactions={filteredTransactions.slice(0, 5)}
          onEdit={() => {}}
          onDelete={() => {}}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard; 
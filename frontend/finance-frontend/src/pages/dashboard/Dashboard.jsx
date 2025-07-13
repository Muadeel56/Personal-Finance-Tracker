import React, { useEffect, useState } from 'react';
import { useBudgets } from '../../contexts/BudgetsContext';
import { useTransactions } from '../../contexts/TransactionContext';
import Card from '../../components/common/Card/Card';
import BudgetProgress from '../../components/common/Budget/BudgetProgress';
import CategoryPieChart from '../../components/common/Charts/CategoryPieChart';
import TransactionList from '../../components/common/Transactions/TransactionList';
import { getDashboardStats } from '../../api/dashboard';

const Dashboard = () => {
  const { transactions, loading } = useTransactions();
  const { budgets = [] } = useBudgets();
  const [timeRange, setTimeRange] = useState('current_month');
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setDashboardLoading(true);
      setError(null);
      try {
        const response = await getDashboardStats(timeRange);
        setDashboardData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);

  // Helper: Calculate spent for a budget
  const getSpentForBudget = (budget) => {
    // For simplicity, sum all transactions in the budget period
    // (If you use category allocations, you can refine this)
    return transactions
      .filter(t => t.date >= budget.start_date && t.date <= budget.end_date)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  if (loading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-red-500">Error Loading Dashboard</h2>
          <p className="text-[var(--color-muted)]">{error}</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics || {
    total_income: 0,
    total_expenses: 0,
    net_balance: 0,
    savings_rate: 0
  };

  const categoryData = dashboardData?.category_breakdown?.map(item => ({
    name: item.category,
    value: item.amount
  })) || [];

  const recentTransactions = dashboardData?.recent_transactions || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('current_month')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'current_month'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Current Month
          </button>
          <button
            onClick={() => setTimeRange('previous_month')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'previous_month'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Previous Month
          </button>
          <button
            onClick={() => setTimeRange('current_year')}
            className={`px-4 py-2 rounded-lg ${
              timeRange === 'current_year'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Current Year
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-[var(--color-muted)]">Total Balance</div>
          <div className="text-2xl font-semibold text-[var(--color-text)]">
            ${stats.net_balance?.toFixed(2) || '0.00'}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Monthly Income</div>
          <div className="text-2xl font-semibold text-green-500">
            ${stats.total_income?.toFixed(2) || '0.00'}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Monthly Expenses</div>
          <div className="text-2xl font-semibold text-red-500">
            ${stats.total_expenses?.toFixed(2) || '0.00'}
          </div>
        </Card>
        <Card>
          <div className="text-[var(--color-muted)]">Savings Rate</div>
          <div className="text-2xl font-semibold text-[var(--color-primary)]">
            {stats.savings_rate?.toFixed(1) || '0.0'}%
          </div>
        </Card>
      </div>

      {/* Budget Summary Section */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Budget Summary</h2>
        {budgets.length === 0 ? (
          <div className="text-gray-500">No budgets found. <a href="/budget" className="text-[var(--color-primary)] underline">Create a budget</a>.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => {
              const spent = getSpentForBudget(b);
              const total = Number(b.total_amount);
              const percent = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
              return (
                <div key={b.id} className="bg-[var(--color-surface)] rounded shadow p-4 flex flex-col justify-between">
                  <div className="font-semibold text-md mb-1">{b.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{b.period_type} | {b.start_date} - {b.end_date}</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full ${percent < 90 ? 'bg-green-500' : percent < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Spent: ${spent.toFixed(2)}</span>
                    <span>Budget: ${total.toFixed(2)}</span>
                  </div>
                  {percent >= 100 && <div className="text-xs text-red-500 mt-1">Over budget!</div>}
                  {percent >= 90 && percent < 100 && <div className="text-xs text-yellow-500 mt-1">Almost at limit</div>}
                </div>
              );
            })}
          </div>
        )}
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
          <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Monthly Trend</h2>
          <div className="space-y-4">
            {dashboardData?.trend_data?.slice(-6).map((month, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-[var(--color-muted)]">{month.month}</span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-500">${month.income.toFixed(2)}</span>
                  <span className="text-red-500">${month.expenses.toFixed(2)}</span>
                  <span className={`${month.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${month.balance.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Recent Transactions</h2>
        <TransactionList
          transactions={recentTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
          loading={false}
        />
      </div>
    </div>
  );
};

export default Dashboard; 
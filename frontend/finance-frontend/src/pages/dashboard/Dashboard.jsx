import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">Dashboard</h1>
              <p className="mt-2 text-[var(--color-muted)]">
                Track your finances and stay on top of your budget
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex bg-[var(--color-surface)] rounded-lg p-1 shadow-sm">
                <button
                  onClick={() => setTimeRange('current_month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    timeRange === 'current_month'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  Current Month
                </button>
                <button
                  onClick={() => setTimeRange('previous_month')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    timeRange === 'previous_month'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  Previous Month
                </button>
                <button
                  onClick={() => setTimeRange('current_year')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    timeRange === 'current_year'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  Current Year
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Total Balance</p>
              <p className="text-2xl font-bold text-[var(--color-text)] mt-1">
                PKR {stats.net_balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="h-12 w-12 bg-[var(--color-primary)] bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-[var(--color-primary)] text-xl">💰</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Monthly Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                PKR {stats.total_income?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">📈</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                PKR {stats.total_expenses?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">📉</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-muted)]">Savings Rate</p>
              <p className="text-2xl font-bold text-[var(--color-primary)] mt-1">
                {stats.savings_rate?.toFixed(1) || '0.0'}%
              </p>
            </div>
            <div className="h-12 w-12 bg-[var(--color-primary)] bg-opacity-10 rounded-lg flex items-center justify-center">
              <span className="text-[var(--color-primary)] text-xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Summary Section */}
      <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Budget Summary</h2>
          <Link to="/budget" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-sm font-medium">
            View All →
          </Link>
        </div>
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[var(--color-primary)] text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No budgets found</h3>
            <p className="text-[var(--color-muted)] mb-4">Create your first budget to start tracking your spending</p>
            <Link to="/budget" className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 transition-colors">
              Create Budget
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((b) => {
              const spent = getSpentForBudget(b);
              const total = Number(b.total_amount);
              const percent = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
              return (
                <div key={b.id} className="bg-[var(--color-surface)] rounded-lg p-4 border border-[var(--color-border)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[var(--color-text)]">{b.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      percent < 90 ? 'bg-green-100 text-green-700' : 
                      percent < 100 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {percent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-xs text-[var(--color-muted)] mb-3">{b.period_type} | {b.start_date} - {b.end_date}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percent < 90 ? 'bg-green-500' : 
                        percent < 100 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Spent: <span className="font-medium text-[var(--color-text)]">PKR {spent.toFixed(2)}</span></span>
                    <span className="text-[var(--color-muted)]">Budget: <span className="font-medium text-[var(--color-text)]">PKR {total.toFixed(2)}</span></span>
                  </div>
                  {percent >= 100 && <div className="text-xs text-red-600 mt-2 font-medium">⚠️ Over budget!</div>}
                  {percent >= 90 && percent < 100 && <div className="text-xs text-yellow-600 mt-2 font-medium">⚠️ Almost at limit</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Expense Categories</h2>
            <Link to="/categories" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-sm font-medium">
              Manage →
            </Link>
          </div>
          {categoryData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-[var(--color-primary)] text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No expense data</h3>
              <p className="text-[var(--color-muted)]">Add some transactions to see your spending breakdown</p>
            </div>
          ) : (
            <div className="h-80">
              <CategoryPieChart data={categoryData} />
            </div>
          )}
        </div>
        
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)]">Monthly Trend</h2>
            <Link to="/reports" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-sm font-medium">
              View Reports →
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData?.trend_data?.slice(-6).map((month, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[var(--color-surface)] rounded-lg">
                <span className="text-sm font-medium text-[var(--color-text)]">{month.month}</span>
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-green-600 font-semibold">PKR {month.income.toFixed(2)}</div>
                    <div className="text-xs text-[var(--color-muted)]">Income</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-semibold">PKR {month.expenses.toFixed(2)}</div>
                    <div className="text-xs text-[var(--color-muted)]">Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold ${month.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      PKR {month.balance.toFixed(2)}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">Balance</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-[var(--color-card)] rounded-xl p-5 shadow-sm border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">Recent Transactions</h2>
          <Link to="/transactions" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 text-sm font-medium">
            View All →
          </Link>
        </div>
        <TransactionList
          transactions={recentTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
          loading={false}
        />
      </div>
    </div>
  </div>
  );
};

export default Dashboard; 
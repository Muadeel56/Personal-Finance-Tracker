import React from 'react';
import { 
  LightBulbIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

const SpendingInsights = ({ transactions = [] }) => {
  // Calculate insights based on transactions
  const calculateInsights = () => {
    if (transactions.length === 0) return [];

    const expenses = transactions.filter(t => t.transaction_type === 'EXPENSE');
    const income = transactions.filter(t => t.transaction_type === 'INCOME');
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    const insights = [];

    // Spending vs Income insight
    if (totalExpenses > totalIncome * 0.8) {
      insights.push({
        type: 'warning',
        icon: ExclamationTriangleIcon,
        title: 'High Spending Alert',
        message: `You're spending ${((totalExpenses / totalIncome) * 100).toFixed(0)}% of your income. Consider reviewing your budget.`,
        color: 'text-[var(--warning)]',
        bgColor: 'bg-[var(--warning-muted)]'
      });
    } else if (totalExpenses < totalIncome * 0.5) {
      insights.push({
        type: 'positive',
        icon: CheckCircleIcon,
        title: 'Great Savings!',
        message: `You're saving ${((1 - totalExpenses / totalIncome) * 100).toFixed(0)}% of your income. Keep it up!`,
        color: 'text-[var(--income)]',
        bgColor: 'bg-[var(--income-muted)]'
      });
    }

    // Category spending insights
    const categorySpending = expenses.reduce((acc, t) => {
      const category = t.category?.name || 'Uncategorized';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];

    if (topCategory && topCategory[1] > totalExpenses * 0.4) {
      insights.push({
        type: 'info',
        icon: LightBulbIcon,
        title: 'Top Spending Category',
        message: `${topCategory[0]} accounts for ${((topCategory[1] / totalExpenses) * 100).toFixed(0)}% of your expenses.`,
        color: 'text-[var(--accent)]',
        bgColor: 'bg-[var(--info-muted)]'
      });
    }

    // Recent spending trend
    const recentExpenses = expenses
      .filter(t => new Date(t.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const previousWeekExpenses = expenses
      .filter(t => {
        const date = new Date(t.date);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        return date <= weekAgo && date > twoWeeksAgo;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    if (previousWeekExpenses > 0) {
      const change = ((recentExpenses - previousWeekExpenses) / previousWeekExpenses) * 100;
      if (change > 20) {
        insights.push({
          type: 'warning',
          icon: TrendingUpIcon,
          title: 'Spending Increased',
          message: `Your spending is up ${change.toFixed(0)}% compared to last week.`,
          color: 'text-[var(--warning)]',
          bgColor: 'bg-[var(--warning-muted)]'
        });
      } else if (change < -20) {
        insights.push({
          type: 'positive',
          icon: TrendingDownIcon,
          title: 'Spending Decreased',
          message: `Great job! Your spending is down ${Math.abs(change).toFixed(0)}% compared to last week.`,
          color: 'text-[var(--income)]',
          bgColor: 'bg-[var(--income-muted)]'
        });
      }
    }

    // No transactions insight
    if (transactions.length === 0) {
      insights.push({
        type: 'info',
        icon: LightBulbIcon,
        title: 'Get Started',
        message: 'Add your first transaction to start tracking your finances and get personalized insights.',
        color: 'text-[var(--accent)]',
        bgColor: 'bg-[var(--info-muted)]'
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = calculateInsights();

  if (insights.length === 0) {
    return (
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Spending Insights</h2>
        <div className="text-center py-8">
          <LightBulbIcon className="w-12 h-12 mx-auto text-[var(--text-disabled)] mb-3" />
          <p className="text-[var(--text-muted)]">Add more transactions to get personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Spending Insights</h2>
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-lg ${insight.bgColor} border border-[var(--border-subtle)]`}>
            <div className="flex items-start gap-3">
              <insight.icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
              <div className="flex-1">
                <h3 className={`font-medium ${insight.color} mb-1`}>
                  {insight.title}
                </h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {insight.message}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingInsights; 
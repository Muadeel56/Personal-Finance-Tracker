import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const BudgetAlert = ({ category, progressPercentage }) => {
  const getAlertType = (percentage) => {
    if (percentage >= 100) return 'over';
    if (percentage >= 90) return 'warning';
    if (percentage >= 75) return 'caution';
    return 'good';
  };

  const getAlertConfig = (type) => {
    const configs = {
      over: {
        icon: ExclamationTriangleIcon,
        title: 'Budget Exceeded!',
        message: `You've exceeded your ${category.name} budget by $${Math.abs(category.budget - category.spent).toLocaleString()}`,
        color: 'text-[var(--expense)]',
        bgColor: 'bg-[var(--expense-muted)]',
        borderColor: 'border-red-200'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        title: 'Budget Warning',
        message: `You've used ${progressPercentage.toFixed(0)}% of your ${category.name} budget`,
        color: 'text-[var(--warning)]',
        bgColor: 'bg-[var(--warning-muted)]',
        borderColor: 'border-[var(--border-subtle)]'
      },
      caution: {
        icon: ExclamationTriangleIcon,
        title: 'Budget Caution',
        message: `You're approaching your ${category.name} budget limit`,
        color: 'text-[var(--warning)]',
        bgColor: 'bg-[var(--warning-muted)]',
        borderColor: 'border-yellow-200'
      },
      good: {
        icon: CheckCircleIcon,
        title: 'On Track',
        message: `Your ${category.name} budget is well managed`,
        color: 'text-[var(--income)]',
        bgColor: 'bg-[var(--income-muted)]',
        borderColor: 'border-[var(--border-subtle)]'
      }
    };
    return configs[type];
  };

  const alertType = getAlertType(progressPercentage);
  const config = getAlertConfig(alertType);

  return (
    <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
      <div className="flex items-start gap-3">
        <config.icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
        <div className="flex-1">
          <h3 className={`font-medium ${config.color} mb-1`}>
            {config.title}
          </h3>
          <p className="text-sm text-[var(--text-primary)] mb-2">
            {config.message}
          </p>
          <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
            <span>Budget: ${category.budget.toLocaleString()}</span>
            <span>Spent: ${category.spent.toLocaleString()}</span>
            <span>Remaining: ${(category.budget - category.spent).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetAlert; 
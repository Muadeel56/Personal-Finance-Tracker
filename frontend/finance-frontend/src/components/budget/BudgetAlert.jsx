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
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      warning: {
        icon: ExclamationTriangleIcon,
        title: 'Budget Warning',
        message: `You've used ${progressPercentage.toFixed(0)}% of your ${category.name} budget`,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      caution: {
        icon: ExclamationTriangleIcon,
        title: 'Budget Caution',
        message: `You're approaching your ${category.name} budget limit`,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      good: {
        icon: CheckCircleIcon,
        title: 'On Track',
        message: `Your ${category.name} budget is well managed`,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
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
          <p className="text-sm text-gray-700 mb-2">
            {config.message}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-600">
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
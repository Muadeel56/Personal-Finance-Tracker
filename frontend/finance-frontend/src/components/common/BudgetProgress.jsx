import React from 'react';
import { formatCurrency } from '../../utils/helpers';

const BudgetProgress = ({ category, spent, budget }) => {
  const percentage = (spent / budget) * 100;
  const isOverBudget = percentage > 100;

  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{category}</span>
        <div className="text-sm text-gray-500">
          <span className={isOverBudget ? 'text-red-500' : 'text-gray-700'}>
            {formatCurrency(spent)}
          </span>
          {' / '}
          <span>{formatCurrency(budget)}</span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      {isOverBudget && (
        <p className="text-xs text-red-500">
          {formatCurrency(spent - budget)} over budget
        </p>
      )}
    </div>
  );
};

export default BudgetProgress; 
import React from 'react';

const BudgetProgress = ({ budget, spent, title }) => {
  // Helper function to format currency in PKR
  const formatCurrencyPKR = (amount) => {
    return `PKR ${Number(amount).toLocaleString('en-PK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = spent > budget;

  const getProgressColor = () => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-[var(--color-card)] rounded-lg p-4 border border-[var(--color-border)]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-[var(--color-text)]">{title}</h3>
        <span className="text-sm text-[var(--color-muted)]">
          {formatCurrencyPKR(spent)} / {formatCurrencyPKR(budget)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-[var(--color-muted)]">
        <span>{percentage.toFixed(1)}% used</span>
        {isOverBudget && (
          <span className="text-red-600 font-medium">
            {formatCurrencyPKR(spent - budget)} over budget
          </span>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress; 
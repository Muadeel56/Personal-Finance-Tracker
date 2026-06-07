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
    if (percentage >= 100) return 'bg-[var(--expense)]';
    if (percentage >= 80) return 'bg-[var(--warning)]';
    return 'bg-[var(--income)]';
  };

  return (
    <div className="bg-[var(--surface-1)] rounded-lg p-4 border border-[var(--border-subtle)]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">{title}</h3>
        <span className="text-sm text-[var(--text-secondary)]">
          {formatCurrencyPKR(spent)} / {formatCurrencyPKR(budget)}
        </span>
      </div>
      
      <div className="w-full bg-[var(--surface-3)] rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-[var(--text-secondary)]">
        <span>{percentage.toFixed(1)}% used</span>
        {isOverBudget && (
          <span className="text-[var(--expense)] font-medium">
            {formatCurrencyPKR(spent - budget)} over budget
          </span>
        )}
      </div>
    </div>
  );
};

export default BudgetProgress; 
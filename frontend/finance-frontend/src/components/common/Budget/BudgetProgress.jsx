import React from 'react';

const BudgetProgress = ({ 
  category, 
  spent, 
  budget, 
  icon: Icon,
  className = '' 
}) => {
  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;
  const progressColor = isOverBudget 
    ? 'bg-red-500' 
    : percentage > 80 
      ? 'bg-yellow-500' 
      : 'bg-green-500';

  return (
    <div className={`bg-[var(--color-card)] rounded-xl p-4 shadow-sm border border-[var(--color-border)] ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="p-2 bg-[var(--color-primary)] bg-opacity-10 rounded-lg">
              <Icon className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
          )}
          <h3 className="font-medium text-[var(--color-text)]">{category}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--color-text)]">
            ${spent.toFixed(2)} / ${budget.toFixed(2)}
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            {isOverBudget ? 'Over budget' : `${percentage.toFixed(1)}% used`}
          </p>
        </div>
      </div>
      <div className="w-full h-2 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className={`h-full ${progressColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default BudgetProgress; 
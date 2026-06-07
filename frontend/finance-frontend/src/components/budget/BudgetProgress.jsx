import React from 'react';
import CategoryIcon from '../categories/CategoryIcon';

const BudgetProgress = ({ category, progressPercentage, progressColor }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-[var(--expense)]';
    if (percentage >= 75) return 'bg-[var(--warning)]';
    if (percentage >= 50) return 'bg-[var(--warning)]';
    return 'bg-[var(--income)]';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 90) return 'text-[var(--expense)]';
    if (percentage >= 75) return 'text-[var(--warning)]';
    if (percentage >= 50) return 'text-[var(--warning)]';
    return 'text-[var(--income)]';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <CategoryIcon icon={category.icon} className="h-6 w-6 text-[var(--text-secondary)]" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[var(--text-primary)] truncate">{category.name}</h3>
          <p className="text-sm text-[var(--text-muted)]">
            ${category.spent.toLocaleString()} of ${category.budget.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-sm font-semibold ${getProgressTextColor(progressPercentage)}`}>
            {progressPercentage.toFixed(0)}%
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            ${(category.budget - category.spent).toLocaleString()} left
          </p>
        </div>
        
        <div className="w-24 bg-[var(--surface-3)] rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progressPercentage)}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress; 
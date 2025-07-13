import React from 'react';

const BudgetProgress = ({ category, progressPercentage, progressColor }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <div className="text-2xl">{category.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{category.name}</h3>
          <p className="text-sm text-gray-500">
            ${category.spent.toLocaleString()} of ${category.budget.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`text-sm font-semibold ${getProgressTextColor(progressPercentage)}`}>
            {progressPercentage.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500">
            ${(category.budget - category.spent).toLocaleString()} left
          </p>
        </div>
        
        <div className="w-24 bg-gray-200 rounded-full h-2">
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
import React from 'react';
import { 
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const BudgetSummary = ({ totalBudget, totalSpent, totalRemaining }) => {
  const progressPercentage = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalRemaining < 0;
  const isOnTrack = progressPercentage <= 80;

  const getStatusColor = () => {
    if (isOverBudget) return 'text-[var(--expense)]';
    if (progressPercentage >= 90) return 'text-[var(--warning)]';
    if (isOnTrack) return 'text-[var(--income)]';
    return 'text-[var(--warning)]';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <ArrowTrendingUpIcon className="w-5 h-5 text-[var(--expense)]" />;
    if (isOnTrack) return <CheckCircleIcon className="w-5 h-5 text-[var(--income)]" />;
    return <ArrowTrendingDownIcon className="w-5 h-5 text-[var(--warning)]" />;
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Over Budget';
    if (isOnTrack) return 'On Track';
    if (progressPercentage >= 90) return 'Almost Full';
    return 'Getting Close';
  };

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="text-center p-4 bg-[var(--info-muted)] rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--info-muted)] rounded-full mx-auto mb-3">
            <BanknotesIcon className="w-6 h-6 text-[var(--accent)]" />
          </div>
          <h3 className="text-sm font-medium text-[var(--info)] mb-1">Total Budget</h3>
          <p className="text-2xl font-bold text-[var(--info)]">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        {/* Total Spent */}
        <div className="text-center p-4 bg-[var(--warning-muted)] rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--warning-muted)] rounded-full mx-auto mb-3">
            <ArrowTrendingDownIcon className="w-6 h-6 text-[var(--warning)]" />
          </div>
          <h3 className="text-sm font-medium text-orange-900 mb-1">Total Spent</h3>
          <p className="text-2xl font-bold text-orange-900">
            ${totalSpent.toLocaleString()}
          </p>
          <p className="text-sm text-orange-700">
            {progressPercentage.toFixed(1)}% of budget
          </p>
        </div>

        {/* Remaining */}
        <div className="text-center p-4 bg-[var(--income-muted)] rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--income-muted)] rounded-full mx-auto mb-3">
            {getStatusIcon()}
          </div>
          <h3 className="text-sm font-medium text-green-900 mb-1">Remaining</h3>
          <p className={`text-2xl font-bold ${isOverBudget ? 'text-[var(--expense)]' : 'text-green-900'}`}>
            ${Math.abs(totalRemaining).toLocaleString()}
          </p>
          <p className={`text-sm ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">Overall Progress</span>
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-[var(--surface-3)] rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-[var(--expense)]' :
              progressPercentage >= 90 ? 'bg-[var(--warning)]' :
              isOnTrack ? 'bg-[var(--income)]' : 'bg-[var(--warning)]'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-4 rounded-lg bg-[var(--surface-2)]">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-[var(--text-primary)]">
              {isOverBudget ? 'Budget Exceeded' : 'Budget Status'}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {isOverBudget 
                ? `You've exceeded your budget by $${Math.abs(totalRemaining).toLocaleString()}. Consider reviewing your spending.`
                : isOnTrack
                ? `Great job! You're staying within your budget with $${totalRemaining.toLocaleString()} remaining.`
                : `You've used ${progressPercentage.toFixed(1)}% of your budget. Keep an eye on your spending.`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummary; 
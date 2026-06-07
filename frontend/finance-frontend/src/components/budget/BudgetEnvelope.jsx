import React from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import CategoryIcon from '../categories/CategoryIcon';

const BudgetEnvelope = ({ category, progressPercentage, progressColor }) => {
  const getStatusIcon = () => {
    if (progressPercentage >= 90) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-[var(--expense)]" />;
    } else if (progressPercentage >= 75) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
    } else if (progressPercentage >= 100) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-[var(--expense)]" />;
    }
    return <CheckCircleIcon className="w-5 h-5 text-[var(--income)]" />;
  };

  const getStatusText = () => {
    if (progressPercentage >= 100) return 'Over Budget';
    if (progressPercentage >= 90) return 'Almost Full';
    if (progressPercentage >= 75) return 'Getting Close';
    return 'On Track';
  };

  const getStatusColor = () => {
    if (progressPercentage >= 90) return 'text-[var(--expense)]';
    if (progressPercentage >= 75) return 'text-[var(--warning)]';
    return 'text-[var(--income)]';
  };

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
      {/* Envelope Header */}
      <div className={`${category.color} rounded-t-xl p-4 text-[var(--surface-1)]`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CategoryIcon icon={category.icon} className="h-6 w-6" />
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-[var(--surface-1)]/80 text-sm">Budget: ${category.budget.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Envelope Content */}
      <div className="p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">Progress</span>
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-[var(--surface-3)] rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                progressPercentage >= 90 ? 'bg-[var(--expense)]' :
                progressPercentage >= 75 ? 'bg-[var(--warning)]' :
                'bg-[var(--income)]'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Amount Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">Spent</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">
              ${category.spent.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">Remaining</p>
            <p className={`text-lg font-semibold ${
              category.remaining < 0 ? 'text-[var(--expense)]' : 'text-[var(--text-primary)]'
            }`}>
              ${category.remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--accent)] text-[var(--surface-1)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium">
            <EyeIcon className="w-4 h-4" />
            View Details
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-[var(--surface-2)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-3)] transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Message */}
        {progressPercentage >= 75 && (
          <div className="mt-3 p-3 bg-[var(--warning-muted)] border border-[var(--border-subtle)] rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-[var(--warning)] mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800">
                  {progressPercentage >= 100 ? 'Budget Exceeded!' : 'Budget Warning'}
                </p>
                <p className="text-orange-700">
                  {progressPercentage >= 100 
                    ? `You've exceeded your budget by $${Math.abs(category.remaining).toLocaleString()}`
                    : `You've used ${progressPercentage.toFixed(0)}% of your budget`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetEnvelope; 
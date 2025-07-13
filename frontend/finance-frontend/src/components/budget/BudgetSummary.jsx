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
    if (isOverBudget) return 'text-red-600';
    if (progressPercentage >= 90) return 'text-orange-600';
    if (isOnTrack) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getStatusIcon = () => {
    if (isOverBudget) return <ArrowTrendingUpIcon className="w-5 h-5 text-red-600" />;
    if (isOnTrack) return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
    return <ArrowTrendingDownIcon className="w-5 h-5 text-orange-600" />;
  };

  const getStatusText = () => {
    if (isOverBudget) return 'Over Budget';
    if (isOnTrack) return 'On Track';
    if (progressPercentage >= 90) return 'Almost Full';
    return 'Getting Close';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Budget */}
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
            <BanknotesIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-blue-900 mb-1">Total Budget</h3>
          <p className="text-2xl font-bold text-blue-900">
            ${totalBudget.toLocaleString()}
          </p>
        </div>

        {/* Total Spent */}
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
            <ArrowTrendingDownIcon className="w-6 h-6 text-orange-600" />
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
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
            {getStatusIcon()}
          </div>
          <h3 className="text-sm font-medium text-green-900 mb-1">Remaining</h3>
          <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-900'}`}>
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
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className={`text-sm font-semibold ${getStatusColor()}`}>
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isOverBudget ? 'bg-red-500' :
              progressPercentage >= 90 ? 'bg-orange-500' :
              isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 p-4 rounded-lg bg-gray-50">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-gray-900">
              {isOverBudget ? 'Budget Exceeded' : 'Budget Status'}
            </p>
            <p className="text-sm text-gray-600">
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
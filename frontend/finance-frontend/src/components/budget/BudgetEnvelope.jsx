import React from 'react';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const BudgetEnvelope = ({ category, progressPercentage, progressColor }) => {
  const getStatusIcon = () => {
    if (progressPercentage >= 90) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
    } else if (progressPercentage >= 75) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />;
    } else if (progressPercentage >= 100) {
      return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    }
    return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (progressPercentage >= 100) return 'Over Budget';
    if (progressPercentage >= 90) return 'Almost Full';
    if (progressPercentage >= 75) return 'Getting Close';
    return 'On Track';
  };

  const getStatusColor = () => {
    if (progressPercentage >= 90) return 'text-red-600';
    if (progressPercentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Envelope Header */}
      <div className={`${category.color} rounded-t-xl p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <p className="text-white/80 text-sm">Budget: ${category.budget.toLocaleString()}</p>
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
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className={`text-sm font-semibold ${getStatusColor()}`}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                progressPercentage >= 90 ? 'bg-red-500' :
                progressPercentage >= 75 ? 'bg-orange-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Amount Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Spent</p>
            <p className="text-lg font-semibold text-gray-900">
              ${category.spent.toLocaleString()}
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Remaining</p>
            <p className={`text-lg font-semibold ${
              category.remaining < 0 ? 'text-red-600' : 'text-gray-900'
            }`}>
              ${category.remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <EyeIcon className="w-4 h-4" />
            View Details
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Message */}
        {progressPercentage >= 75 && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-orange-600 mt-0.5" />
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
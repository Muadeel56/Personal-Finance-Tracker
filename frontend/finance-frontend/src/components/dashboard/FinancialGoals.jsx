import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const FinancialGoals = ({ goals = [] }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Financial Goals</h2>
        <Link 
          to="/goals"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PlusIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-500 mb-4">Set your first financial goal to start tracking your progress</p>
          <Link
            to="/goals/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Goal
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            
            return (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{goal.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">{goal.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getProgressTextColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {remaining > 0 ? `$${remaining.toLocaleString()} to go` : 'Goal reached! 🎉'}
                  </span>
                  <Link 
                    to={`/goals/${goal.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
          
          <Link
            to="/goals/new"
            className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Goal
          </Link>
        </div>
      )}
    </div>
  );
};

export default FinancialGoals; 
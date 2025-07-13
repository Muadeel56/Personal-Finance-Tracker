import React, { useState } from 'react';
import { 
  PlusIcon, 
  FlagIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 6500,
      icon: '🛡️',
      color: 'blue',
      deadline: '2024-12-31',
      category: 'Savings',
      description: 'Build a 6-month emergency fund',
      isCompleted: false
    },
    {
      id: 2,
      name: 'Vacation Fund',
      target: 5000,
      current: 3200,
      icon: '✈️',
      color: 'green',
      deadline: '2024-08-15',
      category: 'Travel',
      description: 'Save for summer vacation',
      isCompleted: false
    },
    {
      id: 3,
      name: 'New Car',
      target: 25000,
      current: 8500,
      icon: '🚙',
      color: 'purple',
      deadline: '2025-06-30',
      category: 'Transportation',
      description: 'Down payment for a new car',
      isCompleted: false
    },
    {
      id: 4,
      name: 'Home Renovation',
      target: 15000,
      current: 15000,
      icon: '🏠',
      color: 'orange',
      deadline: '2024-05-01',
      category: 'Home',
      description: 'Kitchen renovation project',
      isCompleted: true
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, completed

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-orange-500 text-orange-600',
      red: 'bg-red-500 text-red-600',
      pink: 'bg-pink-500 text-pink-600'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-600';
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return !goal.isCompleted;
    if (filter === 'completed') return goal.isCompleted;
    return true;
  });

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const overallProgress = (totalCurrent / totalTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Financial Goals</h1>
            <p className="text-purple-100">
              Set, track, and achieve your financial milestones
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Goal
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <FlagIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Target</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${totalTarget.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Saved</h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalCurrent.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircleIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
            <p className="text-2xl font-bold text-purple-600">
              {overallProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All Goals', count: goals.length },
            { key: 'active', label: 'Active', count: goals.filter(g => !g.isCompleted).length },
            { key: 'completed', label: 'Completed', count: goals.filter(g => g.isCompleted).length }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption.label}
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                {filterOption.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target);
          const timeRemaining = getTimeRemaining(goal.deadline);
          
          return (
            <div key={goal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Goal Header */}
              <div className={`${getColorClasses(goal.color).split(' ')[0]} rounded-t-xl p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className="text-white/80 text-sm">{goal.category}</p>
                    </div>
                  </div>
                  {goal.isCompleted && (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>

              {/* Goal Content */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
                
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Saved</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${goal.current.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Target</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{timeRemaining}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Update Progress
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <ClockIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Completion Status */}
                {goal.isCompleted && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Goal completed! 🎉
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FlagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'completed' ? 'No completed goals yet' : 'No goals yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'completed' 
              ? 'Start working on your goals to see them here'
              : 'Create your first financial goal to start tracking your progress'
            }
          </p>
          {filter !== 'completed' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Goal
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Goals; 
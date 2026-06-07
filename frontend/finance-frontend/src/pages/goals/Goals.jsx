import React, { useState } from 'react';
import { 
  PlusIcon, 
  FlagIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
  TruckIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const GOAL_ICONS = {
  emergency: ShieldCheckIcon,
  vacation: PaperAirplaneIcon,
  car: TruckIcon,
  home: HomeIcon,
};

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Emergency Fund',
      target: 10000,
      current: 6500,
      iconKey: 'emergency',
      color: 'emerald',
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
      iconKey: 'vacation',
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
      iconKey: 'car',
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
      iconKey: 'home',
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
    if (percentage >= 100) return 'bg-[var(--income)]';
    if (percentage >= 75) return 'bg-[var(--accent)]';
    if (percentage >= 50) return 'bg-[var(--warning)]';
    return 'bg-[var(--expense)]';
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
      emerald: 'bg-[var(--accent)] text-[var(--accent)]',
      green: 'bg-[var(--income)] text-[var(--income)]',
      purple: 'bg-[var(--info-muted)] text-[var(--info)]',
      orange: 'bg-[var(--warning)] text-[var(--warning)]',
      red: 'bg-[var(--expense)] text-[var(--expense)]',
      pink: 'bg-[var(--expense-muted)] text-[var(--expense)]'
    };
    return colorMap[color] || 'bg-[var(--surface-2)]0 text-[var(--text-secondary)]';
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-[var(--surface-1)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Financial Goals</h1>
            <p className="text-purple-100">
              Set, track, and achieve your financial milestones
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[var(--surface-1)]/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-[var(--surface-1)]/30 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Create Goal
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[var(--info-muted)] rounded-full flex items-center justify-center mb-3">
              <FlagIcon className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Total Target</h3>
            <p className="text-2xl font-bold text-[var(--accent)]">
              ${totalTarget.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[var(--income-muted)] rounded-full flex items-center justify-center mb-3">
              <CurrencyDollarIcon className="w-8 h-8 text-[var(--income)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Total Saved</h3>
            <p className="text-2xl font-bold text-[var(--income)]">
              ${totalCurrent.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-[var(--info-muted)] rounded-full flex items-center justify-center mb-3">
              <CheckCircleIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Overall Progress</h3>
            <p className="text-2xl font-bold text-purple-600">
              {overallProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 bg-[var(--surface-2)] p-1 rounded-lg">
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
                  ? 'bg-[var(--surface-1)] text-[var(--text-primary)] shadow-[var(--card-shadow)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {filterOption.label}
              <span className="bg-[var(--surface-3)] text-[var(--text-primary)] px-2 py-1 rounded-full text-xs">
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
          const GoalIcon = GOAL_ICONS[goal.iconKey] || FlagIcon;
          
          return (
            <div key={goal.id} className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] border border-[var(--border-subtle)] hover:shadow-md transition-shadow">
              {/* Goal Header */}
              <div className={`${getColorClasses(goal.color).split(' ')[0]} rounded-t-xl p-4 text-[var(--surface-1)]`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--surface-1)]/20">
                      <GoalIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <p className="text-[var(--surface-1)]/80 text-sm">{goal.category}</p>
                    </div>
                  </div>
                  {goal.isCompleted && (
                    <CheckCircleIcon className="w-6 h-6 text-[var(--surface-1)]" />
                  )}
                </div>
              </div>

              {/* Goal Content */}
              <div className="p-4">
                <p className="text-[var(--text-secondary)] text-sm mb-4">{goal.description}</p>
                
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">Progress</span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-[var(--surface-3)] rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amount Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Saved</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      ${goal.current.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                    <p className="text-sm text-[var(--text-secondary)]">Target</p>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      ${goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-4">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{timeRemaining}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--accent)] text-[var(--surface-1)] rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium">
                    Update Progress
                  </button>
                  <button className="flex items-center justify-center px-3 py-2 bg-[var(--surface-2)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-3)] transition-colors">
                    <ClockIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Completion Status */}
                {goal.isCompleted && (
                  <div className="mt-3 p-3 bg-[var(--income-muted)] border border-[var(--border-subtle)] rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-[var(--income)]" />
                      <span className="text-sm font-medium text-[var(--income)]">
                        Goal completed!
                        <CheckCircleIcon className="w-4 h-4 inline ml-1" />
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
          <div className="w-24 h-24 mx-auto bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-6">
            <FlagIcon className="w-12 h-12 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            {filter === 'completed' ? 'No completed goals yet' : 'No goals yet'}
          </h3>
          <p className="text-[var(--text-muted)] mb-6">
            {filter === 'completed' 
              ? 'Start working on your goals to see them here'
              : 'Create your first financial goal to start tracking your progress'
            }
          </p>
          {filter !== 'completed' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--surface-1)] px-6 py-3 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
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
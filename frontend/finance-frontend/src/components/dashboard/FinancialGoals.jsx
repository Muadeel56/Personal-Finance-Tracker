import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, ArrowRightIcon, CheckCircleIcon, FlagIcon } from '@heroicons/react/24/outline';

const FinancialGoals = ({ goals = [] }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-[var(--income)]';
    if (percentage >= 60) return 'bg-[var(--accent)]';
    if (percentage >= 40) return 'bg-[var(--warning)]';
    return 'bg-[var(--expense)]';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 80) return 'text-[var(--income)]';
    if (percentage >= 60) return 'text-[var(--accent)]';
    if (percentage >= 40) return 'text-[var(--warning)]';
    return 'text-[var(--expense)]';
  };

  return (
    <div className="bg-[var(--surface-1)] rounded-xl shadow-[var(--card-shadow)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Financial Goals</h2>
        <Link 
          to="/goals"
          className="text-sm text-[var(--accent)] hover:text-[var(--info)] font-medium flex items-center gap-1"
        >
          View all
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-[var(--surface-2)] rounded-full flex items-center justify-center mb-4">
            <PlusIcon className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">No goals yet</h3>
          <p className="text-[var(--text-muted)] mb-4">Set your first financial goal to start tracking your progress</p>
          <Link
            to="/goals/new"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-[var(--surface-1)] px-4 py-2 rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
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
              <div key={goal.id} className="p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--border-subtle)] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
                      <FlagIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">{goal.name}</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        ${goal.current.toLocaleString()} of ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${getProgressTextColor(percentage)}`}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-[var(--surface-3)] rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-muted)] flex items-center gap-1">
                    {remaining > 0 ? `$${remaining.toLocaleString()} to go` : (
                      <>Goal reached! <CheckCircleIcon className="w-4 h-4 text-[var(--income)]" /></>
                    )}
                  </span>
                  <Link 
                    to={`/goals/${goal.id}`}
                    className="text-[var(--accent)] hover:text-[var(--info)] font-medium"
                  >
                    Details
                  </Link>
                </div>
              </div>
            );
          })}
          
          <Link
            to="/goals/new"
            className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-[var(--border-subtle)] rounded-lg text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
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
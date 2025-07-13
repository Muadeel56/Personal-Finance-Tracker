import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusIcon, 
  ChartBarIcon, 
  BanknotesIcon, 
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const QuickActions = () => {
  const actions = [
    {
      name: 'Add Income',
      icon: ArrowUpIcon,
      color: 'bg-green-500',
      href: '/transactions/add?type=income',
      description: 'Record new income'
    },
    {
      name: 'Add Expense',
      icon: ArrowDownIcon,
      color: 'bg-red-500',
      href: '/transactions/add?type=expense',
      description: 'Record new expense'
    },
    {
      name: 'View Reports',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
      href: '/reports',
      description: 'Financial insights'
    },
    {
      name: 'Manage Budget',
      icon: BanknotesIcon,
      color: 'bg-purple-500',
      href: '/budget',
      description: 'Budget settings'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      {actions.map((action) => (
        <Link
          key={action.name}
          to={action.href}
          className="group relative flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          title={action.description}
        >
          <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
            <action.icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-white hidden lg:block">
            {action.name}
          </span>
          
          {/* Tooltip for mobile */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none lg:hidden">
            {action.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions; 
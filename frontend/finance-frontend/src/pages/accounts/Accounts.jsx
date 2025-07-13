import React, { useState } from 'react';
import { 
  PlusIcon, 
  BanknotesIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  WalletIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: 'Chase Checking',
      account_type: 'CHECKING',
      balance: 5240.50,
      currency: 'USD',
      institution: 'Chase Bank',
      account_number: '****1234',
      is_active: true,
      color: 'blue',
      icon: '🏦'
    },
    {
      id: 2,
      name: 'Wells Fargo Savings',
      account_type: 'SAVINGS',
      balance: 12500.00,
      currency: 'USD',
      institution: 'Wells Fargo',
      account_number: '****5678',
      is_active: true,
      color: 'green',
      icon: '💰'
    },
    {
      id: 3,
      name: 'Chase Credit Card',
      account_type: 'CREDIT',
      balance: -1250.75,
      currency: 'USD',
      institution: 'Chase Bank',
      account_number: '****9012',
      is_active: true,
      color: 'red',
      icon: '💳'
    },
    {
      id: 4,
      name: 'Cash Wallet',
      account_type: 'CASH',
      balance: 450.00,
      currency: 'USD',
      institution: 'Personal',
      account_number: '',
      is_active: true,
      color: 'yellow',
      icon: '💵'
    },
    {
      id: 5,
      name: 'Vanguard IRA',
      account_type: 'INVESTMENT',
      balance: 45000.00,
      currency: 'USD',
      institution: 'Vanguard',
      account_number: '****3456',
      is_active: true,
      color: 'purple',
      icon: '📈'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  const getAccountTypeIcon = (type) => {
    const icons = {
      'CHECKING': BanknotesIcon,
      'SAVINGS': BuildingLibraryIcon,
      'CREDIT': CreditCardIcon,
      'CASH': WalletIcon,
      'INVESTMENT': ChartBarIcon
    };
    return icons[type] || BanknotesIcon;
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      'CHECKING': 'Checking Account',
      'SAVINGS': 'Savings Account',
      'CREDIT': 'Credit Card',
      'CASH': 'Cash',
      'INVESTMENT': 'Investment Account'
    };
    return labels[type] || 'Other';
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-500 text-blue-600',
      green: 'bg-green-500 text-green-600',
      red: 'bg-red-500 text-red-600',
      yellow: 'bg-yellow-500 text-yellow-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-orange-500 text-orange-600'
    };
    return colorMap[color] || 'bg-gray-500 text-gray-600';
  };

  const getBalanceColor = (balance, type) => {
    if (type === 'CREDIT') {
      return balance < 0 ? 'text-green-600' : 'text-red-600';
    }
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getBalancePrefix = (balance, type) => {
    if (type === 'CREDIT') {
      return balance < 0 ? '+' : '';
    }
    return '';
  };

  const filteredAccounts = accounts.filter(account => {
    if (filter === 'active') return account.is_active;
    if (filter === 'inactive') return !account.is_active;
    return true;
  });

  const totalBalance = accounts.reduce((sum, account) => {
    if (account.account_type === 'CREDIT') {
      return sum - account.balance; // Credit cards are negative
    }
    return sum + account.balance;
  }, 0);

  const totalAssets = accounts
    .filter(account => account.account_type !== 'CREDIT')
    .reduce((sum, account) => sum + account.balance, 0);

  const totalLiabilities = accounts
    .filter(account => account.account_type === 'CREDIT')
    .reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Accounts</h1>
            <p className="text-indigo-100">
              Manage your bank accounts, credit cards, and investments
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <BanknotesIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Net Worth</h3>
            <p className={`text-2xl font-bold ${getBalanceColor(totalBalance)}`}>
              ${totalBalance.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <BuildingLibraryIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Assets</h3>
            <p className="text-2xl font-bold text-green-600">
              ${totalAssets.toLocaleString()}
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
              <CreditCardIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Liabilities</h3>
            <p className="text-2xl font-bold text-red-600">
              ${Math.abs(totalLiabilities).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All Accounts', count: accounts.length },
            { key: 'active', label: 'Active', count: accounts.filter(a => a.is_active).length },
            { key: 'inactive', label: 'Inactive', count: accounts.filter(a => !a.is_active).length }
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

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => {
          const IconComponent = getAccountTypeIcon(account.account_type);
          
          return (
            <div key={account.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              {/* Account Header */}
              <div className={`${getColorClasses(account.color).split(' ')[0]} rounded-t-xl p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{account.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{account.name}</h3>
                      <p className="text-white/80 text-sm">{account.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.is_active && (
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    )}
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Account Content */}
              <div className="p-4">
                {/* Account Type */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <IconComponent className="w-4 h-4" />
                  <span>{getAccountTypeLabel(account.account_type)}</span>
                </div>

                {/* Balance */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className={`text-2xl font-bold ${getBalanceColor(account.balance, account.account_type)}`}>
                    {getBalancePrefix(account.balance, account.account_type)}${Math.abs(account.balance).toLocaleString()}
                  </p>
                </div>

                {/* Account Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Account Number:</span>
                    <span className="font-mono">{account.account_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span>{account.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={account.is_active ? 'text-green-600' : 'text-red-600'}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </span>
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
                  <button className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <BanknotesIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filter === 'inactive' ? 'No inactive accounts' : 'No accounts yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'inactive' 
              ? 'All your accounts are currently active'
              : 'Add your first account to start tracking your finances'
            }
          </p>
          {filter !== 'inactive' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Account
            </button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Account Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <p>Keep your account information up to date for accurate tracking</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <p>Regularly reconcile your accounts to ensure accuracy</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <p>Use different account types to organize your money effectively</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <p>Monitor your credit card balances to avoid high interest charges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accounts; 
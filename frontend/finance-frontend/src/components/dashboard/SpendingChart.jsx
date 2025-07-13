import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const SpendingChart = ({ data = [] }) => {
  // Mock data for demonstration
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 85 },
    { day: 'Wed', amount: 200 },
    { day: 'Thu', amount: 150 },
    { day: 'Fri', amount: 300 },
    { day: 'Sat', amount: 180 },
    { day: 'Sun', amount: 95 }
  ];

  const maxAmount = Math.max(...chartData.map(d => d.amount));

  const getBarHeight = (amount) => {
    return (amount / maxAmount) * 100;
  };

  const getBarColor = (amount) => {
    const percentage = (amount / maxAmount) * 100;
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-orange-500';
    if (percentage > 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Spending</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ChartBarIcon className="w-4 h-4" />
          <span>Last 7 days</span>
        </div>
      </div>

      <div className="flex items-end justify-between h-48 gap-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full h-full flex items-end">
              <div
                className={`w-full rounded-t-lg transition-all duration-300 ${getBarColor(item.amount)}`}
                style={{ height: `${getBarHeight(item.amount)}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${item.amount}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 mt-2">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total spent this week:</span>
          <span className="font-semibold text-gray-900">
            ${chartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-600">Daily average:</span>
          <span className="font-semibold text-gray-900">
            ${(chartData.reduce((sum, item) => sum + item.amount, 0) / chartData.length).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart; 
import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data = [], title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--color-muted)',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: !!title,
        text: title,
        color: 'var(--color-text)',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'var(--color-surface)',
        titleColor: 'var(--color-text)',
        bodyColor: 'var(--color-text)',
        borderColor: 'var(--color-border)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // Enhanced color palette with better contrast
  const colors = [
    '#3B82F6', // blue
    '#EF4444', // red
    '#10B981', // green
    '#F59E0B', // yellow
    '#8B5CF6', // purple
    '#06B6D4', // cyan
    '#F97316', // orange
    '#EC4899', // pink
    '#6366F1', // indigo
    '#84CC16', // lime
  ];

  const chartData = {
    labels: data.map(item => item.name || item.category),
    datasets: [
      {
        data: data.map(item => item.value || item.amount),
        backgroundColor: colors.slice(0, data.length),
        borderColor: 'rgb(255, 255, 255)',
        borderWidth: 2,
        hoverBorderColor: 'rgb(255, 255, 255)',
        hoverBorderWidth: 3,
      },
    ],
  };

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No expense data available</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add some transactions to see your spending breakdown</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-2xl p-6 shadow-lg border border-[var(--color-border)] w-full h-full flex flex-col">
      <div className="relative w-full" style={{height: 'min(320px,40vw)'}}>
        <Pie options={options} data={chartData} style={{width: '100%', height: '100%'}} />
        {/* Summary overlay for small screens */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--color-text)]">
              ${data.reduce((sum, item) => sum + (item.value || item.amount), 0).toFixed(2)}
            </div>
            <div className="text-sm text-[var(--color-muted)]">Total Expenses</div>
          </div>
        </div>
      </div>
      {/* Mobile-friendly legend */}
      <div className="mt-4 lg:hidden">
        <div className="grid grid-cols-2 gap-2">
          {data.slice(0, 6).map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index] }}
              ></div>
              <span className="text-[var(--color-muted)] truncate">
                {item.name || item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart; 
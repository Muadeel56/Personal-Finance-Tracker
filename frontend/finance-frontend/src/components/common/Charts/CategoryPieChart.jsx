import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data, title }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--color-text)',
          font: {
            size: 12,
          },
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
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC249',
          '#EA526F',
          '#23B5D3',
          '#279AF1',
        ],
        borderColor: 'var(--color-card)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-[var(--color-card)] rounded-xl p-4 shadow-sm border border-[var(--color-border)]">
      <div style={{ height: '300px' }}>
        <Pie options={options} data={chartData} />
      </div>
    </div>
  );
};

export default CategoryPieChart; 
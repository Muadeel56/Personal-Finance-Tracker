import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getCategoryColor } from '../../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map(category => category.total),
        backgroundColor: Object.keys(data).map(category => getCategoryColor(category)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart; 
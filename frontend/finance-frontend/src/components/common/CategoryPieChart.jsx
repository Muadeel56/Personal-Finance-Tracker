import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getCategoryColor } from '../../utils/helpers';
import { useChartTheme } from '../../hooks/useChartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ data }) => {
  const chartTheme = useChartTheme();

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          color: chartTheme.colors.text,
          font: { size: 12, family: 'var(--font-body)' },
        },
      },
      tooltip: {
        ...chartTheme.plugins.tooltip,
        callbacks: {
          label(context) {
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
  }), [chartTheme]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data).map((category) => category.total),
        backgroundColor: Object.keys(data).map((category) => getCategoryColor(category)),
        borderColor: chartTheme.colors.border,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="h-[300px]">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart;

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data, title, height = '300px' }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--color-border)',
        },
        ticks: {
          color: 'var(--color-text)',
        },
      },
      x: {
        grid: {
          color: 'var(--color-border)',
        },
        ticks: {
          color: 'var(--color-text)',
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart; 
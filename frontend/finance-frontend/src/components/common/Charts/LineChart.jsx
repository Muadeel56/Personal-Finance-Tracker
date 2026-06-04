import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = ({ data, title, height = '300px' }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'var(--font-body)', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: 'var(--text-primary)',
        font: { family: 'var(--font-display)', size: 15, weight: '600' },
      },
      tooltip: {
        backgroundColor: 'var(--surface-2)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-subtle)',
        borderWidth: 1,
        cornerRadius: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'var(--grid-line)', drawBorder: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-mono)', size: 11 } },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-body)', size: 12 } },
        border: { display: false },
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

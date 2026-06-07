import { useMemo } from 'react';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useChartTheme } from '../../hooks/useChartTheme';
import { getCategoryColors, getCategoryBackgrounds } from '../../utils/chartTheme';

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const CategoryPieChart = ({ data = [], title }) => {
  const chartTheme = useChartTheme();
  const total = data.reduce((s, i) => s + (i.value || i.amount || 0), 0);
  const categoryColors = useMemo(() => getCategoryColors(), [chartTheme.theme]);
  const categoryBgs = useMemo(() => getCategoryBackgrounds(0.18), [chartTheme.theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '66%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: chartTheme.colors.text,
          font: { family: 'var(--font-body)', size: 12, weight: '500' },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        ...chartTheme.plugins.tooltip,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` PKR ${fmt(ctx.raw)} (${total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0}%)`,
        },
      },
    },
    animation: { animateRotate: true, animateScale: true, duration: 900 },
  };

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
        <div style={{ textAlign: 'center' }}>
          <ChartPieIcon className="h-10 w-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No expense data yet</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((i) => i.name || i.category),
    datasets: [{
      data: data.map((i) => i.value || i.amount),
      backgroundColor: categoryBgs.slice(0, data.length),
      borderColor: categoryColors.slice(0, data.length),
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: '200px' }}>
      <Doughnut options={options} data={chartData} />
      <div style={{
        position: 'absolute', top: '50%', left: '30%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', pointerEvents: 'none',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
          PKR {fmt(total)}
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Total
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;

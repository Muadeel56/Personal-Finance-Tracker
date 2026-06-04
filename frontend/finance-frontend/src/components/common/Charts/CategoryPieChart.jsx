import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CAT_COLORS = ['#6366F1','#10B981','#F43F5E','#F59E0B','#8B5CF6','#0EA5E9','#14B8A6','#F97316'];
const CAT_BG = ['rgba(99,102,241,0.18)','rgba(16,185,129,0.18)','rgba(244,63,94,0.18)','rgba(245,158,11,0.18)','rgba(139,92,246,0.18)','rgba(14,165,233,0.18)','rgba(20,184,166,0.18)','rgba(249,115,22,0.18)'];
const fmt = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const CategoryPieChart = ({ data = [], title }) => {
  const total = data.reduce((s, i) => s + (i.value || i.amount || 0), 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '66%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'var(--font-body)', size: 12, weight: '500' },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'var(--surface-2)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-subtle)',
        borderWidth: 1,
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
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🍩</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No expense data yet</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((i) => i.name || i.category),
    datasets: [{
      data: data.map((i) => i.value || i.amount),
      backgroundColor: CAT_BG.slice(0, data.length),
      borderColor: CAT_COLORS.slice(0, data.length),
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

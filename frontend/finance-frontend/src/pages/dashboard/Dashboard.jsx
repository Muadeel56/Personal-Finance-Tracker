import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { useBudgets } from '../../contexts/BudgetsContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { getDashboardStats } from '../../api/dashboard';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const CAT_COLORS = ['#6366F1', '#10B981', '#F43F5E', '#F59E0B', '#8B5CF6', '#0EA5E9', '#14B8A6'];
const CAT_BG    = ['rgba(99,102,241,0.15)', 'rgba(16,185,129,0.15)', 'rgba(244,63,94,0.15)', 'rgba(245,158,11,0.15)', 'rgba(139,92,246,0.15)', 'rgba(14,165,233,0.15)', 'rgba(20,184,166,0.15)'];

const fmt = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const RingProgress = ({ pct, color = 'var(--accent)' }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="4" />
      <circle
        cx="28" cy="28" r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.22,.61,.36,1)' }}
      />
      <text x="28" y="32" textAnchor="middle" fontSize="10" fontWeight="700"
        fontFamily="var(--font-mono)" fill={color}>
        {Math.round(pct)}%
      </text>
    </svg>
  );
};

const StatCard = ({ label, value, sub, badge, badgeType, ring, ringColor, icon, iconBg }) => (
  <div className="card rise" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="t-label dim">{label}</span>
      {icon && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: iconBg || 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
        }}>
          {icon}
        </div>
      )}
      {ring !== undefined && <RingProgress pct={ring} color={ringColor} />}
    </div>
    <div>
      <div className="num" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>}
    </div>
    {badge && (
      <span className={`badge badge-${badgeType || 'amber'}`} style={{ alignSelf: 'flex-start' }}>
        {badge}
      </span>
    )}
  </div>
);

const Dashboard = () => {
  const { loading } = useTransactions();
  const { budgets = [], budgetOverview, fetchBudgetOverview } = useBudgets();
  const [timeRange, setTimeRange] = useState('current_month');
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [error, setError] = useState(null);

  const hasInitialized = useRef(false);
  const isFetchingDashboard = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    if (isFetchingDashboard.current) return;
    isFetchingDashboard.current = true;
    setDashboardLoading(true);
    setError(null);
    try {
      const response = await getDashboardStats(timeRange);
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setDashboardLoading(false);
      isFetchingDashboard.current = false;
    }
  }, [timeRange]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchBudgetOverview();
      fetchDashboardData();
    }
  }, []);

  useEffect(() => {
    if (hasInitialized.current) fetchDashboardData();
  }, [timeRange, fetchDashboardData]);

  const getBudgetData = (budgetId) => budgetOverview?.budgets?.find((b) => b.id === budgetId) || null;

  if (loading || dashboardLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="badge badge-down" style={{ fontSize: '14px', padding: '6px 14px', marginBottom: '8px' }}>Error</div>
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.statistics || { total_income: 0, total_expenses: 0, net_balance: 0, savings_rate: 0 };
  const categoryData = dashboardData?.category_breakdown?.map((i) => ({ name: i.category, value: i.amount })) || [];
  const recentTransactions = dashboardData?.recent_transactions || [];
  const trendData = dashboardData?.trend_data?.slice(-6) || [];

  /* ---- Chart configs ---- */
  const lineData = {
    labels: trendData.map((m) => m.month),
    datasets: [
      {
        label: 'Income',
        data: trendData.map((m) => m.income),
        borderColor: 'var(--income)',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'var(--income)',
        borderWidth: 2,
      },
      {
        label: 'Expenses',
        data: trendData.map((m) => m.expenses),
        borderColor: 'var(--expense)',
        backgroundColor: 'rgba(239,68,68,0.06)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'var(--expense)',
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'var(--font-body)', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'var(--surface-2)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-secondary)',
        borderColor: 'var(--border-subtle)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        callbacks: {
          label: (ctx) => ` PKR ${fmt(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'var(--grid-line)', drawBorder: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-mono)', size: 11 }, callback: (v) => `${fmt(v)}` },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'var(--font-body)', size: 12 } },
        border: { display: false },
      },
    },
  };

  const totalCat = categoryData.reduce((s, i) => s + i.value, 0);
  const donutData = {
    labels: categoryData.map((i) => i.name),
    datasets: [{
      data: categoryData.map((i) => i.value),
      backgroundColor: CAT_BG.slice(0, categoryData.length),
      borderColor: CAT_COLORS.slice(0, categoryData.length),
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text-secondary)',
          font: { family: 'var(--font-body)', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 14,
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
          label: (ctx) => ` PKR ${fmt(ctx.raw)} (${totalCat > 0 ? ((ctx.raw / totalCat) * 100).toFixed(1) : 0}%)`,
        },
      },
    },
    animation: { animateRotate: true, animateScale: true, duration: 900 },
  };

  const RANGE_OPTS = [
    { value: 'current_month', label: 'This Month' },
    { value: 'previous_month', label: 'Last Month' },
    { value: 'current_year', label: 'This Year' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Dashboard</h1>
          <p>Track your finances and stay on top of your budget</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface-1)', border: 'var(--card-border)', borderRadius: '12px', padding: '4px', gap: '2px', boxShadow: 'var(--card-shadow)' }}>
          {RANGE_OPTS.map((o) => (
            <button
              key={o.value}
              onClick={() => setTimeRange(o.value)}
              style={{
                padding: '7px 14px',
                borderRadius: '9px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                border: 'none',
                cursor: 'pointer',
                background: timeRange === o.value ? 'var(--accent-grad)' : 'transparent',
                color: timeRange === o.value ? '#1A1206' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zone A — KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          label="Net Balance"
          value={`PKR ${fmt(stats.net_balance)}`}
          sub="Total across all accounts"
          icon="💰"
          iconBg="var(--accent-glow)"
        />
        <StatCard
          label="Income"
          value={`PKR ${fmt(stats.total_income)}`}
          sub="This period"
          badge="+ Earned"
          badgeType="up"
          icon="📈"
          iconBg="var(--income-muted)"
        />
        <StatCard
          label="Expenses"
          value={`PKR ${fmt(stats.total_expenses)}`}
          sub="This period"
          badge="Spent"
          badgeType="down"
          icon="📉"
          iconBg="var(--expense-muted)"
        />
        <StatCard
          label="Savings Rate"
          value={`${(stats.savings_rate ?? 0).toFixed(1)}%`}
          sub="Of total income saved"
          ring={stats.savings_rate ?? 0}
          ringColor={stats.savings_rate >= 20 ? 'var(--income)' : stats.savings_rate >= 10 ? 'var(--accent)' : 'var(--expense)'}
        />
      </div>

      {/* Zone B — Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>

        {/* Cash Flow chart */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span className="section-title">Cash Flow</span>
            <Link to="/reports" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Reports →
            </Link>
          </div>
          {trendData.length === 0 ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No trend data yet</p>
              </div>
            </div>
          ) : (
            <div style={{ height: '220px' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>

        {/* Spending by Category */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span className="section-title">Spending by Category</span>
            <Link to="/categories" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Manage →
            </Link>
          </div>
          {categoryData.length === 0 ? (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🍩</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No category data yet</p>
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', height: '220px' }}>
              <Doughnut data={donutData} options={donutOptions} />
              <div style={{
                position: 'absolute', top: '50%', left: '30%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center', pointerEvents: 'none',
              }}>
                <div className="num" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  PKR {fmt(totalCat)}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Total
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone C — Budget Overview */}
      <div className="card" style={{ padding: '22px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span className="section-title">Budget Overview</span>
          <Link to="/budget" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            View All →
          </Link>
        </div>
        {budgets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎯</div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>No budgets yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Create your first budget to start tracking spending
            </p>
            <Link to="/budget" className="btn btn-primary btn-sm">Create Budget</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {budgets.slice(0, 6).map((b) => {
              const bd = getBudgetData(b.id);
              const spent = bd?.total_spent || 0;
              const total = Number(b.total_amount);
              const pct = bd?.percentage_used || 0;
              const status = bd?.status || 'on_track';
              const fillClass = status === 'on_track' ? 'green' : status === 'warning' ? 'warn' : 'over';
              return (
                <div key={b.id} style={{
                  background: 'var(--surface-2)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {b.name}
                    </span>
                    <span className={`badge badge-${status === 'on_track' ? 'up' : status === 'warning' ? 'warn' : 'down'}`}>
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="track" style={{ marginBottom: '10px' }}>
                    <div className={`fill ${fillClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>PKR {fmt(spent)} spent</span>
                    <span>of PKR {fmt(total)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Zone D — Recent Transactions */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <span className="section-title">Recent Transactions</span>
          <Link to="/transactions" style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
            View All →
          </Link>
        </div>
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>No transactions yet</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
              Add your first transaction to get started
            </p>
            <Link to="/transactions" className="btn btn-primary btn-sm">Add Transaction</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recentTransactions.slice(0, 8).map((txn, i) => {
              const isIncome = txn.transaction_type === 'income';
              const color = CAT_COLORS[i % CAT_COLORS.length];
              const bg = CAT_BG[i % CAT_BG.length];
              return (
                <div key={txn.id || i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: 'transparent',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="cat-ic" style={{ background: bg, color }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {isIncome
                        ? <><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></>
                        : <><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></>}
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {txn.description || txn.title || 'Transaction'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {txn.category_name || txn.category || '—'} · {txn.date ? new Date(txn.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : ''}
                    </div>
                  </div>
                  <span className={`badge badge-${isIncome ? 'up' : 'down'}`}>
                    {isIncome ? '+' : '-'}PKR {fmt(txn.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

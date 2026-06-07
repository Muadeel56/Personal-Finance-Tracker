import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowRightIcon,
  ChartBarIcon,
  ChartPieIcon,
  FlagIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
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
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats } from '../../api/dashboard';
import { useChartTheme } from '../../hooks/useChartTheme';
import { getCategoryColors, getCategoryBackgrounds, getCategoryColorByIndex, getCategoryBgByIndex } from '../../utils/chartTheme';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const fmt = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const RingProgress = ({ pct, color = 'var(--accent)' }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
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

const StatCard = ({ label, value, sub, badge, badgeType, ring, ringColor, icon, iconBg, accentClass, delayClass }) => (
  <div className={`card rise dashboard-stat-card ${accentClass || ''} ${delayClass || ''}`}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span className="t-label dim">{label}</span>
      {icon && (
        <div className="dashboard-quick-action-icon" style={{ background: iconBg || 'var(--surface-2)' }}>
          {icon}
        </div>
      )}
      {ring !== undefined && <RingProgress pct={ring} color={ringColor} />}
    </div>
    <div>
      <div className="num" style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
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

const LinkArrow = ({ children, to }) => (
  <Link to={to} style={{ fontSize: '13px', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
    {children}
    <ArrowRightIcon className="h-4 w-4" />
  </Link>
);

const DashboardSkeleton = () => (
  <div className="dashboard-page">
    <div className="skel" style={{ height: '140px', borderRadius: '20px', marginBottom: '24px' }} />
    <div className="dashboard-skeleton-grid">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="skel" style={{ height: '120px', borderRadius: '16px' }} />
      ))}
    </div>
    <div className="dashboard-charts-grid">
      <div className="skel" style={{ height: '300px', borderRadius: '16px' }} />
      <div className="skel" style={{ height: '300px', borderRadius: '16px' }} />
    </div>
  </div>
);

const QUICK_ACTIONS = [
  { label: 'Add Transaction', to: '/transactions', icon: PlusIcon, bg: 'var(--accent-glow)', color: 'var(--accent)' },
  { label: 'Manage Budget', to: '/budget', icon: FlagIcon, bg: 'var(--info-muted)', color: 'var(--info)' },
  { label: 'View Reports', to: '/reports', icon: ChartBarIcon, bg: 'var(--income-muted)', color: 'var(--income)' },
];

const Dashboard = () => {
  const { loading } = useTransactions();
  const { budgets = [], budgetOverview, fetchBudgetOverview } = useBudgets();
  const { user } = useAuth();
  const chartTheme = useChartTheme();
  const isWide = useMediaQuery('(min-width: 901px)');
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
    } catch {
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
    return <DashboardSkeleton />;
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

  const categoryColors = getCategoryColors();
  const categoryBgs = getCategoryBackgrounds();

  const displayName = user?.name?.split(' ')[0] || user?.username || 'there';
  const savingsRate = stats.savings_rate ?? 0;
  const savingsInsight = savingsRate >= 20
    ? 'Great job — you\'re saving more than 20% of your income!'
    : savingsRate >= 10
      ? 'You\'re on track. Try pushing your savings rate above 20%.'
      : 'Consider reviewing expenses to boost your savings rate.';

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
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: chartTheme.colors.text,
          font: { family: 'var(--font-body)', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      tooltip: {
        ...chartTheme.plugins.tooltip,
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
        grid: { color: chartTheme.colors.grid, drawBorder: false },
        ticks: { color: chartTheme.colors.text, font: { family: 'var(--font-mono)', size: 11 }, callback: (v) => `${fmt(v)}` },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: chartTheme.colors.text, font: { family: 'var(--font-body)', size: 12 }, maxRotation: 0 },
        border: { display: false },
      },
    },
  };

  const totalCat = categoryData.reduce((s, i) => s + i.value, 0);
  const donutData = {
    labels: categoryData.map((i) => i.name),
    datasets: [{
      data: categoryData.map((i) => i.value),
      backgroundColor: categoryBgs.slice(0, categoryData.length),
      borderColor: categoryColors.slice(0, categoryData.length),
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
        position: isWide ? 'right' : 'bottom',
        labels: {
          color: chartTheme.colors.text,
          font: { family: 'var(--font-body)', size: 12 },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: isWide ? 14 : 10,
          boxWidth: 8,
        },
      },
      tooltip: {
        ...chartTheme.plugins.tooltip,
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
    <div className="dashboard-page">

      {/* Hero welcome banner */}
      <div className="dashboard-hero rise">
        <div className="dashboard-hero-glow" />
        <div className="dashboard-hero-inner">
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <SparklesIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span className="t-label" style={{ color: 'var(--accent)' }}>Financial Overview</span>
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {getGreeting()}, {displayName}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 16px', maxWidth: '420px', lineHeight: 1.5 }}>
              {savingsInsight}
            </p>
            <div className="dashboard-quick-actions">
              {QUICK_ACTIONS.map(({ label, to, icon: Icon, bg, color }) => (
                <Link key={label} to={to} className="dashboard-quick-action">
                  <span className="dashboard-quick-action-icon" style={{ background: bg }}>
                    <Icon className="h-4 w-4" style={{ color }} />
                  </span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div style={{ textAlign: isWide ? 'right' : 'left', flexShrink: 0 }}>
            <div className="t-label dim" style={{ marginBottom: '6px' }}>Net Balance</div>
            <div className="dashboard-hero-balance">
              PKR {fmt(stats.net_balance)}
            </div>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: isWide ? 'flex-end' : 'flex-start' }}>
              <span className="badge badge-up">+ PKR {fmt(stats.total_income)} income</span>
              <span className="badge badge-down">- PKR {fmt(stats.total_expenses)} spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Time range + page title */}
      <div className="dashboard-page-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Dashboard</h1>
          <p>Track your finances and stay on top of your budget</p>
        </div>
        <div className="dashboard-time-pills" role="tablist" aria-label="Time range">
          {RANGE_OPTS.map((o) => (
            <button
              key={o.value}
              role="tab"
              aria-selected={timeRange === o.value}
              onClick={() => setTimeRange(o.value)}
              className={`dashboard-time-pill${timeRange === o.value ? ' active' : ''}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-kpi-grid">
        <StatCard
          label="Net Balance"
          value={`PKR ${fmt(stats.net_balance)}`}
          sub="Total across all accounts"
          icon={<BanknotesIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />}
          iconBg="var(--accent-glow)"
          accentClass="stat-accent-balance rise-1"
          delayClass="rise-1"
        />
        <StatCard
          label="Income"
          value={`PKR ${fmt(stats.total_income)}`}
          sub="This period"
          badge="+ Earned"
          badgeType="up"
          icon={<ArrowTrendingUpIcon className="h-5 w-5" style={{ color: 'var(--income)' }} />}
          iconBg="var(--income-muted)"
          accentClass="stat-accent-income rise-2"
          delayClass="rise-2"
        />
        <StatCard
          label="Expenses"
          value={`PKR ${fmt(stats.total_expenses)}`}
          sub="This period"
          badge="Spent"
          badgeType="down"
          icon={<ArrowTrendingDownIcon className="h-5 w-5" style={{ color: 'var(--expense)' }} />}
          iconBg="var(--expense-muted)"
          accentClass="stat-accent-expense rise-3"
          delayClass="rise-3"
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          sub="Of total income saved"
          ring={savingsRate}
          ringColor={savingsRate >= 20 ? 'var(--income)' : savingsRate >= 10 ? 'var(--accent)' : 'var(--expense)'}
          accentClass="stat-accent-savings rise-4"
          delayClass="rise-4"
        />
      </div>

      {/* Charts */}
      <div className="dashboard-charts-grid">
        <div className="card dashboard-chart-card rise rise-5">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <span className="section-title">Cash Flow</span>
            <LinkArrow to="/reports">Reports</LinkArrow>
          </div>
          {trendData.length === 0 ? (
            <div className="dashboard-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <ChartBarIcon className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No trend data yet</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-chart-body">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>

        <div className="card dashboard-chart-card rise rise-6">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <span className="section-title">Spending by Category</span>
            <LinkArrow to="/categories">Manage</LinkArrow>
          </div>
          {categoryData.length === 0 ? (
            <div className="dashboard-chart-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <ChartPieIcon className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No category data yet</p>
              </div>
            </div>
          ) : (
            <div className="dashboard-chart-body">
              <Doughnut data={donutData} options={donutOptions} />
              <div style={{
                position: 'absolute',
                top: isWide ? '50%' : '42%',
                left: isWide ? '35%' : '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}>
                <div className="num" style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', fontWeight: 700, color: 'var(--text-primary)' }}>
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

      {/* Budget + Transactions side by side on large screens */}
      <div className="dashboard-split-grid">

        {/* Budget Overview */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span className="section-title">Budget Overview</span>
            <LinkArrow to="/budget">View All</LinkArrow>
          </div>
          {budgets.length === 0 ? (
            <div className="dashboard-empty">
              <FlagIcon className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>No budgets yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                Create your first budget to start tracking spending
              </p>
              <Link to="/budget" className="btn btn-primary btn-sm">Create Budget</Link>
            </div>
          ) : (
            <div className="dashboard-budget-grid">
              {budgets.slice(0, 4).map((b) => {
                const bd = getBudgetData(b.id);
                const spent = bd?.total_spent || 0;
                const total = Number(b.total_amount);
                const pct = bd?.percentage_used || 0;
                const status = bd?.status || 'on_track';
                const fillClass = status === 'on_track' ? 'green' : status === 'warning' ? 'warn' : 'over';
                return (
                  <div key={b.id} className="dashboard-budget-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {b.name}
                      </span>
                      <span className={`badge badge-${status === 'on_track' ? 'up' : status === 'warning' ? 'warn' : 'down'}`} style={{ flexShrink: 0 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="track" style={{ marginBottom: '10px' }}>
                      <div className={`fill ${fillClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', gap: '8px', flexWrap: 'wrap' }}>
                      <span>PKR {fmt(spent)} spent</span>
                      <span>of PKR {fmt(total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <span className="section-title">Recent Transactions</span>
            <LinkArrow to="/transactions">View All</LinkArrow>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="dashboard-empty">
              <ClipboardDocumentListIcon className="h-10 w-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>No transactions yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                Add your first transaction to get started
              </p>
              <Link to="/transactions" className="btn btn-primary btn-sm">Add Transaction</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {recentTransactions.slice(0, 8).map((txn, i) => {
                const isIncome = txn.transaction_type === 'income';
                const color = getCategoryColorByIndex(i);
                const bg = getCategoryBgByIndex(i);
                return (
                  <div key={txn.id || i} className="dashboard-txn-row">
                    <div className="cat-ic" style={{ background: bg, color, flexShrink: 0 }}>
                      {isIncome ? (
                        <ArrowUpIcon className="h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="dashboard-txn-desc">
                        {txn.description || txn.title || 'Transaction'}
                      </div>
                      <div className="dashboard-txn-meta" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {txn.category?.name || txn.category_name || '—'} · {txn.date ? new Date(txn.date).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' }) : ''}
                      </div>
                    </div>
                    <span className={`badge badge-${isIncome ? 'up' : 'down'} dashboard-txn-amount`} style={{ flexShrink: 0 }}>
                      {isIncome ? '+' : '-'}PKR {fmt(txn.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

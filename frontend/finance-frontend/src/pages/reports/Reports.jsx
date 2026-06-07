import { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useTransactions } from '../../contexts/TransactionContext';

const fmt = (n) => `PKR ${Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const Reports = () => {
  const { transactions, loading } = useTransactions();
  const [timeRange, setTimeRange] = useState('current_month');
  const [reportType, setReportType] = useState('overview');

  const income   = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(Number(t.amount)), 0);
  const netIncome = income - expenses;

  const categoryData = transactions.reduce((acc, t) => {
    const cat = t.category?.name || 'Uncategorized';
    const amt = Math.abs(Number(t.amount));
    if (!acc[cat]) acc[cat] = { income: 0, expenses: 0, count: 0 };
    if (t.amount > 0) acc[cat].income += amt; else acc[cat].expenses += amt;
    acc[cat].count += 1;
    return acc;
  }, {});

  const monthlyData = transactions.reduce((acc, t) => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = { income: 0, expenses: 0, count: 0 };
    if (t.amount > 0) acc[key].income += Number(t.amount); else acc[key].expenses += Math.abs(Number(t.amount));
    acc[key].count += 1;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData).sort().slice(-6);

  const tabStyle = (active) => ({
    padding: '7px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: 600,
    fontFamily: 'var(--font-display)', border: 'none', cursor: 'pointer',
    background: active ? 'var(--accent-grad)' : 'transparent',
    color: active ? 'var(--on-accent)' : 'var(--text-secondary)',
    transition: 'all 0.15s',
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Reports</h1>
          <p>Analyze your financial data and track progress</p>
        </div>
        <div className="field" style={{ width: 'auto', height: '40px' }}>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={{ minWidth: '160px' }}>
            <option value="current_month">Current Month</option>
            <option value="previous_month">Previous Month</option>
            <option value="current_year">Current Year</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--surface-1)', border: 'var(--card-border)', borderRadius: '12px', padding: '4px', gap: '2px', boxShadow: 'var(--card-shadow)', marginBottom: '20px', width: 'fit-content' }}>
        {['overview', 'categories', 'trends'].map((t) => (
          <button key={t} style={tabStyle(reportType === t)} onClick={() => setReportType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {transactions.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <ChartBarIcon className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No data yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Add transactions to see reports.</p>
        </div>
      ) : (
        <>
          {/* Overview */}
          {reportType === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {[
                  { label: 'Total Income', value: fmt(income), Icon: ArrowTrendingUpIcon, iconBg: 'var(--income-muted)', color: 'var(--income)' },
                  { label: 'Total Expenses', value: fmt(expenses), Icon: ArrowTrendingDownIcon, iconBg: 'var(--expense-muted)', color: 'var(--expense)' },
                  { label: 'Net Income', value: fmt(netIncome), Icon: netIncome >= 0 ? BanknotesIcon : CurrencyDollarIcon, iconBg: netIncome >= 0 ? 'var(--income-muted)' : 'var(--expense-muted)', color: netIncome >= 0 ? 'var(--income)' : 'var(--expense)' },
                ].map((c) => (
                  <div key={c.label} className="card" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div className="t-label dim" style={{ marginBottom: '6px' }}>{c.label}</div>
                      <div className="num" style={{ fontSize: '22px', fontWeight: 700, color: c.color }}>{c.value}</div>
                    </div>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: c.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <c.Icon className="h-5 w-5" style={{ color: c.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ padding: '22px' }}>
                <div className="section-title" style={{ marginBottom: '18px' }}>Transaction Summary</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--income)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Income by Category</div>
                    {Object.entries(categoryData).filter(([, d]) => d.income > 0).sort(([, a], [, b]) => b.income - a.income).slice(0, 5).map(([cat, d]) => (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                        <span className="num" style={{ color: 'var(--income)', fontWeight: 600 }}>{fmt(d.income)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--expense)', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>Expenses by Category</div>
                    {Object.entries(categoryData).filter(([, d]) => d.expenses > 0).sort(([, a], [, b]) => b.expenses - a.expenses).slice(0, 5).map(([cat, d]) => (
                      <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                        <span className="num" style={{ color: 'var(--expense)', fontWeight: 600 }}>{fmt(d.expenses)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          {reportType === 'categories' && (
            <div className="card" style={{ padding: '22px', overflowX: 'auto' }}>
              <div className="section-title" style={{ marginBottom: '18px' }}>Category Analysis</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Category', 'Income', 'Expenses', 'Net', 'Count'].map((h, i) => (
                      <th key={h} style={{ padding: '10px 12px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 0 ? 'left' : 'right', fontFamily: 'var(--font-display)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categoryData).sort(([, a], [, b]) => (b.income + b.expenses) - (a.income + a.expenses)).map(([cat, d]) => (
                    <tr key={cat} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <td style={{ padding: '11px 12px', fontSize: '14px', color: 'var(--text-primary)' }}>{cat}</td>
                      <td className="num" style={{ padding: '11px 12px', fontSize: '13px', color: 'var(--income)', textAlign: 'right', fontWeight: 600 }}>{fmt(d.income)}</td>
                      <td className="num" style={{ padding: '11px 12px', fontSize: '13px', color: 'var(--expense)', textAlign: 'right', fontWeight: 600 }}>{fmt(d.expenses)}</td>
                      <td className="num" style={{ padding: '11px 12px', fontSize: '13px', color: d.income - d.expenses >= 0 ? 'var(--income)' : 'var(--expense)', textAlign: 'right', fontWeight: 600 }}>{fmt(d.income - d.expenses)}</td>
                      <td style={{ padding: '11px 12px', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'right' }}>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Trends */}
          {reportType === 'trends' && (
            <div className="card" style={{ padding: '22px' }}>
              <div className="section-title" style={{ marginBottom: '18px' }}>Monthly Trends</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedMonths.map((month) => {
                  const d = monthlyData[month];
                  const net = d.income - d.expenses;
                  return (
                    <div key={month} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: '12px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{month}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{d.count} transactions</div>
                      </div>
                      <div style={{ display: 'flex', gap: '24px' }}>
                        {[
                          { label: 'Income', v: d.income, color: 'var(--income)' },
                          { label: 'Expenses', v: d.expenses, color: 'var(--expense)' },
                          { label: 'Net', v: net, color: net >= 0 ? 'var(--income)' : 'var(--expense)' },
                        ].map((s) => (
                          <div key={s.label} style={{ textAlign: 'right' }}>
                            <div className="num" style={{ fontSize: '14px', fontWeight: 700, color: s.color }}>{fmt(s.v)}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reports;

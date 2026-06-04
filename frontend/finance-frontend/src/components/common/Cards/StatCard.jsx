const StatCard = ({ title, value, icon: Icon, trend, trendValue, className = '' }) => {
  const isPositive = trend === 'up';

  return (
    <div className={`card ${className}`} style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <div className="t-label dim" style={{ marginBottom: '8px' }}>{title}</div>
          <div className="num" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {value}
          </div>
        </div>
        {Icon && (
          <div style={{ padding: '10px', background: 'var(--surface-2)', borderRadius: '10px', flexShrink: 0 }}>
            <Icon style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
          </div>
        )}
      </div>
      {trend && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge badge-${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '↑' : '↓'} {trendValue}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>vs last period</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

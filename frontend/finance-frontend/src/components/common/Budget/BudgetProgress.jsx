const BudgetProgress = ({ category, spent, budget, icon: Icon, className = '' }) => {
  const pct = Math.min((spent / budget) * 100, 100);
  const isOver = spent > budget;
  const fillClass = isOver ? 'over' : pct > 80 ? 'warn' : 'green';
  const statusColor = isOver ? 'var(--expense)' : pct > 80 ? 'var(--accent)' : 'var(--income)';

  return (
    <div className={`card ${className}`} style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {Icon && (
            <div style={{ padding: '8px', background: 'var(--surface-2)', borderRadius: '9px', display: 'flex' }}>
              <Icon style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
            </div>
          )}
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {category}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num" style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
            PKR {spent.toFixed(0)} / {budget.toFixed(0)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isOver ? 'Over budget' : `${pct.toFixed(1)}% used`}
          </div>
        </div>
      </div>
      <div className="track">
        <div className={`fill ${fillClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default BudgetProgress;

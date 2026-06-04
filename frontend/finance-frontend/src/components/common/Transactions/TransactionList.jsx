import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

const CAT_COLORS = ['#6366F1','#10B981','#F43F5E','#F59E0B','#8B5CF6','#0EA5E9','#14B8A6','#F97316'];
const CAT_BG = ['rgba(99,102,241,0.15)','rgba(16,185,129,0.15)','rgba(244,63,94,0.15)','rgba(245,158,11,0.15)','rgba(139,92,246,0.15)','rgba(14,165,233,0.15)','rgba(20,184,166,0.15)','rgba(249,115,22,0.15)'];

const fmtAmt  = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(n));
const fmtDate = (d) => { try { return format(typeof d === 'string' ? parseISO(d) : d, 'MMM d, yyyy'); } catch { return d; } };
const getCategoryName = (t) => typeof t.category === 'object' && t.category?.name ? t.category.name : `Cat ${t.category}`;

const TransactionList = ({
  transactions, onEdit, onDelete, onSort, sortField, sortDirection, onExport, loading = false,
}) => {
  const [selected, setSelected] = useState(new Set());
  const [selectMode, setSelectMode] = useState(false);

  const toggleAll = () => setSelected(selected.size === transactions.length ? new Set() : new Set(transactions.map((t) => t.id)));
  const toggleOne = (id) => { const s = new Set(selected); s.has(id) ? s.delete(id) : s.add(id); setSelected(s); };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc'
      ? <ChevronUpIcon style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '3px', color: 'var(--accent)' }} />
      : <ChevronDownIcon style={{ width: '12px', height: '12px', display: 'inline', marginLeft: '3px', color: 'var(--accent)' }} />;
  };

  const thStyle = (clickable) => ({
    padding: '10px 14px',
    fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'var(--font-display)',
    cursor: clickable ? 'pointer' : 'default',
    textAlign: 'left',
    background: 'var(--surface-2)',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap',
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '12px' }}>
        <div className="spinner" style={{ width: '24px', height: '24px' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading transactions…</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>No transactions found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Try adjusting the filters or add a new transaction.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Action bar */}
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-2)', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0 }}
            onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
          >
            {selectMode ? 'Cancel' : 'Select'}
          </button>
          {selectMode && (
            <button style={{ fontSize: '13px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', padding: 0 }} onClick={toggleAll}>
              {selected.size === transactions.length ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>
        {selectMode && selected.size > 0 && (
          <button className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => onExport(transactions.filter((t) => selected.has(t.id)))}>
            <DocumentArrowDownIcon style={{ width: '14px', height: '14px' }} />
            Export ({selected.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              {selectMode && <th style={{ ...thStyle(false), width: '40px', padding: '10px 8px 10px 16px' }}><input type="checkbox" checked={selected.size === transactions.length} onChange={toggleAll} style={{ accentColor: 'var(--accent)' }} /></th>}
              {[
                { label: 'Date', field: 'date' },
                { label: 'Description', field: 'description' },
                { label: 'Category', field: 'category' },
                { label: 'Amount', field: 'amount' },
              ].map(({ label, field }) => (
                <th key={field} style={thStyle(true)} onClick={() => onSort(field)}>
                  {label}<SortIcon field={field} />
                </th>
              ))}
              <th style={{ ...thStyle(false), textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => {
              const isIncome = txn.transaction_type === 'income' || Number(txn.amount) > 0;
              const color = CAT_COLORS[i % CAT_COLORS.length];
              const bg = CAT_BG[i % CAT_BG.length];
              const isSelected = selected.has(txn.id);
              return (
                <tr key={txn.id}
                  style={{ borderBottom: '1px solid var(--border-subtle)', background: isSelected ? 'var(--accent-glow)' : 'transparent', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
                >
                  {selectMode && (
                    <td style={{ padding: '11px 8px 11px 16px' }}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleOne(txn.id)} style={{ accentColor: 'var(--accent)' }} />
                    </td>
                  )}
                  <td style={{ padding: '11px 14px', fontSize: '13px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                    {fmtDate(txn.date)}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="cat-ic" style={{ background: bg, color, width: '32px', height: '32px', borderRadius: '9px', fontSize: '14px' }}>
                        {txn.category?.icon || (isIncome ? '↑' : '↓')}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{txn.description}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <span className="badge" style={{ background: bg, color, fontSize: '11px' }}>
                      {getCategoryName(txn)}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', whiteSpace: 'nowrap' }}>
                    <span className={`badge badge-${isIncome ? 'up' : 'down'}`}>
                      {isIncome ? '+' : '-'}PKR {fmtAmt(txn.amount)}
                    </span>
                  </td>
                  <td style={{ padding: '11px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(txn)} title="Edit">
                        <PencilIcon style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(txn.id)} title="Delete"
                        style={{ color: 'var(--expense)' }}>
                        <TrashIcon style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FlagIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useBudgets } from '../../contexts/BudgetsContext';
import { categoriesAPI } from '../../api/categories';
import { parseDate } from '../../utils/formatters';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const fmt = (n) => new Intl.NumberFormat('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const FormField = ({ label, children }) => (
  <div>
    <label className="field-label">{label}</label>
    {children}
  </div>
);

const Budget = () => {
  const {
    budgets, loading, error,
    addBudget, updateBudget, deleteBudget,
    fetchBudgetOverview, getBudgetSpendingAnalysis,
  } = useBudgets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState({});
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '', total_amount: '', period_type: 'MONTHLY',
    start_date: '', end_date: '', notes: '', category_allocations: [],
  });

  useEffect(() => {
    categoriesAPI.getCategoriesByType('expense').then((data) => setCategories(data || [])).catch(() => toast.error('Failed to load categories'));
  }, []);

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        total_amount: editingBudget.total_amount,
        period_type: editingBudget.period_type,
        start_date: fmtDateDisplay(editingBudget.start_date),
        end_date: fmtDateDisplay(editingBudget.end_date),
        notes: editingBudget.notes || '',
        category_allocations: editingBudget.categories?.map((c) => ({ category: c.category, amount: c.amount, notes: c.notes || '' })) || [],
      });
    } else {
      setFormData({ name: '', total_amount: '', period_type: 'MONTHLY', start_date: '', end_date: '', notes: '', category_allocations: [] });
    }
  }, [editingBudget]);

  useEffect(() => {
    if (budgets.length === 0) return;
    setLoadingAnalysis(true);
    Promise.all(budgets.map(async (b) => {
      try { return { budgetId: b.id, analysis: await getBudgetSpendingAnalysis(b.id) }; }
      catch { return { budgetId: b.id, analysis: null }; }
    })).then((results) => {
      const map = {};
      results.forEach(({ budgetId, analysis }) => { map[budgetId] = analysis; });
      setBudgetAnalysis(map);
      setLoadingAnalysis(false);
    });
  }, [budgets, getBudgetSpendingAnalysis]);

  const fmtDateDisplay = (d) => {
    if (!d) return '';
    if (/^\d{2}-\d{2}-\d{4}$/.test(d)) return d;
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, day] = d.split('-'); return `${day}-${m}-${y}`; }
    return d;
  };
  const validateDate = (d) => {
    if (!d || !/^\d{2}-\d{2}-\d{4}$/.test(d)) return false;
    const [day, m, y] = d.split('-').map(Number);
    const dt = new Date(y, m - 1, day);
    return dt.getDate() === day && dt.getMonth() === m - 1 && dt.getFullYear() === y;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDate(formData.start_date)) { toast.error('Start date must be DD-MM-YYYY'); return; }
    if (!validateDate(formData.end_date)) { toast.error('End date must be DD-MM-YYYY'); return; }
    const startDate = parseDate(formData.start_date);
    const endDate = parseDate(formData.end_date);
    if (!startDate || !endDate) { toast.error('Invalid dates'); return; }
    if (new Date(startDate) >= new Date(endDate)) { toast.error('End date must be after start date'); return; }
    const totalAllocated = formData.category_allocations.reduce((s, a) => s + parseFloat(a.amount || 0), 0);
    if (totalAllocated > parseFloat(formData.total_amount)) { toast.error('Allocations exceed budget amount'); return; }
    try {
      const budgetData = { ...formData, start_date: startDate, end_date: endDate };
      if (editingBudget) await updateBudget(editingBudget.id, budgetData);
      else await addBudget(budgetData);
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (err) {
      console.error('Error saving budget:', err);
    }
  };

  const handleDelete = (id) => {
    setDeletingBudgetId(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingBudgetId) {
      try { await deleteBudget(deletingBudgetId); } catch (err) { console.error(err); }
    }
    setShowDeleteConfirm(false);
    setDeletingBudgetId(null);
  };

  const getBudgetProgress = (budget) => {
    const analysis = budgetAnalysis[budget.id];
    if (!analysis?.overall_progress) {
      return { spent: 0, total: parseFloat(budget.total_amount), percentage: 0, isOverBudget: false, remaining: parseFloat(budget.total_amount), status: 'on_track' };
    }
    const p = analysis.overall_progress;
    return {
      spent: p.total_spent, total: p.total_budgeted, percentage: p.percentage_used,
      isOverBudget: p.is_over_budget, remaining: p.total_remaining,
      status: p.is_over_budget ? 'over_budget' : p.percentage_used > 90 ? 'warning' : 'on_track',
      daysRemaining: p.days_remaining,
    };
  };

  const getTotalAllocated = () => formData.category_allocations.reduce((s, a) => s + parseFloat(a.amount || 0), 0);

  if (loading || loadingAnalysis) {
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
          <p style={{ color: 'var(--expense)', marginBottom: '12px' }}>{error}</p>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Budgets</h1>
          <p>Create and manage your spending budgets</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Create Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <FlagIcon className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No budgets yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Create your first budget to start tracking your spending
          </p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Your First Budget</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {budgets.map((budget) => {
            const progress = getBudgetProgress(budget);
            const fillClass = progress.status === 'on_track' ? 'green' : progress.status === 'warning' ? 'warn' : 'over';
            const badgeType = progress.status === 'on_track' ? 'up' : progress.status === 'warning' ? 'warn' : 'down';
            return (
              <div key={budget.id} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {budget.name}
                    </h3>
                    {budget.notes && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{budget.notes}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditingBudget(budget); setIsModalOpen(true); }}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Edit"
                    > <PencilIcon className="h-4 w-4" /></button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Delete"
                    > <TrashIcon className="h-4 w-4" /></button>
                  </div>
                </div>

                {/* Category allocations */}
                {budget.categories?.length > 0 && (
                  <div style={{ marginBottom: '14px', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: '10px' }}>
                    {budget.categories.slice(0, 3).map((cat) => (
                      <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cat.category_name}</span>
                        <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>PKR {fmt(cat.amount)}</span>
                      </div>
                    ))}
                    {budget.categories.length > 3 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>+{budget.categories.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Progress */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress</span>
                    <span className={`badge badge-${badgeType}`}>{progress.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="track">
                    <div className={`fill ${fillClass}`} style={{ width: `${Math.min(progress.percentage, 100)}%` }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Spent</div>
                    <div className="num" style={{ fontSize: '15px', fontWeight: 700, color: progress.isOverBudget ? 'var(--expense)' : 'var(--text-primary)' }}>
                      PKR {fmt(progress.spent)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>Budget</div>
                    <div className="num" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>PKR {fmt(progress.total)}</div>
                  </div>
                </div>

                <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {budget.period_type} · {budget.start_date} – {budget.end_date}
                  {progress.daysRemaining !== undefined && (
                    <span style={{ marginLeft: '8px' }}>
                      {progress.daysRemaining > 0 ? `${progress.daysRemaining}d left` : progress.daysRemaining === 0 ? 'Ends today' : 'Ended'}
                    </span>
                  )}
                  {progress.isOverBudget && (
                    <div style={{ color: 'var(--expense)', fontWeight: 600, marginTop: '4px' }}>
                      Over by PKR {fmt(Math.abs(progress.remaining))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => { setIsModalOpen(false); setEditingBudget(null); }} />
          <div style={{
            position: 'relative', zIndex: 1,
            width: '100%', maxWidth: '540px',
            background: 'var(--surface-1)',
            border: 'var(--card-border)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
            maxHeight: '90vh',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '22px' }}>
              {editingBudget ? 'Edit Budget' : 'Create Budget'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField label="Budget name">
                <div className="field">
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Monthly groceries" />
                </div>
              </FormField>

              <FormField label="Total amount (PKR)">
                <div className="field">
                  <input type="number" step="0.01" value={formData.total_amount} onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })} required placeholder="0.00" />
                </div>
              </FormField>

              <FormField label="Period type">
                <div className="field">
                  <select value={formData.period_type} onChange={(e) => setFormData({ ...formData, period_type: e.target.value })} style={{ width: '100%' }}>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                    <option value="CUSTOM">Custom</option>
                  </select>
                </div>
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <FormField label="Start date">
                  <div className="field">
                    <input type="text" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} placeholder="DD-MM-YYYY" autoComplete="off" required />
                  </div>
                </FormField>
                <FormField label="End date">
                  <div className="field">
                    <input type="text" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} placeholder="DD-MM-YYYY" autoComplete="off" required />
                  </div>
                </FormField>
              </div>

              {/* Category allocations */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label className="field-label" style={{ margin: 0 }}>Category allocations</label>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFormData((p) => ({ ...p, category_allocations: [...p.category_allocations, { category: '', amount: '', notes: '' }] }))}>
                    + Add
                  </button>
                </div>
                {formData.category_allocations.map((alloc, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <div className="field" style={{ height: '40px' }}>
                      <select value={alloc.category} onChange={(e) => setFormData((p) => ({ ...p, category_allocations: p.category_allocations.map((a, j) => j === i ? { ...a, category: e.target.value } : a) }))} style={{ width: '100%' }} required>
                        <option value="">Select category</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="field" style={{ height: '40px' }}>
                      <input type="number" step="0.01" placeholder="Amount" value={alloc.amount} onChange={(e) => setFormData((p) => ({ ...p, category_allocations: p.category_allocations.map((a, j) => j === i ? { ...a, amount: e.target.value } : a) }))} required />
                    </div>
                    <button type="button" onClick={() => setFormData((p) => ({ ...p, category_allocations: p.category_allocations.filter((_, j) => j !== i) }))} style={{ background: 'none', border: 'none', color: 'var(--expense)', cursor: 'pointer', padding: '4px', display: 'flex' }} aria-label="Remove row"><XMarkIcon className="h-4 w-4" /></button>
                  </div>
                ))}
                {formData.total_amount && formData.category_allocations.length > 0 && (
                  <div style={{ background: 'var(--surface-2)', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                      <span>Allocated</span><span className="num">PKR {fmt(getTotalAllocated())}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: (parseFloat(formData.total_amount) - getTotalAllocated()) < 0 ? 'var(--expense)' : 'var(--income)' }}>
                      <span>Remaining</span><span className="num">PKR {fmt(parseFloat(formData.total_amount) - getTotalAllocated())}</span>
                    </div>
                  </div>
                )}
              </div>

              <FormField label="Notes (optional)">
                <div className="field" style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}>
                  <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} style={{ width: '100%', resize: 'vertical', minHeight: '60px' }} placeholder="Any notes about this budget…" />
                </div>
              </FormField>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingBudget ? 'Save changes' : 'Create Budget'}
                </button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setIsModalOpen(false); setEditingBudget(null); }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeletingBudgetId(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
      />
    </div>
  );
};

export default Budget;

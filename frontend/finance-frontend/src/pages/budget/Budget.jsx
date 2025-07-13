import React, { useState, useEffect } from 'react';
import { useBudgets } from '../../contexts/BudgetsContext';
import { useTransactions } from '../../contexts/TransactionContext';
import { budgetsAPI } from '../../api/budgets';
import { getCategories } from '../../api/transactions';
import Button from '../../components/common/Button/Button';

const PERIOD_TYPES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'CUSTOM', label: 'Custom' }
];

const Budget = () => {
  const { budgets = [], loading, error, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();
  const [form, setForm] = useState({
    name: '',
    period_type: 'MONTHLY',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    total_amount: '',
    notes: '',
    is_active: true
  });
  const [editing, setEditing] = useState(null);
  const [budgetCategories, setBudgetCategories] = useState({}); // { [budgetId]: [categories] }
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [categoryAllocations, setCategoryAllocations] = useState([]); // [{categoryId, amount}]

  // Fetch categories for all budgets
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoadingCategories(true);
      const catMap = {};
      for (const b of budgets) {
        try {
          const cats = await budgetsAPI.getCategories(b.id);
          catMap[b.id] = cats;
        } catch (e) {
          catMap[b.id] = [];
        }
      }
      setBudgetCategories(catMap);
      setLoadingCategories(false);
    };
    if (budgets.length > 0) fetchAllCategories();
  }, [budgets]);

  // Fetch all transaction categories for the form
  useEffect(() => {
    getCategories().then(res => {
      setAllCategories(res.data || res || []);
    });
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Handle category selection
  const handleCategorySelect = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, opt => Number(opt.value));
    // Keep allocations for selected, remove for unselected
    setCategoryAllocations(prev => {
      const filtered = prev.filter(a => selectedIds.includes(a.categoryId));
      // Add new allocations for newly selected
      selectedIds.forEach(id => {
        if (!filtered.find(a => a.categoryId === id)) {
          filtered.push({ categoryId: id, amount: '' });
        }
      });
      return filtered;
    });
  };

  // Handle allocation amount change
  const handleAllocationChange = (categoryId, value) => {
    setCategoryAllocations(prev => prev.map(a => a.categoryId === categoryId ? { ...a, amount: value } : a));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newBudget;
      if (editing) {
        newBudget = await updateBudget(editing, form);
        setEditing(null);
      } else {
        newBudget = await addBudget(form);
      }
      // Create BudgetCategory records for each allocation
      for (const alloc of categoryAllocations) {
        if (alloc.amount && alloc.categoryId) {
          await budgetsAPI.createCategory({
            budget: newBudget.id,
            category: alloc.categoryId,
            amount: alloc.amount,
          });
        }
      }
      setForm({
        name: '',
        period_type: 'MONTHLY',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        total_amount: '',
        notes: '',
        is_active: true
      });
      setCategoryAllocations([]);
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  // When editing a budget, load its category allocations
  const handleEdit = async (budget) => {
    setEditing(budget.id);
    setForm({
      name: budget.name,
      period_type: budget.period_type,
      start_date: budget.start_date,
      end_date: budget.end_date,
      total_amount: budget.total_amount,
      notes: budget.notes || '',
      is_active: budget.is_active
    });
    // Load allocations for this budget
    const cats = await budgetsAPI.getCategories(budget.id);
    setCategoryAllocations(
      cats.map(cat => ({ categoryId: cat.category, amount: cat.amount, allocationId: cat.id }))
    );
  };

  // Allow deleting a category allocation before saving
  const handleRemoveAllocation = (categoryId) => {
    setCategoryAllocations(prev => prev.filter(a => a.categoryId !== categoryId));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      period_type: 'MONTHLY',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      total_amount: '',
      notes: '',
      is_active: true
    });
  };

  // Calculate spent for a budget category
  const getSpentForCategory = (cat, budget) => {
    return transactions
      .filter(t => t.category && t.category.id === cat.category && t.date >= budget.start_date && t.date <= budget.end_date)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  };

  // Calculate total spent for a budget
  const getTotalSpent = (budget) => {
    const cats = budgetCategories[budget.id] || [];
    return cats.reduce((sum, cat) => sum + getSpentForCategory(cat, budget), 0);
  };

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="primary" className="mt-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-primary)]">Budgets</h2>
      <div className="bg-[var(--color-card)] rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[var(--color-text)]">{editing ? 'Edit Budget' : 'Create a New Budget'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Budget Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Monthly Groceries"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Amount</label>
              <input
                name="total_amount"
                value={form.total_amount}
                onChange={handleChange}
                placeholder="e.g. 500"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Period Type</label>
              <select
                name="period_type"
                value={form.period_type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              >
                {PERIOD_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  name="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  name="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
            </div>
          </div>
          {/* Category selection and allocations */}
          <div>
            <label className="block text-sm font-medium mb-2">Categories & Allocations</label>
            <select
              multiple
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] mb-2"
              value={categoryAllocations.map(a => a.categoryId)}
              onChange={handleCategorySelect}
            >
              {allCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="space-y-2">
              {categoryAllocations.map(a => (
                <div key={a.categoryId} className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-2">
                  <span className="text-xs text-[var(--color-primary)] font-semibold flex-1">
                    {allCategories.find(c => c.id === a.categoryId)?.name}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-24 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="Amount"
                    value={a.amount}
                    onChange={e => handleAllocationChange(a.categoryId, e.target.value)}
                    required
                  />
                  <button type="button" className="text-red-500 text-xs font-semibold hover:underline" onClick={() => handleRemoveAllocation(a.categoryId)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              rows="2"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="submit" variant="primary">
              {editing ? 'Update' : 'Add'} Budget
            </Button>
            {editing && (
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
      {loading || loadingCategories ? (
        <div className="text-center py-8 text-lg">Loading...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-lg">No budgets found. Create your first budget above.</div>
      ) : (
        <div className="space-y-8">
          {budgets.map((b) => {
            const cats = budgetCategories[b.id] || [];
            const totalSpent = getTotalSpent(b);
            const totalBudget = Number(b.total_amount);
            const percent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
            return (
              <div key={b.id} className="bg-[var(--color-card)] rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <div className="font-semibold text-xl text-[var(--color-primary)]">{b.name}</div>
                    <div className="text-xs text-gray-500">{b.period_type} | {b.start_date} - {b.end_date}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => handleEdit(b)}>Edit</Button>
                    <Button variant="danger" onClick={() => deleteBudget(b.id)}>Delete</Button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Total Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-5 mb-2">
                    <div
                      className={`h-5 rounded-full transition-all duration-300 ${percent < 90 ? 'bg-green-500' : percent < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Spent: <span className="font-semibold">${totalSpent.toFixed(2)}</span></span>
                    <span>Budget: <span className="font-semibold">${totalBudget.toFixed(2)}</span></span>
                  </div>
                  {percent >= 100 && <div className="text-xs text-red-500 mt-1 font-semibold">Over budget!</div>}
                  {percent >= 90 && percent < 100 && <div className="text-xs text-yellow-500 mt-1 font-semibold">Almost at limit</div>}
                </div>
                {cats.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm font-medium mb-2">Category Allocations</div>
                    <div className="space-y-3">
                      {cats.map(cat => {
                        const spent = getSpentForCategory(cat, b);
                        const catPercent = cat.amount > 0 ? Math.min((spent / cat.amount) * 100, 100) : 0;
                        const catName = allCategories.find(c => c.id === cat.category)?.name || cat.category;
                        return (
                          <div key={cat.id} className="bg-[var(--color-surface)] rounded-lg p-3 border border-[var(--color-border)]">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-[var(--color-primary)]">{catName}</span>
                              <span>
                                <span className="font-semibold">${spent.toFixed(2)}</span> / <span className="font-semibold">${Number(cat.amount).toFixed(2)}</span>
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3">
                              <div
                                className={`h-3 rounded-full transition-all duration-300 ${catPercent < 90 ? 'bg-blue-500' : catPercent < 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${catPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budget; 
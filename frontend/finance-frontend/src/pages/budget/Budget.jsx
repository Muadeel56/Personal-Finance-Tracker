import React, { useState } from 'react';
import { useBudgets } from '../../contexts/BudgetsContext';
import Button from '../../components/common/Button/Button';

const PERIOD_TYPES = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'CUSTOM', label: 'Custom' }
];

const Budget = () => {
  const { budgets = [], loading, error, addBudget, updateBudget, deleteBudget } = useBudgets();
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

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateBudget(editing, form);
        setEditing(null);
      } else {
        await addBudget(form);
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
    } catch (error) {
      console.error('Failed to save budget:', error);
    }
  };

  const handleEdit = (budget) => {
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
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Budgets</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Budget Name"
            className="px-2 py-1 rounded border"
            required
          />
          <input
            name="total_amount"
            value={form.total_amount}
            onChange={handleChange}
            placeholder="Total Amount"
            type="number"
            step="0.01"
            className="px-2 py-1 rounded border"
            required
          />
          <select
            name="period_type"
            value={form.period_type}
            onChange={handleChange}
            className="px-2 py-1 rounded border"
            required
          >
            {PERIOD_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              className="px-2 py-1 rounded border flex-1"
              required
            />
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              className="px-2 py-1 rounded border flex-1"
              required
            />
          </div>
        </div>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes (optional)"
          className="w-full px-2 py-1 rounded border"
          rows="2"
        />
        <div className="flex gap-2">
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
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No budgets found. Create your first budget above.</div>
      ) : (
        <table className="w-full bg-[var(--color-surface)] rounded shadow">
          <thead>
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Period</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.id}>
                <td className="p-2">{b.name}</td>
                <td className="p-2">{b.period_type}</td>
                <td className="p-2">${b.total_amount}</td>
                <td className="p-2">{b.is_active ? 'Active' : 'Inactive'}</td>
                <td className="p-2 flex gap-2">
                  <Button variant="ghost" onClick={() => handleEdit(b)}>Edit</Button>
                  <Button variant="danger" onClick={() => deleteBudget(b.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Budget; 
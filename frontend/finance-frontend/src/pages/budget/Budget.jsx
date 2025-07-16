import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    total_amount: '',
    period_type: 'monthly',
    start_date: '',
    end_date: '',
    description: ''
  });

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        total_amount: editingBudget.total_amount,
        period_type: editingBudget.period_type,
        start_date: editingBudget.start_date,
        end_date: editingBudget.end_date,
        description: editingBudget.description || ''
      });
    } else {
      setFormData({
        name: '',
        total_amount: '',
        period_type: 'monthly',
        start_date: '',
        end_date: '',
        description: ''
      });
    }
  }, [editingBudget]);

  const createBudget = async (budgetData) => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API endpoint
      const newBudget = {
        id: Date.now(),
        ...budgetData,
        created_at: new Date().toISOString()
      };
      
      setBudgets(prev => [...prev, newBudget]);
      toast.success('Budget created successfully!');
      return newBudget;
    } catch (error) {
      toast.error('Failed to create budget');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API endpoint
      const updatedBudget = { ...budgetData, id };
      
      setBudgets(prev => prev.map(budget => 
        budget.id === id ? updatedBudget : budget
      ));
      toast.success('Budget updated successfully!');
      return updatedBudget;
    } catch (error) {
      toast.error('Failed to update budget');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBudget = async (budgetId) => {
    try {
      setLoading(true);
      // Simulate API call - replace with actual API endpoint
      setBudgets(prev => prev.filter(budget => budget.id !== budgetId));
      toast.success('Budget deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete budget');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, formData);
      } else {
        await createBudget(formData);
      }
      setIsModalOpen(false);
      setEditingBudget(null);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(budgetId);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const calculateProgress = (budget) => {
    // This would need to be calculated based on actual spending
    // For now, using a placeholder calculation
    const spent = 0; // This should come from transactions
    const total = parseFloat(budget.total_amount);
    return total > 0 ? Math.min((spent / total) * 100, 100) : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">Budgets</h1>
              <p className="mt-2 text-[var(--color-muted)]">
                Create and manage your spending budgets
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
              >
                + Create Budget
              </Button>
            </div>
          </div>
        </div>

        {/* Budgets Grid */}
        {budgets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-[var(--color-primary)] text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No budgets yet</h3>
            <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
              Create your first budget to start tracking your spending and stay on top of your finances.
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
            >
              Create Your First Budget
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const progress = calculateProgress(budget);
              const spent = 0; // This should come from actual transaction data
              const total = parseFloat(budget.total_amount);
              
              return (
                <div key={budget.id} className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">{budget.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(budget)}
                        className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        className="p-2 text-[var(--color-muted)] hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--color-muted)] mb-4">{budget.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--color-muted)]">Progress</span>
                      <span className="font-medium text-[var(--color-text)]">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress < 90 ? 'bg-green-500' : 
                          progress < 100 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[var(--color-muted)]">Spent</div>
                      <div className="font-semibold text-[var(--color-text)]">PKR {spent.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[var(--color-muted)]">Budget</div>
                      <div className="font-semibold text-[var(--color-text)]">PKR {total.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div className="text-xs text-[var(--color-muted)]">
                      {budget.period_type} • {budget.start_date} - {budget.end_date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? 'Edit Budget' : 'Create Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Budget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Total Amount
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.total_amount}
              onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Period Type
            </label>
            <select
              value={formData.period_type}
              onChange={(e) => setFormData({ ...formData, period_type: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
            >
              {editingBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                setEditingBudget(null);
              }}
              className="flex-1 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg)] hover:border-[var(--color-primary)] transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget; 
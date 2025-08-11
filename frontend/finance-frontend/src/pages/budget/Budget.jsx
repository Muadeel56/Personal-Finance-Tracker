import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button/Button';
import Modal from '../../components/common/Modal/Modal';
import { useBudgets } from '../../contexts/BudgetsContext';
import { categoriesAPI } from '../../api/categories';
import { parseDate } from '../../utils/formatters';

const Budget = () => {
  const { 
    budgets, 
    loading, 
    error, 
    addBudget, 
    updateBudget, 
    deleteBudget,
    fetchBudgetOverview,
    getBudgetSpendingAnalysis
  } = useBudgets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetAnalysis, setBudgetAnalysis] = useState({});
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    total_amount: '',
    period_type: 'MONTHLY',
    start_date: '',
    end_date: '',
    notes: '',
    category_allocations: []
  });

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoriesAPI.getCategoriesByType('expense'); // Only expense categories for budget allocation
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    if (editingBudget) {
      setFormData({
        name: editingBudget.name,
        total_amount: editingBudget.total_amount,
        period_type: editingBudget.period_type,
        start_date: formatDateForDisplay(editingBudget.start_date),
        end_date: formatDateForDisplay(editingBudget.end_date),
        notes: editingBudget.notes || '',
        category_allocations: editingBudget.categories?.map(cat => ({
          category: cat.category,
          amount: cat.amount,
          notes: cat.notes || ''
        })) || []
      });
    } else {
      setFormData({
        name: '',
        total_amount: '',
        period_type: 'MONTHLY',
        start_date: '',
        end_date: '',
        notes: '',
        category_allocations: []
      });
    }
  }, [editingBudget]);

  // Fetch spending analysis for all budgets
  useEffect(() => {
    const fetchAllAnalysis = async () => {
      if (budgets.length === 0) return;
      
      setLoadingAnalysis(true);
      console.log('Fetching budget analysis for', budgets.length, 'budgets');
      
      const analysisPromises = budgets.map(async (budget) => {
        try {
          console.log(`Fetching analysis for budget ${budget.id}: ${budget.name}`);
          const analysis = await getBudgetSpendingAnalysis(budget.id);
          console.log(`Analysis for budget ${budget.id}:`, analysis);
          return { budgetId: budget.id, analysis };
        } catch (error) {
          console.error(`Failed to fetch analysis for budget ${budget.id}:`, error);
          return { budgetId: budget.id, analysis: null };
        }
      });

      const results = await Promise.all(analysisPromises);
      const analysisMap = {};
      results.forEach(({ budgetId, analysis }) => {
        analysisMap[budgetId] = analysis;
      });
      
      console.log('Final budget analysis map:', analysisMap);
      setBudgetAnalysis(analysisMap);
      setLoadingAnalysis(false);
    };

    fetchAllAnalysis();
  }, [budgets, getBudgetSpendingAnalysis]);

  const validateDate = (dateString) => {
    if (!dateString) return false;
    
    // Check format DD-MM-YYYY
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return false;
    }
    
    // Check if it's a valid date
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in DD-MM-YYYY format, return as is
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
      return dateString;
    }
    
    // If it's in YYYY-MM-DD format (from backend), convert to DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    }
    
    return dateString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date format
    if (!validateDate(formData.start_date)) {
      toast.error('Please enter start date in DD-MM-YYYY format (e.g., 10-08-2024)');
      return;
    }
    
    if (!validateDate(formData.end_date)) {
      toast.error('Please enter end date in DD-MM-YYYY format (e.g., 10-09-2025)');
      return;
    }
    
    // Parse and validate dates
    const startDate = parseDate(formData.start_date);
    const endDate = parseDate(formData.end_date);
    
    if (!startDate || !endDate) {
      toast.error('Please enter valid dates');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }
    
    // Validate that total allocations don't exceed total budget
    const totalAllocated = formData.category_allocations.reduce((sum, allocation) => 
      sum + parseFloat(allocation.amount || 0), 0
    );
    const totalBudget = parseFloat(formData.total_amount);
    
    if (totalAllocated > totalBudget) {
      toast.error(`Total category allocations (${totalAllocated.toFixed(2)}) cannot exceed budget amount (${totalBudget.toFixed(2)})`);
      return;
    }
    
    try {
      const budgetData = {
        ...formData,
        start_date: startDate,
        end_date: endDate
      };
      
      if (editingBudget) {
        await updateBudget(editingBudget.id, budgetData);
      } else {
        await addBudget(budgetData);
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

  const addCategoryAllocation = () => {
    setFormData(prev => ({
      ...prev,
      category_allocations: [
        ...prev.category_allocations,
        { category: '', amount: '', notes: '' }
      ]
    }));
  };

  const removeCategoryAllocation = (index) => {
    setFormData(prev => ({
      ...prev,
      category_allocations: prev.category_allocations.filter((_, i) => i !== index)
    }));
  };

  const updateCategoryAllocation = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      category_allocations: prev.category_allocations.map((allocation, i) => 
        i === index ? { ...allocation, [field]: value } : allocation
      )
    }));
  };

  const getBudgetProgress = (budget) => {
    const analysis = budgetAnalysis[budget.id];
    console.log(`Getting progress for budget ${budget.id}:`, analysis);
    
    if (!analysis || !analysis.overall_progress) {
      console.log(`No analysis data for budget ${budget.id}, using default values`);
      return {
        spent: 0,
        total: parseFloat(budget.total_amount),
        percentage: 0,
        isOverBudget: false,
        remaining: parseFloat(budget.total_amount),
        status: 'on_track'
      };
    }

    const progress = analysis.overall_progress;
    console.log(`Progress data for budget ${budget.id}:`, progress);
    
    const result = {
      spent: progress.total_spent,
      total: progress.total_budgeted,
      percentage: progress.percentage_used,
      isOverBudget: progress.is_over_budget,
      remaining: progress.total_remaining,
      status: progress.is_over_budget ? 'over_budget' : 
               progress.percentage_used > 90 ? 'warning' : 'on_track',
      daysRemaining: progress.days_remaining,
      dailyAverage: progress.daily_average_spent
    };
    
    console.log(`Calculated progress for budget ${budget.id}:`, result);
    return result;
  };

  const getTotalAllocated = () => {
    return formData.category_allocations.reduce((sum, allocation) => 
      sum + parseFloat(allocation.amount || 0), 0
    );
  };

  const getRemainingBudget = () => {
    const total = parseFloat(formData.total_amount || 0);
    const allocated = getTotalAllocated();
    return total - allocated;
  };

  if (loading || loadingAnalysis) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Budgets</h2>
          <p className="text-[var(--color-muted)] mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
          >
            Reload Page
          </Button>
        </div>
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
                Create and manage your spending budgets with real-time transaction tracking
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
              const progress = getBudgetProgress(budget);
              
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
                  
                  {budget.notes && (
                    <p className="text-sm text-[var(--color-muted)] mb-4">{budget.notes}</p>
                  )}

                  {/* Category Breakdown */}
                  {budget.categories && budget.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Category Allocations</h4>
                      <div className="space-y-1">
                        {budget.categories.slice(0, 3).map((category) => (
                          <div key={category.id} className="flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">{category.category_name}</span>
                            <span className="text-[var(--color-text)]">PKR {parseFloat(category.amount).toFixed(0)}</span>
                          </div>
                        ))}
                        {budget.categories.length > 3 && (
                          <div className="text-xs text-[var(--color-muted)]">
                            +{budget.categories.length - 3} more categories
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--color-muted)]">Progress</span>
                      <span className="font-medium text-[var(--color-text)]">
                        {progress.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.status === 'on_track' ? 'bg-green-500' : 
                          progress.status === 'warning' ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <div className="text-[var(--color-muted)]">Spent</div>
                      <div className={`font-semibold ${progress.isOverBudget ? 'text-red-600' : 'text-[var(--color-text)]'}`}>
                        PKR {progress.spent.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--color-muted)]">Budget</div>
                      <div className="font-semibold text-[var(--color-text)]">
                        PKR {progress.total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {progress.daysRemaining !== undefined && (
                    <div className="text-xs text-[var(--color-muted)] mb-2">
                      {progress.daysRemaining > 0 
                        ? `${progress.daysRemaining} days remaining`
                        : progress.daysRemaining === 0 
                        ? 'Budget period ends today'
                        : 'Budget period has ended'
                      }
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
                    <div className="text-xs text-[var(--color-muted)]">
                      {budget.period_type} • {budget.start_date} - {budget.end_date}
                    </div>
                    {progress.isOverBudget && (
                      <div className="text-xs text-red-600 mt-1 font-medium">
                        Over budget by PKR {Math.abs(progress.remaining).toFixed(2)}
                      </div>
                    )}
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
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
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
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Start Date
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="DD-MM-YYYY"
                autoComplete="off"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                End Date
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                placeholder="DD-MM-YYYY"
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Category Allocations */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-[var(--color-text)]">
                Category Allocations
              </label>
              <Button
                type="button"
                onClick={addCategoryAllocation}
                className="text-xs bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90 px-2 py-1"
              >
                + Add Category
              </Button>
            </div>
            
            {formData.category_allocations.length > 0 && (
              <div className="space-y-3 mb-4">
                {formData.category_allocations.map((allocation, index) => (
                  <div key={index} className="border border-[var(--color-border)] rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <select
                          value={allocation.category}
                          onChange={(e) => updateCategoryAllocation(index, 'category', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-[var(--color-border)] rounded bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          value={allocation.amount}
                          onChange={(e) => updateCategoryAllocation(index, 'amount', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-[var(--color-border)] rounded bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeCategoryAllocation(index)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Budget Summary */}
            {formData.total_amount && formData.category_allocations.length > 0 && (
              <div className="bg-[var(--color-surface)] p-3 rounded-lg text-sm">
                <div className="flex justify-between mb-1">
                  <span>Total Budget:</span>
                  <span>PKR {parseFloat(formData.total_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Total Allocated:</span>
                  <span>PKR {getTotalAllocated().toFixed(2)}</span>
                </div>
                <div className={`flex justify-between font-medium ${getRemainingBudget() < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <span>Remaining:</span>
                  <span>PKR {getRemainingBudget().toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
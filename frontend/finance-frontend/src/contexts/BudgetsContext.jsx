import { createContext, useContext, useState, useEffect } from 'react';
import { budgetsAPI } from '../api/budgets';
import { toast } from 'react-hot-toast';

const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgetOverview, setBudgetOverview] = useState(null);

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetsAPI.list();
      // Ensure we're setting an array
      setBudgets(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
      setError(err.message || 'Failed to load budgets');
      toast.error('Failed to load budgets');
      setBudgets([]); // Ensure we have an empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetOverview = async () => {
    try {
      const response = await budgetsAPI.getDashboardOverview();
      setBudgetOverview(response);
      return response;
    } catch (err) {
      console.error('Failed to fetch budget overview:', err);
      toast.error('Failed to load budget overview');
      throw err;
    }
  };

  const getBudgetSpendingAnalysis = async (budgetId) => {
    try {
      const response = await budgetsAPI.getSpendingAnalysis(budgetId);
      return response;
    } catch (err) {
      console.error('Failed to fetch budget spending analysis:', err);
      toast.error('Failed to load budget analysis');
      throw err;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async (budget) => {
    try {
      const newBudget = await budgetsAPI.create(budget);
      setBudgets((prev) => [...prev, newBudget]);
      toast.success('Budget added!');
      // Refresh overview data
      fetchBudgetOverview();
      return newBudget;
    } catch (err) {
      console.error('Failed to add budget:', err);
      toast.error('Failed to add budget');
      throw err;
    }
  };

  const updateBudget = async (id, budget) => {
    try {
      const updated = await budgetsAPI.update(id, budget);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success('Budget updated!');
      // Refresh overview data
      fetchBudgetOverview();
      return updated;
    } catch (err) {
      console.error('Failed to update budget:', err);
      toast.error('Failed to update budget');
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetsAPI.delete(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      toast.success('Budget deleted!');
      // Refresh overview data
      fetchBudgetOverview();
    } catch (err) {
      console.error('Failed to delete budget:', err);
      toast.error('Failed to delete budget');
      throw err;
    }
  };

  const value = {
    budgets,
    loading,
    error,
    budgetOverview,
    addBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
    fetchBudgetOverview,
    getBudgetSpendingAnalysis,
  };

  return (
    <BudgetsContext.Provider value={value}>
      {children}
    </BudgetsContext.Provider>
  );
};

export const useBudgets = () => {
  const context = useContext(BudgetsContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetsProvider');
  }
  return context;
}; 
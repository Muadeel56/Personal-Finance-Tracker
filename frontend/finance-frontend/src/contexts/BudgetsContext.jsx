import { createContext, useContext, useState, useEffect } from 'react';
import { budgetsAPI } from '../api/budgets';
import { toast } from 'react-hot-toast';

const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchBudgets();
  }, []);

  const addBudget = async (budget) => {
    try {
      const newBudget = await budgetsAPI.create(budget);
      setBudgets((prev) => [...prev, newBudget]);
      toast.success('Budget added!');
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
    addBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
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
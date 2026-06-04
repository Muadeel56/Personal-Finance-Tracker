import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { budgetsAPI } from '../api/budgets';
import { toast } from 'react-hot-toast';

const BudgetsContext = createContext();

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [budgetOverview, setBudgetOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const overviewFetchedRef = useRef(false);

  const fetchBudgets = useCallback(async () => {
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
  }, []);

  const fetchBudgetOverview = useCallback(async () => {
    // Prevent multiple calls - only fetch once per session
    if (overviewFetchedRef.current) {
      console.log('Budget overview already fetched, skipping...');
      return budgetOverview;
    }
    
    // Prevent multiple simultaneous calls
    if (overviewLoading) {
      console.log('Budget overview fetch already in progress, skipping...');
      return;
    }
    
    console.log('Fetching budget overview...');
    setOverviewLoading(true);
    overviewFetchedRef.current = true;
    
    try {
      const response = await budgetsAPI.getDashboardOverview();
      console.log('Budget overview fetched successfully:', response);
      setBudgetOverview(response);
      return response;
    } catch (err) {
      console.error('Failed to fetch budget overview:', err);
      toast.error('Failed to load budget overview');
      overviewFetchedRef.current = false; // Reset on error so it can be retried
      throw err;
    } finally {
      setOverviewLoading(false);
    }
  }, [overviewLoading, budgetOverview]);

  const getBudgetSpendingAnalysis = useCallback(async (budgetId) => {
    try {
      const response = await budgetsAPI.getSpendingAnalysis(budgetId);
      return response;
    } catch (err) {
      console.error('Failed to fetch budget spending analysis:', err);
      toast.error('Failed to load budget analysis');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(async (budget) => {
    try {
      const newBudget = await budgetsAPI.create(budget);
      setBudgets((prev) => [...prev, newBudget]);
      toast.success('Budget added!');
      // Reset the ref so overview can be refreshed
      overviewFetchedRef.current = false;
      await fetchBudgetOverview();
      return newBudget;
    } catch (err) {
      console.error('Failed to add budget:', err);
      toast.error('Failed to add budget');
      throw err;
    }
  }, [fetchBudgetOverview]);

  const updateBudget = useCallback(async (id, budget) => {
    try {
      const updated = await budgetsAPI.update(id, budget);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success('Budget updated!');
      // Reset the ref so overview can be refreshed
      overviewFetchedRef.current = false;
      await fetchBudgetOverview();
      return updated;
    } catch (err) {
      console.error('Failed to update budget:', err);
      toast.error('Failed to update budget');
      throw err;
    }
  }, [fetchBudgetOverview]);

  const deleteBudget = useCallback(async (id) => {
    try {
      await budgetsAPI.delete(id);
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      toast.success('Budget deleted!');
      // Reset the ref so overview can be refreshed
      overviewFetchedRef.current = false;
      await fetchBudgetOverview();
    } catch (err) {
      console.error('Failed to delete budget:', err);
      toast.error('Failed to delete budget');
      throw err;
    }
  }, [fetchBudgetOverview]);

  const value = {
    budgets,
    loading,
    error,
    budgetOverview,
    overviewLoading,
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
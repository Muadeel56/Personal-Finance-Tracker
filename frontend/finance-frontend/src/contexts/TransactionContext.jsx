import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  transactions: [],
  loading: false,
  error: null,
  filters: {
    searchQuery: '',
    dateRange: null,
    category: '',
    type: '',
  },
  sort: {
    field: 'date',
    direction: 'desc',
  },
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_FILTERS: 'SET_FILTERS',
  SET_SORT: 'SET_SORT',
};

// Reducer function
const transactionReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case ActionTypes.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        loading: false,
        error: null,
      };
    case ActionTypes.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case ActionTypes.UPDATE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case ActionTypes.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    case ActionTypes.SET_SORT:
      return {
        ...state,
        sort: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const TransactionContext = createContext();

// Mock API functions (replace with actual API calls later)
const mockApi = {
  getTransactions: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: 1,
        date: '2024-03-01',
        description: 'Salary',
        amount: 5000,
        category: 'salary',
        type: 'income',
      },
      {
        id: 2,
        date: '2024-03-02',
        description: 'Rent',
        amount: 1500,
        category: 'housing',
        type: 'expense',
      },
      {
        id: 3,
        date: '2024-03-03',
        description: 'Groceries',
        amount: 200,
        category: 'food',
        type: 'expense',
      },
    ];
  },
  addTransaction: async (transaction) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...transaction, id: Date.now() };
  },
  updateTransaction: async (id, transaction) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...transaction, id };
  },
  deleteTransaction: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return id;
  },
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const data = await mockApi.getTransactions();
      dispatch({ type: ActionTypes.SET_TRANSACTIONS, payload: data });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      toast.error('Failed to fetch transactions');
    }
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const newTransaction = await mockApi.addTransaction(transaction);
      dispatch({ type: ActionTypes.ADD_TRANSACTION, payload: newTransaction });
      toast.success('Transaction added successfully');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      toast.error('Failed to add transaction');
    }
  };

  // Update transaction
  const updateTransaction = async (id, transaction) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const updatedTransaction = await mockApi.updateTransaction(id, transaction);
      dispatch({ type: ActionTypes.UPDATE_TRANSACTION, payload: updatedTransaction });
      toast.success('Transaction updated successfully');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      toast.error('Failed to update transaction');
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await mockApi.deleteTransaction(id);
      dispatch({ type: ActionTypes.DELETE_TRANSACTION, payload: id });
      toast.success('Transaction deleted successfully');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      toast.error('Failed to delete transaction');
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: ActionTypes.SET_FILTERS, payload: filters });
  };

  // Set sort
  const setSort = (sort) => {
    dispatch({ type: ActionTypes.SET_SORT, payload: sort });
  };

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const value = {
    ...state,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    setSort,
    refreshTransactions: fetchTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}; 
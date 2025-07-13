import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/config';

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
      console.log('Reducer: Setting transactions to:', action.payload);
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

// Provider component
export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      // Check if user is authenticated before making API calls
      const token = localStorage.getItem('access_token');
      console.log('Fetching transactions, token exists:', !!token);
      
      if (!token) {
        console.log('No authentication token found, skipping transaction fetch');
        dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false if no token
        return;
      }

      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      console.log('Making API call to fetch transactions...');
      const response = await api.get('/transactions/transactions/');
      console.log('API response:', response.data);
      
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      console.log('Processed transactions data:', data);
      
      console.log('Setting transactions in context:', data);
      dispatch({ type: ActionTypes.SET_TRANSACTIONS, payload: data });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after success
    } catch (error) {
      console.error('Error fetching transactions:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after error
      toast.error('Failed to fetch transactions');
    }
  };

  // Add transaction
  const addTransaction = async (transaction) => {
    try {
      // Check if user is authenticated before making API calls
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to add transactions');
        return;
      }

      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await api.post('/transactions/transactions/', transaction);
      dispatch({ type: ActionTypes.ADD_TRANSACTION, payload: response.data });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after success
      toast.success('Transaction added successfully');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after error
      toast.error('Failed to add transaction');
    }
  };

  // Update transaction
  const updateTransaction = async (id, transaction) => {
    try {
      // Check if user is authenticated before making API calls
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to update transactions');
        return;
      }

      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      const response = await api.put(`/transactions/transactions/${id}/`, transaction);
      dispatch({ type: ActionTypes.UPDATE_TRANSACTION, payload: response.data });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after success
      toast.success('Transaction updated successfully');
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false }); // Ensure loading is false after error
      toast.error('Failed to update transaction');
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      // Check if user is authenticated before making API calls
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast.error('Please log in to delete transactions');
        return;
      }

      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      await api.delete(`/transactions/transactions/${id}/`);
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

  // Fetch transactions on mount only if authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('TransactionContext mounted, token exists:', !!token);
    if (token) {
      console.log('Token found, calling fetchTransactions...');
      fetchTransactions();
    } else {
      console.log('No token found, skipping fetch');
    }
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
import axios from './axios';

// Accounts
export const getAccounts = () => axios.get('/transactions/accounts/');
export const createAccount = (data) => axios.post('/transactions/accounts/', data);
export const updateAccount = (id, data) => axios.patch(`/transactions/accounts/${id}/`, data);
export const deleteAccount = (id) => axios.delete(`/transactions/accounts/${id}/`);

// Categories
export const getCategories = () => axios.get('/transactions/categories/');
export const createCategory = (data) => axios.post('/transactions/categories/', data);
export const updateCategory = (id, data) => axios.patch(`/transactions/categories/${id}/`, data);
export const deleteCategory = (id) => axios.delete(`/transactions/categories/${id}/`);

// Transactions
export const getTransactions = () => axios.get('/transactions/transactions/');
export const createTransaction = (data) => axios.post('/transactions/transactions/', data);
export const updateTransaction = (id, data) => axios.patch(`/transactions/transactions/${id}/`, data);
export const deleteTransaction = (id) => axios.delete(`/transactions/transactions/${id}/`); 
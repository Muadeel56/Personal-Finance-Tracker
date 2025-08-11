import axiosInstance from './axios';

export const budgetsAPI = {
  list: async () => (await axiosInstance.get('/budgets/budgets/')).data,
  create: async (data) => (await axiosInstance.post('/budgets/budgets/', data)).data,
  update: async (id, data) => (await axiosInstance.put(`/budgets/budgets/${id}/`, data)).data,
  delete: async (id) => (await axiosInstance.delete(`/budgets/budgets/${id}/`)).data,
  // Fetch budget categories for a given budget
  getCategories: async (budgetId) => (await axiosInstance.get(`/budgets/budget-categories/?budget=${budgetId}`)).data,
  // Get spending analysis for a specific budget
  getSpendingAnalysis: async (budgetId) => (await axiosInstance.get(`/budgets/budgets/${budgetId}/spending_analysis/`)).data,
  // Get dashboard overview of all budgets with spending data
  getDashboardOverview: async () => (await axiosInstance.get('/budgets/budgets/dashboard_overview/')).data,
}; 
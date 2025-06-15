import axiosInstance from './axios';

export const budgetsAPI = {
  list: async () => (await axiosInstance.get('/budgets/budgets/')).data,
  create: async (data) => (await axiosInstance.post('/budgets/budgets/', data)).data,
  update: async (id, data) => (await axiosInstance.put(`/budgets/budgets/${id}/`, data)).data,
  delete: async (id) => (await axiosInstance.delete(`/budgets/budgets/${id}/`)).data,
}; 
import axiosInstance from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/accounts/token/', credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/accounts/users/register/', userData);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    // You might want to call a backend logout endpoint here if you have one
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/accounts/users/me/');
    return response.data;
  },

  refreshToken: async () => {
    const response = await axiosInstance.post('/accounts/token/refresh/');
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return response.data;
  },
}; 
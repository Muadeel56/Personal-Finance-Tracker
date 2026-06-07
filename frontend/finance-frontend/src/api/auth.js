import axiosInstance from './axios';

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosInstance.post('/accounts/token/', credentials);
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post('/accounts/users/register/', userData);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/accounts/users/me/');
    return response.data;
  },

  updateProfile: async ({ first_name, last_name, email, profile_picture }) => {
    const formData = new FormData();
    if (first_name !== undefined) formData.append('first_name', first_name);
    if (last_name !== undefined) formData.append('last_name', last_name);
    if (email !== undefined) formData.append('email', email);
    if (profile_picture instanceof File) formData.append('profile_picture', profile_picture);

    const response = await axiosInstance.patch('/accounts/users/me/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem('refresh_token');
    const response = await axiosInstance.post('/accounts/token/refresh/', { refresh });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return response.data;
  },
};

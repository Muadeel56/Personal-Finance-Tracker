import axiosInstance from './axios';

export const categoriesAPI = {
  // Get all categories for the current user
  getCategories: async () => {
    const response = await axiosInstance.get('/transactions/categories/');
    return response.data;
  },

  // Get a specific category by ID
  getCategory: async (id) => {
    const response = await axiosInstance.get(`/transactions/categories/${id}/`);
    return response.data;
  },

  // Create a new category
  createCategory: async (categoryData) => {
    const response = await axiosInstance.post('/transactions/categories/', categoryData);
    return response.data;
  },

  // Update an existing category
  updateCategory: async (id, categoryData) => {
    const response = await axiosInstance.put(`/transactions/categories/${id}/`, categoryData);
    return response.data;
  },

  // Delete a category
  deleteCategory: async (id) => {
    const response = await axiosInstance.delete(`/transactions/categories/${id}/`);
    return response.data;
  },

  // Get categories with transaction counts
  getCategoriesWithStats: async () => {
    const response = await axiosInstance.get('/transactions/categories/');
    return response.data;
  },

  // Get categories by type (income/expense)
  getCategoriesByType: async (type) => {
    const response = await axiosInstance.get(`/transactions/categories/?type=${type}`);
    return response.data;
  },

  // Get parent categories (categories without parent)
  getParentCategories: async () => {
    const response = await axiosInstance.get('/transactions/categories/?parent=null');
    return response.data;
  },

  // Get subcategories for a specific parent
  getSubcategories: async (parentId) => {
    const response = await axiosInstance.get(`/transactions/categories/?parent=${parentId}`);
    return response.data;
  }
}; 
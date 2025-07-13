import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      toast.success('Login successful!');
      navigate('/dashboard');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context
}; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import { Toaster } from 'react-hot-toast';
import { TransactionProvider } from './contexts/TransactionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginForm } from './components/auth/LoginForm';
import { BudgetsProvider } from './contexts/BudgetsContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Transactions from './pages/transactions/Transactions';
import Budget from './pages/budget/Budget';
import Reports from './pages/reports/Reports';
import Categories from './pages/categories/Categories';

// Wrapper component for authenticated routes
const AuthenticatedApp = () => {
  return (
    <BudgetsProvider>
      <TransactionProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Header />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Header />
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Header />
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/budget"
            element={
              <ProtectedRoute>
                <Header />
                <Budget />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Header />
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Header />
                <Categories />
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[var(--color-text)]">404</h1>
                  <p className="mt-4 text-xl text-[var(--color-muted)]">
                    Page not found
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </TransactionProvider>
    </BudgetsProvider>
  );
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Authenticated Routes */}
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import { TransactionProvider } from './contexts/TransactionContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { BudgetsProvider } from './contexts/BudgetsContext';
import AppLayout from './components/layout/AppLayout';

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

const AuthenticatedApp = () => {
  return (
    <BudgetsProvider>
      <TransactionProvider>
        <AppLayout>
          <Routes>
            <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings"     element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/budget"       element={<ProtectedRoute><Budget /></ProtectedRoute>} />
            <Route path="/reports"      element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/categories"   element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/"             element={<Navigate to="/dashboard" replace />} />
            <Route path="*"             element={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '64px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>404</h1>
                  <p style={{ marginTop: '12px', fontSize: '18px', color: 'var(--text-secondary)' }}>Page not found</p>
                </div>
              </div>
            } />
          </Routes>
        </AppLayout>
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
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/*"               element={<AuthenticatedApp />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface-1)',
            color: 'var(--text-primary)',
            border: 'var(--card-border)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
        }}
      />
    </Router>
  );
};

export default App;

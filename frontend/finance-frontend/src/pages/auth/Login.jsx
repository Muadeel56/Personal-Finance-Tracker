import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ submit: 'Invalid email or password' });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-md w-full">
        <Card className="p-8 shadow-lg bg-[var(--color-surface)]">
          <div className="mb-6 text-center">
            <div className="text-3xl font-bold text-[var(--color-primary)] mb-2">Personal Finance Tracker</div>
            <div className="text-lg text-[var(--color-muted)]">Sign in to your account</div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || submitting}
            >
              {(loading || submitting) ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-[var(--color-muted)]">Don't have an account? </span>
            <Link to="/register" className="text-[var(--color-primary)] hover:underline">Sign up</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login; 
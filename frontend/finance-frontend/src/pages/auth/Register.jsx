import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { success, error } = await register({ name: formData.name, email: formData.email, password: formData.password });
      if (!success) setErrors({ submit: error });
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const Field = ({ name, label, type = 'text', placeholder, autoComplete }) => (
    <div>
      <label className="field-label">{label}</label>
      <div className={`field ${errors[name] ? 'error' : ''}`}>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      </div>
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'var(--accent-grad)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--on-accent)', marginBottom: '16px',
          }}>
            <SparklesIcon className="h-6 w-6" />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700,
            color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em',
          }}>
            Create account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            Start tracking your finances today
          </p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Field name="name" label="Full name" placeholder="Jane Smith" autoComplete="name" />
            <Field name="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
            <Field name="password" label="Password" type="password" placeholder="Min 8 characters" autoComplete="new-password" />
            <Field name="confirmPassword" label="Confirm password" type="password" placeholder="Repeat password" autoComplete="new-password" />

            {errors.submit && (
              <div style={{
                padding: '10px 14px', borderRadius: '10px',
                background: 'var(--expense-muted)', color: 'var(--expense)',
                fontSize: '13px', fontWeight: 500,
              }}>
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '15px', marginTop: '4px' }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

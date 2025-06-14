import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password reset request
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] dark:bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-[var(--color-text)]">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              We've sent password reset instructions to your email address.
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                Return to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] dark:bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[var(--color-text)]">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <Card>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset instructions'}
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-[var(--color-primary)] hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 
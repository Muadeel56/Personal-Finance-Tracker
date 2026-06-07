import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';
import { 
  BanknotesIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowRightIcon,
  HandRaisedIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Financial Journey",
      subtitle: "Let's set up your personal finance tracker in just a few steps",
      icon: SparklesIcon,
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--accent-grad)' }}>
            <SparklesIcon className="w-12 h-12 text-[var(--surface-1)]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2 flex items-center justify-center gap-2">
              Welcome, {user?.first_name || 'there'}!
              <HandRaisedIcon className="w-6 h-6 text-[var(--accent)]" />
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              We're excited to help you take control of your finances. Let's get started with a quick setup.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Connect Your Accounts",
      subtitle: "Securely link your bank accounts and credit cards",
      icon: BanknotesIcon,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-[var(--border-subtle)] rounded-lg text-center hover:border-[var(--accent)] transition-colors cursor-pointer">
              <BanknotesIcon className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-2" />
              <h3 className="font-semibold text-[var(--text-primary)]">Bank Account</h3>
              <p className="text-sm text-[var(--text-muted)]">Connect your checking & savings</p>
            </div>
            <div className="p-4 border-2 border-dashed border-[var(--border-subtle)] rounded-lg text-center hover:border-[var(--accent)] transition-colors cursor-pointer">
              <BanknotesIcon className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-2" />
              <h3 className="font-semibold text-[var(--text-primary)]">Credit Card</h3>
              <p className="text-sm text-[var(--text-muted)]">Link your credit cards</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Don't worry, you can skip this for now and add accounts later
            </p>
            <Button variant="outline" onClick={() => setCurrentStep(currentStep + 1)}>
              Skip for now
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Set Up Your Budget",
      subtitle: "Create your first budget to start tracking your spending",
      icon: ChartBarIcon,
      content: (
        <div className="space-y-6">
          <div className="bg-[var(--info-muted)] p-4 rounded-lg">
            <h3 className="font-semibold text-[var(--info)] mb-2">Quick Budget Setup</h3>
            <p className="text-[var(--info)] text-sm">
              We'll help you create a basic budget based on common categories. You can customize it later.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--surface-1)] border rounded-lg">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Housing</h4>
                <p className="text-sm text-[var(--text-muted)]">Rent, mortgage, utilities</p>
              </div>
              <input 
                type="number" 
                placeholder="0" 
                className="w-24 px-3 py-1 border rounded text-right"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--surface-1)] border rounded-lg">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Food & Dining</h4>
                <p className="text-sm text-[var(--text-muted)]">Groceries, restaurants</p>
              </div>
              <input 
                type="number" 
                placeholder="0" 
                className="w-24 px-3 py-1 border rounded text-right"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-[var(--surface-1)] border rounded-lg">
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Transportation</h4>
                <p className="text-sm text-[var(--text-muted)]">Gas, public transit, car payment</p>
              </div>
              <input 
                type="number" 
                placeholder="0" 
                className="w-24 px-3 py-1 border rounded text-right"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Security & Privacy",
      subtitle: "Your financial data is protected with bank-level security",
      icon: ShieldCheckIcon,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-[var(--income-muted)] rounded-lg">
              <ShieldCheckIcon className="w-12 h-12 mx-auto text-[var(--income)] mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Bank-Level Security</h3>
              <p className="text-green-700 text-sm">
                Your data is encrypted and protected with the same security standards as major banks.
              </p>
            </div>
            <div className="text-center p-6 bg-[var(--info-muted)] rounded-lg">
              <ShieldCheckIcon className="w-12 h-12 mx-auto text-[var(--accent)] mb-3" />
              <h3 className="font-semibold text-[var(--info)] mb-2">Privacy First</h3>
              <p className="text-[var(--info)] text-sm">
                We never sell your data. Your financial information stays private and secure.
              </p>
            </div>
          </div>
          <div className="bg-[var(--surface-2)] p-4 rounded-lg">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Security Features</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-[var(--income)] mr-2" />
                Two-factor authentication
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-[var(--income)] mr-2" />
                End-to-end encryption
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-[var(--income)] mr-2" />
                Regular security audits
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-[var(--income)] mr-2" />
                Secure data centers
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-2xl w-full bg-[var(--surface-1)] rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[var(--text-muted)]">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-[var(--text-muted)]">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-[var(--surface-3)] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                background: 'var(--accent-grad)',
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {steps[currentStep].subtitle}
            </p>
          </div>
          <div className="min-h-[300px]">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSkip}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] font-medium"
          >
            Skip setup
          </button>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 
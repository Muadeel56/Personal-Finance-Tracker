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
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.first_name || 'there'}! 👋
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
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
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors cursor-pointer">
              <BanknotesIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <h3 className="font-semibold text-gray-900">Bank Account</h3>
              <p className="text-sm text-gray-500">Connect your checking & savings</p>
            </div>
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors cursor-pointer">
              <BanknotesIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <h3 className="font-semibold text-gray-900">Credit Card</h3>
              <p className="text-sm text-gray-500">Link your credit cards</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Quick Budget Setup</h3>
            <p className="text-blue-700 text-sm">
              We'll help you create a basic budget based on common categories. You can customize it later.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Housing</h4>
                <p className="text-sm text-gray-500">Rent, mortgage, utilities</p>
              </div>
              <input 
                type="number" 
                placeholder="0" 
                className="w-24 px-3 py-1 border rounded text-right"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Food & Dining</h4>
                <p className="text-sm text-gray-500">Groceries, restaurants</p>
              </div>
              <input 
                type="number" 
                placeholder="0" 
                className="w-24 px-3 py-1 border rounded text-right"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Transportation</h4>
                <p className="text-sm text-gray-500">Gas, public transit, car payment</p>
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
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <ShieldCheckIcon className="w-12 h-12 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Bank-Level Security</h3>
              <p className="text-green-700 text-sm">
                Your data is encrypted and protected with the same security standards as major banks.
              </p>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <ShieldCheckIcon className="w-12 h-12 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Privacy First</h3>
              <p className="text-blue-700 text-sm">
                We never sell your data. Your financial information stays private and secure.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Security Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Two-factor authentication
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                End-to-end encryption
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                Regular security audits
              </li>
              <li className="flex items-center">
                <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
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
            className="text-gray-500 hover:text-gray-700 font-medium"
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
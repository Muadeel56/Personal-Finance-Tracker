import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../Button/Button';

const defaultCategories = [
  { id: 'housing', name: 'Housing' },
  { id: 'food', name: 'Food' },
  { id: 'transportation', name: 'Transportation' },
  { id: 'utilities', name: 'Utilities' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'shopping', name: 'Shopping' },
  { id: 'salary', name: 'Salary' },
  { id: 'investment', name: 'Investment' },
  { id: 'other', name: 'Other' },
];

const schema = yup.object().shape({
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
  description: yup
    .string()
    .required('Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(100, 'Description must not exceed 100 characters'),
  category: yup
    .string()
    .required('Category is required'),
  date: yup
    .date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  type: yup
    .string()
    .required('Transaction type is required')
    .oneOf(['income', 'expense'], 'Invalid transaction type'),
});

const TransactionForm = ({ onSubmit, initialData = {}, categories = defaultCategories, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      ...initialData,
    },
  });

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-[var(--color-text)]">
          Type
        </label>
        <select
          {...register('type')}
          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-[var(--color-text)]">
          Amount
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-[var(--color-muted)] sm:text-sm">$</span>
          </div>
          <input
            type="number"
            step="0.01"
            {...register('amount')}
            className="block w-full pl-7 rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text)]">
          Description
        </label>
        <input
          type="text"
          {...register('description')}
          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
          placeholder="Enter transaction description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[var(--color-text)]">
          Category
        </label>
        <select
          {...register('category')}
          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-[var(--color-text)]">
          Date
        </label>
        <input
          type="date"
          {...register('date')}
          className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData.id ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm; 
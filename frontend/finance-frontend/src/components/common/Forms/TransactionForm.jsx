import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-hot-toast';
import api from '../../../api/config';
import { parseDate, formatDateForInput, formatDateForDisplay } from '../../../utils/formatters';

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
    .string()
    .required('Date is required')
    .matches(/^\d{2}-\d{2}-\d{4}$/, 'Please enter date in DD-MM-YYYY format (e.g., 08-09-2025)')
    .test('valid-date', 'Please enter a valid date', function(value) {
      if (!value) return false;
      const [day, month, year] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
    })
    .test('not-future', 'Date cannot be in the future', function(value) {
      if (!value) return false;
      const [day, month, year] = value.split('-').map(Number);
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return inputDate <= today;
    }),
  transaction_type: yup
    .string()
    .required('Transaction type is required')
    .oneOf(['INCOME', 'EXPENSE'], 'Invalid transaction type'),
});

const errorStyle = { marginTop: '4px', fontSize: '12px', color: 'var(--expense)' };

const TransactionForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: formatDateForInput(),
      transaction_type: 'EXPENSE',
      ...initialData,
      category: initialData?.category?.id || initialData?.category || '',
    },
  });

  useEffect(() => {
    if (initialData && initialData.id) {
      const formattedDate = formatDateForDisplay(initialData.date);
      reset({
        ...initialData,
        date: formattedDate,
        category: initialData?.category?.id || initialData?.category || '',
      });
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          const response = await api.get('/transactions/categories/');
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const formattedDate = parseDate(data.date);
      if (!formattedDate) {
        toast.error('Invalid date format. Please use DD-MM-YYYY format.');
        return;
      }

      const transformedData = {
        ...data,
        date: formattedDate,
        category_id: Number(data.category),
        transaction_type: data.transaction_type,
      };
      delete transformedData.category;
      await onSubmit(transformedData);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save transaction');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label htmlFor="transaction_type" className="field-label">Type</label>
        <div className={`field field--select${errors.transaction_type ? ' error' : ''}`}>
          <select {...register('transaction_type')} id="transaction_type">
            <option value="EXPENSE">Expense</option>
            <option value="INCOME">Income</option>
          </select>
        </div>
        {errors.transaction_type && <p style={errorStyle}>{errors.transaction_type.message}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="field-label">Amount</label>
        <div className={`field${errors.amount ? ' error' : ''}`}>
          <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>$</span>
          <input
            type="number"
            step="0.01"
            id="amount"
            {...register('amount')}
            placeholder="0.00"
          />
        </div>
        {errors.amount && <p style={errorStyle}>{errors.amount.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="field-label">Description</label>
        <div className={`field${errors.description ? ' error' : ''}`}>
          <input
            type="text"
            id="description"
            {...register('description')}
            placeholder="Enter transaction description"
          />
        </div>
        {errors.description && <p style={errorStyle}>{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="category" className="field-label">Category</label>
        <div className={`field field--select${errors.category ? ' error' : ''}`}>
          <select {...register('category')} id="category" disabled={loadingCategories}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {errors.category && <p style={errorStyle}>{errors.category.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="field-label">Date</label>
        <div className={`field${errors.date ? ' error' : ''}`}>
          <input
            type="text"
            id="date"
            {...register('date')}
            placeholder="DD-MM-YYYY (e.g., 08-09-2025)"
            autoComplete="off"
          />
        </div>
        <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
          Format: DD-MM-YYYY (e.g., 08-09-2025 for August 9th, 2025)
        </p>
        {errors.date && <p style={errorStyle}>{errors.date.message}</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ flex: 1 }}
          disabled={isSubmitting || loadingCategories}
        >
          {isSubmitting ? 'Saving...' : (initialData && initialData.id) ? 'Update Transaction' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

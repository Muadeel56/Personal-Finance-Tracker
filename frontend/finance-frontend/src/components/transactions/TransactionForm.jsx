import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';

const TransactionForm = ({ transaction, onSubmit, onCancel }) => {
  const context = useTransactions();
  const accounts = context.accounts || [];
  const categories = context.categories || [];
  console.log('accounts', accounts);
  console.log('categories', categories);
  const emptyForm = {
    account: '',
    category: '',
    amount: '',
    date: '',
    description: '',
    transaction_type: '',
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (transaction) {
      setFormData({
        account: transaction.account,
        category: transaction.category,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        transaction_type: transaction.transaction_type || '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure category is an integer (ID), date is YYYY-MM-DD, and transaction_type is present
    const dataToSend = {
      ...formData,
      category: parseInt(formData.category, 10),
      account: parseInt(formData.account, 10),
      date: formData.date, // input type=date is already YYYY-MM-DD
      transaction_type: formData.transaction_type,
    };
    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="account" className="block text-sm font-medium text-gray-700">
          Account
        </label>
        <select
          id="account"
          name="account"
          value={formData.account}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select an account</option>
          {accounts.filter(acc => acc && acc.id).map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select a category</option>
          {categories.filter(cat => cat && cat.id).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="transaction_type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          id="transaction_type"
          name="transaction_type"
          value={formData.transaction_type}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm; 
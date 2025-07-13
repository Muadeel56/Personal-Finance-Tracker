import React, { useState } from 'react';
import { useTransactions } from '../../contexts/TransactionContext';
import TransactionList from '../../components/common/Transactions/TransactionList';
import FilterBar from '../../components/common/Filter/FilterBar';
import TransactionForm from '../../components/common/Forms/TransactionForm';
import { Dialog } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { 
  filterByDateRange, 
  sortTransactions,
  getCurrentMonthRange 
} from '../../utils/helpers';

const Transactions = () => {
  const { 
    transactions, 
    loading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();

  // Debug logging
  console.log('Transactions component - transactions:', transactions);
  console.log('Transactions component - loading:', loading);
  console.log('Transactions component - transactions length:', transactions?.length);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: getCurrentMonthRange(),
    category: '',
    type: '',
  });
  const [sort, setSort] = useState({
    field: 'date',
    direction: 'desc',
  });

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  const handleSubmit = async (data) => {
    if (selectedTransaction) {
      await updateTransaction(selectedTransaction.id, data);
    } else {
      await addTransaction(data);
    }
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const handleExport = (selectedData) => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...selectedData.map(t => [
        t.date,
        t.description,
        typeof t.category === 'object' ? t.category?.name || '' : `Category ${t.category}`,
        t.transaction_type,
        t.amount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ensure transactions is always an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  
  const filteredTransactions = safeTransactions
    .filter(t => {
      // Handle category as either object or ID
      const categoryName = typeof t.category === 'object' 
        ? t.category?.name || '' 
        : `Category ${t.category}`;
      
      const matchesSearch = t.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                          categoryName.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      const matchesCategory = !filters.category || 
                            (typeof t.category === 'object' 
                              ? t.category?.id === filters.category 
                              : t.category === filters.category);
      
      const matchesType = !filters.type || t.transaction_type === filters.type;
      const matchesDateRange = filterByDateRange(t, filters.dateRange.start, filters.dateRange.end);
      
      return matchesSearch && matchesCategory && matchesType && matchesDateRange;
    });

  const sortedTransactions = sortTransactions(
    filteredTransactions,
    sort.field,
    sort.direction
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Transactions</h1>
        <button
          onClick={() => {
            setSelectedTransaction(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      <FilterBar
        searchQuery={filters.searchQuery}
        onSearchChange={(value) => setFilters(prev => ({ ...prev, searchQuery: value }))}
        dateRange={filters.dateRange}
        onDateRangeChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
        category={filters.category}
        onCategoryChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
        type={filters.type}
        onTypeChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
        onReset={() => setFilters({
          searchQuery: '',
          dateRange: getCurrentMonthRange(),
          category: '',
          type: '',
        })}
      />

      <TransactionList
        transactions={sortedTransactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={(field) => setSort(prev => ({
          field,
          direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
        }))}
        sortField={sort.field}
        sortDirection={sort.direction}
        onExport={handleExport}
        loading={loading}
      />

      <Dialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTransaction(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-[var(--color-card)] p-6 shadow-lg">
            <Dialog.Title className="text-lg font-medium text-[var(--color-text)] mb-4">
              {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Dialog.Title>
            <TransactionForm
              onSubmit={handleSubmit}
              initialData={selectedTransaction}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedTransaction(null);
              }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Transactions; 
import { useState } from 'react';
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
    deleteTransaction,
  } = useTransactions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: getCurrentMonthRange(),
    category: '',
    type: '',
  });
  const [sort, setSort] = useState({ field: 'date', direction: 'desc' });

  const handleEdit = (transaction) => { setSelectedTransaction(transaction); setIsFormOpen(true); };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };
  const handleSubmit = async (data) => {
    if (selectedTransaction) await updateTransaction(selectedTransaction.id, data);
    else await addTransaction(data);
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };
  const handleExport = (selectedData) => {
    const csvContent = [
      ['Date', 'Description', 'Category', 'Type', 'Amount'],
      ...selectedData.map((t) => [
        t.date, t.description,
        typeof t.category === 'object' ? t.category?.name || '' : `Category ${t.category}`,
        t.transaction_type, t.amount,
      ]),
    ].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const filteredTransactions = safeTransactions.filter((t) => {
    const categoryName = typeof t.category === 'object' ? t.category?.name || '' : `Category ${t.category}`;
    const matchesSearch = t.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      categoryName.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesCategory = !filters.category ||
      (typeof t.category === 'object' ? t.category?.id === filters.category : t.category === filters.category);
    const matchesType = !filters.type || t.transaction_type === filters.type;
    return matchesSearch && matchesCategory && matchesType && filterByDateRange(t, filters.dateRange.start, filters.dateRange.end);
  });
  const sortedTransactions = sortTransactions(filteredTransactions, sort.field, sort.direction);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Transactions</h1>
          <p>Manage and track all your financial activity</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setSelectedTransaction(null); setIsFormOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusIcon style={{ width: '16px', height: '16px' }} />
          Add Transaction
        </button>
      </div>

      {/* Filter bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <FilterBar
          searchQuery={filters.searchQuery}
          onSearchChange={(value) => setFilters((prev) => ({ ...prev, searchQuery: value }))}
          dateRange={filters.dateRange}
          onDateRangeChange={(range) => setFilters((prev) => ({ ...prev, dateRange: range }))}
          category={filters.category}
          onCategoryChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
          type={filters.type}
          onTypeChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
          onReset={() => setFilters({ searchQuery: '', dateRange: getCurrentMonthRange(), category: '', type: '' })}
        />
      </div>

      {/* Transaction list */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <TransactionList
          transactions={sortedTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSort={(field) => setSort((prev) => ({
            field,
            direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
          }))}
          sortField={sort.field}
          sortDirection={sort.direction}
          onExport={handleExport}
          loading={loading}
        />
      </div>

      {/* Add / Edit modal */}
      <Dialog
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedTransaction(null); }}
        style={{ position: 'relative', zIndex: 50 }}
      >
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} aria-hidden="true" />
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <Dialog.Panel style={{
            width: '100%', maxWidth: '520px',
            background: 'var(--surface-1)',
            border: 'var(--card-border)',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: 'var(--card-shadow)',
          }}>
            <Dialog.Title style={{
              fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700,
              color: 'var(--text-primary)', marginBottom: '20px', letterSpacing: '-0.01em',
            }}>
              {selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Dialog.Title>
            <TransactionForm
              onSubmit={handleSubmit}
              initialData={selectedTransaction}
              onCancel={() => { setIsFormOpen(false); setSelectedTransaction(null); }}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Transactions;

import React, { useState } from 'react';
import Table from '../../components/common/Table/Table';
import Button from '../../components/common/Button/Button';

const mockBudgets = [
  { id: 1, category: 'Groceries', limit: 400, spent: 120 },
  { id: 2, category: 'Rent', limit: 1000, spent: 1000 },
  { id: 3, category: 'Utilities', limit: 200, spent: 150 },
  { id: 4, category: 'Entertainment', limit: 150, spent: 80 },
];

const columns = [
  { key: 'category', title: 'Category' },
  { key: 'limit', title: 'Budget Limit' },
  { key: 'spent', title: 'Spent' },
];

const Budget = () => {
  const [budgets, setBudgets] = useState(mockBudgets);
  const [showModal, setShowModal] = useState(false);

  // Mock add/edit/delete handlers
  const handleAdd = () => setShowModal(true);
  const handleDelete = (id) => setBudgets(budgets.filter(b => b.id !== id));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Budget</h1>
        <Button variant="primary" onClick={handleAdd}>Add Budget</Button>
      </div>
      <Table
        columns={[...columns, { key: 'actions', title: 'Actions' }]}
        data={budgets.map(b => ({
          ...b,
          limit: `$${b.limit}`,
          spent: (
            <span style={{ color: b.spent > b.limit ? 'var(--color-danger, #ef4444)' : 'var(--color-success, #22c55e)' }}>
              ${b.spent}
            </span>
          ),
          actions: (
            <Button variant="ghost" onClick={() => handleDelete(b.id)}>
              Delete
            </Button>
          ),
        }))}
      />
      {/* Mock Modal for Add/Edit (not implemented) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[var(--color-card)] p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Add Budget (Mock)</h2>
            <Button variant="primary" onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget; 
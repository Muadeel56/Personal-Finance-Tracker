import React from 'react';
import Table from '../../components/common/Table/Table';

const mockSummary = [
  { label: 'Total Income', value: '$3500' },
  { label: 'Total Expenses', value: '$2300' },
  { label: 'Net Savings', value: '$1200' },
];

const mockReports = [
  { id: 1, month: 'June 2024', income: 3500, expenses: 2300, savings: 1200 },
  { id: 2, month: 'May 2024', income: 3400, expenses: 2200, savings: 1200 },
  { id: 3, month: 'April 2024', income: 3200, expenses: 2100, savings: 1100 },
];

const columns = [
  { key: 'month', title: 'Month' },
  { key: 'income', title: 'Income' },
  { key: 'expenses', title: 'Expenses' },
  { key: 'savings', title: 'Savings' },
];

const Reports = () => (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <h1 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Reports</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {mockSummary.map((item) => (
        <div key={item.label} className="rounded-lg shadow p-4 bg-[var(--color-card)] text-[var(--color-text)]">
          <div className="text-[var(--color-muted)]">{item.label}</div>
          <div className="text-xl font-semibold">{item.value}</div>
        </div>
      ))}
    </div>
    <Table
      columns={columns}
      data={mockReports.map(r => ({
        ...r,
        income: `$${r.income}`,
        expenses: `$${r.expenses}`,
        savings: `$${r.savings}`,
      }))}
    />
  </div>
);

export default Reports; 
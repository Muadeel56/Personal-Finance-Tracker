import { format, parseISO, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { getCssVar, getCategoryColorByIndex } from './chartTheme';

// Format currency with 2 decimal places
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  return format(parseISO(date), formatStr);
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(1);
};

// Get current month range
export const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
};

// Get previous month range
export const getPreviousMonthRange = () => {
  const now = new Date();
  const previousMonth = subMonths(now, 1);
  return {
    start: format(startOfMonth(previousMonth), 'yyyy-MM-dd'),
    end: format(endOfMonth(previousMonth), 'yyyy-MM-dd'),
  };
};

export const getDateRangeForTimeRange = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'current_month':
      return {
        start: format(startOfMonth(now), 'yyyy-MM-dd'),
        end: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    case 'previous_month': {
      const previousMonth = subMonths(now, 1);
      return {
        start: format(startOfMonth(previousMonth), 'yyyy-MM-dd'),
        end: format(endOfMonth(previousMonth), 'yyyy-MM-dd'),
      };
    }
    case 'current_year':
      return {
        start: format(startOfYear(now), 'yyyy-MM-dd'),
        end: format(endOfYear(now), 'yyyy-MM-dd'),
      };
    case 'all_time':
      return { start: null, end: null };
    default:
      return {
        start: format(startOfMonth(now), 'yyyy-MM-dd'),
        end: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
  }
};

export const filterTransactionsByTimeRange = (transactions, timeRange) => {
  const { start, end } = getDateRangeForTimeRange(timeRange);
  if (!start && !end) return transactions;
  return transactions.filter((t) => filterByDateRange(t, start, end));
};

export const isIncomeTransaction = (transaction) =>
  transaction.transaction_type === 'INCOME';

export const isExpenseTransaction = (transaction) =>
  transaction.transaction_type === 'EXPENSE';

// Group transactions by category
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const categoryName = typeof transaction.category === 'object' 
      ? transaction.category?.name || 'Uncategorized'
      : `Category ${transaction.category}`;
    const amount = transaction.amount;
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += amount;
    return acc;
  }, {});
};

// Calculate total income from transactions
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.transaction_type === 'INCOME')
    .reduce((sum, t) => sum + Number(t.amount), 0);
};

// Calculate total expenses from transactions
export const calculateTotalExpenses = (transactions) => {
  return Math.abs(transactions
    .filter(t => t.transaction_type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount), 0));
};

// Calculate net balance (income - expenses)
export const calculateNetBalance = (transactions) => {
  return transactions.reduce((sum, t) => {
    return sum + (t.transaction_type === 'INCOME' ? Number(t.amount) : -Number(t.amount));
  }, 0);
};

// Calculate savings rate
export const calculateSavingsRate = (income, expenses) => {
  if (!income) return 0;
  return ((income - expenses) / income) * 100;
};

// Filter transactions by date range
export const filterByDateRange = (transaction, startDate, endDate) => {
  const transactionDate = typeof transaction.date === 'string' 
    ? parseISO(transaction.date) 
    : transaction.date;
  
  // Parse start and end dates if they are strings
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return transactionDate >= start && transactionDate <= end;
};

// Sort transactions by field
export const sortTransactions = (transactions, field, direction) => {
  return [...transactions].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle category field (sort by category name)
    if (field === 'category') {
      aValue = typeof a.category === 'object' ? a.category?.name || '' : `Category ${a.category}`;
      bValue = typeof b.category === 'object' ? b.category?.name || '' : `Category ${b.category}`;
    }

    // Handle date fields
    if (field === 'date') {
      aValue = typeof aValue === 'string' ? parseISO(aValue) : aValue;
      bValue = typeof bValue === 'string' ? parseISO(bValue) : bValue;
    }

    // Handle amount fields
    if (field === 'amount') {
      aValue = Math.abs(aValue);
      bValue = Math.abs(bValue);
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Generate chart data
export const generateChartData = (transactions, type = 'line') => {
  const groupedData = transactions.reduce((acc, t) => {
    const date = format(new Date(t.date), 'MMM d');
    if (!acc[date]) {
      acc[date] = { income: 0, expense: 0 };
    }
    if (t.transaction_type === 'INCOME') {
      acc[date].income += t.amount;
    } else {
      acc[date].expense += t.amount;
    }
    return acc;
  }, {});

  const labels = Object.keys(groupedData);
  const incomeData = labels.map(date => groupedData[date].income);
  const expenseData = labels.map(date => groupedData[date].expense);

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: getCssVar('--income') || '#059669',
        backgroundColor: getCssVar('--income-muted') || 'rgba(16, 185, 129, 0.1)',
        fill: type === 'line',
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: getCssVar('--expense') || '#EF4444',
        backgroundColor: getCssVar('--expense-muted') || 'rgba(239, 68, 68, 0.1)',
        fill: type === 'line',
      },
    ],
  };
};

// Get category color
export const getCategoryColor = (category) => {
  const keys = ['housing', 'food', 'transportation', 'utilities', 'entertainment', 'healthcare', 'education', 'shopping', 'salary', 'investment', 'other'];
  const index = keys.indexOf(category);
  if (index >= 0) return getCategoryColorByIndex(index);
  return getCssVar('--text-muted') || '#94A3B8';
};

// Group transactions by category
export const groupTransactionsByCategory = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const categoryName = typeof transaction.category === 'object' 
      ? transaction.category?.name || 'Uncategorized'
      : `Category ${transaction.category}`;
    if (!groups[categoryName]) {
      groups[categoryName] = {
        total: 0,
        transactions: [],
      };
    }
    groups[categoryName].total += Math.abs(transaction.amount);
    groups[categoryName].transactions.push(transaction);
    return groups;
  }, {});
}; 
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';

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

// Group transactions by category
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});
};

// Calculate total income from transactions
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expenses from transactions
export const calculateTotalExpenses = (transactions) => {
  return Math.abs(transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));
};

// Calculate net balance (income - expenses)
export const calculateNetBalance = (transactions) => {
  return transactions.reduce((sum, t) => {
    return sum + (t.type === 'income' ? t.amount : -t.amount);
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
  return transactionDate >= startDate && transactionDate <= endDate;
};

// Sort transactions by field
export const sortTransactions = (transactions, field, direction) => {
  return [...transactions].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

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
    if (t.type === 'income') {
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
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: type === 'line',
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: type === 'line',
      },
    ],
  };
};

// Get category color
export const getCategoryColor = (category) => {
  const colors = {
    housing: '#FF6B6B',
    food: '#4ECDC4',
    transportation: '#45B7D1',
    utilities: '#96CEB4',
    entertainment: '#FFEEAD',
    healthcare: '#D4A5A5',
    education: '#9B59B6',
    shopping: '#3498DB',
    salary: '#2ECC71',
    investment: '#F1C40F',
    other: '#95A5A6',
  };
  return colors[category] || '#95A5A6';
};

// Group transactions by category
export const groupTransactionsByCategory = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const category = transaction.category;
    if (!groups[category]) {
      groups[category] = {
        total: 0,
        transactions: [],
      };
    }
    groups[category].total += Math.abs(transaction.amount);
    groups[category].transactions.push(transaction);
    return groups;
  }, {});
}; 
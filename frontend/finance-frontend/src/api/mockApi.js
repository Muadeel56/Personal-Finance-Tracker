// src/api/mockApi.js

// Mock user data
let mockUser = {
  id: 1,
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: null,
};

// Mock dashboard data
const mockDashboard = {
  balance: 1200.5,
  income: 3500,
  expenses: 2300,
  savings: 500,
  transactions: [
    { id: 1, date: "2024-06-01", description: "Groceries", amount: -50 },
    { id: 2, date: "2024-06-02", description: "Salary", amount: 2000 },
    { id: 3, date: "2024-06-03", description: "Rent", amount: -800 },
  ],
};

export function mockGetDashboard() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboard), 700);
  });
}

export function mockGetProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockUser), 500);
  });
}

export function mockUpdateProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockUser = { ...mockUser, ...data };
      resolve(mockUser);
    }, 700);
  });
} 
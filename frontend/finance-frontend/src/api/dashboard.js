import api from './config';

// Dashboard Statistics
export const getDashboardStats = (timeRange = 'current_month') => 
  api.get(`/transactions/transactions/dashboard_stats/?time_range=${timeRange}`);

export const getCategoryStats = (timeRange = 'current_month') => 
  api.get(`/transactions/transactions/category_stats/?time_range=${timeRange}`);

// Reports
export const getFinancialSummary = (startDate, endDate) => 
  api.get(`/reports/reports/financial_summary/?start_date=${startDate}&end_date=${endDate}`);

export const getCashFlowReport = (startDate, endDate) => 
  api.get(`/reports/reports/cash_flow/?start_date=${startDate}&end_date=${endDate}`);

export const getBudgetVsActualReport = () => 
  api.get('/reports/reports/budget_vs_actual/');

export const getSpendingTrendsReport = (months = 12) => 
  api.get(`/reports/reports/spending_trends/?months=${months}`);

// Saved Reports
export const getReports = () => api.get('/reports/reports/');
export const createReport = (data) => api.post('/reports/reports/', data);
export const updateReport = (id, data) => api.patch(`/reports/reports/${id}/`, data);
export const deleteReport = (id) => api.delete(`/reports/reports/${id}/`);

// Report Schedules
export const getReportSchedules = () => api.get('/reports/report-schedules/');
export const createReportSchedule = (data) => api.post('/reports/report-schedules/', data);
export const updateReportSchedule = (id, data) => api.patch(`/reports/report-schedules/${id}/`, data);
export const deleteReportSchedule = (id) => api.delete(`/reports/report-schedules/${id}/`);

// Report Exports
export const getReportExports = () => api.get('/reports/report-exports/');
export const createReportExport = (data) => api.post('/reports/report-exports/', data);
export const deleteReportExport = (id) => api.delete(`/reports/report-exports/${id}/`); 
import React, { useState, useEffect } from 'react';
import { 
  getFinancialSummary, 
  getCashFlowReport, 
  getBudgetVsActualReport, 
  getSpendingTrendsReport,
  getReports,
  createReport,
  deleteReport
} from '../../api/dashboard';
import Card from '../../components/common/Card/Card';
import CategoryPieChart from '../../components/common/Charts/CategoryPieChart';
import Table from '../../components/common/Table/Table';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('financial_summary');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0].slice(0, 7) + '-01',
    endDate: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedReports, setSavedReports] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required. Please log in to view reports.');
      return;
    }
    
    fetchReportData();
    fetchSavedReports();
  }, [activeReport, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication required. Please log in to view reports.');
      setLoading(false);
      return;
    }
    
    try {
      let response;
      switch (activeReport) {
        case 'financial_summary':
          response = await getFinancialSummary(dateRange.startDate, dateRange.endDate);
          break;
        case 'cash_flow':
          response = await getCashFlowReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'budget_vs_actual':
          response = await getBudgetVsActualReport();
          break;
        case 'spending_trends':
          response = await getSpendingTrendsReport(12);
          break;
        default:
          response = await getFinancialSummary(dateRange.startDate, dateRange.endDate);
      }
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      // Validate the response data structure
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
      console.error('Error details:', err.response?.data);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view this data.');
      } else if (err.response?.status === 404) {
        setError('Report not found. Please check your request parameters.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to load report data. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedReports = async () => {
    try {
      const response = await getReports();
      setSavedReports(response.data);
    } catch (err) {
      console.error('Error fetching saved reports:', err);
    }
  };

  const handleSaveReport = async () => {
    try {
      const reportData = {
        name: `${activeReport.replace('_', ' ').toUpperCase()} Report`,
        report_type: activeReport.toUpperCase(),
        date_range_start: dateRange.startDate,
        date_range_end: dateRange.endDate,
        filters: { report_type: activeReport }
      };
      await createReport(reportData);
      fetchSavedReports();
    } catch (err) {
      console.error('Error saving report:', err);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await deleteReport(reportId);
      fetchSavedReports();
    } catch (err) {
      console.error('Error deleting report:', err);
    }
  };

  const renderFinancialSummary = () => {
    if (!reportData) return null;
    
    // Add debugging to understand the data structure
    console.log('reportData:', reportData);
    
    // Validate the data structure
    const { summary, category_breakdown, monthly_breakdown, period } = reportData;
    
    console.log('summary:', summary);
    console.log('period:', period);
    
    // Check if summary exists, if not, provide default values
    if (!summary) {
      console.warn('Summary data is missing from API response');
      return (
        <div className="space-y-6">
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">No Data Available</h3>
            <p className="text-[var(--color-muted)]">
              No financial summary data is available for the selected period. 
              This might be due to no transactions in the selected date range.
            </p>
            {period && (
              <div className="mt-4 text-sm text-[var(--color-muted)]">
                Period: {period.start_date} to {period.end_date}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <div className="text-[var(--color-muted)]">Total Income</div>
            <div className="text-2xl font-semibold text-green-500">
              ${summary.total_income?.toFixed(2) || '0.00'}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-muted)]">Total Expenses</div>
            <div className="text-2xl font-semibold text-red-500">
              ${summary.total_expenses?.toFixed(2) || '0.00'}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-muted)]">Net Income</div>
            <div className="text-2xl font-semibold text-[var(--color-text)]">
              ${summary.net_income?.toFixed(2) || '0.00'}
            </div>
          </Card>
          <Card>
            <div className="text-[var(--color-muted)]">Savings Rate</div>
            <div className="text-2xl font-semibold text-[var(--color-primary)]">
              {summary.savings_rate?.toFixed(1) || '0.0'}%
            </div>
          </Card>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Expense Categories</h3>
            <div className="h-80">
              {category_breakdown && category_breakdown.length > 0 ? (
                <CategoryPieChart 
                  data={category_breakdown.map(item => ({
                    name: item.category,
                    value: item.amount
                  }))} 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--color-muted)]">
                  No category data available
                </div>
              )}
            </div>
          </div>
          <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Monthly Breakdown</h3>
            <div className="space-y-3">
              {monthly_breakdown?.map((month, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-[var(--color-surface)] rounded">
                  <span className="text-sm text-[var(--color-muted)]">{month.month}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-green-500">${(month.income || 0).toFixed(2)}</span>
                    <span className="text-red-500">${(month.expenses || 0).toFixed(2)}</span>
                    <span className={`${(month.net || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${(month.net || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
              {(!monthly_breakdown || monthly_breakdown.length === 0) && (
                <div className="text-center text-[var(--color-muted)] py-4">
                  No monthly data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCashFlow = () => {
    if (!reportData) return null;
    
    const { cash_flow_data } = reportData;
    
    const tableData = cash_flow_data?.map(month => ({
      month: month.month,
      income: `$${month.income.toFixed(2)}`,
      expenses: `$${month.expenses.toFixed(2)}`,
      net_cash_flow: `$${month.net_cash_flow.toFixed(2)}`,
      transactions: month.transaction_count
    })) || [];

    const columns = [
      { key: 'month', title: 'Month' },
      { key: 'income', title: 'Income' },
      { key: 'expenses', title: 'Expenses' },
      { key: 'net_cash_flow', title: 'Net Cash Flow' },
      { key: 'transactions', title: 'Transactions' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Cash Flow Report</h3>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
    );
  };

  const renderBudgetVsActual = () => {
    if (!reportData) return null;
    
    const { budget_comparison } = reportData;
    
    const tableData = budget_comparison?.map(budget => ({
      budget_name: budget.budget_name,
      period: budget.period,
      budget_amount: `$${budget.budget_amount.toFixed(2)}`,
      actual_spending: `$${budget.actual_spending.toFixed(2)}`,
      variance: `$${budget.variance.toFixed(2)}`,
      utilization: `${budget.utilization_percentage.toFixed(1)}%`
    })) || [];

    const columns = [
      { key: 'budget_name', title: 'Budget Name' },
      { key: 'period', title: 'Period' },
      { key: 'budget_amount', title: 'Budget Amount' },
      { key: 'actual_spending', title: 'Actual Spending' },
      { key: 'variance', title: 'Variance' },
      { key: 'utilization', title: 'Utilization' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Budget vs Actual Report</h3>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
    );
  };

  const renderSpendingTrends = () => {
    if (!reportData) return null;
    
    const { trends_data } = reportData;
    
    const tableData = trends_data?.map(month => ({
      month: month.month,
      total_spending: `$${month.total_spending.toFixed(2)}`,
      top_categories: month.category_breakdown?.slice(0, 3).map(cat => cat.category).join(', ') || 'N/A'
    })) || [];

    const columns = [
      { key: 'month', title: 'Month' },
      { key: 'total_spending', title: 'Total Spending' },
      { key: 'top_categories', title: 'Top Categories' }
    ];

    return (
      <div className="space-y-6">
        <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Spending Trends Report</h3>
          <Table columns={columns} data={tableData} />
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'financial_summary':
        return renderFinancialSummary();
      case 'cash_flow':
        return renderCashFlow();
      case 'budget_vs_actual':
        return renderBudgetVsActual();
      case 'spending_trends':
        return renderSpendingTrends();
      default:
        return renderFinancialSummary();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  // Check if user is not authenticated
  const token = localStorage.getItem('access_token');
  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-[var(--color-muted)] mb-6">
            Please log in to view your financial reports.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Reports</h1>
        <button
          onClick={handleSaveReport}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90"
        >
          Save Report
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center justify-between">
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
          {error.includes('Authentication') && (
            <div className="mt-2">
              <button
                onClick={() => window.location.href = '/login'}
                className="text-sm underline hover:no-underline"
              >
                Click here to log in
              </button>
            </div>
          )}
          {!error.includes('Authentication') && (
            <div className="mt-2">
              <button
                onClick={() => {
                  setError(null);
                  fetchReportData();
                }}
                className="text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Report Type Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveReport('financial_summary')}
            className={`px-4 py-2 rounded-lg ${
              activeReport === 'financial_summary'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Financial Summary
          </button>
          <button
            onClick={() => setActiveReport('cash_flow')}
            className={`px-4 py-2 rounded-lg ${
              activeReport === 'cash_flow'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Cash Flow
          </button>
          <button
            onClick={() => setActiveReport('budget_vs_actual')}
            className={`px-4 py-2 rounded-lg ${
              activeReport === 'budget_vs_actual'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Budget vs Actual
          </button>
          <button
            onClick={() => setActiveReport('spending_trends')}
            className={`px-4 py-2 rounded-lg ${
              activeReport === 'spending_trends'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-card)] text-[var(--color-text)]'
            }`}
          >
            Spending Trends
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-[var(--color-surface)] text-[var(--color-text)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-[var(--color-surface)] text-[var(--color-text)]"
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Saved Reports */}
      {savedReports.length > 0 && (
        <div className="mt-8 bg-[var(--color-card)] rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Saved Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedReports.map((report) => (
              <div key={report.id} className="bg-[var(--color-surface)] rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[var(--color-text)]">{report.name}</h4>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-[var(--color-muted)]">{report.report_type}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {report.date_range_start} - {report.date_range_end}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports; 
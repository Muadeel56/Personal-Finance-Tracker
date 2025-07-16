import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EyeSlashIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import CategoryModal from '../../components/categories/CategoryModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { categoriesAPI } from '../../api/categories';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [filterType, setFilterType] = useState('all'); // all, income, expense

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (category) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory) {
        await categoriesAPI.updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated successfully');
      } else {
        await categoriesAPI.createCategory(categoryData);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save category');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await categoriesAPI.deleteCategory(deletingCategory.id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(category => {
    if (filterType === 'income') return category.is_income;
    if (filterType === 'expense') return !category.is_income;
    return true;
  });

  const getCategoryIcon = (category) => {
    if (category.icon) return category.icon;
    return category.is_income ? '💰' : '💸';
  };

  const getCategoryColor = (category) => {
    return category.color || (category.is_income ? '#10B981' : '#EF4444');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text)]">Categories</h1>
              <p className="mt-2 text-[var(--color-muted)]">
                Manage your transaction categories for better organization
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleCreateCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Category
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex bg-[var(--color-surface)] rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                filterType === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              All Categories ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                filterType === 'income'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              Income ({categories.filter(c => c.is_income).length})
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                filterType === 'expense'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              Expenses ({categories.filter(c => !c.is_income).length})
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-[var(--color-primary)] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CurrencyDollarIcon className="h-12 w-12 text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">No categories</h3>
            <p className="text-[var(--color-muted)] mb-6 max-w-md mx-auto">
              {filterType === 'all' 
                ? 'Get started by creating your first category to organize your transactions.'
                : `No ${filterType} categories found.`
              }
            </p>
            {filterType === 'all' && (
              <button
                onClick={handleCreateCategory}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-[var(--color-card)] overflow-hidden shadow-sm rounded-xl border border-[var(--color-border)] hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      >
                        {getCategoryIcon(category)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-[var(--color-text)]">
                          {category.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              category.is_income
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {category.is_income ? 'Income' : 'Expense'}
                          </span>
                          {category.parent && (
                            <span className="ml-2 text-xs text-[var(--color-muted)]">
                              Subcategory of {category.parent.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {category.description && (
                    <p className="mt-3 text-sm text-[var(--color-muted)] line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-[var(--color-muted)]">
                      {category.transactions_count || 0} transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                        title="Edit category"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="p-1 text-[var(--color-muted)] hover:text-red-600 transition-colors"
                        title="Delete category"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Modal */}
        {showModal && (
          <CategoryModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleSaveCategory}
            category={editingCategory}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingCategory && (
          <DeleteConfirmModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title="Delete Category"
            message={`Are you sure you want to delete "${deletingCategory.name}"? This action cannot be undone.`}
          />
        )}
      </div>
    </div>
  );
};

export default Categories; 
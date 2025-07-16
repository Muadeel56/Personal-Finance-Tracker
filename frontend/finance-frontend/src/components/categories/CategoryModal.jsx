import React, { useState, useEffect } from 'react';
import { XMarkIcon, EyeDropperIcon } from '@heroicons/react/24/outline';

const CategoryModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#10B981',
    is_income: false,
    parent: null
  });
  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);

  const predefinedColors = [
    '#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  const predefinedIcons = [
    '💰', '💸', '🍔', '🚗', '🏠', '💊', '🎬', '🛍️', '✈️', '🎓',
    '🏥', '⚡', '📱', '💻', '🎮', '🏋️', '🎨', '📚', '🎵', '🎪'
  ];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#10B981',
        is_income: category.is_income || false,
        parent: category.parent || null
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '#10B981',
        is_income: false,
        parent: null
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (formData.name.length > 100) {
      newErrors.name = 'Category name must be less than 100 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
    setShowColorPicker(false);
  };

  const handleIconSelect = (icon) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal Content */}
        <div 
          className="relative inline-block align-bottom bg-[var(--color-card)] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-[var(--color-border)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[var(--color-text)]">
                {category ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={onClose}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] ${
                    errors.name ? 'border-red-300' : 'border-[var(--color-border)]'
                  }`}
                  placeholder="e.g., Groceries, Salary, Entertainment"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-surface)] text-[var(--color-text)] ${
                    errors.description ? 'border-red-300' : 'border-[var(--color-border)]'
                  }`}
                  placeholder="Optional description for this category"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Category Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_income"
                      checked={!formData.is_income}
                      onChange={() => setFormData(prev => ({ ...prev, is_income: false }))}
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] bg-[var(--color-surface)]"
                    />
                    <span className="ml-2 text-sm text-[var(--color-text)]">Expense</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="is_income"
                      checked={formData.is_income}
                      onChange={() => setFormData(prev => ({ ...prev, is_income: true }))}
                      className="h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-[var(--color-border)] bg-[var(--color-surface)]"
                    />
                    <span className="ml-2 text-sm text-[var(--color-text)]">Income</span>
                  </label>
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] cursor-pointer"
                    style={{ backgroundColor: formData.color }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="flex items-center text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    <EyeDropperIcon className="h-4 w-4 mr-1" />
                    Choose Color
                  </button>
                </div>
                
                {showColorPicker && (
                  <div className="mt-2 p-3 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)]">
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => handleColorSelect(color)}
                          className="w-8 h-8 rounded-full border-2 border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors"
                          style={{ backgroundColor: color }}
                        ></button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Icon Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-10 gap-2 max-h-32 overflow-y-auto">
                  {predefinedIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleIconSelect(icon)}
                      className={`w-8 h-8 rounded-md border-2 text-lg hover:bg-[var(--color-surface)] transition-colors ${
                        formData.icon === icon ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[var(--color-border)]'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                {formData.icon && (
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Selected icon: {formData.icon}
                  </p>
                )}
              </div>

              {/* Preview */}
              <div className="mb-6 p-4 bg-[var(--color-surface)] rounded-md border border-[var(--color-border)]">
                <h4 className="text-sm font-medium text-[var(--color-text)] mb-2">Preview</h4>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.icon || (formData.is_income ? '💰' : '💸')}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-[var(--color-text)]">
                      {formData.name || 'Category Name'}
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formData.is_income
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {formData.is_income ? 'Income' : 'Expense'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md hover:bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-primary)] border border-transparent rounded-md hover:bg-[var(--color-primary)]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] transition-colors"
                >
                  {category ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal; 
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

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: '540px',
          background: 'var(--surface-1)',
          border: 'var(--card-border)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: 'var(--card-shadow)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {category ? 'Edit Category' : 'Create Category'}
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="field-label">Category Name *</label>
            <div className={`field${errors.name ? ' error' : ''}`}>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Groceries, Salary, Entertainment"
              />
            </div>
            {errors.name && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--expense)' }}>{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="field-label">Description</label>
            <div className={`field${errors.description ? ' error' : ''}`} style={{ height: 'auto', alignItems: 'flex-start', padding: '10px 14px' }}>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                style={{ width: '100%', resize: 'vertical', minHeight: '72px' }}
                placeholder="Optional description for this category"
              />
            </div>
            {errors.description && (
              <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--expense)' }}>{errors.description}</p>
            )}
          </div>

          {/* Category Type */}
          <div>
            <label className="field-label">Category Type</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="is_income"
                  checked={!formData.is_income}
                  onChange={() => setFormData(prev => ({ ...prev, is_income: false }))}
                  style={{ accentColor: 'var(--accent)', marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Expense</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="is_income"
                  checked={formData.is_income}
                  onChange={() => setFormData(prev => ({ ...prev, is_income: true }))}
                  style={{ accentColor: 'var(--accent)', marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Income</span>
              </label>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="field-label">Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--border-subtle)', cursor: 'pointer', backgroundColor: formData.color, flexShrink: 0 }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <EyeDropperIcon style={{ width: '16px', height: '16px' }} />
                Choose Color
              </button>
            </div>

            {showColorPicker && (
              <div style={{ marginTop: '8px', padding: '12px', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        border: formData.color === color ? '2px solid var(--accent)' : '2px solid var(--border-subtle)',
                        backgroundColor: color, cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="field-label">Icon</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px', maxHeight: '128px', overflowY: 'auto' }}>
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  style={
                    formData.icon === icon
                      ? { width: '32px', height: '32px', borderRadius: '8px', border: '2px solid var(--accent)', background: 'var(--accent-glow)', fontSize: '18px', cursor: 'pointer' }
                      : { width: '32px', height: '32px', borderRadius: '8px', border: '2px solid var(--border-subtle)', background: 'none', fontSize: '18px', cursor: 'pointer' }
                  }
                >
                  {icon}
                </button>
              ))}
            </div>
            {formData.icon && (
              <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                Selected icon: {formData.icon}
              </p>
            )}
          </div>

          {/* Preview */}
          <div style={{ padding: '16px', background: 'var(--surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '10px', marginTop: 0 }}>Preview</h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', backgroundColor: formData.color, flexShrink: 0 }}
              >
                {formData.icon || (formData.is_income ? '💰' : '💸')}
              </div>
              <div style={{ marginLeft: '12px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                  {formData.name || 'Category Name'}
                </p>
                <span className={`badge ${formData.is_income ? 'badge-up' : 'badge-down'}`}>
                  {formData.is_income ? 'Income' : 'Expense'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;

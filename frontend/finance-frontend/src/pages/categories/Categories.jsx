import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, TagIcon } from '@heroicons/react/24/outline';
import CategoryModal from '../../components/categories/CategoryModal';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';
import { categoriesAPI } from '../../api/categories';
import CategoryIcon from '../../components/categories/CategoryIcon';

const CAT_COLORS = ['#9333EA','#059669','#E11D48','#D97706','#7C3AED','#65A30D','#EA580C','#DB2777'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getCategories();
      setCategories(data);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory) { await categoriesAPI.updateCategory(editingCategory.id, data); toast.success('Category updated'); }
      else { await categoriesAPI.createCategory(data); toast.success('Category created'); }
      setShowModal(false);
      fetchCategories();
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to save category'); }
  };

  const handleConfirmDelete = async () => {
    try {
      await categoriesAPI.deleteCategory(deletingCategory.id);
      toast.success('Category deleted');
      setShowDeleteModal(false);
      fetchCategories();
    } catch { toast.error('Failed to delete category'); }
  };

  const filteredCategories = categories.filter((c) => {
    if (filterType === 'income') return c.is_income;
    if (filterType === 'expense') return !c.is_income;
    return true;
  });

  const tabStyle = (active) => ({
    padding: '7px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: 600,
    fontFamily: 'var(--font-display)', border: 'none', cursor: 'pointer',
    background: active ? 'var(--accent-grad)' : 'transparent',
    color: active ? 'var(--on-accent)' : 'var(--text-secondary)',
    transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', gap: '5px',
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Categories</h1>
          <p>Organize your transactions with custom categories</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusIcon style={{ width: '16px', height: '16px' }} /> Add Category
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', background: 'var(--surface-1)', border: 'var(--card-border)', borderRadius: '12px', padding: '4px', gap: '2px', boxShadow: 'var(--card-shadow)', marginBottom: '20px', width: 'fit-content' }}>
        <button style={tabStyle(filterType === 'all')} onClick={() => setFilterType('all')}>
          All <span className="badge badge-info" style={{ fontSize: '10px' }}>{categories.length}</span>
        </button>
        <button style={tabStyle(filterType === 'income')} onClick={() => setFilterType('income')}>
          <ArrowTrendingUpIcon className="h-4 w-4" /> Income <span className="badge badge-up" style={{ fontSize: '10px' }}>{categories.filter((c) => c.is_income).length}</span>
        </button>
        <button style={tabStyle(filterType === 'expense')} onClick={() => setFilterType('expense')}>
          <ArrowTrendingDownIcon className="h-4 w-4" /> Expense <span className="badge badge-down" style={{ fontSize: '10px' }}>{categories.filter((c) => !c.is_income).length}</span>
        </button>
      </div>

      {/* Grid */}
      {filteredCategories.length === 0 ? (
        <div className="card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <TagIcon className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No categories</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            {filterType === 'all' ? 'Create your first category to start organizing transactions.' : `No ${filterType} categories found.`}
          </p>
          {filterType === 'all' && (
            <button className="btn btn-primary" onClick={() => { setEditingCategory(null); setShowModal(true); }}>
              Add Category
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {filteredCategories.map((cat, i) => {
            const color = cat.color || CAT_COLORS[i % CAT_COLORS.length];
            return (
              <div key={cat.id} className="card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="cat-ic" style={{ background: `${color}22`, color, width: '42px', height: '42px' }}>
                      <CategoryIcon icon={cat.icon} isIncome={cat.is_income} className="h-5 w-5" />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cat.name}
                      </div>
                      <span className={`badge badge-${cat.is_income ? 'up' : 'down'}`} style={{ fontSize: '10px', marginTop: '4px' }}>
                        {cat.is_income ? 'Income' : 'Expense'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setEditingCategory(cat); setShowModal(true); }} title="Edit">
                      <PencilIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setDeletingCategory(cat); setShowDeleteModal(true); }} title="Delete"
                      style={{ color: 'var(--expense)' }}>
                      <TrashIcon style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>
                {cat.description && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }} className="line-clamp-2">{cat.description}</p>
                )}
                {cat.parent && (
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sub of {cat.parent.name}</p>
                )}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {cat.transactions_count || 0} transactions
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <CategoryModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleSaveCategory} category={editingCategory} />
      )}
      {showDeleteModal && deletingCategory && (
        <DeleteConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete}
          title="Delete Category" message={`Delete "${deletingCategory.name}"? This cannot be undone.`} />
      )}
    </div>
  );
};

export default Categories;

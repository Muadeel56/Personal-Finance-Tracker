import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button/Button';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Profile</h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Account Information</h2>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Avatar URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]/90"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-bg)]"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Full Name
                    </label>
                    <p className="text-[var(--color-text)]">{user?.name || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Email Address
                    </label>
                    <p className="text-[var(--color-text)]">{user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                      Member Since
                    </label>
                    <p className="text-[var(--color-text)]">
                      {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[var(--color-primary)] text-3xl font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{user?.name}</h3>
                <p className="text-[var(--color-muted)]">{user?.email}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-[var(--color-card)] rounded-xl p-6 shadow-sm border border-[var(--color-border)]">
              <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Account Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Last Login</span>
                  <span className="text-[var(--color-text)]">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
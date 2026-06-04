import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: '' });

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', avatar: user.avatar || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await updateProfile(formData); setIsEditing(false); }
    catch (err) { console.error('Error updating profile:', err); }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '', avatar: user?.avatar || '' });
    setIsEditing(false);
  };

  const initials = user?.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', alignItems: 'start' }}>
        {/* Main info card */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
            <span className="section-title">Account Information</span>
            {!isEditing && (
              <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Full name', key: 'name', type: 'text', placeholder: 'Jane Smith' },
                { label: 'Email address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Avatar URL (optional)', key: 'avatar', type: 'url', placeholder: 'https://…' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="field-label">{label}</label>
                  <div className="field">
                    <input type={type} value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} placeholder={placeholder} required={key !== 'avatar'} />
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save changes</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Full name', value: user?.name || 'Not set' },
                { label: 'Email address', value: user?.email },
                { label: 'Username', value: user?.username || 'Not set' },
                { label: 'Member since', value: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Avatar card */}
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex' }}>
              <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '28px', marginBottom: '14px', position: 'relative' }}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials
                }
                <span className="dot" />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {user?.name || user?.username}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>

          {/* Stats */}
          <div className="card" style={{ padding: '20px 22px' }}>
            <div className="section-title" style={{ marginBottom: '14px' }}>Quick Stats</div>
            {[
              { label: 'Account status', value: 'Active', color: 'var(--income)' },
              { label: 'Last login', value: user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'Unknown' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: color || 'var(--text-primary)', fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

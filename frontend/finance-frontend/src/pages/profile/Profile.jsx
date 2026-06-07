import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const getFullName = (user) => [user?.first_name, user?.last_name].filter(Boolean).join(' ');

const splitFullName = (name) => {
  const parts = name.trim().split(/\s+/);
  return {
    first_name: parts[0] || '',
    last_name: parts.slice(1).join(' ') || '',
  };
};

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [emailError, setEmailError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: getFullName(user),
        email: user.email || '',
      });
      setAvatarPreview(user.profile_picture || null);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    if (avatarPreview && avatarPreview.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');

    const { first_name, last_name } = splitFullName(formData.fullName);
    const payload = { first_name, last_name, email: formData.email };
    if (avatarFile) payload.profile_picture = avatarFile;

    try {
      await updateProfile(payload);
      setAvatarFile(null);
      setIsEditing(false);
    } catch {
      // Error toast handled in AuthContext
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: getFullName(user),
      email: user?.email || '',
    });
    setAvatarFile(null);
    setAvatarPreview(user?.profile_picture || null);
    setEmailError('');
    setIsEditing(false);
  };

  const displayName = getFullName(user) || user?.username || 'User';
  const initials = displayName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const avatarSrc = isEditing ? avatarPreview : user?.profile_picture;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className="profile-layout-grid">
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
              <div>
                <label className="field-label">Profile picture</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '20px', flexShrink: 0 }}>
                    {avatarSrc
                      ? <img src={avatarSrc} alt={displayName} style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }} />
                      : initials}
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => fileInputRef.current?.click()}>
                    Choose image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Full name</label>
                <div className="field">
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Email address</label>
                <div className={`field${emailError ? ' error' : ''}`}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setEmailError(''); }}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {emailError && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--expense)' }}>{emailError}</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save changes</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Full name', value: displayName || 'Not set' },
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
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex' }}>
              <div className="avatar" style={{ width: '80px', height: '80px', fontSize: '28px', marginBottom: '14px', position: 'relative' }}>
                {user?.profile_picture
                  ? <img src={user.profile_picture} alt={displayName} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials
                }
                <span className="dot" />
              </div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {displayName}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{user?.email}</div>
          </div>

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

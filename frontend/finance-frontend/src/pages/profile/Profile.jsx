import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';

const mockUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '',
};

const Profile = () => {
  const [user] = useState(mockUser);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-text)]">Profile</h1>
      <div className="rounded-lg shadow p-6 bg-[var(--color-card)] flex items-center space-x-6">
        <div className="h-20 w-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-3xl font-bold text-[var(--color-text)]">
          {user.avatar ? <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full" /> : user.name.charAt(0)}
        </div>
        <div>
          <div className="text-lg font-semibold text-[var(--color-text)]">{user.name}</div>
          <div className="text-[var(--color-muted)]">{user.email}</div>
          <Button variant="primary" className="mt-4" onClick={() => setShowModal(true)}>
            Edit Profile
          </Button>
        </div>
      </div>
      {/* Mock Modal for Edit (not implemented) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[var(--color-card)] p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Edit Profile (Mock)</h2>
            <form className="space-y-4">
              <input className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]" placeholder="Name" defaultValue={user.name} />
              <input className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)]" placeholder="Email" defaultValue={user.email} />
              <Button variant="primary" type="button" onClick={() => setShowModal(false)}>Save (Mock)</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 
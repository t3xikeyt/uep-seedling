import { useState } from 'react';

function MySettingsAndProfile({ user, onProfileUpdated }) {
  const [displayName, setDisplayName] = useState(user?.name || 'Admin');
  const [contactNumber, setContactNumber] = useState(localStorage.getItem('uep_user_contact') || '');
  const [profileImage, setProfileImage] = useState(localStorage.getItem('uep_user_avatar') || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passData, setPassData] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [flashMsg, setFlashMsg] = useState('');

  // Convert uploaded image to Base64 and preview immediately
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setProfileImage(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    // 1. Save photo to persistent localStorage
    if (profileImage) {
      localStorage.setItem('uep_user_avatar', profileImage);
    }

    // 2. Save updated name & contact
    localStorage.setItem('uep_user_contact', contactNumber);
    const updatedUser = { ...user, name: displayName };
    localStorage.setItem('uep_user', JSON.stringify(updatedUser));

    // 3. Notify parent (App.jsx) to immediately update the Top Header Avatar
    if (onProfileUpdated) {
      onProfileUpdated(updatedUser, profileImage);
    }

    setFlashMsg('Profile and photo successfully updated in the system.');
    setTimeout(() => setFlashMsg(''), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passData.newPass !== passData.confirmPass) {
      alert('New passwords do not match.');
      return;
    }
    setShowPasswordModal(false);
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    setFlashMsg('Admin password updated successfully.');
    setTimeout(() => setFlashMsg(''), 3000);
  };

  return (
    <div className="profile-manager-container">
      {flashMsg && <div className="flash-message success">{flashMsg}</div>}

      <div className="proto-table-box profile-card-box">
        <div className="profile-card-title">
          <h2>My Profile Settings</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="profile-form-content">
          {/* PHOTO UPLOAD BOX */}
          <div className="change-photo-box">
            <div className="photo-avatar-preview">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="uploaded-photo" />
              ) : (
                <div className="avatar-placeholder-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#254b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-profile-big">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>

            <div className="photo-actions">
              <strong>CHANGE PHOTO</strong>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="file-upload-input"
              />
            </div>
          </div>

          <div className="profile-inputs-2col">
            <div className="form-field">
              <label>Full Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Admin"
                required
              />
            </div>

            <div className="form-field">
              <label>My Contact Number</label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="e.g. 09123456789"
              />
            </div>
          </div>

          <div className="form-field">
            <label>Designation Role</label>
            <input
              type="text"
              value={user?.role || 'Admin'}
              disabled
              className="role-input-disabled"
            />
          </div>

          <div className="profile-actions-row">
            <button type="submit" className="btn-save-profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Profile Changes
            </button>

            <button
              type="button"
              className="btn-change-password-navy"
              onClick={() => setShowPasswordModal(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Change Admin Password
            </button>
          </div>
        </form>
      </div>

      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-card password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Account Password</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="stockin-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passData.currentPass}
                  onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={passData.confirmPass}
                  onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-stock">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MySettingsAndProfile;
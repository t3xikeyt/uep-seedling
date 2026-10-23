import { useEffect, useState } from 'react';

function ManageStaffAccounts({ token, API_URL }) {
  const [staffList, setStaffList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '', status: 'Active' });
  const [flashMsg, setFlashMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Fetch real users from database
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const staffOnly = data.filter((u) => u.role === 'Staff');
        setStaffList(staffOnly);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const openAddModal = () => {
    setEditingStaff(null);
    setFormData({ name: '', username: '', email: '', password: '', status: 'Active' });
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      username: staff.username,
      email: staff.email,
      password: '',
      status: staff.status || 'Active',
    });
    setShowModal(true);
  };

  // SUBMIT HANDLER (REAL UPDATE & REAL CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFlashMsg({ type: '', text: '' });

    try {
      if (editingStaff) {
        // SEND PUT REQUEST TO BACKEND DATABASE
        const res = await fetch(`${API_URL}/users/${editingStaff.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            email: formData.email,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update staff account.');

        setFlashMsg({ type: 'success', text: `Staff account "${formData.username}" updated in database!` });
        fetchUsers(); // Refresh table from database
      } else {
        // CREATE NEW STAFF IN DATABASE
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: 'Staff',
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create staff account.');

        setFlashMsg({ type: 'success', text: `Staff account "${formData.username}" successfully created!` });
        fetchUsers();
      }

      setShowModal(false);
    } catch (error) {
      setFlashMsg({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setFlashMsg({ type: '', text: '' }), 4000);
    }
  };

  return (
    <div className="staff-station-module">
      {flashMsg.text && (
        <div className={`flash-message ${flashMsg.type}`}>
          {flashMsg.text}
        </div>
      )}

      <div className="proto-table-box staff-table-card">
        <div className="staff-card-header">
          <div>
            <h2 className="staff-title">Manage Staff Accounts</h2>
            <p className="staff-subtitle">User access and role management</p>
          </div>

          <button type="button" className="btn-add-staff-green" onClick={openAddModal}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Add Staff
          </button>
        </div>

        <div className="table-overflow">
          <table className="proto-table staff-table">
            <thead>
              <tr>
                <th>STAFF ID</th>
                <th>NAME</th>
                <th>USERNAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length > 0 ? (
                staffList.map((staff, idx) => (
                  <tr key={staff.id || idx}>
                    <td className="staff-id-mono">{`STF-00${staff.id}`}</td>
                    <td className="staff-name-bold">{staff.name}</td>
                    <td><strong>{staff.username}</strong></td>
                    <td className="staff-email-cell">{staff.email}</td>
                    <td>
                      <span className="pill-role-staff">{staff.role}</span>
                    </td>
                    <td>
                      <span className="pill-staff-status active">Active</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-edit-staff-pill"
                        onClick={() => openEditModal(staff)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-pencil-icon">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table-msg">
                    No staff accounts found. Click <strong>"+ Add Staff"</strong> to register one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="staff-footer-count">
          <small>{staffList.length} staff accounts</small>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card staff-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#174828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3>{editingStaff ? 'Edit Staff Account' : 'Add New Staff Account'}</h3>
                  <p>{editingStaff ? 'Update username, name, or email in database' : 'Creates account directly in database'}</p>
                </div>
              </div>

              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="stockin-form" style={{ marginTop: '10px' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  placeholder="e.g. juan_staff"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. juan@uep.edu.ph"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {!editingStaff && (
                <div className="form-group">
                  <label>Initial Login Password</label>
                  <input
                    type="password"
                    placeholder="Enter password (e.g. staff123)"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-modal-confirm">
                  {loading ? 'Saving...' : editingStaff ? 'Update Staff Account' : 'Create Staff Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaffAccounts;
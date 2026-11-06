import { useState } from 'react';

const mockCatalog = [
  { id: 1, species_name: 'Narra', category: 'Hardwood', available_stock: 400, is_low: false },
  { id: 2, species_name: 'Mahogany', category: 'Hardwood', available_stock: 300, is_low: false },
  { id: 3, species_name: 'Mangga', category: 'Fruit-Bearing', available_stock: 150, is_low: false },
  { id: 4, species_name: 'Cacao', category: 'Fruit-Bearing', available_stock: 75, is_low: false },
  { id: 5, species_name: 'Talahangin', category: 'Hardwood', available_stock: 99, is_low: false },
  { id: 6, species_name: 'Yakal', category: 'Hardwood', available_stock: 5, is_low: true },
];

function RequesterPortal({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog', 'form', 'requests', 'profile'
  const [selectedItems, setSelectedItems] = useState([]);
  const [contactNumber, setContactNumber] = useState(
    (user?.id && localStorage.getItem(`uep_user_contact_${user.id}`)) || ''
  );
  const [purpose, setPurpose] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Profile Settings States para kay Requester
  const [requesterName, setRequesterName] = useState(user?.name || '');
  const [requesterPhoto, setRequesterPhoto] = useState(
    (user?.id && localStorage.getItem(`uep_user_avatar_${user.id}`)) || null
  );
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [myRequests, setMyRequests] = useState([
    {
      id: 1,
      req_id: 'REQ-001',
      items: '20x Narra, 10x Mahogany',
      pickup_date: '2026-11-12',
      submitted_date: '2026-11-06',
      status: 'Approved',
    },
    {
      id: 2,
      req_id: 'REQ-002',
      items: '15x Mangga',
      pickup_date: '2026-11-18',
      submitted_date: '2026-11-06',
      status: 'Pending',
    },
  ]);
  const [flashMsg, setFlashMsg] = useState('');

  const handleAddToRequest = (species) => {
    const existing = selectedItems.find((item) => item.id === species.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.id === species.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...species, qty: 1 }]);
    }
    setFlashMsg(`Added ${species.species_name} to request list.`);
    setTimeout(() => setFlashMsg(''), 2500);
  };

  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const handleUpdateQty = (id, newQty) => {
    if (Number(newQty) <= 0) {
      handleRemoveItem(id);
      return;
    }
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, qty: Number(newQty) } : item
      )
    );
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Please add at least one seedling species from the catalog first.');
      setActiveTab('catalog');
      return;
    }

    const itemsSummary = selectedItems.map((i) => `${i.qty}x ${i.species_name}`).join(', ');
    const newReq = {
      id: Date.now(),
      req_id: `REQ-00${myRequests.length + 1}`,
      items: itemsSummary,
      pickup_date: targetDate,
      submitted_date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };

    setMyRequests([newReq, ...myRequests]);
    setSelectedItems([]);
    setPurpose('');
    setTargetDate('');
    setFlashMsg('Your seedling request has been submitted successfully.');
    setActiveTab('requests');
    setTimeout(() => setFlashMsg(''), 3500);
  };

  // Profile Save
  const handleSaveRequesterProfile = (e) => {
    e.preventDefault();
    if (user?.id) {
      localStorage.setItem(`uep_user_contact_${user.id}`, contactNumber);
      if (requesterPhoto) {
        localStorage.setItem(`uep_user_avatar_${user.id}`, requesterPhoto);
      }
    }
    setFlashMsg('Profile updated successfully.');
    setTimeout(() => setFlashMsg(''), 3000);
  };

  // Password Change
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert('New passwords do not match.');
      return;
    }
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setFlashMsg('Password updated successfully.');
    setTimeout(() => setFlashMsg(''), 3000);
  };

  return (
    <div className="requester-portal-shell">
      {/* TOP NAVIGATION BAR */}
      <header className="requester-navbar">
        <div className="req-nav-brand">
          <div className="req-brand-badge">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 50V34M32 34C32 24 44 20 44 20C44 20 44 32 32 34ZM32 38C26 38 20 32 20 26C20 26 30 26 32 38Z" stroke="#254b35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 52C26 50 38 50 42 52" stroke="#254b35" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3>UEP Clonal Facility</h3>
            <small>Seedling Request Portal</small>
          </div>
        </div>

        {/* NAVBAR TABS INCLUDING MY SETTINGS & PROFILE */}
        <nav className="req-nav-links">
          <button
            type="button"
            className={`req-nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Catalog
          </button>
          <button
            type="button"
            className={`req-nav-btn ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Request Form {selectedItems.length > 0 && <span className="req-badge-count">{selectedItems.length}</span>}
          </button>
          <button
            type="button"
            className={`req-nav-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            My Requests <span className="req-badge-count grey">{myRequests.length}</span>
          </button>
          <button
            type="button"
            className={`req-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile & Settings
          </button>
        </nav>

        <div className="req-user-corner">
          <div className="user-pill-tag clickable-pill" onClick={() => setActiveTab('profile')}>
            <div className="avatar-mini-circle">
              {requesterPhoto ? (
                <img src={requesterPhoto} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <span>{user?.name || 'Requester'}</span>
          </div>
          <button type="button" className="btn-req-logout" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </header>

      {/* MAIN BODY AREA */}
      <main className="requester-main-body">
        {flashMsg && <div className="flash-message success">{flashMsg}</div>}

        <div className="requester-header-intro">
          <h1>Public Seedling Request Portal</h1>
          <p>Request high-quality seedlings directly from the University Clonal Station.</p>
        </div>

        {/* 3 STAT KPI CARDS */}
        <section className="stats-grid-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
          <div className="stat-card clickable-card" onClick={() => setActiveTab('catalog')}>
            <div className="stat-icon-wrap icon-green">
              <svg viewBox="0 0 24 24" fill="none" stroke="#25a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <path d="M12 10v10" />
                <path d="M12 10a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3z" />
                <path d="M12 14a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3z" />
              </svg>
            </div>
            <div className="stat-meta">
              <span className="stat-lbl">Available Seedlings</span>
              <strong className="stat-num">1,029</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap icon-orange">
              <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="stat-meta">
              <span className="stat-lbl">Low Stock Species</span>
              <strong className="stat-num">1</strong>
            </div>
          </div>

          <div className="stat-card clickable-card" onClick={() => setActiveTab('requests')}>
            <div className="stat-icon-wrap icon-purple">
              <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="stat-meta">
              <span className="stat-lbl">My Active Requests</span>
              <strong className="stat-num">{myRequests.length}</strong>
            </div>
          </div>
        </section>

        {/* TAB 1: CATALOG */}
        {activeTab === 'catalog' && (
          <section className="proto-table-box" style={{ marginBottom: '28px' }}>
            <div className="catalog-header-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#25a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <path d="M12 10v10" />
                <path d="M12 10a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3z" />
                <path d="M12 14a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3z" />
              </svg>
              <h2>Available Seedlings Catalog</h2>
            </div>

            <div className="table-overflow">
              <table className="proto-table">
                <thead>
                  <tr>
                    <th>SPECIES NAME</th>
                    <th>CATEGORY</th>
                    <th>AVAILABLE STOCK</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCatalog.map((item) => (
                    <tr key={item.id}>
                      <td className="species-name-bold">{item.species_name}</td>
                      <td>{item.category}</td>
                      <td><strong>{item.available_stock}</strong></td>
                      <td>
                        {item.is_low ? (
                          <span className="badge-status badge-low">Low Stock</span>
                        ) : (
                          <span className="badge-status badge-ok">Available</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-add-request-pill"
                          onClick={() => handleAddToRequest(item)}
                        >
                          + Add to Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: REQUEST FORM */}
        {activeTab === 'form' && (
          <div className="request-form-container-grid">
            <div className="proto-table-box request-form-card">
              <div className="card-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#174828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <h3>Seedling Request Form</h3>
              </div>

              <form onSubmit={handleSubmitRequest} className="stockin-form">
                <div className="profile-inputs-2col">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input type="text" value={user?.name || ''} disabled className="role-input-disabled" />
                  </div>
                  <div className="form-field">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 09171234567"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="profile-inputs-2col">
                  <div className="form-field">
                    <label>Organization / Purpose</label>
                    <input
                      type="text"
                      placeholder="e.g. Barangay Tree Planting / Thesis"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Target Pickup Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="selected-items-wrapper">
                  <label>Selected Seedlings List:</label>
                  {selectedItems.length > 0 ? (
                    <div className="selected-items-table">
                      {selectedItems.map((s) => (
                        <div key={s.id} className="selected-row-item">
                          <strong>{s.species_name}</strong>
                          <div className="qty-picker">
                            <input
                              type="number"
                              min="1"
                              max={s.available_stock}
                              value={s.qty}
                              onChange={(e) => handleUpdateQty(s.id, e.target.value)}
                            />
                            <small>pcs</small>
                          </div>
                          <button
                            type="button"
                            className="btn-remove-selected"
                            onClick={() => handleRemoveItem(s.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-selected-box">
                      No seedlings selected. Click <strong>"+ Add to Request"</strong> in the Catalog tab.
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-confirm-stock" style={{ marginTop: '10px' }}>
                  Submit Request
                </button>
              </form>
            </div>

            <div className="guidelines-card-yellow">
              <div className="guidelines-head">
                <svg viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h4>Collection Guidelines & Rules</h4>
              </div>
              <ul>
                <li><strong>Maximum Limit:</strong> Maximum of 100 seedlings per application.</li>
                <li><strong>Claim Period:</strong> Approved requests must be collected within 5 working days.</li>
                <li><strong>Requirements:</strong> Please bring a valid ID and present your downloaded Claim Slip.</li>
                <li><strong>Location:</strong> UEP Clonal Core Facility (8:00 AM - 4:00 PM).</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: MY REQUESTS */}
        {activeTab === 'requests' && (
          <section className="proto-table-box">
            <div className="catalog-header-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="#174828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              <h2>My Submitted Requests History</h2>
            </div>

            <div className="table-overflow">
              <table className="proto-table">
                <thead>
                  <tr>
                    <th>REQ ID</th>
                    <th>ITEMS REQUESTED</th>
                    <th>PICKUP DATE</th>
                    <th>DATE SUBMITTED</th>
                    <th>STATUS</th>
                    <th>ACTION / SLIP</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="bold-cell">{req.req_id}</td>
                      <td>{req.items}</td>
                      <td>{req.pickup_date}</td>
                      <td>{req.submitted_date}</td>
                      <td>
                        <span className={`badge-req-status ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        {req.status === 'Approved' ? (
                          <button
                            type="button"
                            className="btn-print-slip"
                            onClick={() => setSelectedSlip(req)}
                          >
                            Print Claim Slip
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#718096', fontStyle: 'italic' }}>
                            Waiting approval
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 4: REQUESTER PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="profile-inputs-2col" style={{ gap: '24px' }}>
            {/* Account Details */}
            <div className="proto-table-box">
              <div className="card-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#174828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <h3>My Requester Profile</h3>
              </div>

              <form onSubmit={handleSaveRequesterProfile} className="stockin-form">
                <div className="change-photo-box" style={{ padding: '14px' }}>
                  <div className="photo-avatar-preview" style={{ width: '60px', height: '60px' }}>
                    {requesterPhoto ? (
                      <img src={requesterPhoto} alt="Profile" className="uploaded-photo" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#254b35" strokeWidth="2" style={{ width: '32px', height: '32px' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  <div className="photo-actions">
                    <strong style={{ fontSize: '0.85rem' }}>PROFILE PHOTO</strong>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setRequesterPhoto(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="file-upload-input"
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input type="email" value={user?.email || ''} disabled className="role-input-disabled" />
                </div>

                <div className="form-field">
                  <label>Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 09171234567"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-confirm-stock">
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Password Change */}
            <div className="proto-table-box">
              <div className="card-header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#174828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <h3>Security & Password</h3>
              </div>

              <form onSubmit={handleChangePassword} className="stockin-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-confirm-stock" style={{ background: '#1e293b' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* CLAIM SLIP MODAL */}
      {selectedSlip && (
        <div className="modal-backdrop" onClick={() => setSelectedSlip(null)}>
          <div className="modal-card print-slip-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Official Seedling Claim Slip</h3>
              <button type="button" className="btn-close-modal" onClick={() => setSelectedSlip(null)}>✕</button>
            </div>

            <div className="printable-slip-body">
              <div className="slip-brand">
                <strong>UNIVERSITY OF EASTERN PHILIPPINES</strong>
                <small>UEP CLONAL CORE FACILITY</small>
              </div>

              <div className="slip-meta-details">
                <p><strong>Claim Stub #:</strong> {selectedSlip.req_id}</p>
                <p><strong>Recipient Name:</strong> {user?.name || requesterName}</p>
                <p><strong>Approved Items:</strong> {selectedSlip.items}</p>
                <p><strong>Scheduled Pickup:</strong> {selectedSlip.pickup_date}</p>
                <p><strong>Status:</strong> APPROVED FOR RELEASE</p>
              </div>

              <div className="slip-note">
                <small>Present this slip or digital screenshot to the nursery officer upon collecting seedlings.</small>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={() => setSelectedSlip(null)}>Close</button>
              <button type="button" className="btn-modal-confirm" onClick={() => window.print()}>Print Slip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequesterPortal;
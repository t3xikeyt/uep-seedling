import { useState } from 'react';

function Sidebar({ activeTab, setActiveTab, onLogout, isOpen, setIsOpen, user }) {
  const [showSupportModal, setShowSupportModal] = useState(false);

  if (!isOpen && !showSupportModal) return null;

  const baseMenuItems = [
    {
      id: 'dashboard',
      label: 'Live Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      id: 'stockin',
      label: 'Stock-In',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" /><polyline points="7 10 12 15 17 10" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      ),
    },
    {
      id: 'stockout',
      label: 'Stock-Out',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V3" /><polyline points="7 8 12 3 17 8" /><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
      ),
    },
    {
      id: 'request',
      label: 'Seedling Request',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Transaction History',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 14 14" />
        </svg>
      ),
    },
    {
      id: 'qrtag',
      label: 'QR Tagging Station',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><circle cx="17.5" cy="17.5" r="1" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'My Settings & Profile',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0 2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const adminOnlyItem = {
    id: 'staff',
    label: 'Manage Staff Accounts',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  };

  const menuItems = user?.role === 'Admin' ? [...baseMenuItems, adminOnlyItem] : baseMenuItems;

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={() => setIsOpen(false)} />}

      {isOpen && (
        <aside className="custom-proto-sidebar">
          <button
            type="button"
            className="btn-close-sidebar"
            onClick={() => setIsOpen(false)}
            title="Close Sidebar"
          >
            ✕
          </button>

          <div className="sidebar-top-box">
            <div className="sidebar-brand-container">
              <div className="sidebar-circle-badge">
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 50V34M32 34C32 24 44 20 44 20C44 20 44 32 32 34ZM32 38C26 38 20 32 20 26C20 26 30 26 32 38Z" stroke="#254b35" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 52C26 50 38 50 42 52" stroke="#254b35" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="sidebar-brand-names">
                <h2>UEP Clonal</h2>
                <small>Seedling Management</small>
              </div>
            </div>

            <nav className="sidebar-nav-list">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`sidebar-nav-btn ${isActive ? 'active-tab' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <span className="nav-btn-icon">{item.icon}</span>
                    <span className="nav-btn-text">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="sidebar-bottom-box">
            <button
              type="button"
              className="sidebar-support-clean-btn"
              onClick={() => {
                setIsOpen(false);
                setShowSupportModal(true);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-support-icon">
                <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Support
            </button>

            <button type="button" className="btn-logout-pill" onClick={onLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-logout-icon">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log Out
            </button>
          </div>
        </aside>
      )}

      {/* CAPSTONE SUPPORT & USER GUIDE HELPDESK */}
      {showSupportModal && (
        <div className="modal-backdrop" onClick={() => setShowSupportModal(false)}>
          <div className="modal-card support-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1b632e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div>
                  <h3>System Guide & Helpdesk</h3>
                  <p>UEP Clonal Seedling Management Information System</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setShowSupportModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-grid support-body-content">
              {/* STEP-BY-STEP SIMPLE USER INSTRUCTIONS */}
              <div className="support-section">
                <h4>How to Use the System (Quick Guide)</h4>
                <div className="guide-steps-list">
                  <div className="guide-step-item">
                    <span className="step-num-badge">1</span>
                    <div>
                      <strong>Add Seedlings (Stock-In)</strong>
                      <p>Open the menu and click <em>Stock-In</em>. Enter the tree species, category, origin, and quantity to add stock.</p>
                    </div>
                  </div>

                  <div className="guide-step-item">
                    <span className="step-num-badge">2</span>
                    <div>
                      <strong>Print QR Tags (Tagging Station)</strong>
                      <p>Go to <em>QR Tagging Station</em>. Select any batch and click <em>Print Tag</em> to place QR labels on plant pots.</p>
                    </div>
                  </div>

                  <div className="guide-step-item">
                    <span className="step-num-badge">3</span>
                    <div>
                      <strong>Handle Requests (Seedling Request)</strong>
                      <p>Review submitted seedling requests. Click <em>Approve</em> if seedlings are ready, or <em>Reject</em> if unavailable.</p>
                    </div>
                  </div>

                  <div className="guide-step-item">
                    <span className="step-num-badge">4</span>
                    <div>
                      <strong>Hand Over Plants (Stock-Out)</strong>
                      <p>When the recipient picks up their order, click <em>Release</em> to deduct the seedlings from inventory.</p>
                    </div>
                  </div>

                  <div className="guide-step-item">
                    <span className="step-num-badge">5</span>
                    <div>
                      <strong>Check Logs & Print (Live Dashboard & History)</strong>
                      <p>Monitor real-time seedling stock, track all movements in <em>Transaction History</em>, and click <em>Print Report</em> for paper documents.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECT INFO */}
              <div className="support-section support-credits-box">
                <h4>Project Information</h4>
                <p><strong>Capstone Title:</strong> Web-Based Seedling Management System</p>
                <p><strong>Institution:</strong> University of Eastern Philippines (UEP)</p>
                <p><strong>Department:</strong> College of Science / Information Technology</p>
                <p><strong>Facility:</strong> UEP Clonal Core Facility, Catarman, Northern Samar</p>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={() => setShowSupportModal(false)}
              >
                Got it, Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
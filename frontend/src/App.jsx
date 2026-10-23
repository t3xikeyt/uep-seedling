import { useEffect, useState } from 'react';
import './styles.css';

// Admin Modules
import Sidebar from './pages/Admin/Sidebar';
import LiveDashboard from './pages/Admin/LiveDashboard';
import StockIn from './pages/Admin/StockIn';
import StockOut from './pages/Admin/StockOut';
import SeedlingRequest from './pages/Admin/SeedlingRequest';
import TransactionHistory from './pages/Admin/TransactionHistory';
import QRTaggingStation from './pages/Admin/QRTaggingStation';
import MySettingsAndProfile from './pages/Admin/MySettingsAndProfile';
import ManageStaffAccounts from './pages/Admin/ManageStaffAccounts';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [authMode, setAuthMode] = useState('login');
  const [showAuth, setShowAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [token, setToken] = useState(localStorage.getItem('uep_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('uep_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('uep_user_avatar') || null);

  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const logout = () => {
    localStorage.removeItem('uep_token');
    localStorage.removeItem('uep_user');
    setToken('');
    setUser(null);
    setBatches([]);
    setShowAuth(false);
    setIsSidebarOpen(false);
  };

  const fetchBatches = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unable to fetch batches.');
      const data = await res.json();
      setBatches(data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    if (token) fetchBatches();
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(event.currentTarget);
    const usernameOrEmail = formData.get('usernameOrEmail');
    const password = formData.get('password');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed. Check credentials.');

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage({ type: 'success', text: 'Login successful.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage({ type: '', text: '' });

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const generatedUsername = email.split('@')[0];

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username: generatedUsername,
          email,
          password,
          role: 'Requester',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage({ type: 'success', text: 'Account created successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const renderEyeIcon = () => (
    <svg className="svg-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {showPassword ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );

  // Welcome Screen
  if (!user || !token) {
    if (!showAuth) {
      return (
        <div className="fullscreen-wrap">
          <div className="bg-photo" />
          <div className="welcome-card">
            <div className="welcome-card-content">
              <div className="welcome-panel-left">
                <div className="logo-circle-container">
                  <div className="inner-green-badge">
                    <svg viewBox="0 0 64 64" fill="none" className="seedling-svg" xmlns="http://www.w3.org/2000/svg">
                      <path d="M32 50V34M32 34C32 24 44 20 44 20C44 20 44 32 32 34ZM32 38C26 38 20 32 20 26C20 26 30 26 32 38Z" stroke="#2b5e40" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 52C26 50 38 50 42 52" stroke="#2b5e40" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="circle-main-title">UEP CLONAL</h3>
                  <span className="circle-sub-title">SEEDLING MANAGEMENT</span>
                </div>
              </div>
              <div className="welcome-panel-right">
                <h1 className="welcome-heading">Welcome!</h1>
                <p className="welcome-to-text">to the official</p>
                <h2 className="welcome-system-title">UEP CLONAL MANAGEMENT SYSTEM</h2>
                <p className="welcome-tagline">streamlining plant tracking for sustainable growth.</p>
                <button type="button" className="btn-get-started-pill" onClick={() => setShowAuth(true)}>
                  Get Started!
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Auth Screen
    return (
      <div className="fullscreen-wrap">
        <div className="bg-photo" />
        <button type="button" className="btn-back-home" onClick={() => setShowAuth(false)}>✕</button>
        <div className="auth-split-grid">
          <div className="auth-left-section">
            <div className="auth-brand-row">
              <div className="auth-brand-circle">
                <svg viewBox="0 0 64 64" fill="none" className="seedling-svg-small" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 50V34M32 34C32 24 44 20 44 20C44 20 44 32 32 34ZM32 38C26 38 20 32 20 26C20 26 30 26 32 38Z" stroke="#204b33" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 52C26 50 38 50 42 52" stroke="#204b33" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="auth-brand-text">
                <h3>UEP CLONAL</h3>
                <span>SEEDLING MANAGEMENT</span>
              </div>
            </div>

            <h1 className="auth-title">{authMode === 'register' ? 'Register' : 'Login'}</h1>

            {message.text && (
              <div style={{
                background: '#ffebee',
                color: '#c62828',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                marginBottom: '14px',
                textAlign: 'center',
                width: '100%',
                maxWidth: '360px'
              }}>
                {message.text}
              </div>
            )}

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="form-clean" autoComplete="off">
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" name="name" placeholder="Full Name" required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input type="email" name="email" placeholder="Email Address" required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {renderEyeIcon()}
                  </button>
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Re-enter password" required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {renderEyeIcon()}
                  </button>
                </div>
                <button type="submit" disabled={loading} className="btn-main-green">{loading ? 'Creating...' : 'Create Account'}</button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="form-clean">
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" name="usernameOrEmail" placeholder="Username or Email Address" required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {renderEyeIcon()}
                  </button>
                </div>
                <button type="submit" disabled={loading} className="btn-main-green">{loading ? 'Signing In...' : 'Sign In'}</button>
              </form>
            )}
          </div>

          <div className="auth-right-section">
            <div className="auth-right-content">
              <h2>{authMode === 'register' ? 'Already have an account?' : "Don't have an account?"}</h2>
              <button type="button" className="btn-pill-light" onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}>
                {authMode === 'register' ? 'Login here!' : 'Register here!'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Live Dashboard Status';
      case 'stockin': return 'Profiling (Stock-in)';
      case 'stockout': return 'Seedling Distribution Control';
      case 'request': return 'Seedling Request Control';
      case 'history': return 'Transaction History';
      case 'qrtag': return 'QR Tagging Station';
      case 'settings': return 'Profile Settings Manager';
      case 'staff': return 'Manage Staff Accounts';
      default: return 'Admin Workspace';
    }
  };

  return (
    <div className="admin-layout" onClick={() => {
      setShowNotifDropdown(false);
      setShowProfileDropdown(false);
    }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="admin-main">
        {/* Header with Notifications & Profile */}
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              type="button"
              className="btn-open-sidebar"
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(true);
              }}
              title="Open Menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="header-title">{getHeaderTitle()}</h1>
          </div>

          <div className="header-user-info">
            {/* Notification Bell */}
            <div className="header-action-container" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="btn-header-bell"
                onClick={() => {
                  setShowNotifDropdown(!showNotifDropdown);
                  setShowProfileDropdown(false);
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-bell-top">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="notif-badge-pill">2</span>
              </button>

              {showNotifDropdown && (
                <div className="header-dropdown-menu notif-dropdown">
                  <div className="dropdown-head">
                    <strong>Notifications</strong>
                    <small>2 Pending</small>
                  </div>
                  <div className="dropdown-body">
                    <div
                      className="notif-item"
                      onClick={() => {
                        setActiveTab('dashboard');
                        setShowNotifDropdown(false);
                      }}
                    >
                      <span className="notif-dot orange" />
                      <div>
                        <strong>Low Stock Warning</strong>
                        <p>Mangga has only 1 remaining stock left.</p>
                      </div>
                    </div>
                    <div
                      className="notif-item"
                      onClick={() => {
                        setActiveTab('request');
                        setShowNotifDropdown(false);
                      }}
                    >
                      <span className="notif-dot purple" />
                      <div>
                        <strong>New Seedling Request</strong>
                        <p>Patrick Santos submitted a request for 20 Narra.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar with Dynamic Photo */}
            <div className="header-action-container" onClick={(e) => e.stopPropagation()}>
              <div
                className="avatar-wrap"
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifDropdown(false);
                }}
              >
                <div className="avatar-neutral">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  )}
                </div>
                <span className="role-tag">{user.role || 'Admin'}</span>
              </div>

              {showProfileDropdown && (
                <div className="header-dropdown-menu profile-dropdown">
                  <div className="dropdown-head profile-head">
                    <div className="avatar-neutral">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt="Profile"
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <strong>{user.name || 'Admin'}</strong>
                      <small>{user.email || 'admin@uep.edu.ph'}</small>
                    </div>
                  </div>
                  <div className="dropdown-body">
                    <button
                      type="button"
                      className="dropdown-btn"
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileDropdown(false);
                      }}
                    >
                      My Profile & Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <LiveDashboard
            batches={batches}
            onNavigateToStockIn={() => setActiveTab('stockin')}
            onNavigateToRequests={() => setActiveTab('request')}
          />
        )}

        {activeTab === 'stockin' && (
          <StockIn
            token={token}
            API_URL={API_URL}
            onBatchAdded={() => {
              fetchBatches();
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'stockout' && <StockOut />}

        {activeTab === 'request' && <SeedlingRequest />}

        {activeTab === 'history' && <TransactionHistory />}

        {activeTab === 'qrtag' && <QRTaggingStation batches={batches} />}

        {activeTab === 'settings' && (
          <MySettingsAndProfile
            user={user}
            onProfileUpdated={(updatedUser, newPhoto) => {
              setUser(updatedUser);
              if (newPhoto) setUserAvatar(newPhoto);
            }}
          />
        )}

        {activeTab === 'staff' && (
          <ManageStaffAccounts user={user} token={token} API_URL={API_URL} />
        )}
      </main>

      {message.text ? <div className={`flash-message ${message.type}`}>{message.text}</div> : null}
    </div>
  );
}

export default App;
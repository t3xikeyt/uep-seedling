import { useEffect, useState } from 'react';
import './styles.css';
import LiveDashboard from './pages/admin/LiveDashboard';
import StockIn from './pages/admin/StockIn';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  const [showAuth, setShowAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [token, setToken] = useState(localStorage.getItem('uep_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('uep_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [batches, setBatches] = useState([]);
  const [loginData, setLoginData] = useState({ usernameOrEmail: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
    setLoginData({ usernameOrEmail: '', password: '' });
    setShowAuth(false);
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
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          username: registerData.email.split('@')[0],
          email: registerData.email,
          password: registerData.password,
          role: 'Requester',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
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
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
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

            {authMode === 'register' ? (
              <form onSubmit={handleRegister} className="form-clean" autoComplete="off">
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" placeholder="Full Name" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input type="email" placeholder="Email Address" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {renderEyeIcon()}
                  </button>
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Re-enter password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {renderEyeIcon()}
                  </button>
                </div>
                <button type="submit" disabled={loading} className="btn-main-green">{loading ? 'Creating...' : 'Create Account'}</button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="form-clean" autoComplete="off">
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" placeholder="Username or Email Address" value={loginData.usernameOrEmail} onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })} required />
                </div>
                <div className="input-pill">
                  <svg className="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo-group">
            <div className="sidebar-logo-circle">
              <svg viewBox="0 0 64 64" fill="none" className="seedling-svg-small" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 50V34M32 34C32 24 44 20 44 20C44 20 44 32 32 34ZM32 38C26 38 20 32 20 26C20 26 30 26 32 38Z" stroke="#1d4530" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 52C26 50 38 50 42 52" stroke="#1d4530" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="sidebar-logo-text">
              <h3>UEP Clonal</h3>
              <span>Seedling Management</span>
            </div>
          </div>

          <nav className="sidebar-menu">
            <button type="button" className={`menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <span className="menu-icon">🔲</span> Live Dashboard
            </button>
            <button type="button" className={`menu-btn ${activeTab === 'stockin' ? 'active' : ''}`} onClick={() => setActiveTab('stockin')}>
              <span className="menu-icon">📦</span> Stock-In
            </button>
            <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">📤</span> Stock-Out</button>
            <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">📝</span> Seedling Request</button>
            <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">🔄</span> Transaction History</button>
            <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">📱</span> QR Tagging Station</button>
            <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">⚙️</span> My Settings & Profile</button>
            {user.role === 'Admin' && (
              <button type="button" className="menu-btn disabled-btn"><span className="menu-icon">👥</span> Manage Staff Accounts</button>
            )}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <a href="#support" className="support-link">❓ Support</a>
          <button type="button" className="btn-logout-red" onClick={logout}>➜] Log Out</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1 className="header-title">
            {activeTab === 'dashboard' ? 'Live Dashboard Status' : 'Stock-In Management'}
          </h1>
          <div className="header-user-info">
            <span className="bell-icon">🔔</span>
            <div className="avatar-wrap">
              <div className="avatar-neutral">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="role-tag">{user.role || 'Admin'}</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <LiveDashboard
            batches={batches}
            onNavigateToStockIn={() => setActiveTab('stockin')}
          />
        ) : (
          <StockIn
            token={token}
            API_URL={API_URL}
            onBatchAdded={() => {
              fetchBatches();
              setActiveTab('dashboard');
            }}
            onCancel={() => setActiveTab('dashboard')}
          />
        )}
      </main>

      {message.text ? <div className={`flash-message ${message.type}`}>{message.text}</div> : null}
    </div>
  );
}

export default App;
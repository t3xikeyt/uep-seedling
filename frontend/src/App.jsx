import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const initialBatchForm = {
  species_name: '',
  category: 'Hardwood',
  origin: 'UEP Clonal Core',
  quantity: '',
  date_logged: new Date().toISOString().slice(0, 10),
};

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('uep_token') || '');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('uep_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [batches, setBatches] = useState([]);
  const [loginData, setLoginData] = useState({ usernameOrEmail: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'Requester',
  });
  const [batchForm, setBatchForm] = useState(initialBatchForm);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem('uep_token');
    localStorage.removeItem('uep_user');
    setToken('');
    setUser(null);
    setBatches([]);
  };

  const fetchBatches = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/batches`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Unable to fetch batches.');
      }

      const data = await res.json();
      setBatches(data);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  useEffect(() => {
    if (token) {
      fetchBatches();
    }
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage({ type: 'success', text: 'Login successful.' });
      setLoginData({ usernameOrEmail: '', password: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      localStorage.setItem('uep_token', data.token);
      localStorage.setItem('uep_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setRegisterData({ name: '', username: '', email: '', password: '', role: 'Requester' });
      setMessage({ type: 'success', text: 'Account created successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch(`${API_URL}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...batchForm,
          quantity: Number(batchForm.quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Unable to save batch.');
      }

      setBatchForm(initialBatchForm);
      setMessage({ type: 'success', text: data.message || 'Batch updated successfully.' });
      fetchBatches();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const renderAuthScreen = () => (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-panel auth-panel-left">
          <div className="brand-row">
            <div className="brand-badge">UEP</div>
            <div>
              <h3>UEP Clonal</h3>
              <small>Inventory Management</small>
            </div>
          </div>

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <h2>Login Account</h2>
              <label>
                Username or Email
                <input
                  type="text"
                  value={loginData.usernameOrEmail}
                  onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
                  placeholder="admin or admin@uep.edu.ph"
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <h2>Create Account</h2>
              <label>
                Full Name
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Username
                <input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <div className="auth-panel auth-panel-right">
          <h2>{authMode === 'login' ? 'Need an account?' : 'Already registered?'}</h2>
          <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
            {authMode === 'login' ? 'Register here' : 'Login here'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!user || !token ? (
        renderAuthScreen()
      ) : (
        <div className="dashboard-shell">
          <aside className="sidebar">
            <div>
              <div className="brand-row sidebar-brand">
                <div className="brand-badge">UEP</div>
                <div>
                  <h3>UEP Clonal</h3>
                  <small>Seedling System</small>
                </div>
              </div>
              <nav className="nav-links">
                <span className="nav-item active">Stock In</span>
                <span className="nav-item">Inventory</span>
                <span className="nav-item">Reports</span>
              </nav>
            </div>
            <button type="button" className="logout-btn" onClick={logout}>Logout</button>
          </aside>

          <main className="main-panel">
            <header className="topbar">
              <h1>Seedling Profiling</h1>
              <div className="user-chip">
                <span>{user.name}</span>
                <strong>{user.role}</strong>
              </div>
            </header>

            <section className="content-grid">
              <form className="stock-form" onSubmit={handleBatchSubmit}>
                <h3>Record stock-in</h3>

                <label>
                  Species Name
                  <input
                    type="text"
                    value={batchForm.species_name}
                    onChange={(e) => setBatchForm({ ...batchForm, species_name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Category
                  <select
                    value={batchForm.category}
                    onChange={(e) => setBatchForm({ ...batchForm, category: e.target.value })}
                  >
                    <option>Hardwood</option>
                    <option>Fruit-bearing</option>
                    <option>Ornamental</option>
                    <option>Forest Species</option>
                  </select>
                </label>

                <label>
                  Origin
                  <input
                    type="text"
                    value={batchForm.origin}
                    onChange={(e) => setBatchForm({ ...batchForm, origin: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Quantity
                  <input
                    type="number"
                    min="1"
                    value={batchForm.quantity}
                    onChange={(e) => setBatchForm({ ...batchForm, quantity: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Date Logged
                  <input
                    type="date"
                    value={batchForm.date_logged}
                    onChange={(e) => setBatchForm({ ...batchForm, date_logged: e.target.value })}
                    required
                  />
                </label>

                <button type="submit">Save Batch</button>
              </form>

              <div className="table-card">
                <h3>Current Inventory</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Batch #</th>
                      <th>Species</th>
                      <th>Category</th>
                      <th>Origin</th>
                      <th>Current Stock</th>
                      <th>Logged</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.length ? (
                      batches.map((batch) => (
                        <tr key={batch.id}>
                          <td>#{batch.batch_id}</td>
                          <td>{batch.species_name}</td>
                          <td>{batch.category}</td>
                          <td>{batch.origin}</td>
                          <td>{batch.current_stock}</td>
                          <td>{batch.date_logged}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-state">No batches available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        </div>
      )}

      {message.text ? <div className={`flash-message ${message.type}`}>{message.text}</div> : null}
    </>
  );
}

export default App;

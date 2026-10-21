import { useState } from 'react';

function LiveDashboard({ batches = [], onNavigateToStockIn }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Compute stat card numbers
  const totalSeedlings = batches.reduce((sum, b) => sum + Number(b.current_stock || 0), 0);
  const activeBatchesCount = batches.length;
  const lowStockCount = batches.filter((b) => Number(b.current_stock) > 0 && Number(b.current_stock) <= 10).length;
  const pendingRequestsCount = 2; // Default prototype value

  // Filter batches by category and search term
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.species_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batch_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || b.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="live-dashboard-module">
      {/* 4 STAT CARDS */}
      <section className="stats-grid-row">
        <div className="stat-card">
          <div className="stat-icon-wrap icon-green">🍃</div>
          <div className="stat-meta">
            <span className="stat-lbl">Total Seedlings</span>
            <strong className="stat-num">{totalSeedlings.toLocaleString()}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-blue">📊</div>
          <div className="stat-meta">
            <span className="stat-lbl">Active Batches</span>
            <strong className="stat-num">{activeBatchesCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-orange">⚠️</div>
          <div className="stat-meta">
            <span className="stat-lbl">Low Stock Alerts</span>
            <strong className="stat-num">{lowStockCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-purple">📋</div>
          <div className="stat-meta">
            <span className="stat-lbl">Pending Request</span>
            <strong className="stat-num">{pendingRequestsCount}</strong>
          </div>
        </div>
      </section>

      {/* TABLE CONTAINER */}
      <section className="proto-table-box">
        {/* Table Toolbar */}
        <div className="table-toolbar">
          <div className="toolbar-left">
            <select
              className="select-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">Filter By Category: All</option>
              <option value="Hardwood">Hardwood</option>
              <option value="Fruit-Bearing">Fruit-Bearing</option>
              <option value="Ornamental">Ornamental</option>
              <option value="Forest Species">Forest Species</option>
            </select>

            <div className="search-pill">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-print-report"
            onClick={() => window.print()}
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Master Table */}
        <div className="table-overflow">
          <table className="proto-table">
            <thead>
              <tr>
                <th>BATCH ID</th>
                <th>SPECIES NAME</th>
                <th>CATEGORY</th>
                <th>SOURCE / ORIGIN</th>
                <th>INITIAL STOCK</th>
                <th>CURRENT STOCK</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredBatches.length > 0 ? (
                filteredBatches.map((b) => {
                  const initial = Number(b.initial_stock) || 100;
                  const current = Number(b.current_stock) || 0;
                  const pct = Math.min(100, Math.round((current / initial) * 100));
                  const isLow = current <= 10;

                  return (
                    <tr key={b.id || b.batch_id}>
                      <td className="bold-cell">{b.batch_id}</td>
                      <td className="species-cell">{b.species_name}</td>
                      <td>{b.category}</td>
                      <td>{b.origin}</td>
                      <td>{initial}</td>
                      <td>
                        <div className="stock-progress-wrap">
                          <span className="stock-qty-val">{current}</span>
                          <div className="progress-bg">
                            <div
                              className={`progress-fill ${isLow ? 'low' : ''}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="stock-pct-val">{pct}%</span>
                        </div>
                      </td>
                      <td>
                        {isLow ? (
                          <span className="badge-status badge-low">⚠️ Low Stock</span>
                        ) : (
                          <span className="badge-status badge-ok">✓ Available</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-purple-tag"
                          onClick={() => alert(`Generating QR Tag for ${b.batch_id} - ${b.species_name}`)}
                        >
                          🏷️ Get Tag
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-msg">
                    No seedling batches found.{' '}
                    {onNavigateToStockIn && (
                      <button
                        type="button"
                        className="link-inline-btn"
                        onClick={onNavigateToStockIn}
                      >
                        Click here to Stock-In.
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default LiveDashboard;
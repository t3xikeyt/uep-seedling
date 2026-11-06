import { useState } from 'react';

function LiveDashboard({ batches = [], onNavigateToStockIn, onNavigateToRequests }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const totalSeedlings = batches.reduce((sum, b) => sum + Number(b.current_stock || 0), 0);
  const activeBatchesCount = batches.length;
  const lowStockCount = batches.filter((b) => Number(b.current_stock) > 0 && Number(b.current_stock) <= 10).length;
  const pendingRequestsCount = 2;

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.species_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batch_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || b.category === filterCategory;
    const matchesLowStock = onlyLowStock ? Number(b.current_stock) <= 10 : true;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  return (
    <div className="live-dashboard-module">
      {/* 4 STAT CARDS */}
      <section className="stats-grid-row">
        <div
          className="stat-card clickable-card"
          onClick={() => {
            setOnlyLowStock(false);
            setFilterCategory('All');
          }}
          title="Click to view all seedlings"
        >
          <div className="stat-icon-wrap icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="#25a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M12 10v10" />
              <path d="M12 10a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3z" />
              <path d="M12 14a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3z" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Total Seedlings</span>
            <strong className="stat-num">{totalSeedlings.toLocaleString()}</strong>
          </div>
        </div>

        <div
          className="stat-card clickable-card"
          onClick={onNavigateToStockIn}
          title="Click to stock-in a new batch"
        >
          <div className="stat-icon-wrap icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Active Batches</span>
            <strong className="stat-num">{activeBatchesCount}</strong>
          </div>
        </div>

        <div
          className={`stat-card clickable-card ${onlyLowStock ? 'card-filter-active' : ''}`}
          onClick={() => setOnlyLowStock(!onlyLowStock)}
          title="Click to filter low stock items"
        >
          <div className="stat-icon-wrap icon-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Low Stock Alerts</span>
            <strong className="stat-num">{lowStockCount}</strong>
          </div>
        </div>

        <div
          className="stat-card clickable-card"
          onClick={onNavigateToRequests}
          title="Click to manage pending requests"
        >
          <div className="stat-icon-wrap icon-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Pending Request</span>
            <strong className="stat-num">{pendingRequestsCount}</strong>
          </div>
        </div>
      </section>

      {/* FORMAL COMPANY / UNIVERSITY PRINT HEADER */}
      <div className="printable-report-header">
        <div className="print-letterhead">
          <div className="print-univ-title">UNIVERSITY OF EASTERN PHILIPPINES</div>
          <div className="print-univ-sub">College of Agriculture, Forestry and Environmental Studies</div>
          <div className="print-univ-office">UEP CLONAL FACILITY</div>
          <div className="print-location">University Town, Northern Samar, Philippines</div>
        </div>

        <div className="print-header-divider" />

        <h2 className="print-doc-title">OFFICIAL SEEDLING MANAGEMENT REPORT</h2>

        <div className="print-meta-grid">
          <div><strong>Report Reference:</strong> UEP-SMR-{Date.now().toString().slice(-6)}</div>
          <div><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          <div><strong>Total Batches:</strong> {filteredBatches.length}</div>
          <div><strong>Total Current Stock:</strong> {totalSeedlings.toLocaleString()} Seedlings</div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <section className="proto-table-box print-card-flat">
        <div className="table-toolbar">
          <div className="toolbar-left">
            <select
              className="select-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">Filter By Category: All</option>
              <option value="Hardwood">Hardwood</option>
              <option value="Fruit-bearing">Fruit-bearing</option>
              <option value="Ornamental">Ornamental</option>
              <option value="Forest Species">Forest Species</option>
            </select>

            <div className="search-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-search">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search batches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {onlyLowStock && (
              <button
                type="button"
                className="btn-clear-filter"
                onClick={() => setOnlyLowStock(false)}
              >
                Clear Low Stock Filter ✕
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn-print-report"
            onClick={() => window.print()}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-btn-icon">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print Report
          </button>
        </div>

        <div className="table-overflow">
          <table className="proto-table print-table-bordered">
            <thead>
              <tr>
                <th>BATCH ID</th>
                <th>SPECIES NAME</th>
                <th>CATEGORY</th>
                <th>SOURCE / ORIGIN</th>
                <th>INITIAL STOCK</th>
                <th>CURRENT STOCK</th>
                <th>STATUS</th>
                <th className="hide-on-print">ACTION</th>
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
                        <span className="print-only-stock">{current}</span>
                        <div className="stock-progress-wrap hide-on-print">
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
                          <span className="badge-status badge-low">Low Stock</span>
                        ) : (
                          <span className="badge-status badge-ok">Available</span>
                        )}
                      </td>
                      <td className="hide-on-print">
                        <button
                          type="button"
                          className="btn-purple-tag"
                          onClick={() => alert(`QR Tag for Batch ${b.batch_id}`)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-mini-icon">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                          </svg>
                          Get Tag
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-msg">
                    No batches match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* OFFICIAL SIGNATURES */}
        <div className="printable-signatures-row">
          <div className="sign-col">
            <span className="sign-title">Prepared by:</span>
            <div className="formal-sign-line" />
            <strong className="sign-name">Clonal Staff / Personnel</strong>
            <small className="sign-role">Seedling Records Officer</small>
          </div>

          <div className="sign-col">
            <span className="sign-title">Approved by:</span>
            <div className="formal-sign-line" />
            <strong className="sign-name">Clonal Project Manager</strong>
            <small className="sign-role">Operations Administrator</small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LiveDashboard;
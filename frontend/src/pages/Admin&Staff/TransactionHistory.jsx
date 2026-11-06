import { useState } from 'react';

const mockTransactions = [
  {
    id: 1,
    date: 'Oct 24, 2026',
    time: '10:30 AM',
    type: 'STOCK-OUT',
    species: 'Narra',
    batch: 'Batch #001',
    qty: 50,
    party: 'Patrick Santos (Tree Planting Project)',
    officer: 'Maria Santos',
  },
  {
    id: 2,
    date: 'Oct 22, 2026',
    time: '02:15 PM',
    type: 'STOCK-OUT',
    species: 'Mahogany',
    batch: 'Batch #002',
    qty: 100,
    party: 'Barangay Greening Program',
    officer: 'Maria Santos',
  },
  {
    id: 3,
    date: 'Oct 18, 2026',
    time: '09:00 AM',
    type: 'STOCK-IN',
    species: 'Yakal',
    batch: 'Batch #006',
    qty: 300,
    party: 'New Nursery Collection / Harvest',
    officer: 'Pedro Reyes',
  },
  {
    id: 4,
    date: 'Oct 15, 2026',
    time: '11:45 AM',
    type: 'STOCK-OUT',
    species: 'Mangga',
    batch: 'Batch #003',
    qty: 350,
    party: 'Local Farmers Livelihood Program',
    officer: 'Pedro Reyes',
  },
  {
    id: 5,
    date: 'Oct 10, 2026',
    time: '08:30 AM',
    type: 'STOCK-IN',
    species: 'Talahangin',
    batch: 'Batch #005',
    qty: 89,
    party: 'Stock Replenishment',
    officer: 'Maria Santos',
  },
  {
    id: 6,
    date: 'Oct 05, 2026',
    time: '03:20 PM',
    type: 'STOCK-OUT',
    species: 'Cacao',
    batch: 'Batch #004',
    qty: 25,
    party: 'Student Research Thesis Project',
    officer: 'Clonal Manager',
  },
];

function TransactionHistory() {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Computations for KPI Header
  const totalStockIn = mockTransactions
    .filter((t) => t.type === 'STOCK-IN')
    .reduce((sum, t) => sum + t.qty, 0);

  const totalStockOut = mockTransactions
    .filter((t) => t.type === 'STOCK-OUT')
    .reduce((sum, t) => sum + t.qty, 0);

  // Filtered list
  const filteredData = mockTransactions.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      item.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.officer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transaction-history-module">
      {/* 2 SUMMARY BADGES */}
      <section className="stats-grid-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-icon-wrap icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="#25a84b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M12 3v12" />
              <polyline points="7 10 12 15 17 10" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Total Stock-In (Replenished)</span>
            <strong className="stat-num" style={{ color: '#15803d' }}>+{totalStockIn.toLocaleString()} Seedlings</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap icon-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <path d="M12 15V3" />
              <polyline points="7 8 12 3 17 8" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
          </div>
          <div className="stat-meta">
            <span className="stat-lbl">Total Stock-Out (Distributed)</span>
            <strong className="stat-num" style={{ color: '#dc2626' }}>-{totalStockOut.toLocaleString()} Seedlings</strong>
          </div>
        </div>
      </section>

      {/* TABLE BOX */}
      <div className="proto-table-box history-card">
        <div className="table-toolbar">
          <div>
            <h2 className="history-title">Transaction Movement Logs</h2>
            <p className="history-subtitle">Comprehensive audit trail of incoming and outgoing clonal stock.</p>
          </div>

          <div className="toolbar-left" style={{ gap: '12px' }}>
            {/* Search */}
            <div className="search-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-search">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search species or person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="history-tab-pills">
              <button
                type="button"
                className={`pill-btn ${filterType === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterType('ALL')}
              >
                ALL
              </button>
              <button
                type="button"
                className={`pill-btn ${filterType === 'STOCK-IN' ? 'active' : ''}`}
                onClick={() => setFilterType('STOCK-IN')}
              >
                STOCK-IN
              </button>
              <button
                type="button"
                className={`pill-btn ${filterType === 'STOCK-OUT' ? 'active' : ''}`}
                onClick={() => setFilterType('STOCK-OUT')}
              >
                STOCK-OUT
              </button>
            </div>
          </div>
        </div>

        {/* Clean Table */}
        <div className="table-overflow">
          <table className="proto-table history-table">
            <thead>
              <tr>
                <th>DATE & TIME</th>
                <th>MOVEMENT TYPE</th>
                <th>SPECIES & BATCH</th>
                <th>QUANTITY</th>
                <th>RECIPIENT / PURPOSE</th>
                <th>HANDLED BY</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const isOut = item.type === 'STOCK-OUT';
                  return (
                    <tr key={item.id}>
                      <td className="date-cell">
                        <strong>{item.date}</strong>
                        <small style={{ display: 'block', color: '#718096' }}>{item.time}</small>
                      </td>
                      <td>
                        <span className={`pill-movement-type ${isOut ? 'type-out' : 'type-in'}`}>
                          {isOut ? 'STOCK-OUT' : 'STOCK-IN'}
                        </span>
                      </td>
                      <td>
                        <strong className="species-name-bold">{item.species}</strong>
                        <small style={{ display: 'block', color: '#55665d' }}>{item.batch}</small>
                      </td>
                      <td className={`qty-cell ${isOut ? 'qty-out' : 'qty-in'}`}>
                        {isOut ? `-${item.qty}` : `+${item.qty}`}
                      </td>
                      <td>{item.party}</td>
                      <td>
                        <span className="officer-badge">{item.officer}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table-msg">
                    No transaction records match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
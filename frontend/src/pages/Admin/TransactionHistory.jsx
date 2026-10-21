import { useState } from 'react';

const mockTransactions = [
  {
    id: 1,
    record_id: 'SO-0041',
    batch_id: '001',
    species_name: 'Narra',
    type: 'OUT',
    qty: -50,
    method: 'QR',
    requester_id: '232414',
    reason: 'Project',
    handled_by: 'Maria Santos',
    date: '2025-11-25',
  },
  {
    id: 2,
    record_id: 'SO-0039',
    batch_id: '002',
    species_name: 'Mahogany',
    type: 'OUT',
    qty: -100,
    method: 'MANUAL',
    requester_id: '-',
    reason: 'Farmer Distribution',
    handled_by: 'Maria Santos',
    date: '2025-09-20',
  },
  {
    id: 3,
    record_id: 'SO-0038',
    batch_id: '003',
    species_name: 'Mangga',
    type: 'OUT',
    qty: -350,
    method: 'MANUAL',
    requester_id: '-',
    reason: 'Farmer Distribution',
    handled_by: 'Pedro Reyes',
    date: '2025-02-02',
  },
  {
    id: 4,
    record_id: 'SO-0037',
    batch_id: '004',
    species_name: 'Cacao',
    type: 'OUT',
    qty: -25,
    method: 'QR',
    requester_id: '211211',
    reason: 'Project',
    handled_by: 'Project',
    date: '2025-11-18',
  },
  {
    id: 5,
    record_id: 'SI-0036',
    batch_id: '005',
    species_name: 'Talahangin',
    type: 'IN',
    qty: 89,
    method: 'MANUAL',
    requester_id: '-',
    reason: 'Stock replenishment',
    handled_by: 'Maria Santos',
    date: '2025-10-13',
  },
  {
    id: 6,
    record_id: 'SI-0035',
    batch_id: '006',
    species_name: 'Yakal',
    type: 'IN',
    qty: 300,
    method: 'MANUAL',
    requester_id: '-',
    reason: 'Stock replenishment',
    handled_by: 'Pedro Reyes',
    date: '2025-06-18',
  },
];

function TransactionHistory() {
  const [filterType, setFilterType] = useState('ALL');

  const filteredData = mockTransactions.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.type === filterType;
  });

  return (
    <div className="transaction-history-module">
      <div className="proto-table-box history-card">
        <div className="history-header-row">
          <div>
            <h2 className="history-title">Transaction History</h2>
            <p className="history-subtitle">Complete audit log of all stock movements</p>
          </div>

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
              className={`pill-btn ${filterType === 'IN' ? 'active' : ''}`}
              onClick={() => setFilterType('IN')}
            >
              IN
            </button>
            <button
              type="button"
              className={`pill-btn ${filterType === 'OUT' ? 'active' : ''}`}
              onClick={() => setFilterType('OUT')}
            >
              OUT
            </button>
          </div>
        </div>

        <div className="table-overflow">
          <table className="proto-table history-table">
            <thead>
              <tr>
                <th>RECORD ID</th>
                <th>BATCH ID</th>
                <th>SPECIES NAME</th>
                <th>QTY</th>
                <th>METHOD</th>
                <th>REQUESTER/ STUDENT ID</th>
                <th>REASON</th>
                <th>HANDLED BY</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const isNegative = item.qty < 0;
                  return (
                    <tr key={item.id}>
                      <td className="record-id-cell">{item.record_id}</td>
                      <td className="bold-cell">{item.batch_id}</td>
                      <td className="species-name-bold">{item.species_name}</td>
                      <td className={`qty-cell ${isNegative ? 'qty-out' : 'qty-in'}`}>
                        {isNegative ? item.qty : `+${item.qty}`}
                      </td>
                      <td>
                        <span className={`method-badge ${item.method.toLowerCase()}`}>
                          {item.method === 'QR' && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-method-qr">
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                            </svg>
                          )}
                          {item.method}
                        </span>
                      </td>
                      <td>{item.requester_id}</td>
                      <td>{item.reason}</td>
                      <td>{item.handled_by}</td>
                      <td className="date-cell">{item.date}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="empty-table-msg">
                    No transaction logs found for this filter.
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
import { useState } from 'react';

const mockPickupQueue = [
  {
    id: 1,
    order_ref: 'REQ-001',
    recipient_name: 'Patrick Santos',
    contact: '0917-123-4567',
    seedlings: [
      { name: 'Narra', qty: 20 },
      { name: 'Mahogany', qty: 10 },
    ],
    allocated_batch: 'Batch #001 & #002',
    purpose: 'Community Tree Planting',
    scheduled_pickup: 'Today • Morning',
    status: 'Ready',
  },
  {
    id: 2,
    order_ref: 'REQ-002',
    recipient_name: 'Maria Santos',
    contact: '0918-987-6543',
    seedlings: [{ name: 'Narra', qty: 20 }],
    allocated_batch: 'Batch #001',
    purpose: 'Thesis Research Project',
    scheduled_pickup: 'Today • Afternoon',
    status: 'Ready',
  },
  {
    id: 3,
    order_ref: 'REQ-003',
    recipient_name: 'Juan Dela Cruz',
    contact: '0920-555-1234',
    seedlings: [
      { name: 'Mahogany', qty: 30 },
      { name: 'Yakal', qty: 10 },
    ],
    allocated_batch: 'Batch #002 & #006',
    purpose: 'Upland Watershed Reforestation',
    scheduled_pickup: 'Tomorrow • 9:00 AM',
    status: 'Ready',
  },
  {
    id: 4,
    order_ref: 'REQ-004',
    recipient_name: 'Elena Ramos',
    contact: '0929-333-8899',
    seedlings: [{ name: 'Narra', qty: 15 }],
    allocated_batch: 'Batch #001',
    purpose: 'Barangay Greening Program',
    scheduled_pickup: 'Tomorrow • 1:30 PM',
    status: 'Ready',
  },
];

function StockOut() {
  const [queue, setQueue] = useState(mockPickupQueue);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('All');

  const handleConfirmStockOut = () => {
    if (!selectedOrder) return;
    setQueue(queue.filter((item) => item.id !== selectedOrder.id));
    setSelectedOrder(null);
  };

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.order_ref.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies =
      filterSpecies === 'All' ||
      item.seedlings.some((s) => s.name.toLowerCase() === filterSpecies.toLowerCase());
    return matchesSearch && matchesSpecies;
  });

  const totalSeedlingsToRelease = queue.reduce(
    (total, item) => total + item.seedlings.reduce((sum, s) => sum + s.qty, 0),
    0
  );

  return (
    <div className="stockout-container">
      <div className="stockout-header-card">
        <div className="stockout-title-meta">
          <div className="stockout-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-inline-icon">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <div>
            <h2>Stock-Out & Distribution</h2>
            <p>Manage and hand over approved seedling requests to recipients.</p>
          </div>
        </div>

        <div className="stockout-kpi-row">
          <div className="kpi-pill">
            <span className="kpi-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-check-icon">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div>
              <small>READY TO HAND OVER</small>
              <strong>{queue.length} Orders ({totalSeedlingsToRelease} Seedlings)</strong>
            </div>
          </div>

          <div className="kpi-pill">
            <span className="kpi-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-check-icon">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div>
              <small>SCHEDULED TODAY</small>
              <strong>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="stockout-table-card">
        <div className="stockout-toolbar">
          <div className="queue-title-badge">
            <span className="green-indicator" />
            <h3>Ready for Pickup Queue</h3>
          </div>

          <div className="stockout-controls">
            <div className="search-pill">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-search">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search recipient or REQ ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="select-filter"
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
            >
              <option value="All">Filter by Species: All</option>
              <option value="Narra">Narra</option>
              <option value="Mahogany">Mahogany</option>
              <option value="Yakal">Yakal</option>
            </select>
          </div>
        </div>

        <div className="table-overflow">
          <table className="proto-table">
            <thead>
              <tr>
                <th>ORDER REF</th>
                <th>RECIPIENT NAME & CONTACT</th>
                <th>SEEDLINGS & QUANTITY</th>
                <th>ALLOCATED BATCH</th>
                <th>PURPOSE</th>
                <th>SCHEDULED PICKUP</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length > 0 ? (
                filteredQueue.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="order-ref-pill">{item.order_ref}</span>
                    </td>
                    <td>
                      <div className="recipient-info">
                        <strong>{item.recipient_name}</strong>
                        <small>{item.contact}</small>
                      </div>
                    </td>
                    <td>
                      <div className="seedlings-tags">
                        {item.seedlings.map((s, idx) => (
                          <span key={idx} className="tag-pill">
                            • {s.qty}x {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{item.allocated_batch}</td>
                    <td>{item.purpose}</td>
                    <td>{item.scheduled_pickup}</td>
                    <td>
                      <span className="badge-ready">
                        <span className="dot" /> {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-confirm-release"
                        onClick={() => setSelectedOrder(item)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-btn-icon">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Confirm Release
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-msg">
                    No orders ready for pickup.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-seedling">
                    <path d="M12 10v10" />
                    <path d="M12 10a5 5 0 0 1 5-5h3v3a5 5 0 0 1-5 5h-3z" />
                    <path d="M12 14a5 5 0 0 0-5-5H4v3a5 5 0 0 0 5 5h3z" />
                  </svg>
                </div>
                <div>
                  <h3>Confirm Seedling Stock-Out</h3>
                  <p>Verify physical handover details for {selectedOrder.order_ref} before releasing.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body-grid">
              <div className="modal-row-2col">
                <div>
                  <small>ORDER REFERENCE</small>
                  <strong>{selectedOrder.order_ref}</strong>
                </div>
                <div>
                  <small>PURPOSE</small>
                  <strong>{selectedOrder.purpose}</strong>
                </div>
              </div>

              <div>
                <small>RECIPIENT</small>
                <strong>{selectedOrder.recipient_name} ({selectedOrder.contact})</strong>
              </div>

              <div>
                <small>SEEDLINGS TO RELEASE</small>
                <div className="seedlings-tags modal-tags">
                  {selectedOrder.seedlings.map((s, idx) => (
                    <span key={idx} className="tag-pill modal-pill">
                      {s.qty}x {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <small>ALLOCATED BATCH</small>
                <strong>{selectedOrder.allocated_batch}</strong>
              </div>

              <div>
                <small>HANDOVER LOCATION</small>
                <strong>UEP Clonal Nursery</strong>
              </div>

              <div className="modal-reminder-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-info-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <p>
                  <strong>Important Reminder:</strong> Ensure seedlings have been physically handed over to the recipient before confirming.
                </p>
              </div>
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleConfirmStockOut}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-btn-icon">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Confirm & Complete Stock-Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockOut;
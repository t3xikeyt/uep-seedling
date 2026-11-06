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
  const [rescheduleOrder, setRescheduleOrder] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('All');
  const [flashMsg, setFlashMsg] = useState('');

  // 1. Confirm Handover
  const handleConfirmStockOut = () => {
    if (!selectedOrder) return;
    setQueue(queue.filter((item) => item.id !== selectedOrder.id));
    setFlashMsg(`Order ${selectedOrder.order_ref} released and logged successfully.`);
    setSelectedOrder(null);
    setTimeout(() => setFlashMsg(''), 3000);
  };

  // 2. Cancel / Unclaimed
  const handleCancelOrder = (item) => {
    if (window.confirm(`Mark ${item.order_ref} (${item.recipient_name}) as Cancelled / Unclaimed?`)) {
      setQueue(queue.filter((q) => q.id !== item.id));
      setFlashMsg(`Order ${item.order_ref} marked as Unclaimed/Cancelled.`);
      setTimeout(() => setFlashMsg(''), 3000);
    }
  };

  // 3. Save Rescheduled Date
  const handleSaveReschedule = (e) => {
    e.preventDefault();
    if (!newDate) return;
    setQueue(
      queue.map((item) =>
        item.id === rescheduleOrder.id ? { ...item, scheduled_pickup: newDate } : item
      )
    );
    setFlashMsg(`Pickup for ${rescheduleOrder.order_ref} rescheduled to ${newDate}.`);
    setRescheduleOrder(null);
    setNewDate('');
    setTimeout(() => setFlashMsg(''), 3000);
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
      {flashMsg && <div className="flash-message success">{flashMsg}</div>}

      {/* Top Banner KPI Header */}
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

      {/* Main Table Card */}
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
                <th>RECIPIENT & CONTACT</th>
                <th>SEEDLINGS & QTY</th>
                <th>ALLOCATED BATCH</th>
                <th>PURPOSE</th>
                <th>SCHEDULED PICKUP</th>
                <th>STATUS</th>
                <th>ACTION CHOICES</th>
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
                      {/* ACTION CHOICES */}
                      <div className="distribution-actions-group">
                        <button
                          type="button"
                          className="btn-action-release"
                          onClick={() => setSelectedOrder(item)}
                          title="Confirm handover of seedlings"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-btn-icon">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Release
                        </button>

                        <button
                          type="button"
                          className="btn-action-reschedule"
                          onClick={() => {
                            setRescheduleOrder(item);
                            setNewDate('');
                          }}
                          title="Change pickup date"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-btn-icon">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Date
                        </button>

                        <button
                          type="button"
                          className="btn-action-cancel"
                          onClick={() => handleCancelOrder(item)}
                          title="Cancel or mark unclaimed"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-msg">
                    No orders waiting in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION HANDOVER MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
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
                <strong>UEP Clonal Facility</strong>
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

      {/* RESCHEDULE MODAL */}
      {rescheduleOrder && (
        <div className="modal-backdrop" onClick={() => setRescheduleOrder(null)}>
          <div className="modal-card password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reschedule Pickup Date</h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setRescheduleOrder(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="stockin-form">
              <div className="form-group">
                <label>Order Reference</label>
                <input type="text" value={rescheduleOrder.order_ref} disabled className="role-input-disabled" />
              </div>

              <div className="form-group">
                <label>Recipient Name</label>
                <input type="text" value={rescheduleOrder.recipient_name} disabled className="role-input-disabled" />
              </div>

              <div className="form-group">
                <label>New Scheduled Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setRescheduleOrder(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-confirm">
                  Save New Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockOut;
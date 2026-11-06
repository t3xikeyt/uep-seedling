import { useState } from 'react';

const mockRequests = [
  {
    id: 1,
    req_id: 'REQ ID- 001',
    requester_name: 'Patrick Santos',
    purpose: 'Tree Planting',
    contact: '09171234567',
    requested_seeds: 'Narra (20), Mahogany(10)',
    pickup_date: '2026-08-20',
    date_submitted: '2026-08-11',
    status: 'Pending',
  },
  {
    id: 2,
    req_id: 'REQ ID- 002',
    requester_name: 'Juan Cruz',
    purpose: 'Tree Planting',
    contact: '09815514363',
    requested_seeds: 'Narra (15)',
    pickup_date: '2026-08-15',
    date_submitted: '2026-08-11',
    status: 'Pending',
  },
];

function SeedlingRequest() {
  const [requests, setRequests] = useState(mockRequests);

  const handleUpdateStatus = (id, newStatus) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  return (
    <div className="request-module-container">
      <div className="proto-table-box request-card">
        <div className="request-card-header">
          <h2>Manage Incoming Request</h2>
        </div>

        <div className="table-overflow">
          <table className="proto-table request-table">
            <thead>
              <tr>
                <th>REQ ID</th>
                <th>REQUESTER NAME</th>
                <th>PURPOSE/CONTACT</th>
                <th>REQUESTED SEEDS</th>
                <th>PICKUP DATE</th>
                <th>DATE SUBMITTED</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {requests.length > 0 ? (
                requests.map((item) => (
                  <tr key={item.id}>
                    <td className="bold-cell">{item.req_id}</td>
                    <td className="requester-name-cell">{item.requester_name}</td>
                    <td>
                      <div className="purpose-contact-cell">
                        <span>{item.purpose}</span>
                        <small className="contact-row">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-mini-icon">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {item.contact}
                        </small>
                      </div>
                    </td>
                    <td>
                      <strong className="seeds-text">{item.requested_seeds}</strong>
                    </td>
                    <td>
                      <span className="pickup-date-cell">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-mini-icon">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {item.pickup_date}
                      </span>
                    </td>
                    <td>{item.date_submitted}</td>
                    <td>
                      <span className={`badge-req-status ${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === 'Pending' ? (
                        <div className="action-btn-group">
                          <button
                            type="button"
                            className="btn-req-approve"
                            onClick={() => handleUpdateStatus(item.id, 'Approved')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn-req-reject"
                            onClick={() => handleUpdateStatus(item.id, 'Rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="processed-lbl">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table-msg">
                    No incoming seedling requests found.
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

export default SeedlingRequest;
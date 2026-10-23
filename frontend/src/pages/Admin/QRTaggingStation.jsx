import { useState } from 'react';

const mockBatches = [
  { batch_id: '001', species_name: 'Narra', category: 'Hardwood', current_stock: 400, source: 'UEP Clonal Core' },
  { batch_id: '002', species_name: 'Mahogany', category: 'Hardwood', current_stock: 300, source: 'UEP Clonal Core' },
  { batch_id: '003', species_name: 'Mangga', category: 'Fruit-Bearing', current_stock: 1, source: 'UEP Clonal Core' },
  { batch_id: '004', species_name: 'Cacao', category: 'Fruit-Bearing', current_stock: 50, source: 'UEP Clonal Core' },
  { batch_id: '005', species_name: 'Talahangin', category: 'Hardwood', current_stock: 99, source: 'UEP Clonal Core' },
  { batch_id: '006', species_name: 'Yakal', category: 'Hardwood', current_stock: 5, source: 'UEP Clonal Core' },
];

function QRTaggingStation({ batches = [] }) {
  const batchList = batches.length > 0 ? batches : mockBatches;
  const [selectedBatch, setSelectedBatch] = useState(batchList[0]);

  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=UEP-CLONAL-BATCH-${selectedBatch.batch_id}-${encodeURIComponent(selectedBatch.species_name)}`;

  return (
    <div className="qr-station-container">
      <div className="qr-station-grid">
        {/* Left Side: Batch Selection Table */}
        <div className="proto-table-box qr-list-card">
          <div className="qr-header-area">
            <h2 className="qr-title">QR Tagging Station</h2>
            <p className="qr-subtitle">Select a batch to generate its QR identification tag</p>
          </div>

          <div className="table-overflow">
            <table className="proto-table qr-table">
              <thead>
                <tr>
                  <th>BATCH ID</th>
                  <th>SPECIES NAME</th>
                  <th>CATEGORY</th>
                  <th>CURRENT STOCK</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {batchList.map((b) => {
                  const isSelected = selectedBatch.batch_id === b.batch_id;
                  return (
                    <tr key={b.batch_id} className={isSelected ? 'row-selected' : ''}>
                      <td>
                        <div className="batch-id-wrap">
                          <span className={`select-dot ${isSelected ? 'active-dot' : ''}`} />
                          <strong className="batch-id-text">{b.batch_id}</strong>
                        </div>
                      </td>
                      <td className="species-name-bold">{b.species_name}</td>
                      <td>{b.category}</td>
                      <td className="stock-count-cell">{b.current_stock}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-purple-tag"
                          onClick={() => setSelectedBatch(b)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-tag-icon">
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
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Printable Tag Preview */}
        <div className="proto-table-box qr-preview-card">
          <div className="preview-top-bar">
            <h3 className="mono-heading">Tag Preview</h3>
          </div>

          <div className="printable-tag-area">
            <div className="qr-code-box">
              <img
                src={qrApiUrl}
                alt={`QR for ${selectedBatch.species_name}`}
                className="actual-qr-image"
              />
            </div>

            <div className="tag-details-meta">
              <span className="tag-org-name">UEP Clonal</span>
              <h2 className="tag-species-title">{selectedBatch.species_name.toUpperCase()}</h2>
              <span className="tag-batch-label">Batch #{selectedBatch.batch_id}</span>
            </div>

            <div className="tag-specs-divider" />

            <div className="tag-specs-grid">
              <div className="spec-row">
                <span className="spec-name">Category</span>
                <strong className="spec-val">{selectedBatch.category}</strong>
              </div>
              <div className="spec-row">
                <span className="spec-name">Source</span>
                <strong className="spec-val">{selectedBatch.origin || selectedBatch.source || 'UEP Clonal Core'}</strong>
              </div>
            </div>

            <button
              type="button"
              className="btn-print-tag-green"
              onClick={() => window.print()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-printer-icon">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print Tag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRTaggingStation;
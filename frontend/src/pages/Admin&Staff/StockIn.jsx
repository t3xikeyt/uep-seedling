import { useState } from 'react';

const initialForm = {
  species_name: '',
  category: 'Hardwood',
  origin: '',
  quantity: '',
  date_logged: new Date().toISOString().slice(0, 10),
};

function StockIn({ token, API_URL, onBatchAdded }) {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const generatedBatchId = `BATCH-${Date.now().toString().slice(-4)}`;

      const res = await fetch(`${API_URL}/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batch_id: generatedBatchId,
          species_name: formData.species_name,
          category: formData.category,
          origin: formData.origin || 'UEP Clonal Core',
          quantity: Number(formData.quantity),
          initial_stock: Number(formData.quantity),
          current_stock: Number(formData.quantity),
          date_logged: formData.date_logged,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to save stock-in.');

      setFormData(initialForm);
      onBatchAdded();
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stockin-container">
      <div className="stockin-card">
        <div className="stockin-card-header">
          <h2>Stock-In Module</h2>
        </div>

        {errorMsg && <div className="flash-message error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="stockin-form">
          <div className="form-group">
            <label>Species Name</label>
            <input
              type="text"
              placeholder="e.g. Narra"
              value={formData.species_name}
              onChange={(e) => setFormData({ ...formData, species_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Hardwood">Hardwood</option>
              <option value="Fruit-bearing">Fruit-bearing</option>
              <option value="Ornamental">Ornamental</option>
              <option value="Forest Species">Forest Species</option>
            </select>
          </div>

          <div className="form-group">
            <label>Origin</label>
            <input
              type="text"
              placeholder="e.g. UEP Clonal"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Quantity Added</label>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Date Logged</label>
            <input
              type="date"
              value={formData.date_logged}
              onChange={(e) => setFormData({ ...formData, date_logged: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-confirm-stock">
            {loading ? 'Saving...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StockIn;
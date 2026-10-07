import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_TRANSACTIONS } from '../../data/adminData';

export default function AdminPayments() {
  const [transactions] = useState(ADMIN_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedTxn, setSelectedTxn] = useState(null);

  const filteredTxns = transactions.filter((t) => {
    const matchSearch =
      t.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.payer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.center.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = categoryFilter === 'All' || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = [
    'All',
    'Admission Enrollment Fee',
    'Final Term Examination Fee',
    'Annual Center Affiliation Fee',
    'Provisional Certificate Fee'
  ];

  const handleExportCSV = () => {
    const header = 'TxnID,Timestamp,Payer,Center,Category,Amount,PaymentMode,Status\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.txnId}","${t.date}","${t.payer}","${t.center}","${t.category}","${t.amount}","${t.mode}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NCTMS_National_Financial_Ledger_2026.csv';
    a.click();
  };

  return (
    <AdminLayout pageTitle="National Finance & Fee Collection Ledger">
      
      {/* 1. Master Finance Overview Cards */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ color: '#16a34a' }}>₹ 4.82 Cr</strong>
            <span>Fiscal Year Gross Revenue</span>
          </div>
          <div className="metric-icon-wrap m-green">
            💳
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>₹ 69,950</strong>
            <span>Today's Clearing Intake</span>
          </div>
          <div className="metric-icon-wrap m-blue">
            📈
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>₹ 45.0 L</strong>
            <span>Center Affiliation Royalties</span>
          </div>
          <div className="metric-icon-wrap m-purple">
            🏛️
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>₹ 1.24 Cr</strong>
            <span>Examination Fee Intake</span>
          </div>
          <div className="metric-icon-wrap m-orange">
            ✍️
          </div>
        </div>
      </div>

      {/* 2. Filter & Actions Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search Txn ID, payer name, or center code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filters">
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Fee Head:</label>
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportCSV}
          >
            📥 Export CSV Ledger
          </button>
        </div>
      </div>

      {/* 3. Real-Time Transactions Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            Real-Time Payment Settlement Records ({filteredTxns.length} Transactions)
          </h3>
          <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>
            ● PG Gateway / UPI Auto-Reconciled
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Settlement Timestamp</th>
                <th>Payer / Organization</th>
                <th>Center Code</th>
                <th>Fee Classification</th>
                <th>Net Amount</th>
                <th>Gateway / Mode</th>
                <th>Clearing Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => (
                <tr key={t.txnId}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb' }}>
                      {t.txnId}
                    </span>
                  </td>
                  <td>{t.date}</td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{t.payer}</strong>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                      {t.center}
                    </span>
                  </td>
                  <td>
                    <span className="badge-info">{t.category}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#16a34a', fontSize: '14px' }}>{t.amount}</strong>
                  </td>
                  <td>{t.mode}</td>
                  <td>
                    <span className="badge-approved">Success</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      onClick={() => setSelectedTxn(t)}
                    >
                      🧾 GST Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Official GST Tax Invoice Modal */}
      {selectedTxn && (
        <div className="admin-modal-overlay" onClick={() => setSelectedTxn(null)}>
          <div className="admin-modal-container" style={{ maxWidth: '650px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Council Electronic GST Tax Receipt &bull; {selectedTxn.txnId}</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedTxn(null)}>&times;</button>
            </div>

            <div className="admin-modal-body">
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', background: '#ffffff' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0b326b', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/assets/images/nctms-logo.svg" alt="NCTMS" style={{ width: '42px', height: '42px' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0b326b' }}>
                        NCTMS INDIA COUNCIL
                      </h4>
                      <small style={{ color: '#64748b' }}>GSTIN: 33AAAAA0000A1Z5 &bull; HSN/SAC: 999293</small>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge-approved">PAID &bull; SETTLED</span>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Date: {selectedTxn.date}</div>
                  </div>
                </div>

                {/* Bill to */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '12.5px', marginBottom: '18px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Billed To:</span>
                    <strong>{selectedTxn.payer}</strong>
                    <div style={{ color: '#475569' }}>Center: {selectedTxn.center}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Payment Channel:</span>
                    <strong>{selectedTxn.mode}</strong>
                    <div style={{ fontFamily: 'monospace', color: '#2563eb' }}>ID: {selectedTxn.txnId}</div>
                  </div>
                </div>

                {/* Breakdown Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '16px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                      <th style={{ padding: '8px', textAlign: 'center' }}>SAC</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px' }}>{selectedTxn.category}</td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>999293</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{selectedTxn.amount}</td>
                    </tr>
                    <tr>
                      <td colSpan={2} style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>Total Paid (Inclusive of Taxes):</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 800, color: '#16a34a', fontSize: '14px' }}>
                        {selectedTxn.amount}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                  This is a computer-generated tax invoice verified by the Central Finance Comptroller, NCTMS India. No physical signature required.
                </div>

              </div>
            </div>

            <div className="admin-modal-foot">
              <button type="button" className="btn-secondary" onClick={() => setSelectedTxn(null)}>
                Close
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => window.print()}
              >
                🖨️ Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

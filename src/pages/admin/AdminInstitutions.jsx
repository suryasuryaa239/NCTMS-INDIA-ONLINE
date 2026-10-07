import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_AFFILIATIONS_QUEUE } from '../../data/adminData';
import { INSTITUTIONS_DATA } from '../../data/institutionsData';

export default function AdminInstitutions() {
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'accredited'
  const [pendingQueue, setPendingQueue] = useState(ADMIN_AFFILIATIONS_QUEUE);
  const [centersList, setCentersList] = useState(INSTITUTIONS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Handle granting affiliation
  const handleApproveAffiliation = (item) => {
    const statePrefix = item.state.includes('Tamil') ? 'TN' : item.state.includes('Karnataka') ? 'KA' : item.state.includes('Maha') ? 'MH' : 'IN';
    const newCenterCode = `NCTMS-${statePrefix}-${Math.floor(200 + Math.random() * 800)}`;

    const newCenter = {
      code: newCenterCode,
      name: item.instName,
      city: item.city,
      state: item.state,
      address: `${item.city}, ${item.state}`,
      category: 'Approved Polytechnic & Training Academy',
      contact: item.phone || '+91 98400 11223',
      email: item.email || 'center@nctms.in',
      status: 'Active Affiliation (2026-2027)',
      rating: '4.8 ★★★★★',
      coursesOffered: item.coursesRequested
    };

    setCentersList([newCenter, ...centersList]);
    setPendingQueue(pendingQueue.filter((p) => p.id !== item.id));
    setSelectedAffiliation(null);
    setToastMsg(`Accreditation granted! Official Center Code issued: ${newCenterCode}`);
  };

  const handleRejectAffiliation = (item) => {
    setPendingQueue(pendingQueue.filter((p) => p.id !== item.id));
    setSelectedAffiliation(null);
    setToastMsg(`Affiliation requisition for ${item.instName} has been declined.`);
  };

  const filteredCenters = centersList.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Affiliated Centers & Institutional Accreditation">
      
      {/* 1. Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
            Council Affiliation & Quality Assurance Bureau
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Inspect, evaluate, and certify autonomous technical institutions, colleges, and polytechnics across India.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: activeTab === 'queue' ? '#2563eb' : '#f1f5f9',
              color: activeTab === 'queue' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1'
            }}
            onClick={() => setActiveTab('queue')}
          >
            📋 Requisitions Queue ({pendingQueue.length})
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: activeTab === 'accredited' ? '#2563eb' : '#f1f5f9',
              color: activeTab === 'accredited' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1'
            }}
            onClick={() => setActiveTab('accredited')}
          >
            🏫 Accredited Centers ({centersList.length})
          </button>
        </div>
      </div>

      {toastMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span>✅ {toastMsg}</span>
          <button type="button" onClick={() => setToastMsg('')} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}>&times;</button>
        </div>
      )}

      {/* 2. REQUISITIONS QUEUE VIEW */}
      {activeTab === 'queue' && (
        <div>
          <div className="panel-card" style={{ marginBottom: '20px' }}>
            <div className="panel-card-head">
              <h3><span>🏢</span> New Center Affiliation Applications ({pendingQueue.length})</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Pending Board Approval &amp; Code Allocation</span>
            </div>

            {pendingQueue.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                All institutional applications have been processed! No pending items in queue.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingQueue.map((item) => (
                  <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>🏛️</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{item.instName}</h4>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '8px' }}>
                        📍 <strong>{item.city}, {item.state}</strong> &bull; Principal / Head: <strong>{item.principalName}</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {item.coursesRequested.map((c, i) => (
                          <span key={i} className="badge-info">{c}</span>
                        ))}
                      </div>
                      <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                        Audit Note: {item.inspectionStatus} &bull; Applied: {item.appliedDate}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => setSelectedAffiliation(item)}
                      >
                        Evaluate Dossier &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ACCREDITED CENTERS REGISTRY VIEW */}
      {activeTab === 'accredited' && (
        <div>
          <div className="admin-toolbar">
            <div className="admin-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search center name, code, city, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
              Accredited Centers: <strong>{filteredCenters.length}</strong>
            </div>
          </div>

          <div className="portal-table-wrap">
            <div className="portal-table-header">
              <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
                Council Accredited Examination &amp; Study Centers
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Active Nationwide Network</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Center Code</th>
                    <th>Institution Name</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Contact &amp; Email</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCenters.map((c) => (
                    <tr key={c.code}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb' }}>
                          {c.code}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{c.name}</strong>
                        <small style={{ color: '#64748b' }}>{c.address}</small>
                      </td>
                      <td>
                        <div>{c.city}</div>
                        <small style={{ color: '#64748b' }}>{c.state}</small>
                      </td>
                      <td>{c.category}</td>
                      <td>
                        <div style={{ fontSize: '12px' }}>{c.contact}</div>
                        <small style={{ color: '#64748b' }}>{c.email}</small>
                      </td>
                      <td>
                        <strong style={{ color: '#eab308' }}>{c.rating}</strong>
                      </td>
                      <td>
                        <span className="badge-approved">Active 2026-27</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => alert(`Center Details for ${c.code}:\nAccreditation Order: NCTMS/ORD/2026/${c.code}\nCapacity: 450 seats\nStatus: Certified in good standing.`)}
                        >
                          Dossier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Affiliation Dossier Evaluation Modal */}
      {selectedAffiliation && (
        <div className="admin-modal-overlay" onClick={() => setSelectedAffiliation(null)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Affiliation Scrutiny &bull; {selectedAffiliation.instName}</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedAffiliation(null)}>&times;</button>
            </div>

            <div className="admin-modal-body">
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12.5px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>City / State:</span>
                    <strong>{selectedAffiliation.city}, {selectedAffiliation.state}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Principal / Academic Head:</span>
                    <strong>{selectedAffiliation.principalName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Proposed Student Intake:</span>
                    <strong>{selectedAffiliation.proposedIntake} Students / Year</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Applied Date:</span>
                    <strong>{selectedAffiliation.appliedDate}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Laboratory Infrastructure:</span>
                    <strong>{selectedAffiliation.labs || '4 Computing & Specialized Labs'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Auditorium & Classrooms:</span>
                    <strong>{selectedAffiliation.classrooms || 12} Smart Classrooms</strong>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 8px', color: '#0f172a' }}>Requested Programs for Affiliation:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {selectedAffiliation.coursesRequested.map((crs, i) => (
                  <span key={i} className="badge-info">{crs}</span>
                ))}
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '14px', fontSize: '12.5px', color: '#1e40af' }}>
                <strong>Quality Inspection Status:</strong> {selectedAffiliation.inspectionStatus}
                <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#3b82f6' }}>
                  The Council Inspection Committee has verified structural compliance, faculty qualifications, fire safety clearance, and computing laboratory resources.
                </p>
              </div>
            </div>

            <div className="admin-modal-foot">
              <button type="button" className="btn-secondary" onClick={() => setSelectedAffiliation(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => handleRejectAffiliation(selectedAffiliation)}
              >
                Reject Affiliation
              </button>
              <button
                type="button"
                className="btn-success"
                onClick={() => handleApproveAffiliation(selectedAffiliation)}
              >
                ✅ Grant Affiliation & Assign Center Code
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

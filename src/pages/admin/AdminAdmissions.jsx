import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_ADMISSIONS_QUEUE } from '../../data/adminData';

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState(ADMIN_ADMISSIONS_QUEUE);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Filtered applications
  const filteredApps = admissions.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.centerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'All' ? true : app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (appId) => {
    // Generate official enrollment ID
    const genEnrollment = `NCTMS2026EN${Math.floor(1000 + Math.random() * 9000)}`;
    setAdmissions((prev) =>
      prev.map((item) =>
        item.id === appId
          ? { ...item, status: 'Approved & Enrolled', enrollmentNo: genEnrollment }
          : item
      )
    );
    setActionSuccessMsg(`Application approved successfully! Permanent Enrollment No issued: ${genEnrollment}`);
    setSelectedApp(null);
  };

  const handleReject = (appId) => {
    if (!rejectionReason.trim()) {
      alert('Please specify the reason for application rejection.');
      return;
    }
    setAdmissions((prev) =>
      prev.map((item) =>
        item.id === appId
          ? { ...item, status: 'Application Rejected', rejectRemark: rejectionReason }
          : item
      )
    );
    setActionSuccessMsg(`Application ${appId} marked as Rejected.`);
    setRejectionReason('');
    setSelectedApp(null);
  };

  const pendingCount = admissions.filter((a) => a.status === 'Pending Verification').length;
  const approvedCount = admissions.filter((a) => a.status === 'Approved & Enrolled').length;

  return (
    <AdminLayout pageTitle="Admissions Scrutiny & Enrollment Desk">
      
      {/* 1. Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
            National Admissions Clearance Committee
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Scrutinize incoming admission applications across 184 affiliated centers and issue council enrollment numbers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 800, color: '#b45309' }}>{pendingCount}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>Pending Review</span>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 800, color: '#15803d' }}>{approvedCount}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534' }}>Approved Today</span>
          </div>
        </div>
      </div>

      {actionSuccessMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span>✅ {actionSuccessMsg}</span>
          <button type="button" onClick={() => setActionSuccessMsg('')} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}>&times;</button>
        </div>
      )}

      {/* 2. Filters & Search */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search candidate name, App ID, course, or center..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filters">
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Status:</label>
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending Verification</option>
            <option value="Approved & Enrolled">Approved & Enrolled</option>
            <option value="Application Rejected">Application Rejected</option>
          </select>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              const csvData = admissions.map(a => `${a.appId},${a.candidateName},${a.courseCode},${a.status}`).join('\n');
              const blob = new Blob([`AppID,Candidate,Course,Status\n${csvData}`], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'NCTMS_Admissions_Dossier.csv';
              a.click();
            }}
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* 3. Admissions Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            Candidate Applications Roster ({filteredApps.length} Records)
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Academic Session 2026-2027</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate Name</th>
                <th>Program / Code</th>
                <th>Affiliated Center</th>
                <th>Qualification</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                      {app.appId}
                    </span>
                    {app.enrollmentNo && (
                      <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                        Enr: {app.enrollmentNo}
                      </div>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{app.candidateName}</strong>
                    <div style={{ fontSize: '11.5px', color: '#64748b' }}>{app.mobile}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.courseName}</div>
                    <small style={{ color: '#64748b' }}>{app.courseCode}</small>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{app.centerName}</span>
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>{app.centerCode}</div>
                  </td>
                  <td>{app.qualification}</td>
                  <td>{app.dateApplied}</td>
                  <td>
                    {app.status === 'Approved & Enrolled' ? (
                      <span className="badge-approved">Approved</span>
                    ) : app.status === 'Application Rejected' ? (
                      <span className="badge-danger">Rejected</span>
                    ) : (
                      <span className="badge-pending">Pending Scrutiny</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ fontSize: '11.5px', padding: '6px 12px' }}
                      onClick={() => setSelectedApp(app)}
                    >
                      Scrutinize &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Document Scrutiny & Approval Modal */}
      {selectedApp && (
        <div className="admin-modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Dossier Review &bull; {selectedApp.appId}</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedApp(null)}>&times;</button>
            </div>

            <div className="admin-modal-body">
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Candidate Full Name</span>
                    <strong>{selectedApp.candidateName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Contact Phone & WhatsApp</span>
                    <strong>{selectedApp.mobile}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Registered Email</span>
                    <strong>{selectedApp.email}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Prior Qualification</span>
                    <strong>{selectedApp.qualification}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Enrolling Program</span>
                    <strong>{selectedApp.courseName} ({selectedApp.courseCode})</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '11.5px' }}>Affiliated Center</span>
                    <strong>{selectedApp.centerName}</strong>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>
                Attached Verification Proofs ({selectedApp.docsAttached?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {selectedApp.docsAttached?.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>📄</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{doc}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => alert(`Simulating document preview for: ${doc}`)}
                    >
                      👁️ View Document
                    </button>
                  </div>
                ))}
              </div>

              {/* Rejection Remarks Form */}
              {selectedApp.status !== 'Approved & Enrolled' && (
                <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Deficiency Remarks (Required if rejecting):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Incomplete 12th marks memo, photo mismatch..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              )}
            </div>

            <div className="admin-modal-foot">
              <button type="button" className="btn-secondary" onClick={() => setSelectedApp(null)}>
                Cancel
              </button>

              {selectedApp.status !== 'Approved & Enrolled' && (
                <>
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleReject(selectedApp.id)}
                  >
                    ❌ Reject Application
                  </button>
                  <button
                    type="button"
                    className="btn-success"
                    onClick={() => handleApprove(selectedApp.id)}
                  >
                    ✅ Approve & Issue Enrollment No
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

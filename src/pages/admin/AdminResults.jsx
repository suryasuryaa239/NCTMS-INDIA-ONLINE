import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_RESULTS_BATCH } from '../../data/adminData';

export default function AdminResults() {
  const [results, setResults] = useState(ADMIN_RESULTS_BATCH);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [selectedCertStudent, setSelectedCertStudent] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const filteredResults = results.filter((r) => {
    const matchSearch =
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCourse = courseFilter === 'All' || r.courseCode === courseFilter;
    return matchSearch && matchCourse;
  });

  const handlePublishAll = () => {
    setResults((prev) =>
      prev.map((r) => ({
        ...r,
        publishStatus: 'Published Online'
      }))
    );
    setToastMsg('All examination scorecards have been published to the Public Verification Portal!');
  };

  const handleBatchSignCertificates = () => {
    setResults((prev) =>
      prev.map((r, i) => ({
        ...r,
        certStatus: 'Digitally Signed & Issued',
        certNo: r.certNo !== 'Pending' ? r.certNo : `NCTMS-CERT-2026-${9920 + i + 1}`
      }))
    );
    setToastMsg('Digital signature applied by Council Controller of Examinations! Certificates ready for download.');
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <AdminLayout pageTitle="Results Moderation & Certificate Issuance">
      
      {/* 1. Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
            Central Board of Examinations &amp; Certifications
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Moderate internal &amp; external marks, authorize public portal release, and cryptographically sign diploma credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ background: '#16a34a' }}
            onClick={handlePublishAll}
          >
            🌐 Publish All Online
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{ background: '#7c3aed' }}
            onClick={handleBatchSignCertificates}
          >
            🔏 Batch Sign Certificates
          </button>
        </div>
      </div>

      {toastMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span>✅ {toastMsg}</span>
          <button type="button" onClick={() => setToastMsg('')} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}>&times;</button>
        </div>
      )}

      {/* 2. Filter & Search Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search candidate name, Roll No (e.g. NCTMS2026CS1092)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="admin-filters">
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Course Program:</label>
          <select
            className="admin-select"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="All">All Courses</option>
            <option value="DCS-101">DCS-101 (Diploma in CS)</option>
            <option value="PGDM-201">PGDM-201 (PG Diploma Management)</option>
            <option value="CMLT-301">CMLT-301 (Cert in Medical Lab Tech)</option>
          </select>
        </div>
      </div>

      {/* 3. Results Ledger Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            Term Examination Scorecards ({filteredResults.length} Candidates)
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Evaluation Cohort: Summer 2026</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Candidate Name</th>
                <th>Course / Center</th>
                <th>Internal (200)</th>
                <th>External (500)</th>
                <th>Aggregate</th>
                <th>Division / Grade</th>
                <th>Public Status</th>
                <th>Certificate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb' }}>
                      {r.rollNo}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{r.candidateName}</strong>
                  </td>
                  <td>
                    <div>{r.courseCode}</div>
                    <small style={{ color: '#64748b' }}>{r.centerCode}</small>
                  </td>
                  <td>{r.internalMarks}</td>
                  <td>{r.externalMarks}</td>
                  <td>
                    <strong>{r.totalMarks} / {r.maxMarks}</strong>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>{r.percentage}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', fontWeight: 600 }}>{r.grade}</span>
                  </td>
                  <td>
                    <span className={r.publishStatus.includes('Published') ? 'badge-approved' : 'badge-pending'}>
                      {r.publishStatus}
                    </span>
                  </td>
                  <td>
                    {r.certStatus.includes('Signed') ? (
                      <span className="badge-approved" title={r.certNo}>Signed ✓</span>
                    ) : (
                      <span className="badge-pending">Pending Sign</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 8px' }}
                      onClick={() => setSelectedCertStudent(r)}
                    >
                      📜 Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Certificate Preview & Print Modal */}
      {selectedCertStudent && (
        <div className="admin-modal-overlay" onClick={() => setSelectedCertStudent(null)}>
          <div className="admin-modal-container" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>National Council Official Diploma Credential</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedCertStudent(null)}>&times;</button>
            </div>

            <div className="admin-modal-body">
              {/* Certificate Border Frame */}
              <div style={{ border: '8px double #0b326b', padding: '28px', background: '#fdfbf7', borderRadius: '4px', textAlign: 'center', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)' }}>
                
                <img
                  src="/assets/images/nctms-logo.svg"
                  alt="NCTMS Emblem"
                  style={{ width: '64px', height: '64px', margin: '0 auto 10px', display: 'block' }}
                />

                <span style={{ fontSize: '12px', fontWeight: 800, color: '#c2410c', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  National Council of Technical &amp; Management Studies
                </span>
                <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0b326b', margin: '4px 0 14px', fontFamily: 'var(--font-heading)' }}>
                  CERTIFICATE OF PROFICIENCY &amp; DIPLOMA
                </h1>

                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px' }}>
                  This is to certify that
                </p>

                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', textDecoration: 'underline' }}>
                  {selectedCertStudent.candidateName}
                </h2>

                <p style={{ fontSize: '13px', color: '#334155', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                  having satisfied the prescribed conditions of eligibility and passed the national evaluation conducted for
                  the program of <strong>{selectedCertStudent.courseName}</strong> with an aggregate score of <strong>{selectedCertStudent.percentage}</strong> is hereby admitted to the Diploma with <strong>{selectedCertStudent.grade}</strong>.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Permanent Roll No</span>
                    <strong style={{ fontFamily: 'monospace', color: '#2563eb' }}>{selectedCertStudent.rollNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Certificate Serial No</span>
                    <strong style={{ fontFamily: 'monospace', color: '#16a34a' }}>{selectedCertStudent.certNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>Accredited Center</span>
                    <strong>{selectedCertStudent.centerCode}</strong>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '30px', padding: '0 20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '16px', color: '#0b326b', borderBottom: '1px solid #475569', paddingBottom: '4px' }}>
                      Dr. K. Ramanathan
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Controller of Examinations</span>
                  </div>

                  <div style={{ border: '2px dashed #0b326b', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#0b326b', textAlign: 'center', textTransform: 'uppercase' }}>
                    COUNCIL<br />SEAL<br />VERIFIED
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'cursive', fontSize: '16px', color: '#0b326b', borderBottom: '1px solid #475569', paddingBottom: '4px' }}>
                      Prof. S. R. Varma
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Director General, NCTMS</span>
                  </div>
                </div>

                {/* Official Tamper-Evident QR Verification Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', margin: '20px auto 0', padding: '10px 18px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', maxWidth: '360px' }}>
                  <div style={{ width: '56px', height: '56px', flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" width="56" height="56">
                      <rect width="100" height="100" fill="#fff" />
                      <rect x="5" y="5" width="28" height="28" fill="#000" />
                      <rect x="9" y="9" width="20" height="20" fill="#fff" />
                      <rect x="13" y="13" width="12" height="12" fill="#000" />
                      <rect x="67" y="5" width="28" height="28" fill="#000" />
                      <rect x="71" y="9" width="20" height="20" fill="#fff" />
                      <rect x="75" y="13" width="12" height="12" fill="#000" />
                      <rect x="5" y="67" width="28" height="28" fill="#000" />
                      <rect x="9" y="71" width="20" height="20" fill="#fff" />
                      <rect x="13" y="75" width="12" height="12" fill="#000" />
                      <rect x="40" y="10" width="8" height="8" fill="#000" />
                      <rect x="52" y="15" width="6" height="6" fill="#000" />
                      <rect x="40" y="35" width="20" height="6" fill="#000" />
                      <rect x="65" y="45" width="10" height="10" fill="#000" />
                      <rect x="45" y="65" width="15" height="15" fill="#000" />
                      <rect x="70" y="70" width="8" height="8" fill="#000" />
                      <rect x="85" y="85" width="8" height="8" fill="#000" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'left', fontSize: '11px', color: '#475569', lineHeight: 1.35 }}>
                    <strong style={{ color: '#0b326b', display: 'block', fontSize: '11.5px' }}>Scan to Verify Authenticity</strong>
                    <span style={{ fontFamily: 'monospace', fontSize: '10.5px' }}>https://verify.nctms.in/verify/{selectedCertStudent.rollNo}</span>
                    <small style={{ color: '#16a34a', display: 'block', fontWeight: 600, marginTop: '2px' }}>Sha256 Digital Council Seal Verified</small>
                  </div>
                </div>

              </div>
            </div>

            <div className="admin-modal-foot">
              <button type="button" className="btn-secondary" onClick={() => setSelectedCertStudent(null)}>
                Close Preview
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handlePrintCertificate}
              >
                🖨️ Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { CERTIFICATES_DATA } from '../data/certificatesData';

export default function VerificationPage() {
  const [searchRoll, setSearchRoll] = useState('NCTMS2026CS1092');
  const [activeRecord, setActiveRecord] = useState(CERTIFICATES_DATA['NCTMS2026CS1092']);
  const [notFound, setNotFound] = useState(false);
  const [searchedKey, setSearchedKey] = useState('NCTMS2026CS1092');

  const handleVerify = (e) => {
    if (e) e.preventDefault();
    const query = searchRoll.trim().toUpperCase();
    setSearchedKey(query);

    if (!query) {
      alert('Please enter a Roll or Registration Number.');
      return;
    }

    if (CERTIFICATES_DATA[query]) {
      setActiveRecord(CERTIFICATES_DATA[query]);
      setNotFound(false);
    } else {
      setActiveRecord(null);
      setNotFound(true);
    }
  };

  const handleSelectSample = (sampleRoll) => {
    setSearchRoll(sampleRoll);
    setSearchedKey(sampleRoll);
    setActiveRecord(CERTIFICATES_DATA[sampleRoll]);
    setNotFound(false);
  };

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Certificate & Result Verification</span>
            </div>
            <h1>National Certificate & Result Verification Portal</h1>
            <p className="subpage-hero-subtitle">
              Public verification registry enabling employers, universities, and students to authenticate digital certificates, diplomas, and official marks memos issued by NCTMS India.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🛡️</span>
            <div>
              <strong>Instant Digital Verification</strong>
              <span>Central Student Academic Registry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="container">
          <div className="verify-wrapper">

            {/* Search Card */}
            <div className="verify-search-card">
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0c57c4', textTransform: 'uppercase' }}>
                Online Verification Engine
              </span>
              <h2 style={{ fontSize: '20px', color: '#0b326b', margin: '4px 0 10px' }}>
                Verify Student Credentials by Registration / Roll Number
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Enter the complete Roll Number as printed on the student hall ticket, mark sheet, or council certificate.
              </p>

              <form onSubmit={handleVerify} className="verify-input-group">
                <input 
                  type="text" 
                  placeholder="e.g. NCTMS2026CS1092 or NCTMS2025TN8821" 
                  value={searchRoll}
                  onChange={(e) => setSearchRoll(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                  Verify Credentials &rarr;
                </button>
              </form>

              {/* Sample Quick Chips */}
              <div className="verify-samples-row">
                <span>Try verified samples:</span>
                {Object.keys(CERTIFICATES_DATA).map((roll) => (
                  <button
                    key={roll}
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample(roll)}
                  >
                    {roll}
                  </button>
                ))}
              </div>
            </div>

            {/* Verification Not Found Notice */}
            {notFound && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '10px', padding: '24px', textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>⚠️</span>
                <h3 style={{ color: '#b91c1c', fontSize: '18px', marginBottom: '6px' }}>
                  No Record Found for "{searchedKey}"
                </h3>
                <p style={{ fontSize: '13.5px', color: '#7f1d1d', maxWidth: '600px', margin: '0 auto 16px' }}>
                  The requested registration number was not located in the verified active council database. Please check for spelling mistakes, ensure zero-omissions, or contact the NCTMS examination cell.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => handleSelectSample('NCTMS2026CS1092')}
                  >
                    Load Sample Record (NCTMS2026CS1092)
                  </button>
                  <Link to="/contact" className="btn-primary">
                    Contact Examination Cell
                  </Link>
                </div>
              </div>
            )}

            {/* Verified Certificate Official Sheet */}
            {activeRecord && (
              <div className="cert-sheet">
                
                {/* Official Letterhead */}
                <div className="cert-header">
                  <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="cert-emblem" />
                  <h2 className="cert-council-title">NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES</h2>
                  <p className="cert-council-sub">An Autonomous Skill Development & Vocational Education Body</p>
                  <p style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                    CENTRAL EXAMINATION DIVISION &bull; STATEMENT OF MARKS & EVALUATION
                  </p>
                </div>

                {/* Status Ribbon */}
                <div className="cert-status-ribbon">
                  <strong>
                    <span style={{ fontSize: '16px' }}>✓</span> {activeRecord.status.toUpperCase()}
                  </strong>
                  <span>Issued on: {activeRecord.issueDate} &bull; Reg: {activeRecord.certificateNo}</span>
                </div>

                {/* Candidate & Course Profile */}
                <div className="cert-profile-grid">
                  <div className="profile-row">
                    <span className="profile-label">Candidate Name:</span>
                    <span className="profile-val">{activeRecord.studentName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Roll / Reg Number:</span>
                    <span className="profile-val">{activeRecord.rollNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Father / Guardian:</span>
                    <span className="profile-val">{activeRecord.fatherName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Enrollment Number:</span>
                    <span className="profile-val">{activeRecord.enrollmentNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Programme Name:</span>
                    <span className="profile-val">{activeRecord.courseName} ({activeRecord.courseCode})</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Academic Session:</span>
                    <span className="profile-val">{activeRecord.academicYear}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Affiliated Center:</span>
                    <span className="profile-val">{activeRecord.affiliatedCenter}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Month & Year of Exam:</span>
                    <span className="profile-val">{activeRecord.examinationMonthYear}</span>
                  </div>
                </div>

                {/* Marks Breakdown Table */}
                <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '8px' }}>
                  Subject-Wise Marks & Grade Record:
                </h4>
                <table className="cert-marks-table">
                  <thead>
                    <tr>
                      <th>Subject Code</th>
                      <th>Subject Title</th>
                      <th>Max Marks</th>
                      <th>Pass Marks</th>
                      <th>Marks Obtained</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRecord.marks.map((m, idx) => (
                      <tr key={idx}>
                        <td><strong>{m.code}</strong></td>
                        <td>{m.name}</td>
                        <td>{m.maxMarks}</td>
                        <td>{m.passMarks}</td>
                        <td><strong style={{ color: '#0c57c4' }}>{m.marksObtained}</strong></td>
                        <td><span style={{ fontWeight: 700, color: '#16a34a' }}>{m.grade}</span></td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan="2" style={{ textAlign: 'right' }}>GRAND TOTAL:</td>
                      <td>{activeRecord.totalMax}</td>
                      <td>--</td>
                      <td>{activeRecord.totalObtained}</td>
                      <td>{activeRecord.percentage}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Overall Summary Row */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Overall Result & Division: </span>
                    <strong style={{ color: '#15803d', fontSize: '14px' }}>{activeRecord.overallGrade}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Cumulative Grade Point Average (CGPA): </span>
                    <strong style={{ color: '#0c57c4', fontSize: '14px' }}>{activeRecord.cgpa} / 10.00</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Certificate Serial: </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{activeRecord.certificateNo}</span>
                  </div>
                </div>

                {/* QR Code and Signatures Footer */}
                <div className="cert-footer-row">
                  <div className="cert-qr-box">
                    <div className="mock-qr-code">
                      <svg viewBox="0 0 100 100" width="76" height="76">
                        <rect width="100" height="100" fill="#fff" />
                        {/* Position Markers */}
                        <rect x="5" y="5" width="28" height="28" fill="#000" />
                        <rect x="9" y="9" width="20" height="20" fill="#fff" />
                        <rect x="13" y="13" width="12" height="12" fill="#000" />
                        
                        <rect x="67" y="5" width="28" height="28" fill="#000" />
                        <rect x="71" y="9" width="20" height="20" fill="#fff" />
                        <rect x="75" y="13" width="12" height="12" fill="#000" />
                        
                        <rect x="5" y="67" width="28" height="28" fill="#000" />
                        <rect x="9" y="71" width="20" height="20" fill="#fff" />
                        <rect x="13" y="75" width="12" height="12" fill="#000" />
                        
                        {/* Data Pixels */}
                        <rect x="40" y="10" width="8" height="8" fill="#000" />
                        <rect x="52" y="15" width="6" height="6" fill="#000" />
                        <rect x="40" y="35" width="20" height="6" fill="#000" />
                        <rect x="65" y="45" width="10" height="10" fill="#000" />
                        <rect x="45" y="65" width="15" height="15" fill="#000" />
                        <rect x="70" y="70" width="8" height="8" fill="#000" />
                        <rect x="85" y="85" width="8" height="8" fill="#000" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>
                      <strong style={{ display: 'block', color: '#0f274a' }}>Digital Authentication Hash</strong>
                      <span>Scan to verify URL: nctms.in/verify/{activeRecord.rollNo}</span>
                      <small style={{ display: 'block', color: '#16a34a', fontWeight: 600 }}>Sha256: 8a7f9c2...b341</small>
                    </div>
                  </div>

                  <div className="cert-sign-box">
                    <div className="cert-sign-line"></div>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>Controller of Examinations</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>NCTMS India Examination Board</span>
                  </div>

                  <div className="cert-sign-box">
                    <div className="cert-sign-line"></div>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>Registrar / Council Secretary</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>National Council NCTMS India</span>
                  </div>
                </div>

                {/* Print and Download Actions */}
                <div className="cert-actions-bar">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Verified Marksheet
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => alert(`Official digital certificate PDF generated for ${activeRecord.studentName} (${activeRecord.rollNo})`)}
                  >
                    📜 Download Official Certificate PDF
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

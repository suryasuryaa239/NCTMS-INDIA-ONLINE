// src/pages/ResultsPage.jsx
import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { CERTIFICATES_DATA } from '../data/certificatesData';
import {
  queryExaminationResult,
  EXAMINATION_SESSIONS
} from '../services/resultsService';

export default function ResultsPage() {
  const { currentUser } = useAuth();

  // Search Fields
  const [rollNo, setRollNo] = useState(() => {
    if (currentUser?.role === 'student' && currentUser?.id) {
      return currentUser.id;
    }
    return '';
  });

  const [dateOfBirth, setDateOfBirth] = useState(() => {
    if (currentUser?.role === 'student' && currentUser?.id) {
      return CERTIFICATES_DATA[currentUser.id]?.dateOfBirth || '';
    }
    return '';
  });

  const [session, setSession] = useState('all');

  // Search execution states: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' | 'UNRELEASED'
  const [searchState, setSearchState] = useState('IDLE');
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [unreleasedInfo, setUnreleasedInfo] = useState(null);

  // Privacy: Mask roll number toggle
  const [maskRoll, setMaskRoll] = useState(false);

  // Form IDs for accessibility
  const rollInputId = useId();
  const dobInputId = useId();
  const sessionSelectId = useId();

  // Execute Result Lookup
  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    setSearchState('LOADING');
    setErrorMessage('');
    setSearchResult(null);
    setUnreleasedInfo(null);

    try {
      const response = await queryExaminationResult({
        rollNo,
        dateOfBirth,
        session,
        authenticatedUser: currentUser
      });

      if (response.success && response.status === 'PUBLISHED') {
        setSearchResult(response.record);
        setSearchState('SUCCESS');
      } else if (response.status === 'UNDER_SCRUTINY' || response.status === 'PENDING_RELEASE') {
        setUnreleasedInfo(response);
        setSearchState('UNRELEASED');
      } else {
        setErrorMessage(response.message || 'No record found.');
        setSearchState('ERROR');
      }
    } catch {
      setErrorMessage('Unable to connect to the Examination Controller server. Please check your network connection and retry.');
      setSearchState('ERROR');
    }
  };

  // Sample record loader for demonstration & quick testing
  const handleLoadSample = (sampleRoll, sampleDob, sampleSession) => {
    setRollNo(sampleRoll);
    setDateOfBirth(sampleDob);
    setSession(sampleSession || 'all');
    setSearchState('IDLE');
    setErrorMessage('');
    setSearchResult(null);
    setUnreleasedInfo(null);
  };

  // Auto-fill logged in student credentials
  const handleUseMyCredentials = () => {
    if (currentUser?.id) {
      setRollNo(currentUser.id);
      const studentRecord = CERTIFICATES_DATA[currentUser.id];
      if (studentRecord?.dateOfBirth) {
        setDateOfBirth(studentRecord.dateOfBirth);
      }
      setSession('all');
    }
  };

  // Reset search
  const handleReset = () => {
    setRollNo('');
    setDateOfBirth('');
    setSession('all');
    setSearchState('IDLE');
    setSearchResult(null);
    setErrorMessage('');
    setUnreleasedInfo(null);
  };

  // Helper to format masked roll number
  const formatRollNo = (rawRoll) => {
    if (!rawRoll) return '';
    if (!maskRoll) return rawRoll;
    if (rawRoll.length <= 6) return '••••••';
    return `${rawRoll.slice(0, 4)}••••${rawRoll.slice(-2)}`;
  };

  // Print scorecard handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <PublicLayout>
      {/* 1. PAGE HERO BANNER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Results</span>
            </nav>
            <h1>Examination Results</h1>
            <p className="subpage-hero-subtitle">
              Official Central Examination Wing portal for statement of marks, term-end scorecards, consolidated grade sheets, and digital provisional results.
            </p>
          </div>
          <div className="subpage-hero-badge" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <strong style={{ fontSize: '14px', color: '#ffffff' }}>Controller of Examinations</strong>
            </div>
            <span style={{ fontSize: '12px', color: '#bfdbfe' }}>
              Two-Factor Student Privacy Protected &bull; Real-Time Verification
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <div className="container" style={{ marginTop: '28px' }}>
        
        {/* Instructions Callout */}
        <div className="payment-instructions-callout" style={{ borderLeftColor: '#0c57c4' }}>
          <div className="payment-instructions-icon">📋</div>
          <div>
            <strong>Student Examination Results Verification Guidelines:</strong>
            <p>
              1. Enter your <strong>Registration / Roll Number</strong> as printed on your Examination Hall Ticket.<br />
              2. For student data privacy, public lookups require <strong>Date of Birth (DOB)</strong> verification to access grade reports.<br />
              3. Applications for <strong>re-evaluation, mark verification, or answer script photocopies</strong> must be submitted within 15 days of online declaration.
            </p>
          </div>
        </div>

        {/* Authenticated Student Banner */}
        {currentUser?.role === 'student' && currentUser?.id && (
          <div className="auth-student-hint-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>👨‍🎓</span>
              <div>
                <strong>Logged In as {currentUser.name || 'Student'} ({currentUser.id})</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                  You are authorized to view your published academic results without manual verification.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleUseMyCredentials}
              style={{ fontSize: '12px', padding: '6px 14px', whiteSpace: 'nowrap' }}
            >
              Fill My Credentials
            </button>
          </div>
        )}

        {/* 3. SEARCH FORM CARD */}
        <div className="results-search-card">
          <div className="results-search-header">
            <div>
              <h2 style={{ fontSize: '18px', color: '#0b326b', margin: 0, fontWeight: 800 }}>
                Official Scorecard Lookup
              </h2>
              <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                Search official marks memo by Registration Number and Date of Birth
              </span>
            </div>
            <span className="secure-badge">
              🔒 Privacy Secured
            </span>
          </div>

          <form onSubmit={handleSearch}>
            <div className="results-form-grid">
              {/* Roll Number Input */}
              <div className="form-group">
                <label htmlFor={rollInputId} style={{ fontWeight: 700, fontSize: '13px' }}>
                  Register / Roll Number *
                </label>
                <input
                  id={rollInputId}
                  type="text"
                  placeholder="e.g. NCTMS2026CS1092"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                  className="payment-input"
                />
              </div>

              {/* Date of Birth Input */}
              <div className="form-group">
                <label htmlFor={dobInputId} style={{ fontWeight: 700, fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Date of Birth (DOB) *</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                    e.g. 14-Aug-2001
                  </span>
                </label>
                <input
                  id={dobInputId}
                  type="text"
                  placeholder="DD-Mon-YYYY (e.g. 14-Aug-2001)"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required={!(currentUser?.role === 'student' && currentUser?.id === rollNo.trim().toUpperCase())}
                  className="payment-input"
                />
              </div>

              {/* Academic Session Selector */}
              <div className="form-group">
                <label htmlFor={sessionSelectId} style={{ fontWeight: 700, fontSize: '13px' }}>
                  Examination Session
                </label>
                <select
                  id={sessionSelectId}
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="payment-select"
                >
                  {EXAMINATION_SESSIONS.map((sess) => (
                    <option key={sess.id} value={sess.id}>
                      {sess.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Demonstration Chips */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
              <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Quick Test Records from Official Registry:
              </span>
              <div className="results-sample-chips">
                <button
                  type="button"
                  className="results-sample-chip"
                  onClick={() => handleLoadSample('NCTMS2026CS1092', '14-Aug-2001', 'all')}
                >
                  🟢 NCTMS2026CS1092 (Alexander James • First Class Dist.)
                </button>
                <button
                  type="button"
                  className="results-sample-chip"
                  onClick={() => handleLoadSample('NCTMS2026CS1093', '18-Dec-2002', 'all')}
                >
                  🟢 NCTMS2026CS1093 (K. Divyabharathi • First Class)
                </button>
                <button
                  type="button"
                  className="results-sample-chip"
                  onClick={() => handleLoadSample('NCTMS2026MGMT304', '10-Nov-2000', 'all')}
                >
                  🟢 NCTMS2026MGMT304 (Priya Sundaram • PGDM Dist.)
                </button>
                <button
                  type="button"
                  className="results-sample-chip"
                  onClick={() => handleLoadSample('NCTMS2026CS1094', '09-Jan-2001', 'all')}
                >
                  🟡 NCTMS2026CS1094 (Mohammed Ashiq • Ready for Publication)
                </button>
                <button
                  type="button"
                  className="results-sample-chip"
                  onClick={() => handleLoadSample('NCTMS2026ML3042', '12-Jul-2003', 'all')}
                >
                  🟠 NCTMS2026ML3042 (Sneha Mohan • Internal Scrutiny)
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
              <button
                type="submit"
                className="btn-primary"
                disabled={searchState === 'LOADING'}
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                {searchState === 'LOADING' ? 'Retrieving Scorecard...' : '🔍 Retrieve Statement of Marks →'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleReset}
                style={{ padding: '12px 20px', fontSize: '14px' }}
              >
                Reset Search
              </button>
            </div>
          </form>
        </div>

        {/* =========================================================================
            4. SEARCH RESULTS DISPLAY STATES
            ========================================================================= */}

        {/* STATE A: LOADING SPINNER */}
        {searchState === 'LOADING' && (
          <div className="results-status-card">
            <div className="gateway-spinner" />
            <h3 style={{ color: '#0b326b', fontSize: '17px', margin: '16px 0 6px', fontWeight: 800 }}>
              Accessing Central Examination Wing Database...
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
              Validating candidate credentials, verifying cryptographic mark seals, and preparing digitally authorized scorecard.
            </p>
          </div>
        )}

        {/* STATE B: ERROR / NOT FOUND */}
        {searchState === 'ERROR' && (
          <div className="results-status-card" style={{ borderColor: '#fca5a5' }}>
            <div className="results-error-icon">✕</div>
            <h3 style={{ color: '#dc2626', fontSize: '18px', margin: '10px 0 6px', fontWeight: 800 }}>
              No Published Record Found
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', maxWidth: '480px', margin: '0 auto 16px', lineHeight: 1.5 }}>
              {errorMessage}
            </p>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px', borderRadius: '8px', fontSize: '12px', color: '#991b1b', maxWidth: '480px', margin: '0 auto 16px', textAlign: 'left' }}>
              <strong>Troubleshooting Advice:</strong>
              <ul style={{ paddingLeft: '18px', margin: '6px 0 0' }}>
                <li>Ensure the Register Number matches your hall ticket exactly (e.g. <code>NCTMS2026CS1092</code>).</li>
                <li>Verify that Date of Birth matches your official registration profile.</li>
                <li>If you recently appeared for a term exam, results may still be under council evaluation audit.</li>
              </ul>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleLoadSample('NCTMS2026CS1092', '14-Aug-2001', 'all')}
            >
              Try Verified Demo Record (NCTMS2026CS1092)
            </button>
          </div>
        )}

        {/* STATE C: UNDER SCRUTINY / PENDING RELEASE */}
        {searchState === 'UNRELEASED' && unreleasedInfo && (
          <div className="results-status-card" style={{ borderColor: '#fde047' }}>
            <div style={{ width: '56px', height: '56px', background: '#fef3c7', color: '#d97706', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px' }}>
              ⏳
            </div>
            <h3 style={{ color: '#92400e', fontSize: '19px', margin: '0 0 6px', fontWeight: 800 }}>
              {unreleasedInfo.status === 'PENDING_RELEASE'
                ? 'Result Moderation Complete — Pending Controller Release'
                : 'Examination Result Under Internal Scrutiny'}
            </h3>
            <div style={{ fontSize: '13px', color: '#475569', maxWidth: '520px', margin: '0 auto 14px' }}>
              <strong>Candidate:</strong> {unreleasedInfo.candidateName} &bull; <strong>Course:</strong> {unreleasedInfo.courseName}
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Session: {unreleasedInfo.session}
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#78350f', background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 16px', borderRadius: '8px', maxWidth: '520px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              ℹ️ {unreleasedInfo.message}
            </p>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              For queries, contact Controller of Examinations at <strong>coe@nctms.in</strong>
            </span>
          </div>
        )}

        {/* STATE D: SUCCESSFUL SCORECARD */}
        {searchState === 'SUCCESS' && searchResult && (
          <div className="results-scorecard-card">
            
            {/* Action Bar (Top) */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="payment-status-pill success" style={{ fontSize: '12px' }}>
                  ✓ Officially Published &amp; Digitally Authorized
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Certificate Ref: <strong>{searchResult.certificateNo}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setMaskRoll(!maskRoll)}
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  {maskRoll ? '👁️ Show Full Roll No' : '🔒 Mask Roll No'}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handlePrint}
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  🖨️ Print Statement of Marks
                </button>
                <Link
                  to={`/verify/${searchResult.rollNo}`}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                >
                  🔍 Verify on Registry
                </Link>
              </div>
            </div>

            {/* Scorecard Printable Canvas */}
            <div className="scorecard-canvas">
              {/* Header */}
              <div className="scorecard-header">
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="68" height="68" />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2 style={{ fontSize: '19px', color: '#0b326b', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>
                    National Council for Technical &amp; Management Studies
                  </h2>
                  <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0' }}>
                    An Autonomous National Academic Body Registered under Govt. of India Act
                  </p>
                  <p style={{ fontSize: '10.5px', color: '#0c57c4', fontWeight: 700, margin: '2px 0 0' }}>
                    OFFICE OF THE CONTROLLER OF EXAMINATIONS &bull; CENTRAL EVALUATION SECRETARIAT
                  </p>
                </div>
                <div className="scorecard-seal-box">
                  <span>DIGITALLY<br />VERIFIED<br />RECORD</span>
                </div>
              </div>

              <div className="scorecard-title-bar">
                STATEMENT OF MARKS &amp; GRADE REPORT &bull; {searchResult.examinationMonthYear?.toUpperCase()}
              </div>

              {/* Student Meta Details Grid */}
              <div className="scorecard-meta-grid">
                <div className="scorecard-meta-item">
                  <span className="meta-lbl">Candidate Name</span>
                  <strong className="meta-val">{searchResult.studentName}</strong>
                </div>
                <div className="scorecard-meta-item">
                  <span className="meta-lbl">Register / Roll Number</span>
                  <strong className="meta-val" style={{ fontFamily: 'monospace' }}>
                    {formatRollNo(searchResult.rollNo)}
                  </strong>
                </div>
                <div className="scorecard-meta-item">
                  <span className="meta-lbl">Enrollment Number</span>
                  <span className="meta-val" style={{ fontFamily: 'monospace' }}>
                    {searchResult.enrollmentNo}
                  </span>
                </div>
                <div className="scorecard-meta-item">
                  <span className="meta-lbl">Date of Birth</span>
                  <span className="meta-val">{searchResult.dateOfBirth}</span>
                </div>
                <div className="scorecard-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="meta-lbl">Academic Program</span>
                  <strong className="meta-val" style={{ color: '#0b326b' }}>
                    {searchResult.courseName} ({searchResult.courseCode})
                  </strong>
                </div>
                <div className="scorecard-meta-item" style={{ gridColumn: 'span 2' }}>
                  <span className="meta-lbl">Affiliated Examination Center</span>
                  <span className="meta-val">{searchResult.affiliatedCenter}</span>
                </div>
              </div>

              {/* Subject Marks Table */}
              <div className="scorecard-table-wrap">
                <table className="scorecard-table">
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>Paper Code</th>
                      <th>Subject Title</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Max Marks</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Min Pass</th>
                      <th style={{ width: '15%', textAlign: 'center' }}>Marks Obtained</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Grade</th>
                      <th style={{ width: '12%', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResult.marks.map((sub, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0c57c4' }}>
                          {sub.code}
                        </td>
                        <td style={{ fontWeight: 600, color: '#1e293b' }}>
                          {sub.name}
                        </td>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>
                          {sub.maxMarks}
                        </td>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>
                          {sub.passMarks}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#0b326b', fontSize: '13.5px' }}>
                          {sub.marksObtained}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`grade-pill grade-${(sub.grade || '').toLowerCase().replace('+', 'plus')}`}>
                            {sub.grade}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: sub.marksObtained >= sub.passMarks ? '#15803d' : '#dc2626' }}>
                            {sub.marksObtained >= sub.passMarks ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                      <td colSpan="2" style={{ textAlign: 'right', color: '#0b326b' }}>
                        GRAND TOTAL CONSOLIDATION:
                      </td>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>
                        {searchResult.totalMax}
                      </td>
                      <td style={{ textAlign: 'center', color: '#64748b' }}>
                        200
                      </td>
                      <td style={{ textAlign: 'center', fontSize: '15px', color: '#0b326b' }}>
                        {searchResult.totalObtained}
                      </td>
                      <td colSpan="2" style={{ textAlign: 'center', color: '#16a34a', fontSize: '13px' }}>
                        {searchResult.percentage} ({searchResult.cgpa} CGPA)
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Performance Summary Banner */}
              <div className="scorecard-summary-bar">
                <div className="summary-metric">
                  <span>Grand Total</span>
                  <strong>{searchResult.totalObtained} / {searchResult.totalMax}</strong>
                </div>
                <div className="summary-metric">
                  <span>Aggregate Percentage</span>
                  <strong style={{ color: '#16a34a' }}>{searchResult.percentage}</strong>
                </div>
                <div className="summary-metric">
                  <span>Cumulative CGPA</span>
                  <strong>{searchResult.cgpa} / 10.00</strong>
                </div>
                <div className="summary-metric">
                  <span>Overall Classification</span>
                  <strong style={{ color: '#0b326b' }}>{searchResult.overallGrade}</strong>
                </div>
                <div className="summary-metric">
                  <span>Publication Date</span>
                  <span>{searchResult.issueDate}</span>
                </div>
              </div>

              {/* Legal Disclaimer & Signatures */}
              <div className="scorecard-footer-signatures">
                <div style={{ fontSize: '10.5px', color: '#64748b', maxWidth: '420px', lineHeight: 1.4 }}>
                  <strong>Important Council Disclaimer:</strong><br />
                  This electronic statement of marks is an authentic digital publication issued under the authority of the Central Examination Syndicate. Physical marksheets and diplomas with council embossed hologram are dispatched to the student&apos;s affiliated center.
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', color: '#0c57c4' }}>🔏</div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0b326b' }}>Controller of Examinations</div>
                  <div style={{ fontSize: '9.5px', color: '#64748b' }}>NCTMS India Examination Wing</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE E: INITIAL PROMPT (WHEN IDLE) */}
        {searchState === 'IDLE' && (
          <div className="results-idle-banner">
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>🎓</div>
            <h3 style={{ color: '#0b326b', fontSize: '18px', margin: '0 0 6px', fontWeight: 800 }}>
              Verify Authentic Examination Results
            </h3>
            <p style={{ color: '#64748b', fontSize: '13.5px', maxWidth: '480px', margin: '0 auto 18px', lineHeight: 1.5 }}>
              Enter your Registration Number and Date of Birth in the search card above to generate your certified Statement of Marks.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleLoadSample('NCTMS2026CS1092', '14-Aug-2001', 'all')}
              >
                View Sample Scorecard (Alexander James Thompson)
              </button>
            </div>
          </div>
        )}

        {/* 5. POST-RESULTS HELP & GRIEVANCE SUPPORT */}
        <div className="results-support-grid" style={{ marginTop: '36px' }}>
          <div className="results-support-card">
            <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
              📑 Re-Evaluation &amp; Mark Scrutiny
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Candidates seeking re-totalling or verification of evaluated answer scripts may apply within 15 calendar days from the date of online publication through the <strong>Applications &amp; Downloads</strong> section quoting their Paper Code.
            </p>
          </div>

          <div className="results-support-card">
            <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
              📜 Original Parchment &amp; Transcripts
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
              Formal convocation degree scrolls and consolidated mark sheets with council embossed seals are issued through affiliated study centers following annual council convocation ceremonies.
            </p>
          </div>

          <div className="results-support-card">
            <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
              📞 Examination Wing Helpdesk
            </h3>
            <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 8px' }}>
              For scorecard disputes, spelling corrections, or missing marks memo records:
            </p>
            <div style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
              <div>✉️ coe@nctms.in</div>
              <div>📞 +91 44 2855 0192 (Mon - Fri 10AM - 5PM)</div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

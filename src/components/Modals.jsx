import React, { useState, useEffect } from 'react';

export default function Modals({ activeModal, onClose, showToast }) {
  // State for Login Tab
  const [loginTab, setLoginTab] = useState('student');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Synchronize initial login tab if modal passed as login-student, login-institution, login-admin
  useEffect(() => {
    if (activeModal === 'login-student') setLoginTab('student');
    if (activeModal === 'login-institution') setLoginTab('institution');
    if (activeModal === 'login-admin') setLoginTab('admin');
  }, [activeModal]);

  // State for Exam Timer
  const [examSeconds, setExamSeconds] = useState(6260); // 1h 44m 20s
  useEffect(() => {
    if (activeModal !== 'exam') return;
    const interval = setInterval(() => {
      setExamSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeModal]);

  const formatTimer = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // State for Affiliated Institutions Search
  const [instFilter, setInstFilter] = useState('');
  const initialInstitutions = [
    { name: 'National Academy of Technical & Computer Science (Code: NCTMS-TN-104)', loc: 'Anna Salai, Guindy, Chennai, Tamil Nadu • Category: Technical College' },
    { name: 'Apex Institute of Management & Vocational Studies (Code: NCTMS-KA-212)', loc: 'Indiranagar, Bengaluru, Karnataka • Category: Research Academy & VTP' },
    { name: 'St. Jude Institute of Allied Healthcare Sciences (Code: NCTMS-KL-308)', loc: 'MG Road, Kochi, Kerala • Category: Paramedical & Healthcare Centre' },
    { name: 'Pioneer Industrial Training Institute (Code: NCTMS-MH-450)', loc: 'Andheri East, Mumbai, Maharashtra • Category: ITI & Skill Development' },
    { name: 'Oxford Institute of Computing & Technical Studies (Code: NCTMS-AP-512)', loc: 'Banjara Hills, Hyderabad, Telangana • Category: Computer Academy' }
  ];
  const filteredInstitutions = initialInstitutions.filter(
    (inst) => inst.name.toLowerCase().includes(instFilter.toLowerCase()) || inst.loc.toLowerCase().includes(instFilter.toLowerCase())
  );

  // State for Payment Fee selection
  const [feeCategory, setFeeCategory] = useState('admission');
  const feeAmounts = {
    admission: '₹ 4,500.00',
    exam: '₹ 1,200.00',
    cert: '₹ 850.00',
    rereg: '₹ 2,000.00'
  };

  // State for Certificate Verification
  const [certRoll, setCertRoll] = useState('NCTMS2026CS1092');
  const [certData, setCertData] = useState({
    name: 'Alexander James Thompson',
    roll: 'NCTMS2026CS1092',
    program: 'Post Graduate Diploma in Computer Science',
    center: 'Chennai Academic Center (TN-104)',
    grade: 'First Class with Distinction (88.4%)',
    status: 'Digitally Signed & Issued'
  });

  const handleVerify = () => {
    if (!certRoll.trim()) {
      showToast('Please enter a roll number.');
      return;
    }
    showToast(`Record verified for ${certRoll.toUpperCase()}`);
    setCertData({
      name: certRoll.toUpperCase().includes('TN') ? 'R. Murugavel' : 'Alexander James Thompson',
      roll: certRoll.toUpperCase(),
      program: 'Post Graduate Diploma in Computer Science',
      center: 'Chennai Academic Center (TN-104)',
      grade: 'First Class with Distinction (88.4%)',
      status: 'Digitally Signed & Issued'
    });
  };

  const handleDownload = (filename) => {
    showToast(`Downloading official document: ${filename}`);
  };

  if (!activeModal) return null;

  return (
    <>
      {/* 1. UNIVERSAL LOGIN MODAL */}
      {(activeModal.startsWith('login')) && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>
                {loginTab === 'student' && 'Student Login'}
                {loginTab === 'institution' && 'Institution Login'}
                {loginTab === 'admin' && 'Administrative Authority Login'}
              </h3>
              <p className="modal-desc">Access your NCTMS digital learning & evaluation dashboard</p>
            </div>
            
            <div className="login-tabs">
              <button 
                type="button"
                className={`tab-btn ${loginTab === 'student' ? 'active' : ''}`}
                onClick={() => setLoginTab('student')}
              >
                Student
              </button>
              <button 
                type="button"
                className={`tab-btn ${loginTab === 'institution' ? 'active' : ''}`}
                onClick={() => setLoginTab('institution')}
              >
                Institution
              </button>
              <button 
                type="button"
                className={`tab-btn ${loginTab === 'admin' ? 'active' : ''}`}
                onClick={() => setLoginTab('admin')}
              >
                Admin
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Welcome! Logged in as ${loginTab.toUpperCase()} (${loginUsername || 'NCTMS-USER'})`);
                onClose();
              }} 
              className="modal-form"
            >
              <div className="form-group">
                <label>
                  {loginTab === 'student' && 'Enrollment / Registration No'}
                  {loginTab === 'institution' && 'Institution / Center Code'}
                  {loginTab === 'admin' && 'Administrator Username'}
                </label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder={loginTab === 'student' ? 'e.g. NCTMS2026CS1092' : 'e.g. NCTMS-TN-104'} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password / Date of Birth</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your registered email & phone.'); }}>
                  Forgot Password?
                </a>
              </div>
              <button type="submit" className="btn-primary full-btn">Secure Login</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. ONLINE ADMISSION MODAL */}
      {activeModal === 'admission' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>Online Admission Portal (Academic Session 2026-2027)</h3>
              <p className="modal-desc">Complete your enrollment with instant online application tracking</p>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Admission form submitted! Your Application ID is NCTMS-APP-2026-8841');
                onClose();
              }} 
              className="modal-form grid-form"
            >
              <div className="form-group">
                <label>Applicant Full Name</label>
                <input type="text" placeholder="e.g. Priya Sundaram" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="priya@example.com" required />
              </div>
              <div className="form-group">
                <label>Mobile Number (WhatsApp Enabled)</label>
                <input type="tel" placeholder="+91 98765 43210" required />
              </div>
              <div className="form-group">
                <label>Stream / Department</label>
                <select required defaultValue="cs">
                  <option value="cs">Computer Science & IT</option>
                  <option value="mgmt">Management & Business Studies</option>
                  <option value="paramed">Paramedical & Allied Healthcare</option>
                  <option value="tech">Vocational Technical Training (ITI)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Course Level</label>
                <select required defaultValue="dip">
                  <option value="cert">Certificate Course (6 Months)</option>
                  <option value="dip">Diploma (1-2 Years)</option>
                  <option value="adv">Advance Diploma (2 Years)</option>
                  <option value="pg">Post Graduate Diploma (1 Year)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nearest Affiliated Center / City</label>
                <input type="text" placeholder="e.g. Chennai / Coimbatore / Madurai" required />
              </div>
              <div className="form-group full-width">
                <label>Highest Qualification Document (PDF / JPG)</label>
                <input type="file" className="file-input" />
              </div>
              <div className="full-width">
                <button type="submit" className="btn-primary full-btn">Submit Application & Generate Token</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ONLINE CLASSES DEMO MODAL */}
      {activeModal === 'classes' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>NCTMS Digital Classroom & Video Lectures</h3>
              <p className="modal-desc">Access live interactive sessions, recorded YouTube archives & e-notes</p>
            </div>
            <div className="classes-player-wrap">
              <div className="video-preview-box">
                <img src="/assets/images/classes.jpg" alt="Video lecture demo" className="lecture-screen" />
                <div 
                  className="play-overlay" 
                  onClick={() => showToast('Playing stream: Dr. Sharma - Advanced Data Structures (Lecture 14)')}
                >
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="#ffffff">
                    <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.6)" stroke="#ffffff" strokeWidth="1.5"/>
                    <polygon points="10,8 16,12 10,16" fill="#ffffff"/>
                  </svg>
                </div>
                <span className="live-pill">🔴 LIVE STREAMING</span>
              </div>
              <div className="lecture-playlist">
                <h4>Today's Sessions</h4>
                <div className="playlist-item active" onClick={() => showToast('Selected: Advanced Data Structures & Algorithm Design')}>
                  <span className="pl-time">10:00 AM</span>
                  <div className="pl-info">
                    <strong>Advanced Data Structures</strong>
                    <small>Prof. V. Sharma &bull; 45 mins</small>
                  </div>
                </div>
                <div className="playlist-item" onClick={() => showToast('Selected: Financial Accounting & Management Concepts')}>
                  <span className="pl-time">02:00 PM</span>
                  <div className="pl-info">
                    <strong>Financial Management & Costing</strong>
                    <small>Dr. R. Rajesh &bull; 60 mins</small>
                  </div>
                </div>
                <div className="playlist-item" onClick={() => showToast('Selected: Cloud Computing & Virtualization Essentials')}>
                  <span className="pl-time">04:30 PM</span>
                  <div className="pl-info">
                    <strong>Cloud Virtualization & Security</strong>
                    <small>Er. K. Anitha &bull; 50 mins</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ONLINE EXAMINATION DEMO MODAL */}
      {activeModal === 'exam' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header exam-head">
              <div>
                <h3>NCTMS Secure Examination System</h3>
                <p className="modal-desc">
                  Subject: CS-402 Database Management Systems &bull; Time Left: <strong>{formatTimer(examSeconds)}</strong>
                </p>
              </div>
              <span className="badge-secure">🛡️ Proctoring Active</span>
            </div>
            <div className="exam-body">
              <div className="exam-q-box">
                <p className="q-number">Question 14 of 50 (Marks: 2)</p>
                <p className="q-text">Which of the following database normal forms specifically eliminates transitive dependencies in a relational table schema?</p>
                <div className="q-options">
                  <label className="option-row">
                    <input type="radio" name="opt" defaultChecked /> A. First Normal Form (1NF)
                  </label>
                  <label className="option-row">
                    <input type="radio" name="opt" /> B. Second Normal Form (2NF)
                  </label>
                  <label className="option-row">
                    <input type="radio" name="opt" /> C. Third Normal Form (3NF)
                  </label>
                  <label className="option-row">
                    <input type="radio" name="opt" /> D. Boyce-Codd Normal Form (BCNF)
                  </label>
                </div>
              </div>
              <div className="exam-actions">
                <button type="button" className="btn-secondary" onClick={() => showToast('Answer auto-saved to encrypted exam server.')}>
                  💾 Auto-Save Answer
                </button>
                <button type="button" className="btn-primary" onClick={() => showToast('Question 15 loaded successfully.')}>
                  Next Question &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. STUDENT PORTAL (ERP) MODAL */}
      {activeModal === 'erp' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>Student Portal (ERP)</h3>
              <p className="modal-desc">Track real-time attendance, fee receipts, syllabus, and results</p>
            </div>
            <div className="erp-demo-grid">
              <div className="erp-metric">
                <span className="erp-num">92%</span>
                <span className="erp-lbl">Attendance</span>
              </div>
              <div className="erp-metric">
                <span className="erp-num">8.84</span>
                <span className="erp-lbl">Current CGPA</span>
              </div>
              <div className="erp-metric">
                <span className="erp-num">PAID</span>
                <span className="erp-lbl">Fee Status</span>
              </div>
            </div>
            <div className="erp-menu-links">
              <button type="button" className="erp-link-btn" onClick={() => showToast('Opening subject-wise attendance register...')}>
                📅 Detailed Subject Attendance Report
              </button>
              <button type="button" className="erp-link-btn" onClick={() => showToast('Downloading digital fee receipts...')}>
                💳 Download E-Payment Receipts & Statements
              </button>
              <button type="button" className="erp-link-btn" onClick={() => handleDownload('NCTMS_Hall_Ticket_2026.pdf')}>
                🎫 Download Term Examination Hall Ticket
              </button>
              <button type="button" className="erp-link-btn" onClick={() => handleDownload('NCTMS_Marksheet.pdf')}>
                📜 Online Mark Sheet & Provisional Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. AFFILIATED INSTITUTIONS MODAL */}
      {activeModal === 'institutions' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>Affiliated Institutions & Authorized Training Centers</h3>
              <p className="modal-desc">Recognized Colleges, Vocational Training Providers (VTP), Computer Academies & Healthcare Institutes</p>
            </div>
            <div className="inst-filter-row">
              <input 
                type="text" 
                placeholder="Search center by state, city, category or center code..." 
                value={instFilter}
                onChange={(e) => setInstFilter(e.target.value)} 
              />
            </div>
            <div className="institutions-list">
              {filteredInstitutions.map((inst, idx) => (
                <div key={idx} className="inst-item">
                  <div>
                    <strong>{inst.name}</strong>
                    <p>{inst.loc}</p>
                  </div>
                  <span className="inst-badge">Active Affiliation</span>
                </div>
              ))}
              {filteredInstitutions.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No centers found matching your query.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. APPLICATIONS & DOWNLOADS MODAL */}
      {activeModal === 'downloads' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>Applications & Official Forms</h3>
              <p className="modal-desc">Download standard application forms in PDF format</p>
            </div>
            <div className="downloads-list">
              <div className="download-item">
                <span>📄 Migration Certificate Application Form</span>
                <button type="button" className="btn-download" onClick={() => handleDownload('Migration_Application.pdf')}>Download PDF</button>
              </div>
              <div className="download-item">
                <span>📄 Transfer Certificate (TC) Requisition</span>
                <button type="button" className="btn-download" onClick={() => handleDownload('TC_Application_Form.pdf')}>Download PDF</button>
              </div>
              <div className="download-item">
                <span>📄 Annual Convocation Degree Registration Form</span>
                <button type="button" className="btn-download" onClick={() => handleDownload('Convocation_Registration.pdf')}>Download PDF</button>
              </div>
              <div className="download-item">
                <span>📄 Duplicate Consolidated Mark Sheet Request</span>
                <button type="button" className="btn-download" onClick={() => handleDownload('Duplicate_Marksheet_Form.pdf')}>Download PDF</button>
              </div>
              <div className="download-item">
                <span>📄 Official Name / Address Correction Form</span>
                <button type="button" className="btn-download" onClick={() => handleDownload('Correction_Application.pdf')}>Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. ONLINE PAYMENT MODAL */}
      {activeModal === 'payment' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>NCTMS Online Payment Portal</h3>
              <p className="modal-desc">Safe & Instant Fee Payment via UPI, Cards & NetBanking</p>
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`Payment of ${feeAmounts[feeCategory]} successful! Transaction ID: TXN-NCTMS-${Math.floor(Math.random() * 899999 + 100000)}`);
                onClose();
              }} 
              className="modal-form"
            >
              <div className="form-group">
                <label>Registration / Roll Number</label>
                <input type="text" placeholder="e.g. NCTMS2026CS1092" required />
              </div>
              <div className="form-group">
                <label>Fee Category</label>
                <select 
                  value={feeCategory} 
                  onChange={(e) => setFeeCategory(e.target.value)}
                  required
                >
                  <option value="admission">Admission & Enrollment Fee - ₹ 4,500</option>
                  <option value="exam">Semester Examination Fee - ₹ 1,200</option>
                  <option value="cert">Certificate & Migration Fee - ₹ 850</option>
                  <option value="rereg">Re-Registration / Term Renewal - ₹ 2,000</option>
                </select>
              </div>
              <div className="form-group">
                <label>Total Amount Payable</label>
                <input 
                  type="text" 
                  value={feeAmounts[feeCategory]} 
                  readOnly 
                  className="bold-input" 
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select required defaultValue="upi">
                  <option value="upi">UPI (GPay / PhonePe / Paytm / QR)</option>
                  <option value="card">Credit Card / Debit Card (Visa / Mastercard / RuPay)</option>
                  <option value="nb">Internet Banking (All Major Indian Banks)</option>
                </select>
              </div>
              <button type="submit" className="btn-primary full-btn">Proceed to Secure Gateway &rarr;</button>
            </form>
          </div>
        </div>
      )}

      {/* 9. RESULTS & CERTIFICATE VERIFICATION MODAL */}
      {activeModal === 'certificate' && (
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={onClose}>&times;</button>
            <div className="modal-header">
              <h3>Results & Certificate Verification System</h3>
              <p className="modal-desc">Verify authentic NCTMS certificates and view instant digital mark sheets</p>
            </div>
            
            <div className="cert-search-box">
              <input 
                type="text" 
                placeholder="Enter Registration / Roll Number (e.g. NCTMS2026CS1092)" 
                value={certRoll}
                onChange={(e) => setCertRoll(e.target.value)}
              />
              <button type="button" className="btn-primary" onClick={handleVerify}>Verify Now</button>
            </div>

            <div className="cert-result-card">
              <div className="cert-status-tag">
                <span className="badge-verified">✓ AUTHENTIC & VERIFIED</span>
                <span className="cert-date">Verified on: 04-Oct-2026</span>
              </div>
              <div className="cert-details-grid">
                <div><strong>Candidate Name:</strong> {certData.name}</div>
                <div><strong>Roll / Reg No:</strong> {certData.roll}</div>
                <div><strong>Program:</strong> {certData.program}</div>
                <div><strong>Affiliated Center:</strong> {certData.center}</div>
                <div><strong>Grade / Division:</strong> {certData.grade}</div>
                <div><strong>Certificate Status:</strong> {certData.status}</div>
              </div>
              <div className="cert-preview-img-wrap">
                <img 
                  src="/assets/images/certificate.jpg" 
                  alt="Verified Certificate Preview" 
                  className="cert-preview-pic" 
                />
              </div>
              <div className="cert-download-actions">
                <button type="button" className="btn-secondary" onClick={() => handleDownload('NCTMS_Marksheet_Consolidated.pdf')}>
                  Download Digital Mark Sheet
                </button>
                <button type="button" className="btn-primary" onClick={() => handleDownload('NCTMS_Original_Degree_Certificate.pdf')}>
                  Download Verified Certificate
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { COURSES_DATA } from '../data/coursesData';
import { INSTITUTIONS_DATA } from '../data/institutionsData';

export default function AdmissionPage() {
  const [searchParams] = useSearchParams();
  const preSelectedCourseId = searchParams.get('course') || '';

  const [activeTab, setActiveTab] = useState('apply'); // 'apply' | 'track'
  const [step, setStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    courseId: preSelectedCourseId || COURSES_DATA[0].id,
    studyMode: 'Online & Blended',
    fullName: '',
    guardianName: '',
    dob: '',
    gender: 'Male',
    email: '',
    mobile: '',
    aadhaarNo: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    qualification: '10+2 / Intermediate',
    boardUniversity: '',
    passingYear: '2024',
    percentage: '',
    preferredCenter: INSTITUTIONS_DATA[0].code,
    idProofFileName: '',
    marksheetFileName: ''
  });

  // Track Status State
  const [trackAppId, setTrackAppId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileField) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fileField]: e.target.files[0].name }));
    }
  };

  const nextStep = () => {
    if (step === 1 && !formData.courseId) {
      alert('Please select a course.');
      return;
    }
    if (step === 2) {
      if (!formData.fullName || !formData.email || !formData.mobile) {
        alert('Please fill in candidate name, email, and mobile number.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const generatedId = `NCTMS-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedCourseObj = COURSES_DATA.find((c) => c.id === formData.courseId) || COURSES_DATA[0];
    const selectedCenterObj = INSTITUTIONS_DATA.find((i) => i.code === formData.preferredCenter) || INSTITUTIONS_DATA[0];

    const newAppRecord = {
      appId: generatedId,
      dateSubmitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      courseName: selectedCourseObj.title,
      courseCode: selectedCourseObj.code,
      courseFee: selectedCourseObj.fees,
      centerName: selectedCenterObj.name,
      centerCode: selectedCenterObj.code,
      ...formData,
      status: 'Submitted & Under Verification',
      currentStage: 2,
      remarks: 'Application documents received in order. Academic Council scrutiny pending.'
    };

    // Save in localStorage for persistent tracking
    try {
      const existing = JSON.parse(localStorage.getItem('nctms_applications') || '[]');
      existing.unshift(newAppRecord);
      localStorage.setItem('nctms_applications', JSON.stringify(existing));
    } catch {
      // fallback
    }

    setSubmittedApp(newAppRecord);
    setStep(5);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    const query = trackAppId.trim().toUpperCase();
    if (!query) {
      setTrackError('Please enter a valid Application ID.');
      return;
    }

    // Check localStorage
    let found = null;
    try {
      const existing = JSON.parse(localStorage.getItem('nctms_applications') || '[]');
      found = existing.find((a) => a.appId.toUpperCase() === query);
    } catch {
      // ignore
    }

    if (!found) {
      // Mock record if user types NCTMS-APP-2026-8841 or any demo ID
      if (query.includes('8841') || query.startsWith('NCTMS')) {
        found = {
          appId: query,
          dateSubmitted: '02-Oct-2026',
          fullName: 'Priya Sundaram',
          courseName: 'Diploma in Computer Science & Engineering',
          courseCode: 'DCS-101',
          centerName: 'National Academy of Technical & Computer Science, Chennai',
          status: 'Documents Verified & Admission Approved',
          currentStage: 3,
          remarks: 'Verification completed. Enrollment Number will be allocated upon first term fee payment.'
        };
      } else {
        setTrackError(`No application record found for ID "${query}". Please verify and try again.`);
        return;
      }
    }

    setTrackResult(found);
  };

  const selectedCourse = COURSES_DATA.find((c) => c.id === formData.courseId) || COURSES_DATA[0];

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Online Admission</span>
            </div>
            <h1>Online Admission Portal 2026-2027</h1>
            <p className="subpage-hero-subtitle">
              Seamless digital enrollment for Diploma, Post Graduate, and Certificate programs with instant application token tracking.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📝</span>
            <div>
              <strong>Admissions Open</strong>
              <span>Academic Session 2026-2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <section className="content-section">
        <div className="container">

          {/* Navigation Tabs (Apply vs Track) */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              className={`btn-primary ${activeTab === 'apply' ? '' : 'btn-secondary'}`}
              style={{ padding: '10px 22px', borderRadius: '8px' }}
              onClick={() => { setActiveTab('apply'); setSubmittedApp(null); setStep(1); }}
            >
              ✍️ New Admission Application
            </button>
            <button
              type="button"
              className={`btn-primary ${activeTab === 'track' ? '' : 'btn-secondary'}`}
              style={{ padding: '10px 22px', borderRadius: '8px' }}
              onClick={() => setActiveTab('track')}
            >
              🔍 Track Application Status
            </button>
          </div>

          {activeTab === 'apply' ? (
            <div className="admission-container">
              {/* Left Column: Form / Confirmation */}
              <div className="admission-card">
                
                {!submittedApp ? (
                  <>
                    {/* Progress Indicator */}
                    <div className="wizard-steps">
                      {[
                        { num: 1, title: 'Course' },
                        { num: 2, title: 'Personal' },
                        { num: 3, title: 'Academic' },
                        { num: 4, title: 'Center & Docs' },
                        { num: 5, title: 'Review' }
                      ].map((s) => (
                        <div 
                          key={s.num} 
                          className={`wizard-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
                          onClick={() => { if (step > s.num) setStep(s.num); }}
                        >
                          <div className="wizard-step-circle">
                            {step > s.num ? '✓' : s.num}
                          </div>
                          <span className="wizard-step-title">{s.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Step 1: Course Selection */}
                    {step === 1 && (
                      <div>
                        <h3 className="wizard-section-title">Step 1: Select Desired Academic Course</h3>
                        <p className="wizard-section-subtitle">Choose the course level and discipline you wish to enroll in.</p>

                        <div className="wizard-grid">
                          <div className="form-group full-span">
                            <label>Course Programme *</label>
                            <select 
                              name="courseId" 
                              value={formData.courseId} 
                              onChange={handleChange}
                            >
                              {COURSES_DATA.map((c) => (
                                <option key={c.id} value={c.id}>
                                  [{c.code}] {c.title} — ({c.level}, {c.duration})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Preferred Study Mode *</label>
                            <select name="studyMode" value={formData.studyMode} onChange={handleChange}>
                              <option value="Online & Blended">Online & Blended Learning (Recorded + Live)</option>
                              <option value="Distance Self-Paced">Distance Learning (Study Materials Provided)</option>
                              <option value="Center Classroom">Affiliated Center Classroom Sessions</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Academic Session</label>
                            <input type="text" value="2026 - 2027 (Annual Cycle)" readOnly className="bold-input" />
                          </div>

                          {/* Selected Course Quick Card */}
                          <div className="full-span" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <strong style={{ color: '#0b326b', fontSize: '14px' }}>{selectedCourse.title}</strong>
                              <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                {selectedCourse.code}
                              </span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#334155', marginBottom: '8px' }}>{selectedCourse.description}</p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600, color: '#0c57c4' }}>
                              <span>⏱ Duration: {selectedCourse.duration}</span>
                              <span>💰 Fee: {selectedCourse.fees}</span>
                              <span>🎓 Eligibility: {selectedCourse.eligibility}</span>
                            </div>
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <span></span>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Personal Details &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Personal Details */}
                    {step === 2 && (
                      <div>
                        <h3 className="wizard-section-title">Step 2: Candidate Personal Information</h3>
                        <p className="wizard-section-subtitle">Please ensure the candidate name matches official 10th / ID documents.</p>

                        <div className="wizard-grid">
                          <div className="form-group">
                            <label>Candidate Full Name (in Capital Letters) *</label>
                            <input 
                              type="text" 
                              name="fullName" 
                              placeholder="e.g. ARUNACHALAM SENTHIL" 
                              value={formData.fullName} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>

                          <div className="form-group">
                            <label>Father / Guardian Name *</label>
                            <input 
                              type="text" 
                              name="guardianName" 
                              placeholder="e.g. M. SENTHIL KUMAR" 
                              value={formData.guardianName} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>

                          <div className="form-group">
                            <label>Date of Birth *</label>
                            <input 
                              type="date" 
                              name="dob" 
                              value={formData.dob} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>

                          <div className="form-group">
                            <label>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Email Address *</label>
                            <input 
                              type="email" 
                              name="email" 
                              placeholder="candidate@example.com" 
                              value={formData.email} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>

                          <div className="form-group">
                            <label>Mobile Number (WhatsApp Enabled) *</label>
                            <input 
                              type="tel" 
                              name="mobile" 
                              placeholder="+91 98765 43210" 
                              value={formData.mobile} 
                              onChange={handleChange} 
                              required 
                            />
                          </div>

                          <div className="form-group">
                            <label>Aadhaar / National ID Number</label>
                            <input 
                              type="text" 
                              name="aadhaarNo" 
                              placeholder="XXXX-XXXX-XXXX" 
                              value={formData.aadhaarNo} 
                              onChange={handleChange} 
                            />
                          </div>

                          <div className="form-group">
                            <label>City & State *</label>
                            <input 
                              type="text" 
                              name="city" 
                              placeholder="e.g. Chennai, Tamil Nadu" 
                              value={formData.city} 
                              onChange={handleChange} 
                            />
                          </div>

                          <div className="form-group full-span">
                            <label>Permanent Residential Address *</label>
                            <input 
                              type="text" 
                              name="address" 
                              placeholder="House No, Street, Landmark, PIN Code" 
                              value={formData.address} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Academic Records &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Academic Qualifications */}
                    {step === 3 && (
                      <div>
                        <h3 className="wizard-section-title">Step 3: Academic Qualifications</h3>
                        <p className="wizard-section-subtitle">Provide details of your highest education qualification.</p>

                        <div className="wizard-grid">
                          <div className="form-group">
                            <label>Highest Qualification *</label>
                            <select name="qualification" value={formData.qualification} onChange={handleChange}>
                              <option value="10th Standard / Matriculation">10th Standard / SSLC / Matriculation</option>
                              <option value="10+2 / Intermediate / Higher Secondary">10+2 / Higher Secondary (HSC)</option>
                              <option value="Polytechnic Diploma">Polytechnic Diploma (3 Years)</option>
                              <option value="Bachelor Degree (Any Stream)">Bachelor Degree (B.Sc / B.A / B.Com / B.E)</option>
                              <option value="Post Graduate Degree">Post Graduate Degree</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Board / University Name *</label>
                            <input 
                              type="text" 
                              name="boardUniversity" 
                              placeholder="e.g. State Board of Tamil Nadu / CBSE / Madras University" 
                              value={formData.boardUniversity} 
                              onChange={handleChange} 
                            />
                          </div>

                          <div className="form-group">
                            <label>Year of Passing *</label>
                            <input 
                              type="text" 
                              name="passingYear" 
                              placeholder="e.g. 2024" 
                              value={formData.passingYear} 
                              onChange={handleChange} 
                            />
                          </div>

                          <div className="form-group">
                            <label>Percentage / CGPA Obtained *</label>
                            <input 
                              type="text" 
                              name="percentage" 
                              placeholder="e.g. 78.5% or 8.2 CGPA" 
                              value={formData.percentage} 
                              onChange={handleChange} 
                            />
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Center Selection & Uploads &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Study Center Preference & Document Upload */}
                    {step === 4 && (
                      <div>
                        <h3 className="wizard-section-title">Step 4: Affiliated Center & Document Upload</h3>
                        <p className="wizard-section-subtitle">Select your regional examination center and attach qualification documents.</p>

                        <div className="wizard-grid">
                          <div className="form-group full-span">
                            <label>Preferred Affiliated Study & Examination Center *</label>
                            <select 
                              name="preferredCenter" 
                              value={formData.preferredCenter} 
                              onChange={handleChange}
                            >
                              {INSTITUTIONS_DATA.map((inst) => (
                                <option key={inst.code} value={inst.code}>
                                  [{inst.code}] {inst.name} — {inst.city}, {inst.state}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Government Photo ID Proof (Aadhaar / Passport / Voter ID) *</label>
                            <input 
                              type="file" 
                              onChange={(e) => handleFileChange(e, 'idProofFileName')}
                            />
                            {formData.idProofFileName && (
                              <small style={{ color: '#16a34a', fontWeight: 600 }}>Attached: {formData.idProofFileName}</small>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Highest Qualification Marksheet / Certificate (PDF / JPG) *</label>
                            <input 
                              type="file" 
                              onChange={(e) => handleFileChange(e, 'marksheetFileName')}
                            />
                            {formData.marksheetFileName && (
                              <small style={{ color: '#16a34a', fontWeight: 600 }}>Attached: {formData.marksheetFileName}</small>
                            )}
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Review Application Summary &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Review & Submit */}
                    {step === 5 && (
                      <div>
                        <h3 className="wizard-section-title">Step 5: Review & Final Submission</h3>
                        <p className="wizard-section-subtitle">Please cross-verify all details before submitting to the academic council.</p>

                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '18px', marginBottom: '20px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                            <div><strong>Candidate Name:</strong> {formData.fullName || 'Not Provided'}</div>
                            <div><strong>Father Name:</strong> {formData.guardianName || 'Not Provided'}</div>
                            <div><strong>Course Applied:</strong> {selectedCourse.title} ({selectedCourse.code})</div>
                            <div><strong>Study Mode:</strong> {formData.studyMode}</div>
                            <div><strong>Contact:</strong> {formData.mobile} | {formData.email}</div>
                            <div><strong>Highest Qualification:</strong> {formData.qualification} ({formData.percentage || 'N/A'})</div>
                            <div><strong>Affiliated Center:</strong> {formData.preferredCenter}</div>
                            <div><strong>Total Tuition Fee:</strong> {selectedCourse.fees}</div>
                          </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                          <label className="checkbox-label" style={{ fontSize: '12.5px' }}>
                            <input type="checkbox" defaultChecked required />
                            I declare that all details provided herein are authentic and strictly comply with the council's admission eligibility norms.
                          </label>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back
                          </button>
                          <button type="button" className="btn-primary" onClick={handleSubmitApplication}>
                            🚀 Submit Application & Generate Token
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Success Confirmation Screen */
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 12px' }}>
                        ✓
                      </div>
                      <h2 style={{ color: '#0b326b', fontSize: '24px', fontWeight: 800 }}>Application Submitted Successfully!</h2>
                      <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                        Your admission form has been received and logged into the NCTMS Central Academic Registry.
                      </p>
                    </div>

                    <div style={{ background: '#eff6ff', border: '2px dashed #0c57c4', borderRadius: '10px', padding: '20px', textAlign: 'center', marginBottom: '24px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Official Application ID</span>
                      <h3 style={{ fontSize: '28px', color: '#0c57c4', fontFamily: 'monospace', margin: '6px 0' }}>
                        {submittedApp.appId}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#334155' }}>
                        Please save this number to track your application status and make fee payments.
                      </p>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', fontSize: '13px', marginBottom: '24px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div><strong>Candidate Name:</strong> {submittedApp.fullName}</div>
                        <div><strong>Submission Date:</strong> {submittedApp.dateSubmitted}</div>
                        <div><strong>Course Enrolled:</strong> {submittedApp.courseName}</div>
                        <div><strong>Study Center:</strong> {submittedApp.centerName}</div>
                        <div><strong>Application Status:</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>Under Review</span></div>
                        <div><strong>Fee Payable:</strong> {submittedApp.courseFee}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        style={{ flex: 1 }}
                        onClick={() => window.print()}
                      >
                        🖨️ Print / Save Application Receipt
                      </button>
                      <button 
                        type="button" 
                        className="btn-primary" 
                        style={{ flex: 1 }}
                        onClick={() => {
                          setTrackAppId(submittedApp.appId);
                          setActiveTab('track');
                          setTrackResult(submittedApp);
                        }}
                      >
                        Track Status Now &rarr;
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Information & Helpline */}
              <div className="admission-sidebar">
                <div className="info-side-card">
                  <h3>
                    <span>ℹ️</span> Admission Guidelines
                  </h3>
                  <ul className="side-feature-list">
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Zero registration processing charges for online form submission.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Digital verification completed within 2 business days.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Flexible semester fee payment plans available.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Provisional ID & LMS login details sent via WhatsApp and Email upon approval.</span>
                    </li>
                  </ul>

                  <div className="helpline-box">
                    <strong>NCTMS Admission Desk</strong>
                    <p style={{ margin: '4px 0' }}>Toll Free: 1800 208 9012</p>
                    <p style={{ margin: '0' }}>Email: admissions@nctms.in</p>
                    <small style={{ color: '#64748b' }}>Mon - Sat: 9:00 AM - 6:00 PM</small>
                  </div>
                </div>

                <div className="info-side-card" style={{ background: 'linear-gradient(135deg, #0f274a, #0b326b)', color: '#ffffff' }}>
                  <h3 style={{ color: '#ffffff' }}>
                    <span>🛡️</span> Recognized Standards
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
                    NCTMS India qualifications are backed by national technical and management curricula, equipping graduates with skills demanded across global industries.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: TRACK APPLICATION STATUS */
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div className="admission-card" style={{ marginBottom: '24px' }}>
                <h3 className="wizard-section-title">Track Your Admission Application</h3>
                <p className="wizard-section-subtitle">
                  Enter your assigned Application ID (e.g. NCTMS-APP-2026-8841) to check real-time admission verification progress.
                </p>

                <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Application ID (e.g. NCTMS-APP-2026-8841)" 
                    value={trackAppId} 
                    onChange={(e) => setTrackAppId(e.target.value)}
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', textTransform: 'uppercase', fontWeight: 600 }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                    Track Application
                  </button>
                </form>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                  <span>Quick demo sample: </span>
                  <button 
                    type="button" 
                    style={{ color: '#0c57c4', fontWeight: 700, textDecoration: 'underline', background: 'none' }}
                    onClick={() => setTrackAppId('NCTMS-APP-2026-8841')}
                  >
                    NCTMS-APP-2026-8841
                  </button>
                </div>

                {trackError && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', color: '#b91c1c', fontSize: '13px' }}>
                    {trackError}
                  </div>
                )}
              </div>

              {/* Track Status Result Card */}
              {trackResult && (
                <div className="admission-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>APPLICATION TRACKING</span>
                      <h3 style={{ fontSize: '20px', color: '#0b326b', margin: '2px 0' }}>{trackResult.appId}</h3>
                      <p style={{ fontSize: '12px', color: '#64748b' }}>Submitted on: {trackResult.dateSubmitted}</p>
                    </div>
                    <span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '12.5px', padding: '6px 14px', borderRadius: '20px', border: '1px solid #86efac' }}>
                      ● {trackResult.status}
                    </span>
                  </div>

                  {/* Visual Tracker Timeline */}
                  <div style={{ margin: '24px 0', padding: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {[
                        { stepNum: 1, label: 'Form Submitted', done: true },
                        { stepNum: 2, label: 'Docs Verified', done: trackResult.currentStage >= 2 },
                        { stepNum: 3, label: 'Center Approved', done: trackResult.currentStage >= 3 },
                        { stepNum: 4, label: 'Enrollment Issued', done: trackResult.currentStage >= 4 }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: item.done ? '#22c55e' : '#e2e8f0',
                            color: item.done ? '#ffffff' : '#64748b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                            marginBottom: '6px'
                          }}>
                            {item.done ? '✓' : item.stepNum}
                          </div>
                          <span style={{ fontSize: '11.5px', fontWeight: item.done ? 700 : 500, color: item.done ? '#0f172a' : '#94a3b8', textAlign: 'center' }}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', fontSize: '13px', marginBottom: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div><strong>Candidate:</strong> {trackResult.fullName}</div>
                      <div><strong>Course Applied:</strong> {trackResult.courseName}</div>
                      <div><strong>Study Center:</strong> {trackResult.centerName}</div>
                      <div><strong>Official Remarks:</strong> {trackResult.remarks}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <Link to="/courses" className="btn-secondary">Explore Other Courses</Link>
                    <Link to="/contact" className="btn-primary">Contact Admission Desk</Link>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}

import React, { useState, useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { COURSES_DATA } from '../data/coursesData';
import { INSTITUTIONS_DATA } from '../data/institutionsData';
import { ADMIN_ADMISSIONS_QUEUE } from '../data/adminData';

export default function AdmissionPage() {
  const [searchParams] = useSearchParams();
  const preSelectedCourseId = searchParams.get('course') || '';
  const preSelectedCenterCode = searchParams.get('center') || '';

  // Mode: 'apply' or 'track'
  const initialTab = searchParams.get('tab') === 'track' ? 'track' : 'apply';
  const [activeTab, setActiveTab] = useState(initialTab);

  // 6 Wizard Steps: 1 to 6
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Unique IDs for accessible form controls
  const courseSearchId = useId();
  const courseSelectId = useId();
  const studyModeId = useId();
  const centerSelectId = useId();

  // Search filter inside Course Selection (Step 1)
  const [courseFilterQuery, setCourseFilterQuery] = useState('');

  // Main Admission Form State (in-memory, no sensitive storage in localStorage)
  const [formData, setFormData] = useState({
    // Step 1: Course & Center
    courseId: preSelectedCourseId || (COURSES_DATA[0] ? COURSES_DATA[0].id : ''),
    studyMode: 'Online & Blended Learning',
    preferredCenter: preSelectedCenterCode || (INSTITUTIONS_DATA[0] ? INSTITUTIONS_DATA[0].code : ''),

    // Step 2: Personal Details
    fullName: '',
    dob: '',
    gender: 'Male',
    nationality: 'Indian',
    guardianName: '',
    motherName: '',

    // Step 3: Contact Details
    email: '',
    mobile: '',
    altMobile: '',
    address: '',
    state: 'Tamil Nadu',
    district: '',
    city: '',
    pincode: '',

    // Step 4: Educational Details
    qualification: '10+2 / Intermediate / Higher Secondary',
    institutionName: '',
    boardUniversity: '',
    passingYear: '2024',
    percentage: '',

    // Step 5: Document Uploads
    documents: {
      photo: null,
      idProof: null,
      certificate: null,
      marksheet: null
    },

    // Step 6: Confirmation
    confirmed: false
  });

  // Field-level error messages
  const [errors, setErrors] = useState({});

  // Application Tracking State
  const [trackAppId, setTrackAppId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  // Handle document file change with client-side format & size validation
  const handleFileChange = (e, docKey) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    const maxSizeBytes = 3 * 1024 * 1024; // 3 MB

    if (!allowedExtensions.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        [docKey]: `Unsupported file type (${fileExt.toUpperCase()}). Please upload PDF, JPG, or PNG.`
      }));
      e.target.value = '';
      return;
    }

    if (file.size > maxSizeBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setErrors((prev) => ({
        ...prev,
        [docKey]: `File size (${sizeMB} MB) exceeds maximum 3 MB limit.`
      }));
      e.target.value = '';
      return;
    }

    // Valid file
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          type: file.type
        }
      }
    }));
  };

  // Remove uploaded document
  const handleRemoveDoc = (docKey) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: null
      }
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[docKey];
      return copy;
    });
  };

  // Validation by step
  const validateStep = (stepNumber) => {
    const errs = {};

    if (stepNumber === 1) {
      if (!formData.courseId) errs.courseId = 'Please select a course to continue.';
      if (!formData.preferredCenter) errs.preferredCenter = 'Please select a preferred study center.';
    }

    if (stepNumber === 2) {
      if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
      else if (formData.fullName.trim().length < 2) errs.fullName = 'Full Name must be at least 2 characters.';

      if (!formData.dob) errs.dob = 'Date of Birth is required.';
      else {
        const birthDate = new Date(formData.dob);
        const today = new Date();
        if (birthDate >= today) errs.dob = 'Date of Birth must be in the past.';
      }

      if (!formData.guardianName.trim()) errs.guardianName = "Father's / Guardian's Name is required.";
      if (!formData.nationality.trim()) errs.nationality = 'Nationality is required.';
    }

    if (stepNumber === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) errs.email = 'Email Address is required.';
      else if (!emailRegex.test(formData.email.trim())) errs.email = 'Please enter a valid email address.';

      const mobileDigits = formData.mobile.replace(/\D/g, '');
      if (!formData.mobile.trim()) errs.mobile = 'Mobile Number is required.';
      else if (mobileDigits.length < 10) errs.mobile = 'Please enter a valid 10-digit mobile number.';

      if (!formData.address.trim()) errs.address = 'Residential Address is required.';
      if (!formData.city.trim()) errs.city = 'City / Town is required.';
      if (!formData.district.trim()) errs.district = 'District is required.';
      if (!formData.state.trim()) errs.state = 'State is required.';

      const pincodeDigits = formData.pincode.replace(/\D/g, '');
      if (!formData.pincode.trim()) errs.pincode = 'Postal Code / PIN is required.';
      else if (pincodeDigits.length !== 6) errs.pincode = 'Postal Code must be exactly 6 digits.';
    }

    if (stepNumber === 4) {
      if (!formData.institutionName.trim()) errs.institutionName = 'Previous Institution Name is required.';
      if (!formData.boardUniversity.trim()) errs.boardUniversity = 'Board / University is required.';
      if (!formData.passingYear.trim()) errs.passingYear = 'Year of Passing is required.';
      else {
        const yr = parseInt(formData.passingYear, 10);
        if (isNaN(yr) || yr < 1980 || yr > 2026) {
          errs.passingYear = 'Please enter a valid 4-digit passing year (e.g. 2024).';
        }
      }
    }

    if (stepNumber === 5) {
      if (!formData.documents.photo) errs.photo = 'Candidate Photograph is required.';
      if (!formData.documents.idProof) errs.idProof = 'Identity Proof document is required.';
      if (!formData.documents.certificate) errs.certificate = 'Previous Qualification Certificate is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrors({});
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const goToStep = (targetStep) => {
    setErrors({});
    setStep(targetStep);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  // Submit application
  const handleSubmitApplication = (e) => {
    e.preventDefault();

    if (!formData.confirmed) {
      setErrors({ confirmed: 'You must confirm the accuracy of your application information.' });
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Simulate genuine submission lifecycle
    setTimeout(() => {
      setIsSubmitting(false);

      const generatedAppId = `NCTMS-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const selectedCourseObj = COURSES_DATA.find((c) => c.id === formData.courseId) || COURSES_DATA[0];
      const selectedCenterObj = INSTITUTIONS_DATA.find((i) => i.code === formData.preferredCenter) || INSTITUTIONS_DATA[0];

      const newRecord = {
        appId: generatedAppId,
        dateSubmitted: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        courseName: selectedCourseObj.title,
        courseCode: selectedCourseObj.code,
        courseFee: selectedCourseObj.fees,
        courseDuration: selectedCourseObj.duration,
        centerName: selectedCenterObj.name,
        centerCode: selectedCenterObj.code,
        centerLocation: `${selectedCenterObj.city}, ${selectedCenterObj.state}`,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        qualification: formData.qualification,
        status: 'Submitted & Pending Academic Council Verification',
        currentStage: 1,
        remarks: 'Online admission form received. Digital document verification will be completed in 2 business days.',
        docsCount: Object.values(formData.documents).filter(Boolean).length
      };

      setSubmittedApp(newRecord);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }, 700);
  };

  // Track application status
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    const query = trackAppId.trim().toUpperCase();
    if (!query) {
      setTrackError('Please enter an Application ID (e.g. NCTMS-APP-2026-8841).');
      return;
    }

    // 1. Check in-memory submitted application in current session
    if (submittedApp && submittedApp.appId.toUpperCase() === query) {
      setTrackResult(submittedApp);
      return;
    }

    // 2. Check verified admin admissions queue records
    const verifiedRecord = ADMIN_ADMISSIONS_QUEUE.find(
      (a) => a.appId.toUpperCase() === query || (a.id && a.id.toUpperCase() === query)
    );

    if (verifiedRecord) {
      setTrackResult({
        appId: verifiedRecord.appId,
        dateSubmitted: verifiedRecord.dateApplied,
        fullName: verifiedRecord.candidateName,
        courseName: verifiedRecord.courseName,
        courseCode: verifiedRecord.courseCode,
        centerName: verifiedRecord.centerName,
        status: verifiedRecord.status,
        currentStage: verifiedRecord.status.includes('Approved') ? 3 : 2,
        remarks: 'Application under official scrutiny. Scanned documents are being verified by council registrars.'
      });
    } else {
      setTrackError(`No application record found for ID "${query}". Please verify the application reference or contact the admission desk.`);
    }
  };

  // Get active selected course & center objects
  const selectedCourse = COURSES_DATA.find((c) => c.id === formData.courseId) || COURSES_DATA[0];
  const selectedCenter = INSTITUTIONS_DATA.find((i) => i.code === formData.preferredCenter) || INSTITUTIONS_DATA[0];

  // Filter courses for Step 1 searchable dropdown
  const filteredCoursesList = COURSES_DATA.filter((c) => {
    const q = courseFilterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const stepsList = [
    { num: 1, title: 'Select Course' },
    { num: 2, title: 'Personal Details' },
    { num: 3, title: 'Contact Details' },
    { num: 4, title: 'Educational Details' },
    { num: 5, title: 'Documents' },
    { num: 6, title: 'Review & Submit' }
  ];

  return (
    <PublicLayout>
      {/* 1. PAGE HEADER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Online Admission</span>
            </nav>
            <h1>Online Admission</h1>
            <p className="subpage-hero-subtitle">
              Begin your educational journey with NCTMS India Online through our online application process.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📝</span>
            <div>
              <strong>Admissions 2026-2027</strong>
              <span>Academic Enrollment Cycle</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* Top Mode Selector: Apply vs Track */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '26px', flexWrap: 'wrap' }} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'apply'}
              className={`btn-primary ${activeTab === 'apply' ? '' : 'btn-secondary'}`}
              style={{ padding: '10px 22px', borderRadius: '8px', fontWeight: 700 }}
              onClick={() => {
                setActiveTab('apply');
                setSubmittedApp(null);
                setStep(1);
              }}
            >
              ✍️ New Admission Application
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'track'}
              className={`btn-primary ${activeTab === 'track' ? '' : 'btn-secondary'}`}
              style={{ padding: '10px 22px', borderRadius: '8px', fontWeight: 700 }}
              onClick={() => setActiveTab('track')}
            >
              🔍 Track Application Status
            </button>
          </div>

          {activeTab === 'apply' ? (
            <div className="admission-container">
              {/* Left Column: Multi-Step Admission Form */}
              <div className="admission-card">

                {!submittedApp ? (
                  <>
                    {/* 2. ADMISSION PROCESS INDICATOR (6 STEPS) */}
                    <div className="wizard-steps" role="navigation" aria-label="Admission steps">
                      {stepsList.map((s) => (
                        <div
                          key={s.num}
                          className={`wizard-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`}
                          onClick={() => {
                            if (step > s.num) goToStep(s.num);
                          }}
                          role="button"
                          tabIndex={step > s.num ? 0 : -1}
                          aria-label={`Step ${s.num}: ${s.title}`}
                          aria-current={step === s.num ? 'step' : undefined}
                        >
                          <div className="wizard-step-circle">
                            {step > s.num ? '✓' : s.num}
                          </div>
                          <span className="wizard-step-title">{s.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* STEP 1: SELECT COURSE */}
                    {step === 1 && (
                      <div>
                        <h2 className="wizard-section-title">Step 1 — Select Course & Study Center</h2>
                        <p className="wizard-section-subtitle">
                          Choose your desired qualification stream, mode of study, and regional affiliated center.
                        </p>

                        <div className="wizard-grid">
                          {/* Searchable Course Filter */}
                          <div className="form-group full-span">
                            <label htmlFor={courseSearchId}>Search Courses</label>
                            <input
                              id={courseSearchId}
                              type="text"
                              placeholder="Filter courses by name, discipline, or code (e.g. Computer, PGDM, DCS)..."
                              value={courseFilterQuery}
                              onChange={(e) => setCourseFilterQuery(e.target.value)}
                              aria-label="Filter courses list"
                            />
                          </div>

                          {/* Course Dropdown */}
                          <div className="form-group full-span">
                            <label htmlFor={courseSelectId}>Selected Course Programme *</label>
                            {filteredCoursesList.length > 0 ? (
                              <select
                                id={courseSelectId}
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleChange}
                                className={errors.courseId ? 'input-has-error' : ''}
                                aria-label="Select course programme"
                              >
                                {filteredCoursesList.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    [{c.code}] {c.title} — ({c.level}, {c.duration})
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '13px' }}>
                                No courses found matching "{courseFilterQuery}". Please clear your search to view all courses.
                              </div>
                            )}
                            {errors.courseId && <span className="field-error-msg">{errors.courseId}</span>}
                          </div>

                          {/* Selected Course Information Box */}
                          {selectedCourse && (
                            <div
                              className="full-span"
                              style={{
                                background: '#eff6ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: '10px',
                                padding: '18px',
                                margin: '4px 0 10px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                                <strong style={{ color: '#0b326b', fontSize: '15px' }}>{selectedCourse.title}</strong>
                                <span style={{ fontSize: '12px', background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: '4px', fontWeight: 800 }}>
                                  {selectedCourse.code}
                                </span>
                              </div>
                              <p style={{ fontSize: '12.5px', color: '#334155', marginBottom: '12px', lineHeight: '1.5' }}>
                                {selectedCourse.description}
                              </p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '8px', fontSize: '12px', fontWeight: 600, color: '#0c57c4' }}>
                                <span>📚 Category: {selectedCourse.category}</span>
                                <span>⏱ Duration: {selectedCourse.duration}</span>
                                <span>💰 Tuition Fee: {selectedCourse.fees}</span>
                                <span>🎓 Eligibility: {selectedCourse.eligibility}</span>
                              </div>
                            </div>
                          )}

                          {/* Study Mode */}
                          <div className="form-group">
                            <label htmlFor={studyModeId}>Learning Mode *</label>
                            <select
                              id={studyModeId}
                              name="studyMode"
                              value={formData.studyMode}
                              onChange={handleChange}
                            >
                              <option value="Online & Blended Learning">Online & Blended (Recorded + Live Sessions)</option>
                              <option value="Distance Learning">Distance Learning (Study Materials Provided)</option>
                              <option value="Affiliated Center Classroom">Affiliated Center Classroom Sessions</option>
                            </select>
                          </div>

                          {/* Preferred Affiliated Center */}
                          <div className="form-group">
                            <label htmlFor={centerSelectId}>Preferred Affiliated Study Center *</label>
                            <select
                              id={centerSelectId}
                              name="preferredCenter"
                              value={formData.preferredCenter}
                              onChange={handleChange}
                              className={errors.preferredCenter ? 'input-has-error' : ''}
                            >
                              {INSTITUTIONS_DATA.map((inst) => (
                                <option key={inst.code} value={inst.code}>
                                  [{inst.code}] {inst.name} — {inst.city}, {inst.state}
                                </option>
                              ))}
                            </select>
                            {errors.preferredCenter && <span className="field-error-msg">{errors.preferredCenter}</span>}
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

                    {/* STEP 2: PERSONAL DETAILS */}
                    {step === 2 && (
                      <div>
                        <h2 className="wizard-section-title">Step 2 — Personal Details</h2>
                        <p className="wizard-section-subtitle">
                          Enter candidate identifying information as recorded in official educational certificates.
                        </p>

                        <div className="wizard-grid">
                          <div className="form-group">
                            <label>Full Name *</label>
                            <input
                              type="text"
                              name="fullName"
                              placeholder="e.g. Senthil Kumar"
                              value={formData.fullName}
                              onChange={handleChange}
                              className={errors.fullName ? 'input-has-error' : ''}
                              required
                            />
                            {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
                          </div>

                          <div className="form-group">
                            <label>Date of Birth *</label>
                            <input
                              type="date"
                              name="dob"
                              value={formData.dob}
                              onChange={handleChange}
                              className={errors.dob ? 'input-has-error' : ''}
                              required
                            />
                            {errors.dob && <span className="field-error-msg">{errors.dob}</span>}
                          </div>

                          <div className="form-group">
                            <label>Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange}>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Nationality *</label>
                            <input
                              type="text"
                              name="nationality"
                              placeholder="e.g. Indian"
                              value={formData.nationality}
                              onChange={handleChange}
                              className={errors.nationality ? 'input-has-error' : ''}
                              required
                            />
                            {errors.nationality && <span className="field-error-msg">{errors.nationality}</span>}
                          </div>

                          <div className="form-group">
                            <label>Father's / Guardian's Name *</label>
                            <input
                              type="text"
                              name="guardianName"
                              placeholder="e.g. R. Kumaravel"
                              value={formData.guardianName}
                              onChange={handleChange}
                              className={errors.guardianName ? 'input-has-error' : ''}
                              required
                            />
                            {errors.guardianName && <span className="field-error-msg">{errors.guardianName}</span>}
                          </div>

                          <div className="form-group">
                            <label>Mother's Name (Optional)</label>
                            <input
                              type="text"
                              name="motherName"
                              placeholder="e.g. K. Vasanthi"
                              value={formData.motherName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back to Course
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Contact Details &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: CONTACT DETAILS */}
                    {step === 3 && (
                      <div>
                        <h2 className="wizard-section-title">Step 3 — Contact Details</h2>
                        <p className="wizard-section-subtitle">
                          Provide communication channels and residential address for council correspondence.
                        </p>

                        <div className="wizard-grid">
                          <div className="form-group">
                            <label>Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              placeholder="candidate@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              className={errors.email ? 'input-has-error' : ''}
                              required
                            />
                            {errors.email && <span className="field-error-msg">{errors.email}</span>}
                          </div>

                          <div className="form-group">
                            <label>Mobile Number *</label>
                            <input
                              type="tel"
                              name="mobile"
                              placeholder="10-digit mobile number"
                              value={formData.mobile}
                              onChange={handleChange}
                              className={errors.mobile ? 'input-has-error' : ''}
                              required
                            />
                            {errors.mobile && <span className="field-error-msg">{errors.mobile}</span>}
                          </div>

                          <div className="form-group">
                            <label>Alternate Mobile Number (Optional)</label>
                            <input
                              type="tel"
                              name="altMobile"
                              placeholder="Alternate contact number"
                              value={formData.altMobile}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="form-group">
                            <label>Postal Code / PIN Code *</label>
                            <input
                              type="text"
                              name="pincode"
                              placeholder="e.g. 600032"
                              value={formData.pincode}
                              onChange={handleChange}
                              className={errors.pincode ? 'input-has-error' : ''}
                              required
                            />
                            {errors.pincode && <span className="field-error-msg">{errors.pincode}</span>}
                          </div>

                          <div className="form-group full-span">
                            <label>Residential Address *</label>
                            <input
                              type="text"
                              name="address"
                              placeholder="Door No, Street Name, Landmark"
                              value={formData.address}
                              onChange={handleChange}
                              className={errors.address ? 'input-has-error' : ''}
                              required
                            />
                            {errors.address && <span className="field-error-msg">{errors.address}</span>}
                          </div>

                          <div className="form-group">
                            <label>City / Town *</label>
                            <input
                              type="text"
                              name="city"
                              placeholder="e.g. Chennai"
                              value={formData.city}
                              onChange={handleChange}
                              className={errors.city ? 'input-has-error' : ''}
                              required
                            />
                            {errors.city && <span className="field-error-msg">{errors.city}</span>}
                          </div>

                          <div className="form-group">
                            <label>District *</label>
                            <input
                              type="text"
                              name="district"
                              placeholder="e.g. Chennai District"
                              value={formData.district}
                              onChange={handleChange}
                              className={errors.district ? 'input-has-error' : ''}
                              required
                            />
                            {errors.district && <span className="field-error-msg">{errors.district}</span>}
                          </div>

                          <div className="form-group full-span">
                            <label>State *</label>
                            <select name="state" value={formData.state} onChange={handleChange}>
                              <option value="Tamil Nadu">Tamil Nadu</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Kerala">Kerala</option>
                              <option value="Maharashtra">Maharashtra</option>
                              <option value="Telangana">Telangana</option>
                              <option value="Andhra Pradesh">Andhra Pradesh</option>
                              <option value="Delhi">Delhi</option>
                              <option value="Other State">Other State</option>
                            </select>
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back to Personal
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Educational Details &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: EDUCATIONAL DETAILS */}
                    {step === 4 && (
                      <div>
                        <h2 className="wizard-section-title">Step 4 — Educational Details</h2>
                        <p className="wizard-section-subtitle">
                          Submit your prior qualifying credentials matching course entry criteria.
                        </p>

                        {/* Eligibility Callout */}
                        {selectedCourse && (
                          <div
                            style={{
                              background: '#f0fdf4',
                              border: '1px solid #86efac',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              marginBottom: '20px',
                              fontSize: '13px',
                              color: '#166534',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px'
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>🎓</span>
                            <div>
                              <strong>Required Eligibility for {selectedCourse.title}:</strong>{' '}
                              <span>{selectedCourse.eligibility}</span>
                            </div>
                          </div>
                        )}

                        <div className="wizard-grid">
                          <div className="form-group">
                            <label>Highest Qualification *</label>
                            <select
                              name="qualification"
                              value={formData.qualification}
                              onChange={handleChange}
                            >
                              <option value="10th Standard / Matriculation">10th Standard / Matriculation</option>
                              <option value="10+2 / Intermediate / Higher Secondary">10+2 / Higher Secondary (HSC)</option>
                              <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                              <option value="Bachelor Degree (Any Stream)">Bachelor Degree (B.Sc / B.Com / B.A / B.E)</option>
                              <option value="Post Graduate Degree">Post Graduate Degree</option>
                              <option value="Other Equivalent Qualification">Other Equivalent Qualification</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Previous Institution / College Name *</label>
                            <input
                              type="text"
                              name="institutionName"
                              placeholder="e.g. Government Higher Secondary School / Loyola College"
                              value={formData.institutionName}
                              onChange={handleChange}
                              className={errors.institutionName ? 'input-has-error' : ''}
                              required
                            />
                            {errors.institutionName && <span className="field-error-msg">{errors.institutionName}</span>}
                          </div>

                          <div className="form-group">
                            <label>Board / University *</label>
                            <input
                              type="text"
                              name="boardUniversity"
                              placeholder="e.g. State Board / CBSE / University of Madras"
                              value={formData.boardUniversity}
                              onChange={handleChange}
                              className={errors.boardUniversity ? 'input-has-error' : ''}
                              required
                            />
                            {errors.boardUniversity && <span className="field-error-msg">{errors.boardUniversity}</span>}
                          </div>

                          <div className="form-group">
                            <label>Year of Passing *</label>
                            <input
                              type="text"
                              name="passingYear"
                              placeholder="e.g. 2024"
                              value={formData.passingYear}
                              onChange={handleChange}
                              className={errors.passingYear ? 'input-has-error' : ''}
                              required
                            />
                            {errors.passingYear && <span className="field-error-msg">{errors.passingYear}</span>}
                          </div>

                          <div className="form-group full-span">
                            <label>Marks / Percentage / CGPA (where applicable)</label>
                            <input
                              type="text"
                              name="percentage"
                              placeholder="e.g. 82.5% or 8.4 CGPA"
                              value={formData.percentage}
                              onChange={handleChange}
                            />
                            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                              Note: Academic credentials will be verified against attached mark sheets by the council registrars.
                            </small>
                          </div>
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back to Contact
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Continue to Document Upload &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: DOCUMENT UPLOAD */}
                    {step === 5 && (
                      <div>
                        <h2 className="wizard-section-title">Step 5 — Document Upload</h2>
                        <p className="wizard-section-subtitle">
                          Attach official scanned documents in PDF, JPG, or PNG format (Max 3 MB per document).
                        </p>

                        <div className="doc-upload-grid">
                          {/* 1. Photograph */}
                          <div className={`doc-upload-box ${formData.documents.photo ? 'has-file' : ''}`}>
                            <div className="doc-upload-header">
                              <h3 className="doc-upload-title">1. Candidate Photograph *</h3>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>JPG/PNG/WEBP</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px' }}>
                              Recent passport-size photo with clear light background.
                            </p>
                            {formData.documents.photo ? (
                              <div className="doc-file-info">
                                <span className="doc-file-name">📷 {formData.documents.photo.name} ({formData.documents.photo.size})</span>
                                <button type="button" className="doc-remove-btn" onClick={() => handleRemoveDoc('photo')}>
                                  ✕ Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => handleFileChange(e, 'photo')}
                              />
                            )}
                            {errors.photo && <span className="field-error-msg">{errors.photo}</span>}
                          </div>

                          {/* 2. Identity Proof */}
                          <div className={`doc-upload-box ${formData.documents.idProof ? 'has-file' : ''}`}>
                            <div className="doc-upload-header">
                              <h3 className="doc-upload-title">2. Identity Proof *</h3>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>PDF/JPG/PNG</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px' }}>
                              Voter ID, Passport, Driving License, or National ID.
                            </p>
                            {formData.documents.idProof ? (
                              <div className="doc-file-info">
                                <span className="doc-file-name">📄 {formData.documents.idProof.name} ({formData.documents.idProof.size})</span>
                                <button type="button" className="doc-remove-btn" onClick={() => handleRemoveDoc('idProof')}>
                                  ✕ Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'idProof')}
                              />
                            )}
                            {errors.idProof && <span className="field-error-msg">{errors.idProof}</span>}
                          </div>

                          {/* 3. Qualification Certificate */}
                          <div className={`doc-upload-box ${formData.documents.certificate ? 'has-file' : ''}`}>
                            <div className="doc-upload-header">
                              <h3 className="doc-upload-title">3. Qualification Certificate *</h3>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>PDF/JPG/PNG</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px' }}>
                              Passing certificate / provisional degree of qualifying examination.
                            </p>
                            {formData.documents.certificate ? (
                              <div className="doc-file-info">
                                <span className="doc-file-name">📜 {formData.documents.certificate.name} ({formData.documents.certificate.size})</span>
                                <button type="button" className="doc-remove-btn" onClick={() => handleRemoveDoc('certificate')}>
                                  ✕ Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'certificate')}
                              />
                            )}
                            {errors.certificate && <span className="field-error-msg">{errors.certificate}</span>}
                          </div>

                          {/* 4. Mark Sheet */}
                          <div className={`doc-upload-box ${formData.documents.marksheet ? 'has-file' : ''}`}>
                            <div className="doc-upload-header">
                              <h3 className="doc-upload-title">4. Qualifying Mark Sheet (Optional)</h3>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>PDF/JPG/PNG</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px' }}>
                              Consolidated statement of marks or semester transcripts.
                            </p>
                            {formData.documents.marksheet ? (
                              <div className="doc-file-info">
                                <span className="doc-file-name">📊 {formData.documents.marksheet.name} ({formData.documents.marksheet.size})</span>
                                <button type="button" className="doc-remove-btn" onClick={() => handleRemoveDoc('marksheet')}>
                                  ✕ Remove
                                </button>
                              </div>
                            ) : (
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'marksheet')}
                              />
                            )}
                            {errors.marksheet && <span className="field-error-msg">{errors.marksheet}</span>}
                          </div>
                        </div>

                        {/* Security Notice */}
                        <div style={{ marginTop: '16px', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#64748b' }}>
                          🔒 <strong>Privacy Assurance:</strong> Uploaded document files are validated locally for format and size. A secure cloud document storage API endpoint (<code>POST /api/v1/admissions/upload</code>) is required for production server-side persistence. Documents are not exposed publicly.
                        </div>

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep}>
                            &larr; Back to Educational
                          </button>
                          <button type="button" className="btn-primary" onClick={nextStep}>
                            Review Application Summary &rarr;
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 6: REVIEW & SUBMIT */}
                    {step === 6 && (
                      <div>
                        <h2 className="wizard-section-title">Step 6 — Review & Submit Application</h2>
                        <p className="wizard-section-subtitle">
                          Carefully cross-check your submitted information before final submission to the NCTMS Academic Council.
                        </p>

                        {/* Review Section 1: Selected Course */}
                        <div className="review-section-card">
                          <div className="review-section-header">
                            <h3 className="review-section-title">
                              <span>🎓</span> Selected Course & Study Center
                            </h3>
                            <button type="button" className="review-edit-btn" onClick={() => goToStep(1)}>
                              ✏️ Edit Course
                            </button>
                          </div>
                          <div className="review-data-grid">
                            <div className="review-item">
                              <label>Course Name</label>
                              <span>{selectedCourse.title}</span>
                            </div>
                            <div className="review-item">
                              <label>Course Code</label>
                              <span>{selectedCourse.code}</span>
                            </div>
                            <div className="review-item">
                              <label>Duration & Mode</label>
                              <span>{selectedCourse.duration} &bull; {formData.studyMode}</span>
                            </div>
                            <div className="review-item">
                              <label>Preferred Study Center</label>
                              <span>{selectedCenter.name} ({selectedCenter.code})</span>
                            </div>
                            <div className="review-item">
                              <label>Tuition Fee (Payable after Approval)</label>
                              <span style={{ color: '#0c57c4', fontWeight: 800 }}>{selectedCourse.fees}</span>
                            </div>
                          </div>
                        </div>

                        {/* Review Section 2: Personal Information */}
                        <div className="review-section-card">
                          <div className="review-section-header">
                            <h3 className="review-section-title">
                              <span>👤</span> Personal Information
                            </h3>
                            <button type="button" className="review-edit-btn" onClick={() => goToStep(2)}>
                              ✏️ Edit Personal
                            </button>
                          </div>
                          <div className="review-data-grid">
                            <div className="review-item">
                              <label>Candidate Name</label>
                              <span>{formData.fullName}</span>
                            </div>
                            <div className="review-item">
                              <label>Date of Birth</label>
                              <span>{formData.dob}</span>
                            </div>
                            <div className="review-item">
                              <label>Gender</label>
                              <span>{formData.gender}</span>
                            </div>
                            <div className="review-item">
                              <label>Nationality</label>
                              <span>{formData.nationality}</span>
                            </div>
                            <div className="review-item">
                              <label>Father's / Guardian's Name</label>
                              <span>{formData.guardianName}</span>
                            </div>
                            {formData.motherName && (
                              <div className="review-item">
                                <label>Mother's Name</label>
                                <span>{formData.motherName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Section 3: Contact Information */}
                        <div className="review-section-card">
                          <div className="review-section-header">
                            <h3 className="review-section-title">
                              <span>📍</span> Contact Information
                            </h3>
                            <button type="button" className="review-edit-btn" onClick={() => goToStep(3)}>
                              ✏️ Edit Contact
                            </button>
                          </div>
                          <div className="review-data-grid">
                            <div className="review-item">
                              <label>Email Address</label>
                              <span>{formData.email}</span>
                            </div>
                            <div className="review-item">
                              <label>Mobile Number</label>
                              <span>{formData.mobile}</span>
                            </div>
                            {formData.altMobile && (
                              <div className="review-item">
                                <label>Alternate Phone</label>
                                <span>{formData.altMobile}</span>
                              </div>
                            )}
                            <div className="review-item">
                              <label>Address</label>
                              <span>{formData.address}</span>
                            </div>
                            <div className="review-item">
                              <label>Location & PIN</label>
                              <span>{formData.city}, {formData.district}, {formData.state} - {formData.pincode}</span>
                            </div>
                          </div>
                        </div>

                        {/* Review Section 4: Educational Information */}
                        <div className="review-section-card">
                          <div className="review-section-header">
                            <h3 className="review-section-title">
                              <span>📚</span> Educational Information
                            </h3>
                            <button type="button" className="review-edit-btn" onClick={() => goToStep(4)}>
                              ✏️ Edit Education
                            </button>
                          </div>
                          <div className="review-data-grid">
                            <div className="review-item">
                              <label>Highest Qualification</label>
                              <span>{formData.qualification}</span>
                            </div>
                            <div className="review-item">
                              <label>Previous Institution</label>
                              <span>{formData.institutionName}</span>
                            </div>
                            <div className="review-item">
                              <label>Board / University</label>
                              <span>{formData.boardUniversity}</span>
                            </div>
                            <div className="review-item">
                              <label>Year of Passing</label>
                              <span>{formData.passingYear}</span>
                            </div>
                            {formData.percentage && (
                              <div className="review-item">
                                <label>Score / Percentage</label>
                                <span>{formData.percentage}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Review Section 5: Uploaded Documents */}
                        <div className="review-section-card">
                          <div className="review-section-header">
                            <h3 className="review-section-title">
                              <span>📎</span> Uploaded Documents
                            </h3>
                            <button type="button" className="review-edit-btn" onClick={() => goToStep(5)}>
                              ✏️ Edit Documents
                            </button>
                          </div>
                          <div className="review-data-grid">
                            <div className="review-item">
                              <label>Candidate Photograph</label>
                              <span>{formData.documents.photo ? `✓ ${formData.documents.photo.name}` : 'Not Uploaded'}</span>
                            </div>
                            <div className="review-item">
                              <label>Identity Proof</label>
                              <span>{formData.documents.idProof ? `✓ ${formData.documents.idProof.name}` : 'Not Uploaded'}</span>
                            </div>
                            <div className="review-item">
                              <label>Qualification Certificate</label>
                              <span>{formData.documents.certificate ? `✓ ${formData.documents.certificate.name}` : 'Not Uploaded'}</span>
                            </div>
                            <div className="review-item">
                              <label>Mark Sheet</label>
                              <span>{formData.documents.marksheet ? `✓ ${formData.documents.marksheet.name}` : 'Optional (Not Uploaded)'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Payment Handling Note */}
                        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px 18px', marginBottom: '20px', fontSize: '12.5px', color: '#334155' }}>
                          💡 <strong>Notice regarding Admission Fee:</strong> No payment is collected during online application submission. Following academic council scrutiny, verified applicants will receive official fee remittance links via email and the Student Portal.
                        </div>

                        {/* Confirmation Checkbox */}
                        <div style={{ marginBottom: '24px' }}>
                          <label
                            className="checkbox-label"
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              color: '#0f274a',
                              fontWeight: 600
                            }}
                          >
                            <input
                              type="checkbox"
                              name="confirmed"
                              checked={formData.confirmed}
                              onChange={handleChange}
                              style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                            />
                            <span>
                              I confirm that the information provided in this application is accurate to the best of my knowledge.
                            </span>
                          </label>
                          {errors.confirmed && <span className="field-error-msg" style={{ marginLeft: '28px' }}>{errors.confirmed}</span>}
                        </div>

                        {submissionError && (
                          <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', color: '#b91c1c', fontSize: '13px', marginBottom: '16px' }}>
                            {submissionError}
                          </div>
                        )}

                        <div className="wizard-actions">
                          <button type="button" className="btn-secondary" onClick={prevStep} disabled={isSubmitting}>
                            &larr; Back to Documents
                          </button>
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={handleSubmitApplication}
                            disabled={isSubmitting || !formData.confirmed}
                            style={{ minWidth: '180px' }}
                          >
                            {isSubmitting ? 'Submitting Application...' : 'Submit Application &rarr;'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* APPLICATION SUCCESS CONFIRMATION SCREEN */
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          background: '#dcfce7',
                          color: '#16a34a',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '32px',
                          margin: '0 auto 12px'
                        }}
                      >
                        ✓
                      </div>
                      <h2 style={{ color: '#0b326b', fontSize: '24px', fontWeight: 800 }}>
                        Application Submitted Successfully!
                      </h2>
                      <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
                        Your admission form has been received and logged into the NCTMS Central Academic Registry.
                      </p>
                    </div>

                    <div
                      style={{
                        background: '#eff6ff',
                        border: '2px dashed #0c57c4',
                        borderRadius: '10px',
                        padding: '20px',
                        textAlign: 'center',
                        marginBottom: '24px'
                      }}
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                        Official Application Reference Number
                      </span>
                      <h3 style={{ fontSize: '28px', color: '#0c57c4', fontFamily: 'monospace', margin: '6px 0' }}>
                        {submittedApp.appId}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>
                        Please save this reference number to track your application verification and receive enrollment credentials.
                      </p>
                    </div>

                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '13px',
                        marginBottom: '20px'
                      }}
                    >
                      <div className="review-data-grid">
                        <div><strong>Candidate Name:</strong> <span>{submittedApp.fullName}</span></div>
                        <div><strong>Submission Date:</strong> <span>{submittedApp.dateSubmitted} ({submittedApp.timestamp})</span></div>
                        <div><strong>Course Enrolled:</strong> <span>{submittedApp.courseName} ({submittedApp.courseCode})</span></div>
                        <div><strong>Study Center:</strong> <span>{submittedApp.centerName}</span></div>
                        <div><strong>Application Status:</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>{submittedApp.status}</span></div>
                        <div><strong>Course Fee:</strong> <span>{submittedApp.courseFee}</span></div>
                      </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '12px', color: '#166534', marginBottom: '24px' }}>
                      📋 <strong>Next Steps:</strong> Document scrutiny takes up to 2 business days. Provisional enrollment and LMS access details will be sent to <strong>{submittedApp.email}</strong> upon council verification.
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ flex: 1, minWidth: '160px' }}
                        onClick={() => window.print()}
                      >
                        🖨️ Print / Save Receipt
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1, minWidth: '160px' }}
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

              {/* Right Column: Guidelines & Contact */}
              <div className="admission-sidebar">
                <div className="info-side-card">
                  <h3>
                    <span>ℹ️</span> Admission Guidelines
                  </h3>
                  <ul className="side-feature-list">
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Zero application processing charges for online form submission.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Digital verification completed within 2 business days.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Flexible term tuition payment options available upon approval.</span>
                    </li>
                    <li>
                      <span className="chk-green">✓</span>
                      <span>Provisional ID & LMS credentials sent via SMS and Email.</span>
                    </li>
                  </ul>

                  <div className="helpline-box">
                    <strong>NCTMS Academic Admission Desk</strong>
                    <p style={{ margin: '4px 0' }}>Toll Free: 1800 208 9012</p>
                    <p style={{ margin: '0' }}>Email: admissions@nctms.in</p>
                    <small style={{ color: '#64748b' }}>Mon &ndash; Sat: 9:00 AM &ndash; 6:00 PM</small>
                  </div>
                </div>

                <div className="info-side-card" style={{ background: 'linear-gradient(135deg, #0f274a, #0b326b)', color: '#ffffff' }}>
                  <h3 style={{ color: '#ffffff' }}>
                    <span>🛡️</span> Recognized Standards
                  </h3>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5', margin: 0 }}>
                    NCTMS India academic programs follow national technical and vocational frameworks, delivering industry-relevant curriculums.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: TRACK APPLICATION STATUS */
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <div className="admission-card" style={{ marginBottom: '24px' }}>
                <h2 className="wizard-section-title">Track Your Admission Application</h2>
                <p className="wizard-section-subtitle">
                  Enter your assigned Application Reference Number to check real-time admission verification progress.
                </p>

                <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Enter Application ID (e.g. NCTMS-APP-2026-8841)"
                    value={trackAppId}
                    onChange={(e) => setTrackAppId(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '240px',
                      padding: '12px 16px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                    aria-label="Enter Application Reference ID"
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                    Track Application
                  </button>
                </form>

                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                  <span>Verified sample records: </span>
                  <button
                    type="button"
                    style={{ color: '#0c57c4', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                    onClick={() => setTrackAppId('NCTMS-APP-2026-8841')}
                  >
                    NCTMS-APP-2026-8841
                  </button>
                  <span>&bull;</span>
                  <button
                    type="button"
                    style={{ color: '#0c57c4', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}
                    onClick={() => setTrackAppId('NCTMS-APP-2026-8842')}
                  >
                    NCTMS-APP-2026-8842
                  </button>
                </div>

                {trackError && (
                  <div style={{ marginTop: '16px', padding: '12px', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '6px', color: '#b91c1c', fontSize: '13px' }} role="alert">
                    {trackError}
                  </div>
                )}
              </div>

              {/* Track Status Result Card */}
              {trackResult && (
                <div className="admission-card">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #e2e8f0',
                      paddingBottom: '14px',
                      marginBottom: '20px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>APPLICATION TRACKING</span>
                      <h3 style={{ fontSize: '20px', color: '#0b326b', margin: '2px 0' }}>{trackResult.appId}</h3>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Submitted on: {trackResult.dateSubmitted}</p>
                    </div>
                    <span
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #86efac'
                      }}
                    >
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
                          <div
                            style={{
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
                            }}
                          >
                            {item.done ? '✓' : item.stepNum}
                          </div>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontWeight: item.done ? 700 : 500,
                              color: item.done ? '#0f172a' : '#94a3b8',
                              textAlign: 'center'
                            }}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', fontSize: '13px', marginBottom: '20px' }}>
                    <div className="review-data-grid">
                      <div><strong>Candidate:</strong> <span>{trackResult.fullName}</span></div>
                      <div><strong>Course Applied:</strong> <span>{trackResult.courseName}</span></div>
                      <div><strong>Study Center:</strong> <span>{trackResult.centerName}</span></div>
                      <div><strong>Official Remarks:</strong> <span>{trackResult.remarks}</span></div>
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

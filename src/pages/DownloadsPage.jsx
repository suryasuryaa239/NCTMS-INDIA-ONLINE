import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { DOWNLOADS_DATA, OFFICIAL_PUBLICATIONS_DATA } from '../data/downloadsData';

export default function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionTab, setActiveSectionTab] = useState('services'); // 'services' | 'publications'

  // Modals state
  const [previewForm, setPreviewForm] = useState(null);
  const [onlineReqForm, setOnlineReqForm] = useState(null);
  const [reqSubmittedId, setReqSubmittedId] = useState(null);

  // Form submission fields for online requisition
  const [applicantName, setApplicantName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unique accessible IDs
  const searchInputId = useId();

  const categories = [
    'All',
    'Certification & Transfer',
    'Document Re-issuance',
    'Record Corrections',
    'Convocations & Degrees',
    'Institutional Services'
  ];

  // Filter application services
  const filteredServices = DOWNLOADS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  // Filter official publications
  const filteredPublications = OFFICIAL_PUBLICATIONS_DATA.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  // Handle Online Requisition Submission
  const handleOnlineReqSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const token = `NCTMS-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setReqSubmittedId(token);
    }, 500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const handleDownloadPublication = (pub) => {
    if (!pub.downloadAvailable) {
      alert(`Notice: ${pub.title} (${pub.code}) is pending annual gazette release by the council secretariat.`);
      return;
    }
    alert(`Downloading official council publication: ${pub.title} (${pub.size}).`);
  };

  return (
    <PublicLayout>
      {/* 1. PAGE HEADER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Applications &amp; Downloads</span>
            </nav>
            <h1>Applications &amp; Downloads</h1>
            <p className="subpage-hero-subtitle">
              Access official council application forms, service requisitions, curriculum handbooks, and regulatory downloads.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📄</span>
            <div>
              <strong>Official Forms Archive</strong>
              <span>Verified Council Proforma 2026-2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* Section Switcher & Search Bar */}
          <div className="courses-filter-bar" role="search" aria-label="Search and filter applications and downloads">
            {/* Search Input */}
            <div className="courses-search-row">
              <div className="courses-search-input-wrap">
                <svg
                  className="courses-search-icon"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  id={searchInputId}
                  type="text"
                  placeholder="Search application forms or publications (e.g. Migration, TC, Duplicate, Prospectus)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search applications and documents by title, keyword, or code"
                />
              </div>

              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetFilters}
                  style={{ padding: '8px 16px', fontSize: '12.5px', whiteSpace: 'nowrap' }}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* View Switcher: Application Services vs Official Publications */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`category-pill ${activeSectionTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveSectionTab('services')}
                style={{ fontWeight: 700 }}
              >
                📋 Application Services ({filteredServices.length})
              </button>
              <button
                type="button"
                className={`category-pill ${activeSectionTab === 'publications' ? 'active' : ''}`}
                onClick={() => setActiveSectionTab('publications')}
                style={{ fontWeight: 700 }}
              >
                📚 Official Council Publications ({filteredPublications.length})
              </button>
            </div>

            {/* Category Filter Pills (Only for Services view) */}
            {activeSectionTab === 'services' && (
              <div className="category-pills" style={{ marginTop: '12px' }}>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Summary Bar */}
          <div
            style={{
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>
              Showing{' '}
              <strong style={{ color: '#0b326b' }}>
                {activeSectionTab === 'services' ? filteredServices.length : filteredPublications.length}
              </strong>{' '}
              {activeSectionTab === 'services' ? 'Requisition Services' : 'Downloadable Publications'}
            </span>
          </div>

          {/* SECTION 1: APPLICATION SERVICES */}
          {activeSectionTab === 'services' && (
            <div>
              <div className="apps-section-header">
                <h2 className="apps-section-title">
                  <span>📋</span> Student &amp; Institutional Application Services
                </h2>
                <p className="apps-section-subtitle">
                  Apply online for official certificates, duplicate transcripts, record corrections, and institutional center inspection.
                </p>
              </div>

              {filteredServices.length > 0 ? (
                <div className="downloads-grid">
                  {filteredServices.map((doc) => (
                    <article key={doc.id} className="download-card">
                      {/* Code and Status Pill */}
                      <div className="download-card-header">
                        <span className="download-form-code">{doc.code}</span>
                        <span className="service-status-pill">{doc.status}</span>
                      </div>

                      {/* Title and Description */}
                      <h3 className="download-card-title">{doc.title}</h3>
                      <p className="download-card-desc">{doc.description}</p>

                      {/* Eligibility Box */}
                      <div className="service-eligibility-box">
                        <strong>Eligibility:</strong> {doc.eligibility}
                      </div>

                      {/* Fee and Turnaround Meta */}
                      <div className="download-card-meta">
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Processing Fee
                          </span>
                          <strong style={{ color: '#0c57c4' }}>{doc.fee}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Estimated Turnaround
                          </span>
                          <strong style={{ color: '#0f274a' }}>{doc.turnaround}</strong>
                        </div>
                      </div>

                      {/* Required Enclosures */}
                      <div style={{ marginBottom: '16px', flexGrow: 1 }}>
                        <small style={{ fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                          Required Enclosures:
                        </small>
                        <ul style={{ fontSize: '11.5px', color: '#64748b', paddingLeft: '16px', margin: 0, lineHeight: '1.45' }}>
                          {doc.documentsRequired.slice(0, 3).map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                          {doc.documentsRequired.length > 3 && (
                            <li style={{ color: '#0c57c4', fontWeight: 600 }}>
                              +{doc.documentsRequired.length - 3} more enclosures...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Action Buttons: Preview/Print and Apply Online */}
                      <div className="download-card-actions">
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setPreviewForm(doc)}
                          aria-label={`Preview official format for ${doc.title}`}
                        >
                          👁️ Preview &amp; Print
                        </button>
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={() => {
                            setOnlineReqForm(doc);
                            setReqSubmittedId(null);
                            setApplicantName('');
                            setRollNumber('');
                            setMobileNumber('');
                            setEmailAddress('');
                            setPostalAddress('');
                          }}
                          aria-label={`Apply online for ${doc.title}`}
                        >
                          ⚡ Apply Online
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '56px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🔍</span>
                  <h3 style={{ fontSize: '18px', color: '#0f274a', margin: '0 0 6px', fontWeight: 700 }}>
                    No application services found matching your criteria.
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px' }}>
                    Try adjusting your search query or reset the category filter.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleResetFilters}
                    style={{ padding: '10px 22px', borderRadius: '8px' }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: OFFICIAL DOWNLOADS SECTION */}
          {activeSectionTab === 'publications' && (
            <div>
              <div className="apps-section-header">
                <h2 className="apps-section-title">
                  <span>📚</span> Official Council Publications &amp; Manuals
                </h2>
                <p className="apps-section-subtitle">
                  Download authenticated council prospectuses, codes of academic conduct, examination regulations, and institutional manuals.
                </p>
              </div>

              {filteredPublications.length > 0 ? (
                <div className="publications-grid">
                  {filteredPublications.map((pub) => (
                    <article key={pub.id} className="publication-card">
                      {/* Code and Format */}
                      <div className="publication-card-header">
                        <span className="download-form-code">{pub.code}</span>
                        <span className="publication-format-tag">
                          <span>📄</span> {pub.format}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 className="publication-title">{pub.title}</h3>
                      <p className="publication-desc">{pub.description}</p>

                      {/* Meta bar: File size & Status */}
                      <div className="publication-meta-bar">
                        <span>
                          File Size: <strong>{pub.size}</strong>
                        </span>
                        <span
                          className={`service-status-pill ${!pub.downloadAvailable ? 'unavailable' : ''}`}
                        >
                          {pub.status}
                        </span>
                      </div>

                      {/* Download Action */}
                      <div style={{ marginTop: 'auto' }}>
                        {pub.downloadAvailable ? (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ width: '100%', padding: '10px 16px', fontSize: '13px' }}
                            onClick={() => handleDownloadPublication(pub)}
                            aria-label={`Download ${pub.title}`}
                          >
                            ⬇ Download PDF ({pub.size})
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-secondary"
                            disabled
                            style={{ width: '100%', padding: '10px 16px', fontSize: '12.5px', opacity: 0.65, cursor: 'not-allowed' }}
                            title="Pending annual gazette release by council registrar"
                          >
                            🔒 Pending Council Release
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '56px 20px', background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
                  <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🔍</span>
                  <h3 style={{ fontSize: '18px', color: '#0f274a', margin: '0 0 6px', fontWeight: 700 }}>
                    No publications found matching your query.
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px' }}>
                    Try clearing your search query to explore all available council documents.
                  </p>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleResetFilters}
                    style={{ padding: '10px 22px', borderRadius: '8px' }}
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* MODAL 1: OFFICIAL PRINTABLE PROFORMA PREVIEW */}
      {previewForm && (
        <div className="modal-backdrop" onClick={() => setPreviewForm(null)} role="dialog" aria-modal="true">
          <div
            className="modal-box large-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '780px' }}
          >
            <button
              className="modal-close-btn"
              onClick={() => setPreviewForm(null)}
              aria-label="Close Preview"
            >
              &times;
            </button>

            {/* Printable Form Sheet */}
            <div style={{ border: '2px solid #0b326b', padding: '24px', borderRadius: '6px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0b326b', paddingBottom: '12px', marginBottom: '16px' }}>
                <img
                  src="/assets/images/nctms-logo.svg"
                  alt="NCTMS Emblem"
                  width="56"
                  height="56"
                  style={{ margin: '0 auto 6px', display: 'block' }}
                />
                <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, margin: 0 }}>
                  NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES
                </h3>
                <p style={{ fontSize: '12px', color: '#334155', fontWeight: 600, margin: '4px 0 0' }}>
                  OFFICIAL REQUISITION FORM &mdash; {previewForm.code}
                </p>
                <h4 style={{ fontSize: '15px', color: '#0c57c4', marginTop: '6px', fontWeight: 700 }}>
                  {previewForm.title}
                </h4>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px', flexWrap: 'wrap', gap: '6px' }}>
                <span>Prescribed Fee: <strong>{previewForm.fee}</strong></span>
                <span>Expected Dispatch: <strong>{previewForm.turnaround}</strong></span>
                <span>Category: <strong>{previewForm.category}</strong></span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13px', color: '#0b326b', marginBottom: '8px', fontWeight: 800 }}>
                  PART A: APPLICANT PARTICULARS
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  {previewForm.fields.map((f, idx) => (
                    <div key={idx} style={{ borderBottom: '1px dotted #94a3b8', paddingBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>{f.name}: ___________________________</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13px', color: '#0b326b', marginBottom: '6px', fontWeight: 800 }}>
                  PART B: MANDATORY ENCLOSURES CHECKLIST
                </h5>
                <ul style={{ fontSize: '12px', color: '#334155', paddingLeft: '18px', margin: 0 }}>
                  {previewForm.documentsRequired.map((docReq, dIdx) => (
                    <li key={dIdx} style={{ marginBottom: '3px' }}>
                      [&nbsp;&nbsp;] {docReq}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 4px' }}>Date: _______________</p>
                  <p style={{ margin: 0 }}>Place: _______________</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '150px', borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                  <span>Signature of the Candidate</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => window.print()}
                >
                  🖨️ Print Form Format
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    alert(`Official printable proforma ${previewForm.code} downloaded successfully.`);
                    setPreviewForm(null);
                  }}
                >
                  📥 Save Clean Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ONLINE REQUISITION SUBMISSION MODAL */}
      {onlineReqForm && (
        <div className="modal-backdrop" onClick={() => setOnlineReqForm(null)} role="dialog" aria-modal="true">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setOnlineReqForm(null)}
              aria-label="Close Application"
            >
              &times;
            </button>

            {!reqSubmittedId ? (
              <>
                <div className="modal-header">
                  <span className="course-code-tag">{onlineReqForm.code}</span>
                  <h3 style={{ marginTop: '6px', fontSize: '18px', color: '#0b326b' }}>
                    Online Service Requisition
                  </h3>
                  <p className="modal-desc" style={{ fontSize: '13px' }}>{onlineReqForm.title}</p>
                </div>

                <form onSubmit={handleOnlineReqSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Candidate Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alexander James Thompson"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Registration / Roll Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. NCTMS2026CS1092"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      placeholder="candidate@example.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Dispatch Postal Address with PIN Code *</label>
                    <input
                      type="text"
                      placeholder="Complete address for speed post dispatch"
                      value={postalAddress}
                      onChange={(e) => setPostalAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Processing Fee Payable</label>
                    <input type="text" value={onlineReqForm.fee} readOnly className="bold-input" />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary full-btn"
                    disabled={isSubmitting}
                    style={{ marginTop: '10px' }}
                  >
                    {isSubmitting ? 'Submitting Requisition...' : 'Proceed to Submit Requisition &rarr;'}
                  </button>
                </form>
              </>
            ) : (
              /* Success Screen */
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: '#dcfce7',
                    color: '#16a34a',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    margin: '0 auto 12px'
                  }}
                >
                  ✓
                </div>
                <h3 style={{ color: '#0b326b', fontSize: '20px', marginBottom: '6px', fontWeight: 800 }}>
                  Service Requisition Logged!
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                  Your request for <strong>{onlineReqForm.title}</strong> has been received by the academic registrar desk.
                </p>

                <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '8px', border: '1px dashed #0c57c4', marginBottom: '18px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Official Requisition Token
                  </span>
                  <div style={{ fontSize: '22px', color: '#0c57c4', fontWeight: 800, fontFamily: 'monospace', margin: '4px 0' }}>
                    {reqSubmittedId}
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#475569' }}>
                    Turnaround: {onlineReqForm.turnaround} &bull; Speed Post Tracking will be sent to {mobileNumber || 'your mobile'}.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => window.print()}
                  >
                    🖨️ Print Token
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => setOnlineReqForm(null)}
                  >
                    Done &amp; Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { DOWNLOADS_DATA } from '../data/downloadsData';

export default function DownloadsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewForm, setPreviewForm] = useState(null);
  const [onlineReqForm, setOnlineReqForm] = useState(null);
  const [reqSubmittedId, setReqSubmittedId] = useState(null);

  const categories = ['All', 'Certification & Transfer', 'Convocations & Degrees', 'Document Re-issuance', 'Record Corrections', 'Institutional Services'];

  const filteredDownloads = DOWNLOADS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOnlineReqSubmit = (e) => {
    e.preventDefault();
    const token = `NCTMS-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setReqSubmittedId(token);
  };

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Applications & Official Downloads</span>
            </div>
            <h1>Applications & Official Council Downloads</h1>
            <p className="subpage-hero-subtitle">
              Download standard proforma documents, academic forms, transfer certificate requisitions, and affiliation inspection manuals.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📄</span>
            <div>
              <strong>Official Forms Archive</strong>
              <span>Updated Formats for 2026-2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="content-section">
        <div className="container">

          {/* Filter Bar */}
          <div className="courses-filter-bar">
            <div className="courses-search-row">
              <div className="courses-search-input-wrap">
                <svg className="courses-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search application form by name or code (e.g. Migration, TC, Duplicate, Affiliation)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="category-pills">
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
          </div>

          {/* Grid of Downloadable Forms */}
          <div className="downloads-grid">
            {filteredDownloads.map((doc) => (
              <div key={doc.id} className="download-card">
                <div className="download-card-header">
                  <span className="download-form-code">{doc.code}</span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{doc.category}</span>
                </div>

                <h3 className="download-card-title">{doc.title}</h3>
                <p className="download-card-desc">{doc.description}</p>

                <div className="download-card-meta">
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Processing Fee</span>
                    <strong style={{ color: '#0c57c4' }}>{doc.fee}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px', textTransform: 'uppercase' }}>Expected Turnaround</span>
                    <strong>{doc.turnaround}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <small style={{ fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Required Enclosures:</small>
                  <ul style={{ fontSize: '11.5px', color: '#64748b', paddingLeft: '14px', lineHeight: '1.4' }}>
                    {doc.documentsRequired.slice(0, 2).map((req, rIdx) => (
                      <li key={rIdx}>{req}</li>
                    ))}
                    {doc.documentsRequired.length > 2 && (
                      <li style={{ color: '#0c57c4', fontWeight: 600 }}>+{doc.documentsRequired.length - 2} more enclosures...</li>
                    )}
                  </ul>
                </div>

                <div className="download-card-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setPreviewForm(doc)}
                  >
                    👁️ Preview & Print
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => { setOnlineReqForm(doc); setReqSubmittedId(null); }}
                  >
                    ⚡ Apply Online
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDownloads.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '12px' }}>
              <p style={{ color: '#64748b', fontSize: '14px' }}>No official applications found matching your criteria.</p>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ marginTop: '10px' }}
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Official Form Preview Modal (Printable) */}
      {previewForm && (
        <div className="modal-backdrop" onClick={() => setPreviewForm(null)}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <button className="modal-close-btn" onClick={() => setPreviewForm(null)}>&times;</button>
            
            {/* Printable Form Sheet */}
            <div style={{ border: '2px solid #0b326b', padding: '24px', borderRadius: '6px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0b326b', paddingBottom: '12px', marginBottom: '16px' }}>
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="56" height="56" style={{ margin: '0 auto 6px', display: 'block' }} />
                <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800 }}>NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES</h3>
                <p style={{ fontSize: '12px', color: '#334155', fontWeight: 600 }}>OFFICIAL REQUISITION FORM — {previewForm.code}</p>
                <h4 style={{ fontSize: '15px', color: '#0c57c4', marginTop: '6px' }}>{previewForm.title}</h4>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: '#f8fafc', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px' }}>
                <span>Prescribed Fee: <strong>{previewForm.fee}</strong></span>
                <span>Expected Dispatch: <strong>{previewForm.turnaround}</strong></span>
                <span>Category: <strong>{previewForm.category}</strong></span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13px', color: '#0b326b', marginBottom: '8px' }}>PART A: APPLICANT PARTICULARS</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  {previewForm.fields.map((f, idx) => (
                    <div key={idx} style={{ borderBottom: '1px dotted #94a3b8', paddingBottom: '4px' }}>
                      <span style={{ color: '#64748b' }}>{f.name}: ___________________________</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ fontSize: '13px', color: '#0b326b', marginBottom: '6px' }}>PART B: MANDATORY ENCLOSURES CHECKLIST</h5>
                <ul style={{ fontSize: '12px', color: '#334155', paddingLeft: '18px' }}>
                  {previewForm.documentsRequired.map((docReq, dIdx) => (
                    <li key={dIdx} style={{ marginBottom: '3px' }}>
                      [ &nbsp; ] {docReq}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '12px' }}>
                <div>
                  <p>Date: _______________</p>
                  <p>Place: _______________</p>
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
                  onClick={() => alert(`Official printable form ${previewForm.code} saved to downloads.`)}
                >
                  📥 Download Clean Form PDF
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Online Digital Requisition Submission Modal */}
      {onlineReqForm && (
        <div className="modal-backdrop" onClick={() => setOnlineReqForm(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setOnlineReqForm(null)}>&times;</button>
            
            {!reqSubmittedId ? (
              <>
                <div className="modal-header">
                  <span className="course-code-tag">{onlineReqForm.code}</span>
                  <h3 style={{ marginTop: '6px' }}>Online Requisition Submission</h3>
                  <p className="modal-desc">{onlineReqForm.title}</p>
                </div>

                <form onSubmit={handleOnlineReqSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Candidate Full Name *</label>
                    <input type="text" placeholder="e.g. Alexander James Thompson" required />
                  </div>
                  <div className="form-group">
                    <label>Registration / Roll Number *</label>
                    <input type="text" placeholder="e.g. NCTMS2026CS1092" required />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number (WhatsApp) *</label>
                    <input type="tel" placeholder="+91 98765 43210" required />
                  </div>
                  <div className="form-group">
                    <label>Dispatch Postal Address with PIN Code *</label>
                    <input type="text" placeholder="Complete address for speed post dispatch" required />
                  </div>
                  <div className="form-group">
                    <label>Processing Fee Payable</label>
                    <input type="text" value={onlineReqForm.fee} readOnly className="bold-input" />
                  </div>

                  <button type="submit" className="btn-primary full-btn" style={{ marginTop: '10px' }}>
                    Proceed to Submit & Pay Fee &rarr;
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '56px', height: '56px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px' }}>
                  ✓
                </div>
                <h3 style={{ color: '#0b326b', fontSize: '20px', marginBottom: '6px' }}>Requisition Logged!</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                  Your service request for {onlineReqForm.title} has been received.
                </p>
                <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px dashed #0c57c4', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>REQUISITION TOKEN</span>
                  <div style={{ fontSize: '22px', color: '#0c57c4', fontWeight: 800, fontFamily: 'monospace' }}>
                    {reqSubmittedId}
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-primary full-btn"
                  onClick={() => setOnlineReqForm(null)}
                >
                  Close & Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </PublicLayout>
  );
}

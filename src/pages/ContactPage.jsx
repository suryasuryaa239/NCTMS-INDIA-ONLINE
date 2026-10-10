// src/pages/ContactPage.jsx
import React, { useState, useEffect, useId, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import {
  ENQUIRY_CATEGORIES,
  validateEnquiryForm,
  submitEnquiry,
  generateMailtoUrl
} from '../services/contactService.js';
import { FAQ_DATA, FAQ_CATEGORIES } from '../data/faqData.js';

export default function ContactPage() {
  // Document title
  useEffect(() => {
    document.title = 'Contact Us | NCTMS INDIA ONLINE';
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Admission',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // FAQ Accordion State (Supports opening multiple questions)
  const [openFaqIds, setOpenFaqIds] = useState(new Set(['faq-adm-1', 'faq-crt-1']));
  const [faqCategory, setFaqCategory] = useState('All');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');

  // Form Field IDs for Accessibility
  const nameInputId = useId();
  const emailInputId = useId();
  const phoneInputId = useId();
  const categorySelectId = useId();
  const subjectInputId = useId();
  const messageTextareaId = useId();
  const faqSearchInputId = useId();

  // Toggle FAQ Item
  const toggleFaq = (id) => {
    setOpenFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand / Collapse All
  const handleExpandAllFaqs = () => {
    const allIds = FAQ_DATA.map((f) => f.id);
    setOpenFaqIds(new Set(allIds));
  };

  const handleCollapseAllFaqs = () => {
    setOpenFaqIds(new Set());
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = faqCategory === 'All' || item.category === faqCategory;
      const q = faqSearchQuery.trim().toLowerCase();
      if (!q) return matchCat;
      const matchText =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.keywords && item.keywords.toLowerCase().includes(q));
      return matchCat && matchText;
    });
  }, [faqCategory, faqSearchQuery]);

  // Handle Form Change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-level error on edit
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitResult(null);

    // Validate inputs
    const { isValid, errors } = validateEnquiryForm(formData);
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const result = await submitEnquiry(formData);
      setSubmitResult(result);
    } catch {
      setSubmitResult({
        success: false,
        backendUnavailable: true,
        message: 'Network disruption. Please email helpdesk@nctms.in directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      {/* 1. HERO BANNER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Contact Us</span>
            </nav>
            <h1>Contact Us</h1>
            <p className="subpage-hero-subtitle">
              Have an academic enquiry, need verification assistance, or want to connect with an affiliated study center? Our central council secretariat and regional directorates are here to assist you.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📞</span>
            <div>
              <strong>Council Helpdesk</strong>
              <span>Mon – Sat: 9:00 AM – 6:00 PM IST</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFORMATION CARDS */}
      <section className="content-section" style={{ paddingBottom: '20px' }}>
        <div className="container">
          <div className="contact-info-grid">
            
            {/* Card 1: Headquarters & Address */}
            <div className="contact-info-card">
              <div className="contact-card-icon">🏛️</div>
              <h2 className="contact-card-title">National Headquarters</h2>
              <p className="contact-card-desc">
                National Council for Technical and Management Studies
              </p>
              <address className="contact-address-text">
                42, Mount Road, Guindy, Chennai – 600032,<br />
                Tamil Nadu, India.
              </address>
              <a
                href="https://www.google.com/maps/search/?api=1&query=42+Mount+Road+Guindy+Chennai+600032"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card-action"
              >
                📍 Open in Google Maps &rarr;
              </a>
            </div>

            {/* Card 2: Official Phone Lines */}
            <div className="contact-info-card">
              <div className="contact-card-icon">📞</div>
              <h2 className="contact-card-title">Telephone Helplines</h2>
              <p className="contact-card-desc">
                Direct council lines for admission, examination, and student support.
              </p>
              <div className="contact-channel-list">
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Primary Exchange:</span>
                  <a href="tel:+914428550192" className="contact-phone-link">+91 44 2855 0192</a>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Secondary Helpline:</span>
                  <a href="tel:+914422358901" className="contact-phone-link">+91 44 2235 8901</a>
                </div>
              </div>
              <span className="contact-hours-badge">
                ⏰ Mon – Sat: 9:00 AM – 6:00 PM IST
              </span>
            </div>

            {/* Card 3: Official Email Channels */}
            <div className="contact-info-card">
              <div className="contact-card-icon">✉️</div>
              <h2 className="contact-card-title">Official Email Desks</h2>
              <p className="contact-card-desc">
                Targeted departmental correspondence channels.
              </p>
              <div className="contact-channel-list">
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>General Student Helpdesk:</span>
                  <a href="mailto:helpdesk@nctms.in" className="contact-email-link">helpdesk@nctms.in</a>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Certificate Verification:</span>
                  <a href="mailto:verification@nctms.in" className="contact-email-link">verification@nctms.in</a>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Council Secretariat:</span>
                  <a href="mailto:secretariat@nctms.in" className="contact-email-link">secretariat@nctms.in</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONTACT FORM & REGIONAL HUBS */}
      <section className="content-section" style={{ paddingTop: '10px' }}>
        <div className="container">
          <div className="contact-main-grid">

            {/* Left: Validated Enquiry Form */}
            <div className="contact-form-panel">
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0c57c4', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Online Assistance Desk
              </span>
              <h2 style={{ fontSize: '22px', color: '#0b326b', margin: '4px 0 8px', fontWeight: 800 }}>
                Send Official Enquiry
              </h2>
              <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '22px', lineHeight: 1.5 }}>
                Fill out the form below. We will review your query and respond to your registered email address.
              </p>

              {/* Status Message: Backend Unavailable Notification */}
              {submitResult && submitResult.backendUnavailable && (
                <div className="contact-alert-box warning" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '24px' }}>⚠️</span>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#92400e', display: 'block', marginBottom: '4px' }}>
                        Online Submission Gateway in Read-Only Mode
                      </strong>
                      <p style={{ fontSize: '13px', color: '#78350f', margin: '0 0 12px', lineHeight: 1.5 }}>
                        {submitResult.message}
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a
                          href={generateMailtoUrl(formData)}
                          className="btn-primary"
                          style={{ padding: '8px 18px', fontSize: '12.5px', textDecoration: 'none' }}
                        >
                          ✉️ Dispatch via Email Client (Pre-Filled)
                        </a>
                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => setSubmitResult(null)}
                          style={{ padding: '8px 16px', fontSize: '12.5px' }}
                        >
                          Dismiss Alert
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Message: Verified Backend Confirmation */}
              {submitResult && submitResult.success && (
                <div className="contact-alert-box success" style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '24px' }}>✓</span>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#166534', display: 'block', marginBottom: '4px' }}>
                        Enquiry Formally Accepted!
                      </strong>
                      <p style={{ fontSize: '13px', color: '#14532d', margin: '0 0 8px' }}>
                        Ticket Reference ID: <strong>{submitResult.ticketId}</strong>. {submitResult.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Element */}
              <form onSubmit={handleFormSubmit} noValidate>
                
                <div className="contact-form-row">
                  {/* Full Name */}
                  <div className="contact-field-group">
                    <label htmlFor={nameInputId} className="contact-label">
                      Full Name <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id={nameInputId}
                      type="text"
                      className={`contact-input ${formErrors.name ? 'has-error' : ''}`}
                      placeholder="e.g. Ramesh Krishnan"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.name && (
                      <span className="field-error-msg">{formErrors.name}</span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="contact-field-group">
                    <label htmlFor={emailInputId} className="contact-label">
                      Email Address <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      className={`contact-input ${formErrors.email ? 'has-error' : ''}`}
                      placeholder="ramesh@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.email && (
                      <span className="field-error-msg">{formErrors.email}</span>
                    )}
                  </div>
                </div>

                <div className="contact-form-row">
                  {/* Phone Number */}
                  <div className="contact-field-group">
                    <label htmlFor={phoneInputId} className="contact-label">
                      Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      id={phoneInputId}
                      type="tel"
                      className={`contact-input ${formErrors.phone ? 'has-error' : ''}`}
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    {formErrors.phone && (
                      <span className="field-error-msg">{formErrors.phone}</span>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="contact-field-group">
                    <label htmlFor={categorySelectId} className="contact-label">
                      Enquiry Category <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      id={categorySelectId}
                      className={`contact-select ${formErrors.category ? 'has-error' : ''}`}
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      disabled={isSubmitting}
                      required
                    >
                      {ENQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <span className="field-error-msg">{formErrors.category}</span>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="contact-field-group" style={{ marginBottom: '14px' }}>
                  <label htmlFor={subjectInputId} className="contact-label">
                    Subject / Concern <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    id={subjectInputId}
                    type="text"
                    className={`contact-input ${formErrors.subject ? 'has-error' : ''}`}
                    placeholder="e.g. Inquiry regarding Winter 2026 Examination Hall Ticket"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.subject && (
                    <span className="field-error-msg">{formErrors.subject}</span>
                  )}
                </div>

                {/* Message */}
                <div className="contact-field-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor={messageTextareaId} className="contact-label">
                    Message Details <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    id={messageTextareaId}
                    rows="4"
                    className={`contact-textarea ${formErrors.message ? 'has-error' : ''}`}
                    placeholder="Please describe your query in detail..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.message && (
                    <span className="field-error-msg">{formErrors.message}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                  >
                    {isSubmitting ? 'Verifying Gateway Connection...' : 'Send Enquiry Message →'}
                  </button>

                  <a
                    href={generateMailtoUrl(formData)}
                    className="btn-secondary"
                    style={{ padding: '12px 20px', fontSize: '13px', textDecoration: 'none' }}
                  >
                    ✉️ Send via Direct Email
                  </a>
                </div>

              </form>
            </div>

            {/* Right: Regional Hubs & Operational Protocols */}
            <aside className="contact-sidebar">
              <div className="contact-side-card">
                <h3 className="side-card-title">
                  <span>🌐</span> Regional Directorate Hubs
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 14px', lineHeight: 1.45 }}>
                  Zonal offices supporting study center coordination and student facilitation:
                </p>
                <div className="regional-hub-list">
                  <div className="regional-hub-item">
                    <strong>Karnataka Hub:</strong>
                    <span>Indiranagar, Bengaluru, Karnataka</span>
                  </div>
                  <div className="regional-hub-item">
                    <strong>Kerala Hub:</strong>
                    <span>MG Road, Ernakulam, Kochi, Kerala</span>
                  </div>
                  <div className="regional-hub-item">
                    <strong>Telangana Hub:</strong>
                    <span>Banjara Hills, Hyderabad, Telangana</span>
                  </div>
                  <div className="regional-hub-item">
                    <strong>Maharashtra Hub:</strong>
                    <span>Andheri East, Mumbai, Maharashtra</span>
                  </div>
                </div>
              </div>

              <div className="contact-side-card" style={{ background: '#f8fafc' }}>
                <h3 className="side-card-title">
                  <span>🛡️</span> Academic Integrity Desk
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  Organizations seeking confidential verification of academic credentials or reporting unauthorized training centers may contact the Council Vigilance Committee at <strong>verification@nctms.in</strong>.
                </p>
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="content-section" style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', marginTop: '30px' }}>
        <div className="container">
          
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 30px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0c57c4', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Institutional Knowledge Base
            </span>
            <h2 style={{ fontSize: '24px', color: '#0b326b', margin: '6px 0 10px', fontWeight: 800 }}>
              Frequently Asked Questions (FAQ)
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Find quick, verified answers regarding admissions, examinations, certificates, payments, and portal features.
            </p>
          </div>

          {/* Search & Category Filter for FAQs */}
          <div style={{ maxWidth: '820px', margin: '0 auto 24px' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <label htmlFor={faqSearchInputId} style={{ display: 'none' }}>Search FAQs</label>
              <input
                id={faqSearchInputId}
                type="text"
                placeholder="Search questions by topic, e.g. hall ticket, grading, certificate verification..."
                value={faqSearchQuery}
                onChange={(e) => setFaqSearchQuery(e.target.value)}
                className="faq-search-input"
              />
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery('')}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}
                  title="Clear search"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="faq-category-pills" role="tablist" aria-label="FAQ Categories">
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={faqCategory === cat}
                  className={`faq-category-pill ${faqCategory === cat ? 'active' : ''}`}
                  onClick={() => setFaqCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Expand / Collapse All Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: '#64748b', marginTop: '12px' }}>
              <span>
                Showing <strong>{filteredFaqs.length}</strong> questions
                {faqCategory !== 'All' && <span> in <strong>{faqCategory}</strong></span>}
                {faqSearchQuery && <span> matching &ldquo;<strong>{faqSearchQuery}</strong>&rdquo;</span>}
              </span>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleExpandAllFaqs}
                  style={{ background: 'none', border: 'none', color: '#0c57c4', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                >
                  Expand All
                </button>
                <span>&bull;</span>
                <button
                  type="button"
                  onClick={handleCollapseAllFaqs}
                  style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                >
                  Collapse All
                </button>
              </div>
            </div>

          </div>

          {/* FAQ ACCORDION ITEMS */}
          <div className="faq-accordion" style={{ maxWidth: '820px' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqIds.has(faq.id);
                const answerId = `faq-answer-${faq.id}`;
                const questionId = `faq-question-${faq.id}`;

                return (
                  <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      id={questionId}
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="faq-cat-badge">{faq.category}</span>
                        <span>{faq.question}</span>
                      </span>
                      <span className="faq-toggle-icon" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        id={answerId}
                        role="region"
                        aria-labelledby={questionId}
                        className="faq-answer"
                      >
                        <p style={{ margin: 0 }}>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 20px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🔎</span>
                <h3 style={{ fontSize: '16px', color: '#0b326b', margin: '0 0 6px' }}>No FAQ Questions Found</h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 16px' }}>
                  No questions matched your search query. You can reset filters or contact our support team directly.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setFaqSearchQuery(''); setFaqCategory('All'); }}
                    style={{ fontSize: '12.5px', padding: '6px 16px' }}
                  >
                    Reset FAQ Search
                  </button>
                  <a
                    href="#name"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="btn-primary"
                    style={{ fontSize: '12.5px', padding: '6px 16px' }}
                  >
                    Contact Support Desk
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Unresolved Questions Footer Card */}
          <div style={{ maxWidth: '820px', margin: '36px auto 0', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '22px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#0b326b', margin: '0 0 4px', fontWeight: 700 }}>
                Didn&rsquo;t find the answer you were looking for?
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Our academic counselors and technical desk officers are available to assist you.
              </p>
            </div>
            <a
              href="mailto:helpdesk@nctms.in"
              className="btn-primary"
              style={{ padding: '10px 22px', fontSize: '13px', textDecoration: 'none' }}
            >
              ✉️ Contact Helpdesk
            </a>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

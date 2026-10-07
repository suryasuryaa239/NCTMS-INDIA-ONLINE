import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Admission Enquiry',
    message: ''
  });
  const [ticketId, setTicketId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketId(`NCTMS-TKT-${Math.floor(10000 + Math.random() * 90000)}`);
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Contact Us</span>
            </div>
            <h1>Contact & Support Center</h1>
            <p className="subpage-hero-subtitle">
              Reach out to NCTMS India Headquarters and Regional Directorates for academic enquiries, admission verification, and institutional affiliations.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📞</span>
            <div>
              <strong>Council Helpdesk</strong>
              <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          <div className="admission-container">

            {/* Left: Interactive Enquiry Form */}
            <div className="admission-card">
              <h3 className="wizard-section-title">Send Official Enquiry</h3>
              <p className="wizard-section-subtitle">
                Submit your query below. Our student support team will respond within 24 working hours.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="wizard-grid">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Ramesh Krishnan" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="ramesh@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+91 98765 43210" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Enquiry Subject *</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Admission Enquiry">Admission & Course Enquiry</option>
                        <option value="Certificate Verification">Certificate & Marksheet Verification</option>
                        <option value="Exam & Hall Ticket">Examination & Hall Ticket Issue</option>
                        <option value="Institution Affiliation">Institution Center Affiliation Request</option>
                        <option value="Technical Support">Student ERP / LMS Technical Support</option>
                      </select>
                    </div>
                    <div className="form-group full-span">
                      <label>Message / Query Details *</label>
                      <textarea 
                        rows="4" 
                        required 
                        placeholder="Please write your detailed enquiry here..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
                    Send Enquiry Message &rarr;
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{ width: '56px', height: '56px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 12px' }}>
                    ✓
                  </div>
                  <h3 style={{ color: '#0b326b', fontSize: '20px', marginBottom: '8px' }}>Enquiry Submitted Successfully!</h3>
                  <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '20px' }}>
                    Thank you, {formData.name}. Ticket #{ticketId} has been assigned. An academic advisor will reach out to your registered contact.
                  </p>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', category: 'Admission Enquiry', message: '' }); }}
                  >
                    Submit Another Query
                  </button>
                </div>
              )}
            </div>

            {/* Right: Office Details */}
            <div className="admission-sidebar">
              <div className="info-side-card">
                <h3><span>🏛️</span> National Headquarters</h3>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  <strong>National Council for Technical and Management Studies</strong>
                  <p style={{ margin: '6px 0' }}>
                    42, Mount Road, Guindy, Chennai - 600032,<br />
                    Tamil Nadu, India.
                  </p>
                  <p style={{ margin: '6px 0' }}><strong>Phone:</strong> +91 44 2855 0192 / +91 44 2235 8901</p>
                  <p style={{ margin: '6px 0' }}><strong>Email:</strong> helpdesk@nctms.in</p>
                  <p style={{ margin: '6px 0' }}><strong>Web:</strong> www.nctms.in</p>
                </div>
              </div>

              <div className="info-side-card">
                <h3><span>🌐</span> Regional Directorate Hubs</h3>
                <ul className="side-feature-list">
                  <li>
                    <strong>Bengaluru Hub:</strong> Indiranagar, Bengaluru, Karnataka
                  </li>
                  <li>
                    <strong>Kochi Hub:</strong> MG Road, Ernakulam, Kochi, Kerala
                  </li>
                  <li>
                    <strong>Hyderabad Hub:</strong> Banjara Hills, Hyderabad, Telangana
                  </li>
                  <li>
                    <strong>Mumbai Hub:</strong> Andheri East, Mumbai, Maharashtra
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { INSTITUTIONS_DATA } from '../data/institutionsData';

export default function InstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  const states = ['All', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Maharashtra', 'Telangana'];

  const filteredInstitutions = INSTITUTIONS_DATA.filter((inst) => {
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'All' || inst.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <PublicLayout>
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Affiliated Institutions</span>
            </div>
            <h1>Affiliated Institutions & Study Centers</h1>
            <p className="subpage-hero-subtitle">
              Locate authorized technical institutes, polytechnic academies, healthcare training colleges, and vocational providers recognized by NCTMS India.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🏫</span>
            <div>
              <strong>Authorized Network</strong>
              <span>Pan-India Affiliated Centers</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container">
          
          <div className="courses-filter-bar">
            <div className="courses-search-row">
              <div className="courses-search-input-wrap">
                <svg className="courses-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search center by name, city, code (e.g. Chennai, NCTMS-TN-104)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="courses-level-select"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map((st, i) => (
                  <option key={i} value={st}>{st === 'All' ? 'All States across India' : st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="institutions-grid">
            {filteredInstitutions.map((inst) => (
              <div key={inst.code} className="institution-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="course-code-tag">{inst.code}</span>
                  <span className="inst-badge">{inst.status}</span>
                </div>

                <h3 style={{ fontSize: '17px', color: '#0b326b', fontWeight: 700, marginBottom: '6px' }}>{inst.name}</h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px' }}>{inst.category}</p>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', lineHeight: '1.45' }}>
                  <p style={{ marginBottom: '6px' }}><strong>📍 Address:</strong> {inst.address}</p>
                  <p style={{ marginBottom: '6px' }}><strong>📞 Phone:</strong> {inst.contact}</p>
                  <p style={{ marginBottom: '0' }}><strong>✉️ Email:</strong> {inst.email}</p>
                </div>

                <div style={{ marginBottom: '16px', flexGrow: 1 }}>
                  <strong style={{ fontSize: '11.5px', color: '#334155', display: 'block', marginBottom: '6px' }}>Approved Academic Streams:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {inst.coursesOffered.map((c, cIdx) => (
                      <span key={cIdx} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                  <Link to={`/admission?center=${inst.code}`} className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                    Select This Center &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

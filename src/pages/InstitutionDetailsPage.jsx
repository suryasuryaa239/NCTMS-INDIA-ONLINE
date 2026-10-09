import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { INSTITUTIONS_DATA } from '../data/institutionsData';

export default function InstitutionDetailsPage() {
  const { institutionId } = useParams();

  // Find institution by code (case-insensitive)
  const institution = INSTITUTIONS_DATA.find(
    (item) => item.code.toLowerCase() === (institutionId || '').toLowerCase()
  );

  // If not found, render 404 Not Found state
  if (!institution) {
    return (
      <PublicLayout>
        <section className="subpage-hero">
          <div className="container subpage-hero-container">
            <div>
              <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link> &rsaquo; <Link to="/institutions">Affiliated Institutions</Link> &rsaquo; <span>Not Found</span>
              </nav>
              <h1>Institution Not Found</h1>
              <p className="subpage-hero-subtitle">
                The requested institution profile could not be located in the NCTMS affiliated directory.
              </p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ maxWidth: '520px', margin: '0 auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '40px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏫</span>
              <h2 style={{ fontSize: '22px', color: '#0f274a', marginBottom: '10px', fontWeight: 800 }}>
                Institution Record Not Found
              </h2>
              <p style={{ color: '#64748b', fontSize: '14.5px', marginBottom: '24px', lineHeight: '1.55' }}>
                We could not find an affiliated center matching the identifier <strong>"{institutionId}"</strong>. Please verify the institution ID or explore the complete directory.
              </p>
              <Link to="/institutions" className="btn-primary" style={{ padding: '12px 26px', fontSize: '14px', borderRadius: '8px', display: 'inline-block' }}>
                &larr; Return to All Institutions
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* 1. HERO SECTION */}
      <section className="inst-detail-hero">
        <div className="container">
          <nav className="subpage-breadcrumbs" aria-label="Breadcrumb" style={{ marginBottom: '18px' }}>
            <Link to="/" style={{ color: '#93c5fd' }}>Home</Link> &rsaquo;{' '}
            <Link to="/institutions" style={{ color: '#93c5fd' }}>Affiliated Institutions</Link> &rsaquo;{' '}
            <span style={{ color: '#ffffff' }}>{institution.name}</span>
          </nav>

          <div className="inst-detail-hero-grid">
            <div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span className="course-code-tag" style={{ background: '#f59e0b', color: '#000000', fontWeight: 800 }}>
                  ID: {institution.code}
                </span>
                <span className="inst-badge" style={{ background: '#22c55e', color: '#ffffff', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px' }}>
                  ✓ {institution.status}
                </span>
                {institution.institutionType && (
                  <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', padding: '4px 10px', borderRadius: '4px', fontSize: '11.5px', fontWeight: 600 }}>
                    {institution.institutionType}
                  </span>
                )}
              </div>

              <h1>{institution.name}</h1>
              <p style={{ fontSize: '16px', color: '#e2e8f0', margin: '0 0 20px', lineHeight: '1.6' }}>
                📍 {institution.city}, {institution.district ? `${institution.district} District, ` : ''}{institution.state}
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link
                  to={`/admission?center=${institution.code}`}
                  className="btn-primary"
                  style={{ background: '#f59e0b', color: '#0f274a', borderColor: '#f59e0b', fontWeight: 700, padding: '12px 24px', fontSize: '14.5px' }}
                >
                  Apply at this Center &rarr;
                </Link>
                <Link
                  to="/institutions"
                  className="btn-secondary"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)', padding: '12px 20px', fontSize: '14px' }}
                >
                  &larr; All Institutions
                </Link>
              </div>
            </div>

            {/* Institution Image Box */}
            <div className="inst-detail-thumb-box">
              <img
                src={institution.image || '/assets/images/institutions.jpg'}
                alt={`${institution.name} campus building`}
                className="inst-detail-thumb-img"
              />
              <div className="inst-detail-thumb-caption">
                <div>
                  <strong style={{ fontSize: '13px', display: 'block', color: '#0b326b' }}>
                    {institution.category || 'Affiliated Campus'}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Est. {institution.established || '2015'} &bull; NCTMS Certified
                  </span>
                </div>
                {institution.rating && (
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#f59e0b' }}>
                    {institution.rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN DETAIL CONTENT */}
      <section className="content-section">
        <div className="container">
          <div className="inst-detail-layout">
            
            {/* Left Column: About, Courses Offered, Facilities */}
            <div>
              {/* About Card */}
              <div className="inst-detail-card">
                <h2>
                  <span>📖</span> About the Institution
                </h2>
                <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.7', margin: 0 }}>
                  {institution.about ||
                    `${institution.name} is an authorized training center affiliated with NCTMS India, providing recognized vocational, technical, and management curriculums.`}
                </p>
              </div>

              {/* Courses Offered Card */}
              <div className="inst-detail-card">
                <h2>
                  <span>🎓</span> Available Courses & Academic Streams
                </h2>
                <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '16px' }}>
                  Students admitted through this center can enroll in the following NCTMS accredited courses:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {institution.coursesOffered && institution.coursesOffered.map((crs, i) => (
                    <div
                      key={i}
                      style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ color: '#0c57c4', fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0b326b' }}>{crs}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <Link to="/courses" style={{ fontSize: '13.5px', color: '#0c57c4', fontWeight: 700, textDecoration: 'none' }}>
                    View full curriculum syllabus in Courses Directory &rarr;
                  </Link>
                </div>
              </div>

              {/* Infrastructure & Facilities Card */}
              {institution.facilities && institution.facilities.length > 0 && (
                <div className="inst-detail-card">
                  <h2>
                    <span>🏢</span> Campus Facilities & Practical Infrastructure
                  </h2>
                  <div className="inst-facilities-grid">
                    {institution.facilities.map((fac, idx) => (
                      <div key={idx} className="inst-facility-item">
                        <span style={{ color: '#16a34a', fontSize: '16px' }}>✔</span>
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Contact & Location Card, Verification Badge, Admission Box */}
            <div>
              {/* Address & Contact Information */}
              <div className="inst-detail-card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                <h2>
                  <span>📍</span> Contact & Location
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                      Postal Address
                    </strong>
                    <span style={{ color: '#0f274a', fontWeight: 600, lineHeight: '1.4' }}>
                      {institution.address}
                    </span>
                  </div>

                  <div>
                    <strong style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                      District & State
                    </strong>
                    <span style={{ color: '#0f274a', fontWeight: 600 }}>
                      {institution.city}, {institution.district ? `${institution.district}, ` : ''}{institution.state}
                    </span>
                  </div>

                  <div>
                    <strong style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                      Direct Phone
                    </strong>
                    <a href={`tel:${institution.contact}`} style={{ color: '#0c57c4', fontWeight: 700, textDecoration: 'none' }}>
                      {institution.contact}
                    </a>
                  </div>

                  <div>
                    <strong style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                      Official Email
                    </strong>
                    <a href={`mailto:${institution.email}`} style={{ color: '#0c57c4', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>
                      {institution.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Affiliation & Verification Seal */}
              <div className="inst-detail-card" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '15px', color: '#166534', fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🛡️</span> Verified Affiliation Status
                </h3>
                <p style={{ fontSize: '12.5px', color: '#15803d', lineHeight: '1.5', margin: '0 0 12px' }}>
                  This study center holds valid active recognition under the National Council for Technical and Management Studies India academic council for the current cycle.
                </p>
                <div style={{ background: '#ffffff', borderRadius: '6px', padding: '10px 14px', border: '1px solid #bbf7d0', fontSize: '12px', color: '#14532d' }}>
                  <strong>Affiliation Validity:</strong> 2026 &ndash; 2027 Academic Session
                </div>
              </div>

              {/* Select Center for Admission CTA */}
              <div className="inst-detail-card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #072652 0%, #0c57c4 100%)', color: '#ffffff' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>
                  Enroll at this Center
                </h3>
                <p style={{ fontSize: '13px', color: '#e2e8f0', margin: '0 0 16px', lineHeight: '1.5' }}>
                  Begin your online admission application with this center pre-selected as your study node.
                </p>
                <Link
                  to={`/admission?center=${institution.code}`}
                  className="btn-primary"
                  style={{ width: '100%', display: 'block', background: '#f59e0b', color: '#000000', fontWeight: 700, padding: '12px 16px' }}
                >
                  Apply Online Now &rarr;
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { COURSES_DATA } from '../data/coursesData';

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [activeCourseModal, setActiveCourseModal] = useState(null);

  const categories = [
    'All',
    'Computer Science & IT',
    'Management & Business',
    'Healthcare & Paramedical',
    'Vocational & ITI Trades'
  ];

  const levels = [
    'All',
    'Certificate',
    'Diploma',
    'Advance Diploma',
    'Post Graduate Diploma'
  ];

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <PublicLayout>
      {/* Hero Banner */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>Courses & Programmes</span>
            </div>
            <h1>Academic & Vocational Programmes</h1>
            <p className="subpage-hero-subtitle">
              Explore recognized Diploma, Post Graduate Diploma, and Certification programs certified by the National Council for Technical and Management Studies.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🎓</span>
            <div>
              <strong>Council Recognized</strong>
              <span>Curriculum Updated for 2026-2027</span>
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
                  placeholder="Search by course name, keyword, or code (e.g. Computer Science, PGDM, ADAI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select 
                className="courses-level-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="All">All Course Levels</option>
                {levels.filter(l => l !== 'All').map((lvl, idx) => (
                  <option key={idx} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Category Pills */}
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

          {/* Results Summary */}
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
              Showing {filteredCourses.length} of {COURSES_DATA.length} Available Courses
            </span>
            {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
              <button 
                type="button" 
                style={{ fontSize: '13px', color: '#0c57c4', fontWeight: 600, background: 'none' }}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
              >
                ✕ Clear All Filters
              </button>
            )}
          </div>

          {/* Courses Grid */}
          <div className="courses-grid">
            {filteredCourses.map((c) => (
              <div key={c.id} className="course-card">
                <div className="course-card-top">
                  <span className="course-code-tag">{c.code}</span>
                  <span className="course-level-badge">{c.level}</span>
                </div>

                <h3 className="course-title">{c.title}</h3>
                <p className="course-description">{c.description}</p>

                <div className="course-meta-grid">
                  <div className="meta-item">
                    <strong>Duration</strong>
                    <span>{c.duration}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Annual Fee</strong>
                    <span>{c.fees}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Eligibility</strong>
                    <span>{c.eligibility}</span>
                  </div>
                  <div className="meta-item">
                    <strong>Study Mode</strong>
                    <span>{c.mode}</span>
                  </div>
                </div>

                <div className="course-card-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setActiveCourseModal(c)}
                  >
                    View Syllabus
                  </button>
                  <Link 
                    to={`/admission?course=${c.id}`} 
                    className="btn-primary"
                  >
                    Apply Online &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🔍</span>
              <h3 style={{ fontSize: '18px', color: '#0f274a', marginBottom: '8px' }}>No courses match your search criteria</h3>
              <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '16px' }}>Try adjusting your keyword or reset filters to explore all available streams.</p>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLevel('All'); }}
              >
                Show All Courses
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Syllabus Modal */}
      {activeCourseModal && (
        <div className="modal-backdrop" onClick={() => setActiveCourseModal(null)}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveCourseModal(null)}>&times;</button>
            
            <div className="modal-header">
              <span className="course-code-tag">{activeCourseModal.code}</span>
              <h3 style={{ marginTop: '8px' }}>{activeCourseModal.title}</h3>
              <p className="modal-desc">
                {activeCourseModal.level} &bull; {activeCourseModal.duration} &bull; {activeCourseModal.mode}
              </p>
            </div>

            <div className="curriculum-modal-content">
              <div>
                <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '6px' }}>Programme Highlights:</h4>
                <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {activeCourseModal.highlights.map((h, i) => (
                    <li key={i} style={{ listStyleType: 'disc' }}>{h}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '10px' }}>Detailed Semester Curriculum:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeCourseModal.semesters.map((sem, sIdx) => (
                    <div key={sIdx} className="curriculum-sem-block">
                      <h4>
                        <span>📚</span> {sem.sem}
                      </h4>
                      <ul className="curriculum-subjects-list">
                        {sem.subjects.map((sub, subIdx) => (
                          <li key={subIdx}>
                            <span className="bullet">&bull;</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '6px' }}>Career Pathways:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeCourseModal.careerOpportunities.map((career, cIdx) => (
                    <span key={cIdx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ flex: 1 }}
                  onClick={() => alert(`Official syllabus PDF downloaded for ${activeCourseModal.title}`)}
                >
                  📥 Download Syllabus PDF
                </button>
                <Link 
                  to={`/admission?course=${activeCourseModal.id}`}
                  className="btn-primary" 
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setActiveCourseModal(null)}
                >
                  Proceed to Online Admission &rarr;
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

    </PublicLayout>
  );
}

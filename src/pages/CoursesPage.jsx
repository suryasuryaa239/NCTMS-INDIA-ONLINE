import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { COURSES_DATA } from '../data/coursesData';

export default function CoursesPage() {
  const [searchParams] = useSearchParams();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedFilterTab, setSelectedFilterTab] = useState('All Courses');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedEligibility, setSelectedEligibility] = useState('All');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? -1 : idx));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedFilterTab('All Courses');
    setSelectedDuration('All');
    setSelectedMode('All');
    setSelectedEligibility('All');
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  // Thumbnail mapping for visual cards
  const getCourseImage = (course) => {
    if (course.category.includes('Computer') || course.code.includes('AI')) {
      return '/assets/images/portal.jpg';
    }
    if (course.category.includes('Management')) {
      return '/assets/images/hero-students.jpg';
    }
    if (course.category.includes('Healthcare')) {
      return '/assets/images/certificate.jpg';
    }
    return '/assets/images/institutions.jpg';
  };

  const filterTabs = [
    'All Courses',
    'Degree',
    'Diploma',
    'Certificate',
    'Professional Courses'
  ];

  // Filtering Logic
  const filteredCourses = COURSES_DATA.filter((course) => {
    // 1. Search Query
    const searchLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchLower ||
      course.title.toLowerCase().includes(searchLower) ||
      course.code.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower);

    // 2. Filter Tabs
    let matchesTab = true;
    if (selectedFilterTab === 'Degree') {
      matchesTab =
        course.level.includes('Degree') ||
        course.level.includes('Post Graduate') ||
        course.title.includes('Degree');
    } else if (selectedFilterTab === 'Diploma') {
      matchesTab = course.level.includes('Diploma');
    } else if (selectedFilterTab === 'Certificate') {
      matchesTab = course.level.includes('Certificate');
    } else if (selectedFilterTab === 'Professional Courses') {
      matchesTab =
        course.level.includes('Post Graduate') ||
        course.category.includes('Management') ||
        course.title.includes('Advance') ||
        course.title.includes('AI');
    }

    // 3. Duration Filter
    let matchesDuration = true;
    if (selectedDuration === '6 Months') {
      matchesDuration = course.duration.includes('6 Months');
    } else if (selectedDuration === '1 Year') {
      matchesDuration = course.duration.includes('1 Year');
    } else if (selectedDuration === '2 Years') {
      matchesDuration = course.duration.includes('2 Years');
    }

    // 4. Learning Mode Filter
    let matchesMode = true;
    if (selectedMode === 'Online') {
      matchesMode = course.mode.toLowerCase().includes('online');
    } else if (selectedMode === 'Hybrid') {
      matchesMode =
        course.mode.toLowerCase().includes('hybrid') ||
        course.mode.toLowerCase().includes('blended');
    }

    // 5. Eligibility Filter
    let matchesElig = true;
    if (selectedEligibility === '10th') {
      matchesElig =
        course.eligibility.includes('10th') ||
        course.eligibility.includes('SSLC') ||
        course.eligibility.includes('Matriculation');
    } else if (selectedEligibility === '10+2') {
      matchesElig =
        course.eligibility.includes('10+2') ||
        course.eligibility.includes('Intermediate') ||
        course.eligibility.includes('Higher Secondary');
    } else if (selectedEligibility === 'Graduate') {
      matchesElig =
        course.eligibility.includes('Bachelor') ||
        course.eligibility.includes('Degree') ||
        course.eligibility.includes('Polytechnic');
    }

    return matchesSearch && matchesTab && matchesDuration && matchesMode && matchesElig;
  });

  const faqs = [
    {
      question: 'What courses are available?',
      answer: 'NCTMS India Online offers a wide spectrum of certified academic and skill programs spanning Computer Science & IT, Management & Business Studies, Paramedical & Healthcare Sciences, and Vocational & Industrial Technical Trades at Certificate, Diploma, Advance Diploma, and Post Graduate Diploma levels.'
    },
    {
      question: 'How can I apply for a course?',
      answer: 'You can apply directly online by clicking the "Apply Now" button on any course card or visiting the Online Admission portal (/admission). Complete the 4-step registration wizard with your academic details, upload required marksheets and identity proofs, and submit your application.'
    },
    {
      question: 'What are the eligibility requirements?',
      answer: 'Eligibility varies by program level: Certificate courses generally require 10th or 10+2 qualification; Diploma programs require 10th Standard or 10+2 depending on the discipline; Advance Diplomas require 10+2 with Science/Maths or Polytechnic Diploma; and Post Graduate Diplomas (such as PGDM) require a Bachelor’s Degree in any discipline.'
    },
    {
      question: 'Are online courses available?',
      answer: 'Yes! All NCTMS programs feature online digital study materials, recorded lecture archives, and online term assessments. Certain technical and healthcare programs also incorporate blended practical workshop sessions or clinical hospital practicums at affiliated study centers.'
    },
    {
      question: 'How long does a course take?',
      answer: 'Course durations range from 6 Months for specialized Certification courses to 1 Year (2 Semesters) for standard Diploma and PGDM programs, and up to 2 Years (4 Semesters) for Advance Diplomas and specialized healthcare credentials.'
    },
    {
      question: 'How can I get more information about a course?',
      answer: 'You can view the detailed semester syllabus and career pathways by clicking "View Details" on any course card, download the official prospectus from the Downloads page (/downloads), or contact the central academic helpline at helpdesk@nctms.in.'
    }
  ];

  return (
    <PublicLayout>
      {/* 1. HERO SECTION */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Courses</span>
            </nav>
            <h1>Explore Our Courses</h1>
            <p className="subpage-hero-subtitle">
              Discover flexible learning opportunities designed to help you build your knowledge, skills, and career.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🎓</span>
            <div>
              <strong>Council Recognized</strong>
              <span>Curriculum Framework 2026-2027</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* 2 & 3. COURSE SEARCH & PROMINENT FILTERS */}
          <div className="courses-filter-bar" role="search" aria-label="Course Filters">
            {/* Search Input Row */}
            <div className="courses-search-row">
              <div className="courses-search-input-wrap">
                <svg className="courses-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search courses by keyword, title, or code"
                />
              </div>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                className="mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                aria-expanded={mobileFiltersOpen}
              >
                <span>⚙️ Filters</span>
                <span>{mobileFiltersOpen ? '▲' : '▼'}</span>
              </button>
            </div>

            {/* Level Filter Tabs */}
            <div className={`category-pills ${mobileFiltersOpen ? 'mobile-show' : ''}`} role="tablist">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={selectedFilterTab === tab}
                  className={`category-pill ${selectedFilterTab === tab ? 'active' : ''}`}
                  onClick={() => setSelectedFilterTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Secondary Optional Filters: Duration, Mode, Eligibility */}
            <div className={`courses-secondary-filters ${mobileFiltersOpen ? 'mobile-show' : ''}`}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Duration:
                </label>
                <select
                  className="courses-filter-select"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  aria-label="Filter by course duration"
                >
                  <option value="All">All Durations</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year / 2 Semesters</option>
                  <option value="2 Years">2 Years / 4 Semesters</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Learning Mode:
                </label>
                <select
                  className="courses-filter-select"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  aria-label="Filter by learning mode"
                >
                  <option value="All">All Modes</option>
                  <option value="Online">Online Interactive</option>
                  <option value="Hybrid">Hybrid / Blended</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Eligibility:
                </label>
                <select
                  className="courses-filter-select"
                  value={selectedEligibility}
                  onChange={(e) => setSelectedEligibility(e.target.value)}
                  aria-label="Filter by eligibility qualification"
                >
                  <option value="All">All Eligibility</option>
                  <option value="10th">10th / SSLC Pass</option>
                  <option value="10+2">10+2 / Higher Secondary</option>
                  <option value="Graduate">Bachelor Degree / Polytechnic</option>
                </select>
              </div>

              {(searchQuery || selectedFilterTab !== 'All Courses' || selectedDuration !== 'All' || selectedMode !== 'All' || selectedEligibility !== 'All') && (
                <button
                  type="button"
                  style={{ alignSelf: 'flex-end', padding: '8px 14px', fontSize: '12px', fontWeight: 700, color: '#0c57c4', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer' }}
                  onClick={handleClearFilters}
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Bar */}
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
              Showing <strong>{filteredCourses.length}</strong> of {COURSES_DATA.length} Available Programs
            </span>
          </div>

          {/* 7. LOADING STATE (Simulated) */}
          {loading && (
            <div className="courses-grid" aria-busy="true" aria-label="Loading courses">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-thumb"></div>
                  <div className="skeleton-line medium"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                </div>
              ))}
            </div>
          )}

          {/* 8. ERROR STATE */}
          {error && !loading && (
            <div className="course-error-card" role="alert">
              <span className="course-error-icon">⚠️</span>
              <h3>Unable to load courses</h3>
              <p>Please try again.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          )}

          {/* 4. COURSE GRID */}
          {!loading && !error && (
            <div className="courses-grid">
              {filteredCourses.map((c) => (
                <article key={c.id} className="course-card">
                  {/* Thumbnail Image */}
                  <div className="course-card-thumb-wrap">
                    <img
                      src={getCourseImage(c)}
                      alt={`${c.title} course banner`}
                      className="course-card-thumb-img"
                      loading="lazy"
                    />
                    <span className="course-thumb-overlay-badge">
                      {c.category}
                    </span>
                  </div>

                  {/* Top Codes & Level */}
                  <div className="course-card-top">
                    <span className="course-code-tag">{c.code}</span>
                    <span className="course-level-badge">{c.level}</span>
                  </div>

                  {/* Course Title & Short Description */}
                  <h2 className="course-title">{c.title}</h2>
                  <span className="course-category-tag">{c.category}</span>
                  <p className="course-description">{c.description}</p>

                  {/* Duration, Mode & Eligibility */}
                  <div className="course-meta-grid">
                    <div className="meta-item">
                      <strong>Duration:</strong>
                      <span>{c.duration}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Learning Mode:</strong>
                      <span>{c.mode}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Eligibility:</strong>
                      <span>{c.eligibility}</span>
                    </div>
                    <div className="meta-item">
                      <strong>Annual Fee:</strong>
                      <span>{c.fees}</span>
                    </div>
                  </div>

                  {/* 5. Course Actions: View Details & Apply Now */}
                  <div className="course-card-actions">
                    <Link
                      to={`/courses/${c.id}`}
                      className="btn-secondary"
                      aria-label={`View details and curriculum for ${c.title}`}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/admission?course=${c.id}`}
                      className="btn-primary"
                      aria-label={`Apply online for ${c.title}`}
                    >
                      Apply Now &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 6. EMPTY STATE */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: '#ffffff', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🔍</span>
              <h3 style={{ fontSize: '20px', color: '#0f274a', marginBottom: '8px', fontWeight: 800 }}>
                No courses found
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                Try changing your search or filters.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* 9. COURSE CTA SECTION */}
          <div className="courses-bottom-cta">
            <h2>Not Sure Which Course Is Right For You?</h2>
            <p>
              Explore our available programs or contact our support team for guidance.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ background: '#ffffff', color: '#0c57c4', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}
                onClick={() => {
                  handleClearFilters();
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
              >
                Explore Courses
              </button>
              <Link
                to="/contact"
                className="btn-primary"
                style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}
              >
                Contact Us &rarr;
              </Link>
            </div>
          </div>

          {/* 10. FAQ SECTION */}
          <div style={{ marginTop: '56px' }}>
            <div className="about-section-header">
              <span className="section-tag" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, color: '#0c57c4', background: '#e0edff', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                Course Enquiries
              </span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Answers to common queries regarding courses, durations, study modes, and admissions.
              </p>
            </div>

            <div className="faq-accordion">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { INSTITUTIONS_DATA } from '../data/institutionsData';

export default function InstitutionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // Loading and Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate unique accessible element IDs
  const searchInputId = useId();
  const stateSelectId = useId();
  const districtSelectId = useId();
  const typeSelectId = useId();
  const courseSelectId = useId();
  const statusSelectId = useId();

  // Dynamic filter lists from real verified data
  const states = ['All States', ...Array.from(new Set(INSTITUTIONS_DATA.map((i) => i.state)))];

  const availableDistricts = [
    'All Districts',
    ...Array.from(
      new Set(
        INSTITUTIONS_DATA.filter(
          (i) => selectedState === 'All States' || i.state === selectedState
        )
          .map((i) => i.district)
          .filter(Boolean)
      )
    )
  ];

  const institutionTypes = [
    'All Types',
    ...Array.from(new Set(INSTITUTIONS_DATA.map((i) => i.institutionType).filter(Boolean)))
  ];

  const allCourses = [
    'All Courses',
    ...Array.from(new Set(INSTITUTIONS_DATA.flatMap((i) => i.coursesOffered || []))).sort()
  ];

  const statuses = [
    'All Statuses',
    ...Array.from(new Set(INSTITUTIONS_DATA.map((i) => i.status).filter(Boolean)))
  ];

  // Filtering logic
  const filteredInstitutions = INSTITUTIONS_DATA.filter((inst) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inst.name.toLowerCase().includes(q) ||
      inst.city.toLowerCase().includes(q) ||
      (inst.district && inst.district.toLowerCase().includes(q)) ||
      inst.state.toLowerCase().includes(q) ||
      inst.address.toLowerCase().includes(q) ||
      inst.code.toLowerCase().includes(q) ||
      (inst.institutionType && inst.institutionType.toLowerCase().includes(q)) ||
      (inst.coursesOffered && inst.coursesOffered.some((c) => c.toLowerCase().includes(q)));

    const matchesState = selectedState === 'All States' || inst.state === selectedState;
    const matchesDistrict = selectedDistrict === 'All Districts' || inst.district === selectedDistrict;
    const matchesType = selectedType === 'All Types' || inst.institutionType === selectedType;
    const matchesCourse =
      selectedCourse === 'All Courses' ||
      (inst.coursesOffered && inst.coursesOffered.includes(selectedCourse));
    const matchesStatus = selectedStatus === 'All Statuses' || inst.status === selectedStatus;

    return (
      matchesSearch &&
      matchesState &&
      matchesDistrict &&
      matchesType &&
      matchesCourse &&
      matchesStatus
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredInstitutions.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedInstitutions = filteredInstitutions.slice(startIndex, startIndex + pageSize);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('All States');
    setSelectedDistrict('All Districts');
    setSelectedType('All Types');
    setSelectedCourse('All Courses');
    setSelectedStatus('All Statuses');
    setCurrentPage(1);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 400);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedState !== 'All States' ||
    selectedDistrict !== 'All Districts' ||
    selectedType !== 'All Types' ||
    selectedCourse !== 'All Courses' ||
    selectedStatus !== 'All Statuses';

  return (
    <PublicLayout>
      {/* 1. PAGE HERO */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Affiliated Institutions</span>
            </nav>
            <h1>Our Affiliated Institutions</h1>
            <p className="subpage-hero-subtitle">
              Explore institutions connected with the NCTMS education platform.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🏛️</span>
            <div>
              <strong>Authorized Network</strong>
              <span>Affiliated Centers Across India</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* 2 & 3. SEARCH AND FILTERS WRAPPER */}
          <div className="inst-filters-wrap" role="search" aria-label="Institution Search and Filters">
            {/* Search Input Row */}
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
                  placeholder="Search by institution name, location, or institution ID..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Search by institution name, location, or institution ID"
                />
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                  aria-label="Clear all applied search queries and filters"
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            {/* Filter Dropdowns Row */}
            <div className="inst-filter-row">
              {/* State Filter */}
              <div className="inst-filter-group">
                <label htmlFor={stateSelectId}>State</label>
                <select
                  id={stateSelectId}
                  className="inst-select"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('All Districts');
                    setCurrentPage(1);
                  }}
                  aria-label="Filter institutions by state"
                >
                  {states.map((st, i) => (
                    <option key={i} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Filter */}
              <div className="inst-filter-group">
                <label htmlFor={districtSelectId}>District / City</label>
                <select
                  id={districtSelectId}
                  className="inst-select"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter institutions by district"
                >
                  {availableDistricts.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Type Filter */}
              <div className="inst-filter-group">
                <label htmlFor={typeSelectId}>Institution Type</label>
                <select
                  id={typeSelectId}
                  className="inst-select"
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter institutions by institution type"
                >
                  {institutionTypes.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Courses Filter */}
              <div className="inst-filter-group">
                <label htmlFor={courseSelectId}>Available Courses</label>
                <select
                  id={courseSelectId}
                  className="inst-select"
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter institutions by offered course"
                >
                  {allCourses.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Status Filter */}
              <div className="inst-filter-group">
                <label htmlFor={statusSelectId}>Institution Status</label>
                <select
                  id={statusSelectId}
                  className="inst-select"
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Filter institutions by affiliation status"
                >
                  {statuses.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div
            style={{
              marginBottom: '22px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '13.5px', color: '#64748b', fontWeight: 600 }}>
              Showing{' '}
              <strong style={{ color: '#0b326b' }}>
                {filteredInstitutions.length > 0 ? startIndex + 1 : 0}&ndash;
                {Math.min(startIndex + pageSize, filteredInstitutions.length)}
              </strong>{' '}
              of <strong style={{ color: '#0b326b' }}>{filteredInstitutions.length}</strong> Affiliated
              Institutions
            </span>

            {hasActiveFilters && (
              <span style={{ fontSize: '12.5px', color: '#0c57c4', fontWeight: 600 }}>
                Filtered View Active &bull;{' '}
                <button
                  type="button"
                  onClick={handleClearFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0c57c4',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 700,
                    padding: 0
                  }}
                >
                  Reset All
                </button>
              </span>
            )}
          </div>

          {/* 7. LOADING STATE (Skeleton) */}
          {loading && (
            <div className="institutions-grid" aria-busy="true" aria-label="Loading affiliated institutions">
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

          {/* 7. ERROR STATE */}
          {error && !loading && (
            <div className="course-error-card" role="alert">
              <span className="course-error-icon">⚠️</span>
              <h3>Unable to load affiliated institutions</h3>
              <p>We encountered an issue fetching center records. Please try again.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleRetry}
                style={{ padding: '10px 24px', borderRadius: '8px' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* 4. INSTITUTION LISTING (CARDS) */}
          {!loading && !error && filteredInstitutions.length > 0 && (
            <div className="institutions-grid">
              {paginatedInstitutions.map((inst) => (
                <article key={inst.code} className="institution-card">
                  {/* Institution Image & Type Tag */}
                  <div className="inst-card-thumb-wrap">
                    <img
                      src={inst.image || '/assets/images/institutions.jpg'}
                      alt={`${inst.name} center facility`}
                      className="inst-card-thumb-img"
                      loading="lazy"
                    />
                    {inst.institutionType && (
                      <span className="inst-type-tag">
                        {inst.institutionType}
                      </span>
                    )}
                    {inst.rating && (
                      <span className="inst-rating-badge">
                        {inst.rating}
                      </span>
                    )}
                  </div>

                  {/* Header: Institution ID & Status Badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span className="course-code-tag">ID: {inst.code}</span>
                    <span
                      className="inst-badge"
                      style={{
                        background: '#dcfce7',
                        color: '#15803d',
                        border: '1px solid #86efac',
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}
                    >
                      ✓ {inst.status}
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h2
                    style={{
                      fontSize: '17px',
                      color: '#0b326b',
                      fontWeight: 700,
                      marginBottom: '6px',
                      lineHeight: '1.35'
                    }}
                  >
                    {inst.name}
                  </h2>

                  {/* Location & Category */}
                  <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '12px', fontWeight: 500 }}>
                    📍 {inst.city}, {inst.state} &bull; {inst.category}
                  </p>

                  {/* Address & Contact Details Box */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      marginBottom: '14px',
                      lineHeight: '1.5'
                    }}
                  >
                    <p style={{ margin: '0 0 5px', color: '#334155' }}>
                      <strong>Address:</strong> {inst.address}
                    </p>
                    <p style={{ margin: '0 0 5px', color: '#334155' }}>
                      <strong>Phone:</strong>{' '}
                      <a href={`tel:${inst.contact}`} style={{ color: '#0c57c4', textDecoration: 'none' }}>
                        {inst.contact}
                      </a>
                    </p>
                    <p style={{ margin: 0, color: '#334155' }}>
                      <strong>Email:</strong>{' '}
                      <a href={`mailto:${inst.email}`} style={{ color: '#0c57c4', textDecoration: 'none' }}>
                        {inst.email}
                      </a>
                    </p>
                  </div>

                  {/* Available Courses */}
                  <div style={{ marginBottom: '16px', flexGrow: 1 }}>
                    <strong
                      style={{
                        fontSize: '11px',
                        color: '#64748b',
                        display: 'block',
                        marginBottom: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px'
                      }}
                    >
                      Available Courses:
                    </strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {inst.coursesOffered &&
                        inst.coursesOffered.map((crs, cIdx) => (
                          <span
                            key={cIdx}
                            style={{
                              background: '#eff6ff',
                              color: '#0c57c4',
                              border: '1px solid #bfdbfe',
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 600
                            }}
                          >
                            {crs}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Card Action Buttons: View Details & Apply at Center */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '8px',
                      borderTop: '1px solid #e2e8f0',
                      paddingTop: '14px',
                      marginTop: 'auto'
                    }}
                  >
                    <Link
                      to={`/institutions/${inst.code}`}
                      className="btn-secondary"
                      style={{ flex: 1, textAlign: 'center', padding: '10px 12px', fontSize: '13px' }}
                      aria-label={`View full details for ${inst.name}`}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/admission?center=${inst.code}`}
                      className="btn-primary"
                      style={{ flex: 1.1, textAlign: 'center', padding: '10px 12px', fontSize: '13px' }}
                      aria-label={`Apply online at ${inst.name}`}
                    >
                      Apply Here &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* 6. EMPTY STATE */}
          {!loading && !error && filteredInstitutions.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
              role="alert"
            >
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>🏫</span>
              <h3 style={{ fontSize: '20px', color: '#0f274a', marginBottom: '8px', fontWeight: 800 }}>
                No institutions found.
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                Try changing your search or filters.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleClearFilters}
                style={{ padding: '10px 24px', borderRadius: '8px' }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* 9. PAGINATION */}
          {!loading && !error && totalPages > 1 && (
            <nav className="inst-pagination-wrap" aria-label="Institution list pagination">
              <button
                type="button"
                className="inst-page-btn"
                disabled={safeCurrentPage === 1}
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                aria-label="Previous Page"
              >
                &larr; Prev
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`inst-page-btn ${safeCurrentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={safeCurrentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className="inst-page-btn"
                disabled={safeCurrentPage === totalPages}
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                aria-label="Next Page"
              >
                Next &rarr;
              </button>
            </nav>
          )}

          {/* 8. INSTITUTION REGISTRATION / ENQUIRY SECTION */}
          <div className="inst-collab-banner">
            <div className="inst-collab-text">
              <h2>Interested in Institutional Collaboration?</h2>
              <p>
                Contact our team to enquire about institutional onboarding and collaboration.
              </p>
            </div>
            <Link
              to="/contact"
              className="btn-primary"
              style={{
                background: '#f59e0b',
                color: '#0f274a',
                borderColor: '#f59e0b',
                fontWeight: 800,
                padding: '12px 28px',
                fontSize: '14.5px',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Contact Us &rarr;
            </Link>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

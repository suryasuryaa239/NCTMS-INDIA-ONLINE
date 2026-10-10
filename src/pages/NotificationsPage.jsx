// src/pages/NotificationsPage.jsx
import React, { useState, useEffect, useId } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import {
  getNotifications,
  getFeaturedNotifications,
  getCategories
} from '../services/notificationsService.js';

export default function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Data State
  const [announcements, setAnnouncements] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Form IDs for accessibility
  const searchInputId = useId();
  const sortSelectId = useId();

  // Set document title
  useEffect(() => {
    document.title = 'News & Notifications | NCTMS INDIA ONLINE';
  }, []);

  // Fetch featured announcements on mount
  useEffect(() => {
    async function loadFeatured() {
      const featured = await getFeaturedNotifications();
      setFeaturedItems(featured);
    }
    loadFeatured();
  }, []);

  // Fetch announcements on filter changes
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      const result = await getNotifications({
        category: selectedCategory,
        search: searchQuery,
        sort: sortBy,
        page,
        pageSize: 6
      });

      if (isMounted) {
        setAnnouncements(result.items);
        setTotalCount(result.total);
        setTotalPages(result.totalPages);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery, sortBy, page]);

  // Handle category change
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('newest');
    setPage(1);
    setSearchParams({});
  };

  const categories = getCategories();

  return (
    <PublicLayout>
      {/* 1. HERO BANNER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>News &amp; Notifications</span>
            </nav>
            <h1>News &amp; Notifications</h1>
            <p className="subpage-hero-subtitle">
              Official institutional circulars, examination advisories, admit card releases, gazette notifications, and academic directives issued by NCTMS India.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📢</span>
            <div>
              <strong>Council Circulars</strong>
              <span>Live Registry {totalCount} Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section className="content-section">
        <div className="container" style={{ maxWidth: '1060px' }}>
          
          {/* FEATURED / PINNED ANNOUNCEMENTS (If Real Content Exists) */}
          {featuredItems.length > 0 && selectedCategory === 'All' && !searchQuery && page === 1 && (
            <div className="notif-featured-wrapper" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '18px' }}>📌</span>
                <h2 style={{ fontSize: '17px', color: '#0b326b', margin: 0, fontWeight: 800 }}>
                  Featured Official Announcements
                </h2>
                <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  PRIORITY
                </span>
              </div>

              <div className="notif-featured-grid">
                {featuredItems.map((item) => (
                  <div key={item.id} className="notif-featured-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
                      <span className="notif-cat-badge">
                        {item.category}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
                        📅 {item.date}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16.5px', color: '#0b326b', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.4 }}>
                      <Link to={`/notifications/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h3>

                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 0 16px' }}>
                      {item.shortDescription}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#64748b' }}>
                        <span>Ref: {item.referenceNo}</span>
                        {item.attachment && item.attachment.hasAttachment && (
                          <span style={{ color: '#0c57c4', fontWeight: 600 }}>
                            📎 Attachment Included
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/notifications/${item.id}`}
                        className="btn-primary"
                        style={{ padding: '7px 16px', fontSize: '12.5px' }}
                      >
                        Read Full Notice &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH & FILTER CONTROLS BAR */}
          <div className="notif-filter-bar">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="notif-search-form">
              <label htmlFor={searchInputId} style={{ display: 'none' }}>Search announcements</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id={searchInputId}
                  type="text"
                  placeholder="Search by title, keyword, or gazette ref..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="notif-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
                    title="Clear search"
                  >
                    &times;
                  </button>
                )}
              </div>
            </form>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label htmlFor={sortSelectId} style={{ fontSize: '12.5px', color: '#64748b', whiteSpace: 'nowrap' }}>
                Sort:
              </label>
              <select
                id={sortSelectId}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="payment-select"
                style={{ padding: '8px 12px', fontSize: '12.5px', minWidth: '130px' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="notif-category-pills" role="tablist" aria-label="Announcement categories">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`notif-category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ACTIVE FILTER STATUS STRIP */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 16px', fontSize: '12.5px', color: '#64748b', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              Showing <strong>{announcements.length}</strong> of <strong>{totalCount}</strong> official announcements
              {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
              {searchQuery && <span> matching &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
            </div>

            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={handleClearFilters}
                style={{ background: 'none', border: 'none', color: '#0c57c4', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
              >
                ✕ Clear all filters
              </button>
            )}
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div className="gateway-spinner" style={{ margin: '0 auto 12px' }} />
              <span style={{ fontSize: '13px', color: '#64748b' }}>Refreshing official announcements ledger...</span>
            </div>
          )}

          {/* EMPTY RESULTS STATE */}
          {!loading && announcements.length === 0 && (
            <div className="notif-empty-card">
              <span style={{ fontSize: '42px', display: 'block', marginBottom: '10px' }}>🔍</span>
              <h3 style={{ fontSize: '17px', color: '#0b326b', margin: '0 0 6px', fontWeight: 800 }}>
                No Announcements Found
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                We couldn&rsquo;t find any official circulars matching your criteria. Try adjusting your keyword or reset category filters.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleClearFilters}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Reset Search &amp; Filters
              </button>
            </div>
          )}

          {/* ANNOUNCEMENTS LIST */}
          {!loading && announcements.length > 0 && (
            <div className="notif-list-container">
              {announcements.map((item) => (
                <article
                  key={item.id}
                  className={`notif-card-enhanced ${item.isPinned ? 'is-pinned' : ''}`}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    
                    {/* Card Top Meta Strip */}
                    <div className="notif-card-meta">
                      <span className="notif-cat-badge">
                        {item.category}
                      </span>
                      <span className="notif-meta-date">
                        📅 {item.date}
                      </span>
                      {item.lastUpdated && item.lastUpdated !== item.date && (
                        <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>
                          (Updated: {item.lastUpdated})
                        </span>
                      )}
                      <span className="notif-ref-tag">
                        Ref: {item.referenceNo}
                      </span>
                      {item.badge && (
                        <span className={`notif-badge-pill ${item.badge.toLowerCase().includes('urgent') ? 'urgent' : ''}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="notif-card-title">
                      <Link to={`/notifications/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h2>

                    {/* Short Description */}
                    <p className="notif-card-desc">
                      {item.shortDescription}
                    </p>

                    {/* Bottom Features: Authority & Attachment Indicator */}
                    <div className="notif-card-bottom-strip">
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                        🏛️ {item.issuingAuthority}
                      </span>

                      {item.attachment && item.attachment.hasAttachment ? (
                        <span className="notif-attachment-indicator">
                          📎 Official Document ({item.attachment.fileType})
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          📄 Public Council Notice
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Actions Column */}
                  <div className="notif-card-actions">
                    <Link
                      to={`/notifications/${item.id}`}
                      className="btn-secondary"
                      style={{ whiteSpace: 'nowrap', fontSize: '12.5px', padding: '8px 16px' }}
                    >
                      Read Full Notice &rarr;
                    </Link>

                    {item.relatedLink && (
                      <Link
                        to={item.relatedLink}
                        style={{ fontSize: '11px', color: '#0c57c4', fontWeight: 600, textDecoration: 'none', marginTop: '6px', textAlign: 'center', display: 'block' }}
                      >
                        {item.relatedLinkText || 'Portal Link'} &raquo;
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* PAGINATION CONTROLS */}
          {!loading && totalPages > 1 && (
            <div className="notif-pagination-bar">
              <button
                type="button"
                className="pagination-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &larr; Previous Page
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    className={`pagination-num-btn ${page === pNum ? 'active' : ''}`}
                    onClick={() => setPage(pNum)}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="pagination-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next Page &rarr;
              </button>
            </div>
          )}

          {/* 4. HELP & GAZETTE INQUIRIES SECTION */}
          <div className="results-support-grid" style={{ marginTop: '40px' }}>
            <div className="results-support-card">
              <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                📜 Official Gazette Publication
              </h3>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                All notices published on this portal are authorized under the NCTMS India National Academic Constitution and carry digital SHA-256 verification seals.
              </p>
            </div>

            <div className="results-support-card">
              <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                🏢 Institutional Bulletin Circulation
              </h3>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                Affiliated study centers receiving circulars via courier or email may verify document authenticity by cross-checking the circular reference number on this page.
              </p>
            </div>

            <div className="results-support-card">
              <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                📞 Central Secretariat Communications
              </h3>
              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 8px' }}>
                For official media releases or administrative clarification:
              </p>
              <div style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                <div>✉️ secretariat@nctms.in</div>
                <div>📞 +91 44 2855 0192 (Mon - Fri 10AM - 5PM)</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

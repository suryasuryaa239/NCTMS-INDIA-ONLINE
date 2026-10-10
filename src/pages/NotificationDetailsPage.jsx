// src/pages/NotificationDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { getNotificationById, getRelatedNotifications } from '../services/notificationsService.js';

export default function NotificationDetailsPage() {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const data = await getNotificationById(id);
      if (isMounted) {
        setNotification(data);
        if (data) {
          document.title = `${data.title} | NCTMS India News & Notifications`;
          const rel = await getRelatedNotifications(data.id, data.category, 3);
          if (isMounted) setRelated(rel);
        } else {
          document.title = 'Notification Not Found | NCTMS India';
        }
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <PublicLayout>
        <section className="subpage-hero">
          <div className="container subpage-hero-container">
            <div>
              <nav className="subpage-breadcrumbs">
                <Link to="/">Home</Link> &rsaquo; <Link to="/notifications">News &amp; Notifications</Link> &rsaquo; <span>Loading...</span>
              </nav>
              <h1>Loading Official Circular...</h1>
            </div>
          </div>
        </section>
        <section className="content-section">
          <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="gateway-spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b', fontSize: '14px' }}>Retrieving authoritative council record...</p>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Not Found State
  if (!notification) {
    return (
      <PublicLayout>
        <section className="subpage-hero">
          <div className="container subpage-hero-container">
            <div>
              <nav className="subpage-breadcrumbs">
                <Link to="/">Home</Link> &rsaquo; <Link to="/notifications">News &amp; Notifications</Link> &rsaquo; <span>Not Found</span>
              </nav>
              <h1>Announcement Not Located</h1>
              <p className="subpage-hero-subtitle">
                The requested council notification could not be found in the active publication registry.
              </p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="container" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <div style={{ maxWidth: '520px', margin: '0 auto', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '36px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
              <span style={{ fontSize: '46px', display: 'block', marginBottom: '14px' }}>📋</span>
              <h2 style={{ fontSize: '20px', color: '#0b326b', marginBottom: '8px', fontWeight: 800 }}>
                Circular Record Unavailable
              </h2>
              <p style={{ color: '#64748b', fontSize: '13.5px', marginBottom: '22px', lineHeight: 1.55 }}>
                No active announcement exists matching identifier <strong>&ldquo;{id}&rdquo;</strong>. It may have been archived or updated under a revised gazette number.
              </p>
              <Link to="/notifications" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13.5px', borderRadius: '8px', display: 'inline-block' }}>
                &larr; Return to All Announcements
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* 1. HERO & BREADCRUMBS */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <Link to="/notifications">News &amp; Notifications</Link> &rsaquo; <span>{notification.category}</span>
            </nav>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span className="notif-cat-badge">
                {notification.category}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff', fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                Ref: {notification.referenceNo}
              </span>
              {notification.badge && (
                <span className="notif-status-badge">
                  {notification.badge}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '24px', lineHeight: 1.3, maxWidth: '880px' }}>
              {notification.title}
            </h1>
            <p className="subpage-hero-subtitle" style={{ maxWidth: '820px' }}>
              {notification.shortDescription}
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🏛️</span>
            <div>
              <strong>Official Gazette Notice</strong>
              <span>Published: {notification.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN DETAIL CONTENT */}
      <section className="content-section">
        <div className="container" style={{ maxWidth: '1020px' }}>
          
          <div style={{ marginBottom: '20px' }}>
            <Link to="/notifications" className="notif-back-link">
              &larr; Back to All News &amp; Notifications
            </Link>
          </div>

          <div className="notif-detail-layout">
            
            {/* Primary Document Body */}
            <article className="notif-article-card">
              
              {/* Official Gazette Header Strip */}
              <div className="notif-article-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src="/assets/images/nctms-logo.svg"
                    alt="NCTMS Seal"
                    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                  />
                  <div>
                    <h2 style={{ fontSize: '14px', color: '#0b326b', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      National Council of Technical &amp; Management Studies
                    </h2>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      Central Secretariat &bull; Directorate of Academic Communications
                    </span>
                  </div>
                </div>

                <div className="notif-meta-chips">
                  <div>
                    <span className="meta-label">Gazette Number:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#0c57c4' }}>{notification.referenceNo}</strong>
                  </div>
                  <div>
                    <span className="meta-label">Issue Date:</span>
                    <strong>{notification.date}</strong>
                  </div>
                  {notification.lastUpdated && notification.lastUpdated !== notification.date && (
                    <div>
                      <span className="meta-label">Last Updated:</span>
                      <strong style={{ color: '#15803d' }}>{notification.lastUpdated}</strong>
                    </div>
                  )}
                  <div>
                    <span className="meta-label">Status:</span>
                    <span className="notif-inline-status">{notification.status}</span>
                  </div>
                </div>
              </div>

              {/* Title & Content Paragraphs (Safe text rendering) */}
              <div className="notif-article-body">
                <h2 style={{ fontSize: '20px', color: '#0b326b', fontWeight: 800, margin: '0 0 16px', lineHeight: 1.4 }}>
                  {notification.title}
                </h2>

                {Array.isArray(notification.fullContent) ? (
                  notification.fullContent.map((paragraph, idx) => (
                    <p key={idx} className="notif-paragraph">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="notif-paragraph">{notification.shortDescription}</p>
                )}

                {/* Direct Action Link if available */}
                {notification.relatedLink && (
                  <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '12.5px', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                      Associated Portal Directive:
                    </span>
                    <Link
                      to={notification.relatedLink}
                      className="btn-primary"
                      style={{ padding: '10px 22px', fontSize: '13.5px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>🚀</span>
                      {notification.relatedLinkText || 'Proceed to Portal'} &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Issuing Authority Seal */}
              <div className="notif-article-footer">
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>Issued by Authority:</span>
                  <strong style={{ fontSize: '13px', color: '#0b326b' }}>{notification.issuingAuthority}</strong>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>NCTMS India Central Secretariat, New Delhi &bull; Chennai</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, display: 'block' }}>
                    ✓ Authenticated Digital Circular
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    Hash: NCTMS-DOC-SHA256
                  </span>
                </div>
              </div>

            </article>

            {/* Sidebar: Attachments & Related Circulars */}
            <aside className="notif-sidebar">
              
              {/* Attachment Card */}
              <div className="notif-sidebar-card">
                <h3 className="sidebar-card-title">
                  <span>📎</span> Official Attachments
                </h3>

                {notification.attachment && notification.attachment.hasAttachment ? (
                  <div className="attachment-item-box">
                    <div style={{ fontSize: '28px', color: '#dc2626' }}>📄</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '13px', color: '#0b326b', display: 'block', wordBreak: 'break-word' }}>
                        {notification.attachment.fileName}
                      </strong>
                      <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block' }}>
                        {notification.attachment.fileType} &bull; {notification.attachment.fileSize}
                      </span>
                      {notification.attachment.isAvailable ? (
                        <div style={{ marginTop: '10px' }}>
                          <Link
                            to={notification.attachment.downloadUrl || '/downloads'}
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '12px', display: 'inline-block' }}
                          >
                            ⬇️ Download Circular
                          </Link>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: '#c2410c', background: '#fff7ed', padding: '3px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '6px' }}>
                          ⏳ Pending Gazette Seal Upload
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', fontSize: '12.5px', color: '#64748b', textAlign: 'center' }}>
                    No standalone document attachment associated with this circular. All directives are fully codified above.
                  </div>
                )}
              </div>

              {/* Related Circulars */}
              {related.length > 0 && (
                <div className="notif-sidebar-card">
                  <h3 className="sidebar-card-title">
                    <span>📑</span> Related Circulars
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {related.map((item) => (
                      <Link
                        key={item.id}
                        to={`/notifications/${item.id}`}
                        className="related-notif-link"
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '3px' }}>
                          <span style={{ color: '#0c57c4', fontWeight: 700 }}>{item.category}</span>
                          <span>{item.date}</span>
                        </div>
                        <strong style={{ fontSize: '12.5px', color: '#0b326b', lineHeight: 1.35, display: 'block' }}>
                          {item.title}
                        </strong>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Council Desk Helpline */}
              <div className="notif-sidebar-card" style={{ background: '#f8fafc' }}>
                <h3 className="sidebar-card-title" style={{ fontSize: '13px' }}>
                  <span>🏛️</span> Council Secretariat Desk
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.45, margin: '0 0 10px' }}>
                  For inquiries regarding circular interpretation or gazette reproduction:
                </p>
                <div style={{ fontSize: '11.5px', color: '#0c57c4', fontWeight: 600 }}>
                  <div>✉️ secretariat@nctms.in</div>
                  <div>📞 +91 44 2855 0192 (Mon - Fri)</div>
                </div>
              </div>

            </aside>

          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

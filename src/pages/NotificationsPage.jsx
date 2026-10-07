import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { NOTIFICATIONS_DATA } from '../data/notificationsData';

export default function NotificationsPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Examination', 'Admissions', 'Results', 'Affiliation', 'Academic'];

  const filteredNotifs = NOTIFICATIONS_DATA.filter((n) => {
    return selectedCat === 'All' || n.category === selectedCat;
  });

  return (
    <PublicLayout>
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>News & Notifications</span>
            </div>
            <h1>News, Circulars & Official Announcements</h1>
            <p className="subpage-hero-subtitle">
              Stay informed with official notifications, examination schedules, admit card announcements, and council press releases.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">📢</span>
            <div>
              <strong>Council Bulletins</strong>
              <span>Live Updates 2026</span>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div className="category-pills" style={{ marginBottom: '24px' }}>
            {categories.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`category-pill ${selectedCat === c ? 'active' : ''}`}
                onClick={() => setSelectedCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredNotifs.map((n) => (
              <div key={n.id} className="notif-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#0c57c4', padding: '3px 8px', borderRadius: '4px' }}>
                      {n.category}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>📅 {n.date}</span>
                    {n.isNew && (
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '16.5px', color: '#0b326b', fontWeight: 700, marginBottom: '6px' }}>{n.title}</h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>{n.description}</p>
                </div>
                
                <div style={{ flexShrink: 0, alignSelf: 'center' }}>
                  <button 
                    type="button" 
                    className="btn-secondary"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => alert(`Opening notification: "${n.title}"`)}
                  >
                    📄 View Notice
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INSTITUTION_CENTER_DETAILS } from '../data/institutionData';
import './InstitutionLayout.css';

export default function InstitutionLayout({ children, pageTitle = 'Institution Portal' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const center = INSTITUTION_CENTER_DETAILS;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { title: 'Center Dashboard', path: '/institution/dashboard', icon: '📊' },
    { title: 'Student Management', path: '/institution/students', icon: '👥' },
    { title: 'Batches & Classrooms', path: '/institution/batches', icon: '📅' },
    { title: 'Internal Marks Entry', path: '/institution/marks-entry', icon: '✍️' },
    { title: 'Center Accreditation', path: '/institution/profile', icon: '🏛️' }
  ];

  return (
    <div className="inst-portal-wrapper">
      
      {/* 1. Sidebar */}
      <aside className={`inst-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Header */}
        <div className="inst-sidebar-header">
          <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="inst-sidebar-logo" />
          <div className="sidebar-title-box">
            <h2>NCTMS INDIA</h2>
            <span>AFFILIATED CENTER</span>
          </div>
        </div>

        {/* Center Meta Card */}
        <div className="inst-center-meta">
          <span className="inst-center-code-pill">CODE: {center.centerCode}</span>
          <span className="inst-center-name">{center.name}</span>
          <small style={{ color: '#94a3b8', fontSize: '11px', display: 'block', marginTop: '2px' }}>
            Guindy, Chennai, Tamil Nadu
          </small>
        </div>

        {/* Navigation Menu */}
        <nav className="inst-sidebar-menu">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              end={link.path === '/institution/dashboard'}
              className={({ isActive }) => `inst-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="inst-sidebar-footer">
          <Link to="/" className="sidebar-foot-btn">
            <span>🌐</span>
            <span>Return to Public Portal</span>
          </Link>
          <button type="button" className="sidebar-foot-btn" onClick={handleLogout} style={{ color: '#f87171' }}>
            <span>🚪</span>
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* 2. Main Workspace */}
      <div className="inst-main-content">
        
        {/* Top App Bar */}
        <header className="inst-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge">
              ● Affiliation Active (2026-2027)
            </span>
            <Link to="/" className="topbar-btn">
              <span>🏠</span> Home
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="inst-portal-body">
          {children}
        </main>

      </div>

    </div>
  );
}

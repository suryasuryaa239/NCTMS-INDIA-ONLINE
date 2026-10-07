import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

export default function AdminLayout({ children, pageTitle = 'Central Council Administration' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { title: 'Master Dashboard', path: '/admin/dashboard', icon: '📊' },
    { title: 'Admissions Approval', path: '/admin/admissions', icon: '📋' },
    { title: 'Courses & Curriculum', path: '/admin/courses', icon: '🎓' },
    { title: 'Center Affiliations', path: '/admin/institutions', icon: '🏫' },
    { title: 'Exam & Question Bank', path: '/admin/exams', icon: '✍️' },
    { title: 'Results & Certificates', path: '/admin/results', icon: '📜' },
    { title: 'Financial Ledger', path: '/admin/payments', icon: '💳' }
  ];

  return (
    <div className="admin-portal-wrapper">
      
      {/* 1. Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Header */}
        <div className="admin-sidebar-header">
          <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="admin-sidebar-logo" />
          <div className="admin-title-box">
            <h2>NCTMS COUNCIL</h2>
            <span>SUPER ADMIN SUITE</span>
          </div>
        </div>

        {/* User Card */}
        <div className="admin-user-card">
          <div className="admin-user-avatar">
            🛡️
          </div>
          <div>
            <span className="admin-user-name">Central Council Admin</span>
            <span className="admin-user-role">Director of Academic Affairs</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar-menu">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              end={link.path === '/admin/dashboard'}
              className={({ isActive }) => `admin-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
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

      {/* 2. Main Area */}
      <div className="admin-main-content">
        
        {/* Top App Bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
              🛡️ Super Admin Level 1 (Full Access)
            </span>
            <Link to="/" className="topbar-btn">
              <span>🏠</span> Home
            </Link>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="admin-portal-body">
          {children}
        </main>

      </div>

    </div>
  );
}

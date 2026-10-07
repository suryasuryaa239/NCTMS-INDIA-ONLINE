import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { STUDENT_PROFILE } from '../data/studentData';
import './StudentLayout.css';

export default function StudentLayout({ children, pageTitle = 'Student Dashboard' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const student = STUDENT_PROFILE;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { title: 'Dashboard Overview', path: '/student/dashboard', icon: '📊' },
    { title: 'My Profile & ID Card', path: '/student/profile', icon: '👤' },
    { title: 'Online Classes & LMS', path: '/student/classes', icon: '📺' },
    { title: 'Online Exam Center', path: '/student/exam', icon: '✍️' },
    { title: 'Results & Marksheet', path: '/student/results', icon: '📜' },
    { title: 'Fees Ledger & Receipts', path: '/student/fees', icon: '💳' }
  ];

  return (
    <div className="student-portal-wrapper">
      
      {/* 1. Sidebar */}
      <aside className={`student-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        
        {/* Header */}
        <div className="sidebar-header">
          <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="sidebar-logo" />
          <div className="sidebar-title-box">
            <h2>NCTMS INDIA</h2>
            <span>STUDENT ERP</span>
          </div>
        </div>

        {/* User Mini Profile */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            👨‍🎓
          </div>
          <div className="sidebar-user-meta">
            <span className="sidebar-user-name">{student.fullName}</span>
            <span className="sidebar-user-roll">{student.rollNo}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-menu">
          {navLinks.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              end={link.path === '/student/dashboard'}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Footer Actions */}
        <div className="sidebar-footer">
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

      {/* 2. Main Wrapper */}
      <div className="student-main-content">
        
        {/* Top App Bar */}
        <header className="student-topbar">
          <div className="topbar-left">
            <button 
              type="button" 
              className="topbar-btn"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            <h1 className="topbar-title">{pageTitle}</h1>
          </div>

          <div className="topbar-right">
            <span className="topbar-badge">
              ● Active Enrollment (Term 2)
            </span>
            <Link to="/" className="topbar-btn">
              <span>🏠</span> Home
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="portal-body">
          {children}
        </main>

      </div>

    </div>
  );
}

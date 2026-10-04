import React, { useState } from 'react';

export default function Navbar({ onOpenModal, showToast }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: 'About NCTMS', action: () => showToast('NCTMS India: Autonomous Council promoting skill development & vocational training since 2012.') },
    { title: 'Courses', action: () => onOpenModal('admission') },
    { title: 'Affiliated Institutions', action: () => onOpenModal('institutions') },
    { title: 'Online Admission', action: () => onOpenModal('admission') },
    { title: 'Online Classes', action: () => onOpenModal('classes') },
    { title: 'Online Examination', action: () => onOpenModal('exam') },
    { title: 'ERP / Student Portal', action: () => onOpenModal('erp') },
    { title: 'Applications & Downloads', action: () => onOpenModal('downloads') },
    { title: 'Online Payment', action: () => onOpenModal('payment') },
    { title: 'Results', action: () => onOpenModal('certificate') },
    { title: 'Certificate Verification', action: () => onOpenModal('certificate') },
    { title: 'News & Notifications', action: () => showToast('Notice: Term 2026 examination admit cards and schedules are available for download.') },
    { title: 'Contact', action: () => showToast('NCTMS Helpdesk: helpdesk@nctms.in | Phone: +91 44 2855 0192 (Mon-Sat 9AM-6PM)') },
  ];

  return (
    <nav className="main-navbar">
      <div className="container nav-container">
        
        {/* Mobile Toggle Button */}
        <button 
          className="mobile-nav-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links Menu */}
        <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <li className="nav-item active">
            <a 
              href="#" 
              className="nav-link home-pill" 
              onClick={(e) => { 
                e.preventDefault(); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Home</span>
            </a>
          </li>

          {navLinks.map((item, idx) => (
            <li key={idx} className="nav-item">
              <a 
                href="#" 
                className="nav-link" 
                onClick={(e) => {
                  e.preventDefault();
                  item.action();
                  setMobileMenuOpen(false);
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </nav>
  );
}

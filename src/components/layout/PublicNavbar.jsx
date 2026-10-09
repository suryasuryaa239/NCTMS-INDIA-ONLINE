import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { title: 'Home', path: '/', isHome: true },
    { title: 'About NCTMS', path: '/about' },
    { title: 'Courses', path: '/courses' },
    { title: 'Affiliated Institutions', path: '/institutions' },
    { title: 'Online Admission', path: '/admission' },
    { title: 'Applications & Downloads', path: '/downloads' },
    { title: 'Online Payment', path: '/online-payment' },
    { title: 'Results & Verification', path: '/verify' },
    { title: 'News & Notifications', path: '/notifications' },
    { title: 'Contact', path: '/contact' },
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
          {navItems.map((item, idx) => (
            <li key={idx} className="nav-item">
              <NavLink 
                to={item.path} 
                end={item.path === '/'}
                className={({ isActive }) => 
                  `nav-link ${item.isHome ? 'home-pill' : ''} ${isActive ? 'active-link' : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.isHome && (
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                )}
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

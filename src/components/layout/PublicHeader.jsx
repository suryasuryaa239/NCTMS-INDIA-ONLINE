import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function PublicHeader({ onOpenLogin, showToast }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLangChange = (e) => {
    const val = e.target.value;
    if (showToast) {
      if (val === 'ta') showToast('மொழி தமிழ் தெரிவு செய்யப்பட்டது (Language set to Tamil)');
      else if (val === 'hi') showToast('भाषा हिन्दी चुनी गई (Language set to Hindi)');
      else showToast('Language set to English');
    }
  };

  return (
    <header className="top-header">
      <div className="container header-container">
        {/* Brand Link back to Home */}
        <Link to="/" className="brand-link">
          <div className="logo-box">
            <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="brand-logo" width="68" height="68" />
          </div>
          <div className="brand-info">
            <h1 className="brand-title">NCTMS INDIA ONLINE</h1>
            <p className="brand-subtitle">National Council for Technical and Management Studies</p>
            <p className="brand-motto">
              EDUCATE <span>|</span> ENRICH <span>|</span> EMPOWER <span>|</span> EVERYWHERE
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Search Box */}
          <form className="header-search" onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search Courses, Syllabi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          {/* User Portals Navigation */}
          <nav className="user-portals">
            <button 
              type="button" 
              className="portal-link" 
              onClick={() => onOpenLogin ? onOpenLogin('student') : navigate('/student/dashboard')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <span>Student Login</span>
            </button>

            <button 
              type="button" 
              className="portal-link" 
              onClick={() => onOpenLogin ? onOpenLogin('institution') : navigate('/institution/dashboard')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
              <span>Institution Login</span>
            </button>

            <button 
              type="button" 
              className="portal-link" 
              onClick={() => onOpenLogin ? onOpenLogin('admin') : navigate('/admin/dashboard')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              <span>Admin Login</span>
            </button>

            {/* Language Selector */}
            <div className="lang-selector">
              <select onChange={handleLangChange} defaultValue="en">
                <option value="en">English ▾</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

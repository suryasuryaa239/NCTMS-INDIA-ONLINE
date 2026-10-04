import React from 'react';
import groupImg from '../assets/group.png';

export default function HeroBanner({ onOpenModal, showToast }) {
  const handleSlideChange = (dir) => {
    showToast(`Viewing slide ${dir === 'next' ? '2 of 3' : '1 of 3'}: NCTMS Digital Campus 2026`);
  };

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Prev Arrow */}
        <button 
          className="carousel-arrow prev-arrow" 
          onClick={() => handleSlideChange('prev')} 
          aria-label="Previous Slide"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        {/* Hero Card */}
        <div className="hero-card">
          
          {/* Left Details */}
          <div className="hero-left">
            <p className="hero-tagline">Learn &bull; Grow &bull; Get Certified</p>
            <h2 className="hero-main-title">NCTMS INDIA ONLINE</h2>
            <p className="hero-subtitle">A Complete Digital Education Platform</p>
            <p className="hero-services">
              Online Admission <span>|</span> Online Classes <span>|</span> Online Examination <span>|</span><br />
              Student ERP <span>|</span> Institution Management <span>|</span> Results <span>|</span> Certificates
            </p>
            <button 
              type="button" 
              className="btn-primary hero-btn" 
              onClick={() => onOpenModal('admission')}
            >
              <span>Explore Courses</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* Center Image */}
          <div className="hero-center">
            <div className="students-img-wrapper">
              <img 
                src={groupImg} 
                alt="NCTMS Students" 
                className="students-img" 
              />
            </div>
          </div>

          {/* Right Highlights Panel */}
          <div className="hero-right">
            <h3 className="highlight-title">
              Quality Education<br />for a Brighter Tomorrow
            </h3>
            
            <ul className="highlight-checklist">
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Recognized Courses</span>
              </li>
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Affiliated Institutions</span>
              </li>
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Digital Learning</span>
              </li>
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Secure Online Examination</span>
              </li>
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Verified Certificates</span>
              </li>
              <li>
                <span className="chk-icon">&#10004;</span>
                <span>Global Learning Opportunities</span>
              </li>
            </ul>

            {/* Glowing Globe */}
            <div className="hero-globe-wrap">
              <img 
                src="/assets/images/globe-badge.svg" 
                alt="Education Globe" 
                className="globe-badge-img" 
              />
              <div className="globe-overlay-text">
                <span className="globe-line1">Education</span>
                <span className="globe-line2">Without</span>
                <span className="globe-line3">Boundaries</span>
              </div>
            </div>

          </div>

        </div>

        {/* Next Arrow */}
        <button 
          className="carousel-arrow next-arrow" 
          onClick={() => handleSlideChange('next')} 
          aria-label="Next Slide"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

      </div>
    </section>
  );
}

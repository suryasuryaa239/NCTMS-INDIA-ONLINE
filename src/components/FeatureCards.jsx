import React from 'react';

export default function FeatureCards({ onOpenModal }) {
  const cards = [
    {
      title: 'Online Admission',
      image: '/assets/images/admission.jpg',
      alt: 'Online Admission student with laptop',
      modal: 'admission',
      btnText: 'Apply Now',
      isDocBox: false,
      isYouTube: false,
      items: [
        'New Admission',
        'Re-Registration',
        'Course Selection',
        'Document Upload',
        'Application Tracking'
      ]
    },
    {
      title: 'Online Classes',
      image: '/assets/images/classes.jpg',
      alt: 'Online Classes screen',
      modal: 'classes',
      btnText: 'Start Learning',
      isDocBox: false,
      isYouTube: true,
      items: [
        'Live Classes',
        'Recorded Classes',
        'YouTube Integration',
        'Study Materials',
        'Assignments',
        'Practice Tests'
      ]
    },
    {
      title: 'Online Examination',
      image: '/assets/images/exam.jpg',
      alt: 'Online Examination student taking test',
      modal: 'exam',
      btnText: 'Take Exam',
      isDocBox: false,
      isYouTube: false,
      items: [
        'Secure Login',
        'Random Questions',
        'Auto Save',
        'Tab Monitoring',
        'Timer',
        'Result Processing'
      ]
    },
    {
      title: 'Student Portal (ERP)',
      image: '/assets/images/portal.jpg',
      alt: 'Student Portal young man on laptop',
      modal: 'erp',
      btnText: 'Login to ERP',
      isDocBox: false,
      isYouTube: false,
      items: [
        'Profile',
        'Attendance',
        'Fees & Payment',
        'Examination',
        'Results',
        'Certificates'
      ]
    },
    {
      title: 'Affiliated Institutions',
      image: '/assets/images/institutions.jpg',
      alt: 'Affiliated Institutions campus building',
      modal: 'institutions',
      btnText: 'Search Institutions',
      isDocBox: false,
      isYouTube: false,
      items: [
        'College',
        'Research Academy',
        'VTP',
        'Computer Centre',
        'ITI',
        'Hospital / Healthcare'
      ]
    },
    {
      title: 'Applications & Downloads',
      image: '/assets/images/downloads-card.svg',
      alt: 'Applications & Downloads document icon',
      modal: 'downloads',
      btnText: 'Apply / Download',
      isDocBox: true,
      isYouTube: false,
      items: [
        'Migration',
        'TC Application',
        'Convocation',
        'Mark Sheet',
        'Name / Address Change',
        'Duplicate Certificate'
      ]
    },
    {
      title: 'Online Payment',
      image: '/assets/images/payment.jpg',
      alt: 'Online Payment with card',
      modal: 'payment',
      btnText: 'Make Payment',
      isDocBox: false,
      isYouTube: false,
      items: [
        'Admission Fees',
        'Examination Fees',
        'Re-Registration',
        'Certificate Fees',
        'Other Services'
      ]
    },
    {
      title: 'Results & Certificates',
      image: '/assets/images/certificate.jpg',
      alt: 'Results and Certificates sample with QR code',
      modal: 'certificate',
      btnText: 'Check Now',
      isDocBox: false,
      isYouTube: false,
      items: [
        'View Results',
        'Download Mark Sheet',
        'Download Certificate',
        'Online Verification',
        'QR Code Verification'
      ]
    }
  ];

  return (
    <main className="services-section">
      <div className="container">
        <div className="services-grid">
          {cards.map((c, i) => (
            <div key={i} className="service-card">
              
              {/* Card Image Box */}
              <div className={`card-img-box ${c.isDocBox ? 'doc-card-box' : ''} ${c.isYouTube ? 'relative-box' : ''}`}>
                <img 
                  src={c.image} 
                  alt={c.alt} 
                  className="card-img" 
                  loading="lazy" 
                />
                {c.isYouTube && (
                  <div className="yt-badge">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#ff0000">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                    <span>YouTube</span>
                  </div>
                )}
              </div>

              {/* Card Content & Checklist */}
              <div className="card-content">
                <h3 className="card-title">{c.title}</h3>
                
                <ul className="card-list">
                  {c.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <span className="chk">&#10004;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Action Button */}
                <button 
                  type="button" 
                  className="card-btn" 
                  onClick={() => onOpenModal(c.modal)}
                >
                  <span>{c.btnText}</span>
                  <span className="arrow">&rarr;</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

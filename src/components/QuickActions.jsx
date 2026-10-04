import React from 'react';

export default function QuickActions({ onOpenModal }) {
  const actions = [
    {
      modal: 'admission',
      colorClass: 'q-blue',
      line1: 'Online',
      line2: 'Admission',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      modal: 'classes',
      colorClass: 'q-red',
      line1: 'Online',
      line2: 'Classes',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
      )
    },
    {
      modal: 'exam',
      colorClass: 'q-green',
      line1: 'Online',
      line2: 'Examination',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
          <rect x="9" y="3" width="6" height="4" rx="2"></rect>
          <path d="m9 14 2 2 4-4"></path>
        </svg>
      )
    },
    {
      modal: 'erp',
      colorClass: 'q-purple',
      line1: 'Student',
      line2: 'ERP',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      modal: 'institutions',
      colorClass: 'q-orange',
      line1: 'Affiliated',
      line2: 'Institutions',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4"/>
        </svg>
      )
    },
    {
      modal: 'downloads',
      colorClass: 'q-cyan',
      line1: 'Applications',
      line2: '& Downloads',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      )
    },
    {
      modal: 'payment',
      colorClass: 'q-pink',
      line1: 'Online',
      line2: 'Payment',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      )
    },
    {
      modal: 'certificate',
      colorClass: 'q-lime',
      line1: 'Results',
      line2: '',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    {
      modal: 'certificate',
      colorClass: 'q-gold',
      line1: 'Certificate',
      line2: 'Verification',
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className="quick-actions-section">
      <div className="container">
        <div className="quick-grid">
          {actions.map((act, i) => (
            <button 
              key={i} 
              type="button" 
              className="quick-btn" 
              onClick={() => onOpenModal(act.modal)}
            >
              <div className={`quick-icon-box ${act.colorClass}`}>
                {act.icon}
              </div>
              <div className="quick-label">
                <span>{act.line1}</span>
                {act.line2 && <span>{act.line2}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

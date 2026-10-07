import React, { useState } from 'react';
import PublicHeader from './PublicHeader';
import PublicNavbar from './PublicNavbar';
import TrustBar from '../TrustBar';
import Modals from '../Modals';
import Toast from '../Toast';
import '../../pages/PublicPages.css';

export default function PublicLayout({ children }) {
  const [activeModal, setActiveModal] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  const handleOpenLogin = (role) => {
    setActiveModal(`login-${role}`);
  };

  return (
    <div className="page-wrapper">
      {/* 1. Header with Search and Portal Links */}
      <PublicHeader onOpenLogin={handleOpenLogin} showToast={showToast} />

      {/* 2. Top Navigation Bar */}
      <PublicNavbar />

      {/* 3. Dynamic Page Content */}
      <main className="page-main">
        {children}
      </main>

      {/* 4. NCTMS Trust Badges Ribbon */}
      <TrustBar />

      {/* 5. Modals for login & quick actions */}
      <Modals 
        activeModal={activeModal} 
        onClose={() => setActiveModal(null)} 
        showToast={showToast} 
      />

      {/* 6. Feedback Toast */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

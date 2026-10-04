import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import QuickActions from './components/QuickActions';
import FeatureCards from './components/FeatureCards';
import TrustBar from './components/TrustBar';
import Modals from './components/Modals';
import Toast from './components/Toast';

export default function App() {
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

  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="nctms-app">
      {/* 1. Top Header */}
      <Header onOpenModal={handleOpenModal} showToast={showToast} />

      {/* 2. Navigation Bar */}
      <Navbar onOpenModal={handleOpenModal} showToast={showToast} />

      {/* 3. Hero Carousel Banner */}
      <HeroBanner onOpenModal={handleOpenModal} showToast={showToast} />

      {/* 4. Quick Action 9-Button Strip */}
      <QuickActions onOpenModal={handleOpenModal} />

      {/* 5. 8 Main Feature Service Cards */}
      <FeatureCards onOpenModal={handleOpenModal} />

      {/* 6. Bottom Trust Strip */}
      <TrustBar />

      {/* 7. Interactive Modals */}
      <Modals 
        activeModal={activeModal} 
        onClose={handleCloseModal} 
        showToast={showToast} 
      />

      {/* 8. Toast Feedback Alert */}
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}

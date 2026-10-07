import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CoursesPage from './pages/CoursesPage';
import AdmissionPage from './pages/AdmissionPage';
import VerificationPage from './pages/VerificationPage';
import DownloadsPage from './pages/DownloadsPage';
import InstitutionsPage from './pages/InstitutionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ContactPage from './pages/ContactPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Landing Page (100% Preserved) */}
        <Route path="/" element={<App />} />

        {/* 2. Public Modules */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/admission/status" element={<AdmissionPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/verify/:rollNo" element={<VerificationPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/institutions" element={<InstitutionsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Fallback to Home */}
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
}

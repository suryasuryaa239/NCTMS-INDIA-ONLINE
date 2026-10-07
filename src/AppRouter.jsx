import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';

// Public Pages
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import AdmissionPage from './pages/AdmissionPage';
import VerificationPage from './pages/VerificationPage';
import DownloadsPage from './pages/DownloadsPage';
import InstitutionsPage from './pages/InstitutionsPage';
import NotificationsPage from './pages/NotificationsPage';
import ContactPage from './pages/ContactPage';

// Student ERP Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentClasses from './pages/student/StudentClasses';
import StudentExamCenter from './pages/student/StudentExamCenter';
import StudentExamRoom from './pages/student/StudentExamRoom';
import StudentResults from './pages/student/StudentResults';
import StudentFees from './pages/student/StudentFees';

// Institution Portal Pages
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import InstitutionStudents from './pages/institution/InstitutionStudents';
import InstitutionBatches from './pages/institution/InstitutionBatches';
import InstitutionMarksEntry from './pages/institution/InstitutionMarksEntry';
import InstitutionProfile from './pages/institution/InstitutionProfile';

// Super Admin Management Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import AdminCourses from './pages/admin/AdminCourses';
import AdminInstitutions from './pages/admin/AdminInstitutions';
import AdminExams from './pages/admin/AdminExams';
import AdminResults from './pages/admin/AdminResults';
import AdminPayments from './pages/admin/AdminPayments';

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. Landing Page (100% Preserved) */}
          <Route path="/" element={<App />} />

          {/* 2. Public Modules */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CoursesPage />} />
          <Route path="/admission" element={<AdmissionPage />} />
          <Route path="/admission/status" element={<AdmissionPage />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/verify/:rollNo" element={<VerificationPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/institutions" element={<InstitutionsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 3. Student ERP Portal */}
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/exam" element={<StudentExamCenter />} />
          <Route path="/student/exam/take" element={<StudentExamRoom />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/fees" element={<StudentFees />} />

          {/* 4. Affiliated Institution Portal */}
          <Route path="/institution" element={<Navigate to="/institution/dashboard" replace />} />
          <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
          <Route path="/institution/students" element={<InstitutionStudents />} />
          <Route path="/institution/batches" element={<InstitutionBatches />} />
          <Route path="/institution/marks-entry" element={<InstitutionMarksEntry />} />
          <Route path="/institution/profile" element={<InstitutionProfile />} />

          {/* 5. Central Council Super Admin Portal */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/admissions" element={<AdminAdmissions />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/institutions" element={<AdminInstitutions />} />
          <Route path="/admin/exams" element={<AdminExams />} />
          <Route path="/admin/results" element={<AdminResults />} />
          <Route path="/admin/payments" element={<AdminPayments />} />

          {/* Fallback */}
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

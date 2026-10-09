import React, { useState, useEffect, useCallback, useId } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { STUDENT_PROFILE, STUDENT_EXAMS, EXAM_QUESTION_BANK } from '../data/studentData';
import { CERTIFICATES_DATA } from '../data/certificatesData';

export default function OnlineExaminationPage() {
  const { currentUser, loginAs, logout } = useAuth();
  const isStudent = currentUser && currentUser.role === 'student';

  // View modes: 'dashboard' | 'instructions' | 'room' | 'submitted'
  const [viewMode, setViewMode] = useState('dashboard');

  // Dashboard Tabs: 'available' | 'upcoming' | 'completed' | 'results'
  const [activeTab, setActiveTab] = useState('available');

  // Active exam being taken
  const activeExam = STUDENT_EXAMS.find((e) => e.canLaunch) || STUDENT_EXAMS[0];

  // Questions from verified question bank (without answer keys exposed)
  const questions = EXAM_QUESTION_BANK;

  // Instructions screen acknowledgment
  const [instructionsAgreed, setInstructionsAgreed] = useState(false);
  const agreeCheckboxId = useId();

  // Exam Room State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`exam_answers_${activeExam.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [markedForReview, setMarkedForReview] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`exam_review_${activeExam.id}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved' | 'Saving...'

  // Authoritative countdown timer (45 minutes = 2700 seconds)
  const EXAM_DURATION_SECS = 2700;
  const [secondsLeft, setSecondsLeft] = useState(() => {
    try {
      const startTime = sessionStorage.getItem(`exam_start_time_${activeExam.id}`);
      if (startTime) {
        const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
        return Math.max(0, EXAM_DURATION_SECS - elapsed);
      }
      return EXAM_DURATION_SECS;
    } catch {
      return EXAM_DURATION_SECS;
    }
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState(null);

  // Student's published result record
  const studentResultRecord = CERTIFICATES_DATA[STUDENT_PROFILE.rollNo];

  // Save answers in sessionStorage to prevent accidental loss on refresh
  const saveAnswersToStorage = (answers, reviewSet) => {
    setSaveStatus('Saving...');
    try {
      sessionStorage.setItem(`exam_answers_${activeExam.id}`, JSON.stringify(answers));
      sessionStorage.setItem(`exam_review_${activeExam.id}`, JSON.stringify(Array.from(reviewSet)));
      setTimeout(() => {
        setSaveStatus('Saved');
      }, 250);
    } catch {
      setSaveStatus('Save Failed');
    }
  };

  // Final Exam Submission Handler
  const handleFinalSubmit = useCallback(() => {
    setShowSubmitModal(false);
    const receipt = {
      referenceNo: `NCTMS-EXAM-SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      examId: activeExam.id,
      subject: activeExam.subject,
      paperCode: activeExam.paperCode,
      hallTicketNo: activeExam.hallTicketNo,
      submittedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      totalQuestions: questions.length,
      answeredCount: Object.keys(selectedAnswers).length,
      status: 'Submitted & Stored in Council Exam Vault'
    };

    setSubmissionReceipt(receipt);
    setViewMode('submitted');

    // Clean up temporary active session storage
    try {
      sessionStorage.removeItem(`exam_start_time_${activeExam.id}`);
      sessionStorage.removeItem(`exam_answers_${activeExam.id}`);
      sessionStorage.removeItem(`exam_review_${activeExam.id}`);
    } catch {
      // ignore
    }
  }, [activeExam, questions.length, selectedAnswers]);

  // Timer Effect
  useEffect(() => {
    if (viewMode !== 'room') return;

    // Set start time on first launch
    let storedStart = sessionStorage.getItem(`exam_start_time_${activeExam.id}`);
    if (!storedStart) {
      storedStart = String(Date.now());
      sessionStorage.setItem(`exam_start_time_${activeExam.id}`, storedStart);
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [viewMode, activeExam.id, handleFinalSubmit]);

  // Before unload warning when in exam room
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (viewMode === 'room') {
        e.preventDefault();
        e.returnValue = 'You have an active examination in progress. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [viewMode]);

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIndex) => {
    const updated = {
      ...selectedAnswers,
      [currentQIndex]: optIndex
    };
    setSelectedAnswers(updated);
    saveAnswersToStorage(updated, markedForReview);
  };

  const handleClearAnswer = () => {
    const updated = { ...selectedAnswers };
    delete updated[currentQIndex];
    setSelectedAnswers(updated);
    saveAnswersToStorage(updated, markedForReview);
  };

  const handleToggleReview = () => {
    const updated = new Set(markedForReview);
    if (updated.has(currentQIndex)) {
      updated.delete(currentQIndex);
    } else {
      updated.add(currentQIndex);
    }
    setMarkedForReview(updated);
    saveAnswersToStorage(selectedAnswers, updated);
  };

  const handleStartExam = () => {
    setViewMode('instructions');
    setInstructionsAgreed(false);
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleProceedToRoom = () => {
    if (instructionsAgreed) {
      setViewMode('room');
      setCurrentQIndex(0);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Available Exams (canLaunch: true)
  const availableExams = STUDENT_EXAMS.filter((e) => e.canLaunch);
  // Upcoming Exams (canLaunch: false)
  const upcomingExams = STUDENT_EXAMS.filter((e) => !e.canLaunch);

  return (
    <PublicLayout>
      {/* 1. PAGE HEADER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Online Examination</span>
            </nav>
            <h1>Online Examination Portal</h1>
            <p className="subpage-hero-subtitle">
              Access your scheduled examinations, review exam instructions, and track your examination status.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">✍️</span>
            <div>
              <strong>Secure Examination Vault</strong>
              <span>Central Academic Proctoring</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* ACCESS CONTROL GATE */}
          {!isStudent ? (
            <div className="classes-gate-card">
              <div className="classes-gate-icon">🛡️</div>
              <h2 style={{ fontSize: '22px', color: '#0b326b', fontWeight: 800, margin: '0 0 10px' }}>
                Student Authentication Required
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: '1.6', margin: '0 auto 24px', maxWidth: '480px' }}>
                The Online Examination Portal, live proctoring, and official hall tickets are strictly restricted to registered candidates enrolled in NCTMS accredited programs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '12px 32px', fontSize: '15px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}
                  onClick={() => loginAs('student')}
                >
                  Student Login (Registered Candidate) &rarr;
                </button>

                <Link
                  to="/courses"
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '13.5px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}
                >
                  Explore Course Catalog
                </Link>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED STUDENT EXAMINATION SYSTEM */
            <div>

              {/* VIEW MODE 1: EXAMINATION DASHBOARD */}
              {viewMode === 'dashboard' && (
                <div>
                  {/* Student Identification Banner */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: '#eff6ff',
                          color: '#0c57c4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px'
                        }}
                      >
                        👨‍🎓
                      </div>
                      <div>
                        <h2 style={{ fontSize: '16px', color: '#0b326b', margin: 0, fontWeight: 800 }}>
                          {STUDENT_PROFILE.fullName}
                        </h2>
                        <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                          Candidate Roll No: <strong>{STUDENT_PROFILE.rollNo}</strong> &bull; Program: <strong>{STUDENT_PROFILE.courseCode}</strong>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          border: '1px solid #86efac',
                          fontSize: '11.5px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}
                      >
                        ✓ Hall Ticket Issued
                      </span>
                      <button
                        type="button"
                        onClick={() => logout()}
                        className="btn-secondary"
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* 2. EXAMINATION DASHBOARD SUMMARY CARDS */}
                  <div className="exam-dash-summary">
                    <div className="exam-stat-card">
                      <div className="exam-stat-icon">🟢</div>
                      <div>
                        <div className="exam-stat-val">{availableExams.length}</div>
                        <div className="exam-stat-label">Available Exams</div>
                      </div>
                    </div>

                    <div className="exam-stat-card">
                      <div className="exam-stat-icon">📅</div>
                      <div>
                        <div className="exam-stat-val">{upcomingExams.length}</div>
                        <div className="exam-stat-label">Upcoming Scheduled</div>
                      </div>
                    </div>

                    <div className="exam-stat-card">
                      <div className="exam-stat-icon">✅</div>
                      <div>
                        <div className="exam-stat-val">{submissionReceipt ? 1 : 0}</div>
                        <div className="exam-stat-label">Completed in Session</div>
                      </div>
                    </div>

                    <div className="exam-stat-card">
                      <div className="exam-stat-icon">📜</div>
                      <div>
                        <div className="exam-stat-val">{studentResultRecord ? 1 : 0}</div>
                        <div className="exam-stat-label">Published Term Results</div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs Bar */}
                  <nav className="classes-tabs-bar" aria-label="Examination dashboard tabs">
                    <button
                      type="button"
                      className={`classes-tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                      onClick={() => setActiveTab('available')}
                    >
                      🟢 Available Now ({availableExams.length})
                    </button>
                    <button
                      type="button"
                      className={`classes-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      📅 Upcoming Scheduled ({upcomingExams.length})
                    </button>
                    <button
                      type="button"
                      className={`classes-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                      onClick={() => setActiveTab('completed')}
                    >
                      ✅ Completed Exams ({submissionReceipt ? 1 : 0})
                    </button>
                    <button
                      type="button"
                      className={`classes-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                      onClick={() => setActiveTab('results')}
                    >
                      🏆 Published Results ({studentResultRecord ? 1 : 0})
                    </button>
                  </nav>

                  {/* TAB 1: AVAILABLE NOW */}
                  {activeTab === 'available' && (
                    <div className="exam-listing-grid">
                      {availableExams.map((exam) => (
                        <div key={exam.id} className="exam-item-card is-available">
                          <div style={{ flex: '1', minWidth: '260px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                              <span className="course-code-tag">{exam.paperCode}</span>
                              <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                                ● Active Exam Window
                              </span>
                            </div>
                            <h3 style={{ fontSize: '17px', color: '#0b326b', margin: '0 0 6px', fontWeight: 800 }}>
                              {exam.subject}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                              Hall Ticket: <strong>{exam.hallTicketNo}</strong> &bull; Schedule: <strong>{exam.time}</strong>
                            </p>

                            <div className="exam-meta-pills">
                              <span className="exam-meta-pill">⏱ Duration: 45 Mins</span>
                              <span className="exam-meta-pill">📋 Total Questions: {questions.length}</span>
                              <span className="exam-meta-pill">🎯 Max Marks: {exam.totalMarks}</span>
                              <span className="exam-meta-pill">✓ Passing Marks: {exam.passingMarks}</span>
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}
                              onClick={handleStartExam}
                            >
                              Review Instructions & Start Exam &rarr;
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: UPCOMING SCHEDULED */}
                  {activeTab === 'upcoming' && (
                    <div className="exam-listing-grid">
                      {upcomingExams.map((exam) => (
                        <div key={exam.id} className="exam-item-card is-scheduled">
                          <div style={{ flex: '1', minWidth: '260px' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                              <span className="course-code-tag">{exam.paperCode}</span>
                              <span style={{ fontSize: '11px', background: '#eff6ff', color: '#0c57c4', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                                Scheduled for {exam.date}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '17px', color: '#0b326b', margin: '0 0 6px', fontWeight: 800 }}>
                              {exam.subject}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                              Date: <strong>{exam.date}</strong> &bull; Slot: <strong>{exam.time}</strong> &bull; Hall Ticket: <strong>{exam.hallTicketNo}</strong>
                            </p>

                            <div className="exam-meta-pills">
                              <span className="exam-meta-pill">⏱ Duration: 2 Hours</span>
                              <span className="exam-meta-pill">🎯 Max Marks: {exam.totalMarks}</span>
                              <span className="exam-meta-pill">✓ Passing Marks: {exam.passingMarks}</span>
                            </div>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn-secondary"
                              disabled
                              style={{ opacity: 0.65, cursor: 'not-allowed', padding: '10px 20px', fontSize: '13px' }}
                            >
                              Opens on {exam.date}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: COMPLETED EXAMS */}
                  {activeTab === 'completed' && (
                    <div>
                      {submissionReceipt ? (
                        <div className="exam-item-card">
                          <div>
                            <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                              ● {submissionReceipt.status}
                            </span>
                            <h3 style={{ fontSize: '17px', color: '#0b326b', margin: '6px 0 4px', fontWeight: 800 }}>
                              {submissionReceipt.subject}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                              Ref: <strong>{submissionReceipt.referenceNo}</strong> &bull; Submitted on: <strong>{submissionReceipt.submittedDate} at {submissionReceipt.submittedAt}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#166534', margin: '6px 0 0' }}>
                              Recorded Responses: {submissionReceipt.answeredCount} / {submissionReceipt.totalQuestions} Questions. Pending central academic council evaluation.
                            </p>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => setViewMode('submitted')}
                            >
                              View Submission Receipt
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>📝</span>
                          <h4 style={{ fontSize: '16px', color: '#0f274a', margin: '0 0 4px' }}>No completed exams in this active session</h4>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Please take your available examination from the "Available Now" tab.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: PUBLISHED RESULTS */}
                  {activeTab === 'results' && (
                    <div>
                      {studentResultRecord ? (
                        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <span style={{ fontSize: '11px', background: '#eff6ff', color: '#0c57c4', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                                OFFICIAL RESULTS ARCHIVE
                              </span>
                              <h3 style={{ fontSize: '18px', color: '#0b326b', margin: '4px 0 2px', fontWeight: 800 }}>
                                {studentResultRecord.examinationMonthYear} Term-End Examination
                              </h3>
                              <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                                Certificate No: <strong>{studentResultRecord.certificateNo}</strong> &bull; Grade: <strong>{studentResultRecord.overallGrade}</strong>
                              </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>Aggregate Percentage</span>
                              <strong style={{ fontSize: '24px', color: '#16a34a', display: 'block' }}>{studentResultRecord.percentage}</strong>
                            </div>
                          </div>

                          {/* Marks Table */}
                          <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                              <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#0b326b', textAlign: 'left' }}>
                                  <th style={{ padding: '10px 12px' }}>Code</th>
                                  <th style={{ padding: '10px 12px' }}>Subject Title</th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Max Marks</th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Pass Marks</th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Obtained</th>
                                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Grade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {studentResultRecord.marks.map((m, idx) => (
                                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0c57c4' }}>{m.code}</td>
                                    <td style={{ padding: '10px 12px' }}>{m.name}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{m.maxMarks}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>{m.passMarks}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#0f274a' }}>{m.marksObtained}</td>
                                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700, color: '#16a34a' }}>{m.grade}</td>
                                  </tr>
                                ))}
                                <tr style={{ background: '#eff6ff', fontWeight: 700, color: '#0b326b' }}>
                                  <td colSpan="2" style={{ padding: '10px 12px' }}>Total Marks Aggregate</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{studentResultRecord.totalMax}</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>200</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#16a34a' }}>{studentResultRecord.totalObtained}</td>
                                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>{studentResultRecord.cgpa} CGPA</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <Link to={`/verify/${STUDENT_PROFILE.rollNo}`} className="btn-secondary" style={{ fontSize: '13px', padding: '8px 18px' }}>
                              Verify Official Certificate &rarr;
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <p style={{ margin: 0, color: '#64748b' }}>No published results available for this candidate.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* VIEW MODE 2: EXAM INSTRUCTIONS SCREEN */}
              {viewMode === 'instructions' && (
                <div className="exam-instructions-container">
                  <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
                    <span className="course-code-tag">{activeExam.paperCode}</span>
                    <h2 style={{ fontSize: '22px', color: '#0b326b', margin: '6px 0 4px', fontWeight: 800 }}>
                      Examination Instructions & Code of Conduct
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      Subject: <strong>{activeExam.subject}</strong> &bull; Hall Ticket: <strong>{activeExam.hallTicketNo}</strong>
                    </p>
                  </div>

                  <div className="exam-meta-pills" style={{ marginBottom: '20px' }}>
                    <span className="exam-meta-pill">⏱ Duration: 45 Minutes</span>
                    <span className="exam-meta-pill">📋 Total Questions: {questions.length}</span>
                    <span className="exam-meta-pill">🎯 Maximum Marks: {activeExam.totalMarks}</span>
                    <span className="exam-meta-pill">✓ Passing Marks: {activeExam.passingMarks}</span>
                    <span className="exam-meta-pill">🚫 Negative Marking: None</span>
                  </div>

                  <h3 style={{ fontSize: '16px', color: '#0f274a', fontWeight: 700, margin: '0 0 12px' }}>
                    Authoritative Examination Regulations:
                  </h3>

                  <ul className="exam-rules-list">
                    <li className="exam-rule-item">
                      <span>1️⃣</span>
                      <div>
                        <strong>Question Navigation:</strong> You may navigate freely between questions using the "Next", "Previous", or Question Navigator buttons.
                      </div>
                    </li>
                    <li className="exam-rule-item">
                      <span>2️⃣</span>
                      <div>
                        <strong>Automatic Answer Saving:</strong> When you select an answer, it is recorded in the examination state. You can clear your response or mark a question for review at any time.
                      </div>
                    </li>
                    <li className="exam-rule-item">
                      <span>3️⃣</span>
                      <div>
                        <strong>Continuous Timer:</strong> The countdown timer will continue even if you refresh your browser. If time runs out, your examination will automatically be submitted.
                      </div>
                    </li>
                    <li className="exam-rule-item">
                      <span>4️⃣</span>
                      <div>
                        <strong>Result Confidentiality:</strong> In accordance with council examination policies, correct answer keys are not displayed during the test or upon submission. Official evaluated scores are published after council evaluation.
                      </div>
                    </li>
                    <li className="exam-rule-item">
                      <span>5️⃣</span>
                      <div>
                        <strong>Single Authorized Attempt:</strong> Only one attempt is permitted. Once submitted, your answers will be locked for grading.
                      </div>
                    </li>
                  </ul>

                  {/* Agreement Checkbox */}
                  <div style={{ marginBottom: '28px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
                    <label
                      htmlFor={agreeCheckboxId}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: '#0f274a', fontWeight: 600, cursor: 'pointer' }}
                    >
                      <input
                        id={agreeCheckboxId}
                        type="checkbox"
                        checked={instructionsAgreed}
                        onChange={(e) => setInstructionsAgreed(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span>
                        I confirm that I have read and agree to comply with all NCTMS examination regulations.
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setViewMode('dashboard')}
                    >
                      &larr; Return to Dashboard
                    </button>

                    <button
                      type="button"
                      className="btn-primary"
                      disabled={!instructionsAgreed}
                      onClick={handleProceedToRoom}
                      style={{ padding: '12px 28px', fontSize: '14.5px', borderRadius: '8px' }}
                    >
                      Start Examination Now &rarr;
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW MODE 3: ACTIVE EXAM INTERFACE (ROOM) */}
              {viewMode === 'room' && (
                <div className="exam-room-wrapper">
                  {/* Top Header Bar */}
                  <div className="exam-room-header-bar">
                    <div>
                      <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700 }}>
                        {activeExam.paperCode} &bull; {activeExam.hallTicketNo}
                      </span>
                      <h2 style={{ fontSize: '16px', margin: '2px 0 0', fontWeight: 800 }}>
                        {activeExam.subject}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                        Status: <strong style={{ color: '#86efac' }}>● {saveStatus}</strong>
                      </span>

                      <div className={`exam-timer-box ${secondsLeft <= 300 ? 'warning' : ''}`} aria-label="Remaining Examination Time">
                        <span>⏱</span>
                        <span>{formatTimer(secondsLeft)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Question Panel + Navigation Sidebar */}
                  <div className="exam-room-grid">
                    {/* Left: Current Question Card */}
                    <div className="exam-question-card">
                      <div className="exam-q-header">
                        <span className="exam-q-title">
                          Question {currentQIndex + 1} of {questions.length}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#0c57c4', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                            Single Choice
                          </span>
                          <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#334155', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                            5 Marks
                          </span>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="exam-q-text">
                        {questions[currentQIndex].question}
                      </p>

                      {/* Options List (Radio options without answer key exposure) */}
                      <div className="exam-options-list">
                        {questions[currentQIndex].options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`exam-option-item ${selectedAnswers[currentQIndex] === optIdx ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name={`question_${currentQIndex}`}
                              checked={selectedAnswers[currentQIndex] === optIdx}
                              onChange={() => handleSelectOption(optIdx)}
                              className="exam-option-radio"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="exam-q-actions">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleClearAnswer}
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            disabled={selectedAnswers[currentQIndex] === undefined}
                          >
                            Clear Response
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={handleToggleReview}
                            style={{
                              fontSize: '12px',
                              padding: '6px 12px',
                              background: markedForReview.has(currentQIndex) ? '#ede9fe' : undefined,
                              color: markedForReview.has(currentQIndex) ? '#6d28d9' : undefined,
                              borderColor: markedForReview.has(currentQIndex) ? '#c4b5fd' : undefined
                            }}
                          >
                            {markedForReview.has(currentQIndex) ? '✓ Marked for Review' : 'Mark for Review'}
                          </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                            disabled={currentQIndex === 0}
                          >
                            &larr; Previous
                          </button>
                          {currentQIndex < questions.length - 1 ? (
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                            >
                              Next &rarr;
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ background: '#16a34a', borderColor: '#16a34a' }}
                              onClick={() => setShowSubmitModal(true)}
                            >
                              Review & Submit &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Question Navigation Panel */}
                    <div className="exam-nav-sidebar">
                      <h3 style={{ fontSize: '14px', color: '#0b326b', margin: '0 0 12px', fontWeight: 800 }}>
                        Question Navigator
                      </h3>

                      <div className="exam-nav-legend">
                        <div className="legend-badge">
                          <span className="legend-dot answered"></span>
                          <span>Answered ({Object.keys(selectedAnswers).length})</span>
                        </div>
                        <div className="legend-badge">
                          <span className="legend-dot unanswered"></span>
                          <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
                        </div>
                        <div className="legend-badge" style={{ gridColumn: '1 / -1' }}>
                          <span className="legend-dot marked"></span>
                          <span>Marked for Review ({markedForReview.size})</span>
                        </div>
                      </div>

                      {/* Numbered buttons */}
                      <div className="exam-nav-grid">
                        {questions.map((_, idx) => {
                          const isAnswered = selectedAnswers[idx] !== undefined;
                          const isMarked = markedForReview.has(idx);
                          const isActive = currentQIndex === idx;

                          let btnClass = 'exam-nav-btn';
                          if (isMarked) btnClass += ' marked';
                          else if (isAnswered) btnClass += ' answered';
                          if (isActive) btnClass += ' active';

                          return (
                            <button
                              key={idx}
                              type="button"
                              className={btnClass}
                              onClick={() => setCurrentQIndex(idx)}
                              aria-label={`Jump to question ${idx + 1}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        className="btn-primary"
                        style={{ width: '100%', background: '#16a34a', borderColor: '#16a34a', padding: '12px', fontSize: '13.5px', fontWeight: 800 }}
                        onClick={() => setShowSubmitModal(true)}
                      >
                        Submit Examination &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 8. SUBMISSION CONFIRMATION MODAL */}
              {showSubmitModal && (
                <div className="exam-confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                  <div className="exam-confirm-modal">
                    <span style={{ fontSize: '42px', display: 'block', marginBottom: '8px' }}>📋</span>
                    <h3 id="modal-title" style={{ fontSize: '20px', color: '#0b326b', margin: '0 0 6px', fontWeight: 800 }}>
                      Are you sure you want to submit?
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Please review your question summary before final locking.
                    </p>

                    <div className="exam-summary-badge-row">
                      <div className="exam-summary-badge-item">
                        <strong>{Object.keys(selectedAnswers).length}</strong>
                        <span>Answered</span>
                      </div>
                      <div className="exam-summary-badge-item">
                        <strong style={{ color: '#dc2626' }}>{questions.length - Object.keys(selectedAnswers).length}</strong>
                        <span>Unanswered</span>
                      </div>
                      <div className="exam-summary-badge-item">
                        <strong style={{ color: '#7c3aed' }}>{markedForReview.size}</strong>
                        <span>Marked</span>
                      </div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#475569', background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', margin: '0 0 20px' }}>
                      ⚠️ Once submitted, your responses cannot be altered. Examination files will be securely vaulted for academic council grading.
                    </p>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        onClick={() => setShowSubmitModal(false)}
                      >
                        Continue Exam
                      </button>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1, background: '#16a34a', borderColor: '#16a34a' }}
                        onClick={handleFinalSubmit}
                      >
                        Confirm & Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 9. SUBMISSION SUCCESS SCREEN */}
              {viewMode === 'submitted' && submissionReceipt && (
                <div className="exam-success-card">
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      background: '#dcfce7',
                      color: '#16a34a',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '32px',
                      margin: '0 auto 14px'
                    }}
                  >
                    ✓
                  </div>
                  <h2 style={{ fontSize: '24px', color: '#0b326b', margin: '0 0 6px', fontWeight: 800 }}>
                    Examination Submitted Successfully!
                  </h2>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px' }}>
                    Your examination answers have been securely recorded and vaulted into the NCTMS Examination Evaluation Server.
                  </p>

                  <div
                    style={{
                      background: '#eff6ff',
                      border: '2px dashed #0c57c4',
                      borderRadius: '10px',
                      padding: '18px',
                      marginBottom: '24px',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                      Official Examination Submission Reference
                    </span>
                    <h3 style={{ fontSize: '24px', color: '#0c57c4', fontFamily: 'monospace', margin: '4px 0' }}>
                      {submissionReceipt.referenceNo}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#475569' }}>
                      Submitted on: {submissionReceipt.submittedDate} at {submissionReceipt.submittedAt}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', fontSize: '13px', marginBottom: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div><strong>Candidate:</strong> {STUDENT_PROFILE.fullName}</div>
                      <div><strong>Roll Number:</strong> {STUDENT_PROFILE.rollNo}</div>
                      <div><strong>Subject:</strong> {submissionReceipt.subject}</div>
                      <div><strong>Recorded Answers:</strong> {submissionReceipt.answeredCount} / {submissionReceipt.totalQuestions} Questions</div>
                      <div><strong>Submission Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>Recorded & Verified</span></div>
                      <div><strong>Hall Ticket No:</strong> {submissionReceipt.hallTicketNo}</div>
                    </div>
                  </div>

                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', fontSize: '12.5px', color: '#166534', marginBottom: '24px', textAlign: 'left' }}>
                    🔒 <strong>Evaluation & Result Policy:</strong> In accordance with council examination policies, answer keys are not released during examination cycles. Official evaluated scores, mark transcripts, and provisional certificates will be published under the "Results" tab after council scrutiny.
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => window.print()}
                    >
                      🖨️ Print Submission Receipt
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        setViewMode('dashboard');
                        setActiveTab('completed');
                      }}
                    >
                      Return to Examination Dashboard &rarr;
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}

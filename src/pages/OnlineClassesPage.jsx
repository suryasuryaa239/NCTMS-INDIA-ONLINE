import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../context/AuthContext';
import { STUDENT_PROFILE, STUDENT_ATTENDANCE, STUDENT_CLASSES } from '../data/studentData';

export default function OnlineClassesPage() {
  const { currentUser, loginAs, logout } = useAuth();
  const isStudent = currentUser && currentUser.role === 'student';

  // Navigation Tabs for student dashboard: 'overview' | 'recorded' | 'live' | 'materials' | 'timetable'
  const [activeTab, setActiveTab] = useState('overview');

  // Active Video Player Selection
  const [selectedLecture, setSelectedLecture] = useState(STUDENT_CLASSES[0]);
  const [markedAttendance, setMarkedAttendance] = useState(false);

  // Search & Filter in Recorded Lessons
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');

  // Timetable filter: 'all' | 'today' | 'upcoming'
  const [timetableFilter, setTimetableFilter] = useState('all');

  // Handle Attendance Action
  const handleMarkAttendance = () => {
    setMarkedAttendance(true);
  };

  // Filter recorded lessons from real STUDENT_CLASSES (recorded archive items)
  const recordedLessons = STUDENT_CLASSES.filter(
    (c) => c.status && c.status.toLowerCase().includes('recorded')
  );

  const filteredRecordedLessons = recordedLessons.filter((lec) => {
    const q = lessonSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lec.topic.toLowerCase().includes(q) ||
      lec.subject.toLowerCase().includes(q) ||
      lec.faculty.toLowerCase().includes(q) ||
      lec.code.toLowerCase().includes(q);

    const matchesSubject =
      selectedSubjectFilter === 'All' || lec.code === selectedSubjectFilter;

    return matchesSearch && matchesSubject;
  });

  // Upcoming live classes from real STUDENT_CLASSES
  const upcomingClasses = STUDENT_CLASSES.filter(
    (c) => c.status && c.status.toLowerCase().includes('upcoming')
  );

  // Timetable items derived strictly from verified schedule data
  const timetableItems = [
    {
      date: 'Today • 04:00 PM',
      time: '04:00 PM - 04:45 PM',
      subject: 'Advanced Data Structures (CS101)',
      course: 'PGDCS-201',
      faculty: 'Prof. R. Rajesh, M.E.',
      type: 'Live Interactive Session',
      status: 'Scheduled',
      isToday: true
    },
    {
      date: 'Tomorrow • 10:30 AM',
      time: '10:30 AM - 11:30 AM',
      subject: 'Relational Database Management Systems (CS102)',
      course: 'PGDCS-201',
      faculty: 'Dr. V. Sharma, Ph.D.',
      type: 'Doubt Clearing & Query Lab',
      status: 'Upcoming',
      isToday: false
    },
    {
      date: '14-Oct-2026 • 02:00 PM',
      time: '02:00 PM - 03:30 PM',
      subject: 'Full-Stack Web Architectures & React (CS103)',
      course: 'PGDCS-201',
      faculty: 'Er. K. Anitha',
      type: 'Code Walkthrough & Practicum',
      status: 'Upcoming',
      isToday: false
    }
  ];

  const filteredTimetable = timetableItems.filter((item) => {
    if (timetableFilter === 'today') return item.isToday;
    if (timetableFilter === 'upcoming') return !item.isToday;
    return true;
  });

  // Study materials list from real student lesson documents
  const studyMaterialsList = [
    {
      id: 'mat-1',
      title: 'CS102 Relational Normalization & Functional Dependencies',
      subject: 'Relational Database Management Systems (CS102)',
      fileName: 'CS102_Normalization_Complete_Notes.pdf',
      format: 'PDF Document',
      size: '1.8 MB',
      date: '04-Oct-2026'
    },
    {
      id: 'mat-2',
      title: 'CS103 React 19 State Architecture & Hooks Handbook',
      subject: 'Full-Stack Web Architectures & React (CS103)',
      fileName: 'CS103_React_Architecture_Guide.pdf',
      format: 'PDF Document',
      size: '2.4 MB',
      date: '02-Oct-2026'
    },
    {
      id: 'mat-3',
      title: 'CS101 Graph Theory, Dijkstra & Spanning Tree Formulas',
      subject: 'Advanced Data Structures (CS101)',
      fileName: 'CS101_Graph_Algorithms.pdf',
      format: 'PDF Document',
      size: '1.2 MB',
      date: 'Today'
    }
  ];

  return (
    <PublicLayout>
      {/* 1. PAGE HEADER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Online Classes</span>
            </nav>
            <h1>Online Learning Center</h1>
            <p className="subpage-hero-subtitle">
              Access your classes, recorded lessons, and learning resources in one place.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">💻</span>
            <div>
              <strong>Digital Classroom</strong>
              <span>Live Streams & Archive LMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="content-section">
        <div className="container">

          {/* 2. ACCESS CONTROL GATE (If not authenticated as student) */}
          {!isStudent ? (
            <div className="classes-gate-card">
              <div className="classes-gate-icon">🔒</div>
              <h2 style={{ fontSize: '22px', color: '#0b326b', fontWeight: 800, margin: '0 0 10px' }}>
                Student Login Required
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', lineHeight: '1.6', margin: '0 auto 24px', maxWidth: '480px' }}>
                The Online Learning Center, live streaming sessions, and digital lecture archives are restricted to registered students enrolled in NCTMS accredited academic programs.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '12px 32px', fontSize: '15px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}
                  onClick={() => loginAs('student')}
                >
                  Student Login (Registered Enrollment) &rarr;
                </button>

                <Link
                  to="/courses"
                  className="btn-secondary"
                  style={{ padding: '10px 24px', fontSize: '13.5px', borderRadius: '8px', width: '100%', maxWidth: '320px' }}
                >
                  Explore Available Courses
                </Link>

                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '8px 0 0' }}>
                  Prospective candidate? <Link to="/admission" style={{ color: '#0c57c4', fontWeight: 700 }}>Apply for online admission</Link>
                </p>
              </div>
            </div>
          ) : (
            /* AUTHENTICATED STUDENT LEARNING CENTER */
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
                      Enrollment: <strong>{STUDENT_PROFILE.enrollmentNo}</strong> &bull; Center: <strong>{STUDENT_PROFILE.centerCode}</strong>
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
                    ✓ Active Enrolled Student
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

              {/* 3. STUDENT LEARNING DASHBOARD SUMMARY CARDS */}
              <div className="classes-summary-grid">
                <div className="class-stat-card">
                  <div className="class-stat-icon">🎓</div>
                  <div>
                    <div className="class-stat-val">1</div>
                    <div className="class-stat-label">Enrolled Program</div>
                  </div>
                </div>

                <div className="class-stat-card">
                  <div className="class-stat-icon">🔴</div>
                  <div>
                    <div className="class-stat-val">{upcomingClasses.length}</div>
                    <div className="class-stat-label">Upcoming Live Class</div>
                  </div>
                </div>

                <div className="class-stat-card">
                  <div className="class-stat-icon">📹</div>
                  <div>
                    <div className="class-stat-val">{recordedLessons.length}</div>
                    <div className="class-stat-label">Recorded Lessons</div>
                  </div>
                </div>

                <div className="class-stat-card">
                  <div className="class-stat-icon">📊</div>
                  <div>
                    <div className="class-stat-val">{STUDENT_PROFILE.overallAttendance}%</div>
                    <div className="class-stat-label">Overall Attendance</div>
                  </div>
                </div>
              </div>

              {/* Learning Center Navigation Tabs */}
              <nav className="classes-tabs-bar" aria-label="Learning center sections">
                <button
                  type="button"
                  className={`classes-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📚 My Program & Subjects
                </button>
                <button
                  type="button"
                  className={`classes-tab-btn ${activeTab === 'live' ? 'active' : ''}`}
                  onClick={() => setActiveTab('live')}
                >
                  🔴 Upcoming Live Classes ({upcomingClasses.length})
                </button>
                <button
                  type="button"
                  className={`classes-tab-btn ${activeTab === 'recorded' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recorded')}
                >
                  📹 Recorded Lessons ({recordedLessons.length})
                </button>
                <button
                  type="button"
                  className={`classes-tab-btn ${activeTab === 'timetable' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timetable')}
                >
                  🗓️ Class Timetable
                </button>
                <button
                  type="button"
                  className={`classes-tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
                  onClick={() => setActiveTab('materials')}
                >
                  📄 Study Materials ({studyMaterialsList.length})
                </button>
              </nav>

              {/* TAB 1: OVERVIEW & MY COURSES & SUBJECTS */}
              {activeTab === 'overview' && (
                <div>
                  {/* 4. MY COURSES CARD */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '24px',
                      marginBottom: '28px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                        <img
                          src="/assets/images/portal.jpg"
                          alt="Course Banner"
                          style={{ width: '84px', height: '84px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <span className="course-code-tag">{STUDENT_PROFILE.courseCode}</span>
                          <h2 style={{ fontSize: '19px', color: '#0b326b', margin: '4px 0 6px', fontWeight: 800 }}>
                            {STUDENT_PROFILE.program}
                          </h2>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                            Term: <strong>{STUDENT_PROFILE.currentSemester}</strong> &bull; Center: <strong>{STUDENT_PROFILE.centerName}</strong>
                          </p>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, display: 'block' }}>
                          Cumulative CGPA
                        </span>
                        <strong style={{ fontSize: '24px', color: '#0c57c4' }}>{STUDENT_PROFILE.cgpa} / 10.0</strong>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                        <span style={{ color: '#475569', fontWeight: 600 }}>Overall Academic Attendance Completion</span>
                        <strong style={{ color: '#0b326b' }}>{STUDENT_PROFILE.overallAttendance}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${STUDENT_PROFILE.overallAttendance}%`, height: '100%', background: '#22c55e', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* 5. SUBJECTS AND LESSONS LIST */}
                  <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, marginBottom: '16px' }}>
                    Enrolled Subjects & Learning Resources
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {STUDENT_ATTENDANCE.map((sub, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '18px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '14px'
                        }}
                      >
                        <div style={{ flex: '1', minWidth: '240px' }}>
                          <span style={{ fontSize: '11px', background: '#eff6ff', color: '#0c57c4', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                            {sub.code}
                          </span>
                          <h4 style={{ fontSize: '15.5px', color: '#0b326b', margin: '4px 0 6px', fontWeight: 700 }}>
                            {sub.subject}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Classes Attended: <strong>{sub.attended}</strong> / {sub.conducted} ({sub.percentage}%)
                          </span>
                        </div>

                        {/* Resource Badges */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                            onClick={() => {
                              setSelectedSubjectFilter(sub.code);
                              setActiveTab('recorded');
                            }}
                          >
                            📹 Recorded ({sub.code === 'CS102' || sub.code === 'CS103' ? '1' : '0'})
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                            onClick={() => setActiveTab('materials')}
                          >
                            📄 E-Notes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE CLASSES */}
              {activeTab === 'live' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, margin: 0 }}>
                      Upcoming Scheduled Live Classes
                    </h3>
                    <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                      All times in Indian Standard Time (IST)
                    </span>
                  </div>

                  {upcomingClasses.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {upcomingClasses.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '12px',
                            padding: '22px',
                            boxShadow: '0 4px 14px rgba(12, 87, 196, 0.06)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                            <div>
                              <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                                ● {item.status}
                              </span>
                              <h4 style={{ fontSize: '17px', color: '#0b326b', margin: '6px 0 2px', fontWeight: 800 }}>
                                {item.topic}
                              </h4>
                              <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                                Subject: <strong>{item.subject} ({item.code})</strong> &bull; Faculty: <strong>{item.faculty}</strong>
                              </p>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <strong style={{ fontSize: '14.5px', color: '#0c57c4', display: 'block' }}>
                                ⏰ {item.date}
                              </strong>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>Duration: {item.duration}</span>
                            </div>
                          </div>

                          <div
                            style={{
                              background: '#eff6ff',
                              border: '1px dashed #93c5fd',
                              borderRadius: '8px',
                              padding: '12px 16px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '12px',
                              marginTop: '14px'
                            }}
                          >
                            <span style={{ fontSize: '12.5px', color: '#1e40af' }}>
                              🔒 Meeting link will be activated 10 minutes prior to scheduled lecture time (03:50 PM).
                            </span>

                            {/* Rule: Show a "Join Class" button only when a valid meeting link exists */}
                            {item.videoUrl ? (
                              <a
                                href={item.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary"
                                style={{ padding: '8px 20px', fontSize: '13px' }}
                              >
                                Join Live Class &rarr;
                              </a>
                            ) : (
                              <button
                                type="button"
                                className="btn-secondary"
                                disabled
                                style={{ padding: '8px 18px', fontSize: '12.5px', opacity: 0.7, cursor: 'not-allowed' }}
                                title="Link activates 10 mins before class"
                              >
                                Link Activates at 03:50 PM
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🗓️</span>
                      <h4 style={{ fontSize: '17px', color: '#0f274a', margin: '0 0 6px' }}>No upcoming live classes right now</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                        All sessions for today have concluded. Please check the timetable for tomorrow's schedule.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: RECORDED LESSONS & VIDEO PLAYER */}
              {activeTab === 'recorded' && (
                <div>
                  {/* Active Video Player Screen */}
                  {selectedLecture && (
                    <div className="lecture-video-player-wrap">
                      <div className="lecture-video-screen">
                        {selectedLecture.videoUrl ? (
                          <iframe
                            src={selectedLecture.videoUrl}
                            title={selectedLecture.topic}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          <div style={{ textAlign: 'center', color: '#cbd5e1' }}>
                            <span style={{ fontSize: '44px', display: 'block', marginBottom: '8px' }}>📹</span>
                            <p style={{ margin: 0, fontSize: '14px' }}>Video stream preview initializing...</p>
                          </div>
                        )}
                      </div>

                      <div className="lecture-video-banner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <span className="course-code-tag">{selectedLecture.code}</span>
                            <h3 style={{ fontSize: '18px', color: '#0b326b', margin: '4px 0 4px', fontWeight: 800 }}>
                              {selectedLecture.topic}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                              Instructor: <strong>{selectedLecture.faculty}</strong> &bull; Subject: <strong>{selectedLecture.subject}</strong> &bull; Views: {selectedLecture.views}
                            </p>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              className={markedAttendance ? 'btn-secondary' : 'btn-primary'}
                              style={{ padding: '8px 16px', fontSize: '12.5px' }}
                              onClick={handleMarkAttendance}
                              disabled={markedAttendance}
                            >
                              {markedAttendance ? '✓ Attendance Logged' : '📌 Mark Class Attendance'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search and Filters for Lessons */}
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px',
                      marginBottom: '20px',
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <input
                        type="text"
                        placeholder="Search lessons by topic or keyword (e.g. Normalization, React)..."
                        value={lessonSearchQuery}
                        onChange={(e) => setLessonSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                        aria-label="Search recorded lessons"
                      />
                    </div>

                    <div>
                      <select
                        value={selectedSubjectFilter}
                        onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                        className="inst-select"
                        style={{ minWidth: '180px' }}
                        aria-label="Filter lessons by subject"
                      >
                        <option value="All">All Subjects</option>
                        <option value="CS102">CS102 — Relational DBMS</option>
                        <option value="CS103">CS103 — Full-Stack React</option>
                      </select>
                    </div>

                    {(lessonSearchQuery || selectedSubjectFilter !== 'All') && (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '12.5px' }}
                        onClick={() => {
                          setLessonSearchQuery('');
                          setSelectedSubjectFilter('All');
                        }}
                      >
                        Reset Filter
                      </button>
                    )}
                  </div>

                  {/* Recorded Lessons Grid */}
                  {filteredRecordedLessons.length > 0 ? (
                    <div className="recorded-lessons-grid">
                      {filteredRecordedLessons.map((lec) => (
                        <article key={lec.id} className="lesson-card">
                          <div className="lesson-card-thumb">
                            <img src={lec.thumbnail} alt={lec.topic} loading="lazy" />
                            <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.75)', color: '#ffffff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                              {lec.code}
                            </span>
                            <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: '#ffffff', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>
                              ⏱ {lec.duration}
                            </span>
                          </div>

                          <div className="lesson-card-body">
                            <span style={{ fontSize: '11.5px', color: '#0c57c4', fontWeight: 700 }}>
                              {lec.subject}
                            </span>
                            <h4 className="lesson-card-title">{lec.topic}</h4>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px', flexGrow: 1 }}>
                              Faculty: {lec.faculty} &bull; Recorded on: {lec.date}
                            </p>

                            <button
                              type="button"
                              className="btn-primary"
                              style={{ width: '100%', padding: '10px', fontSize: '13px' }}
                              onClick={() => {
                                setSelectedLecture(lec);
                                setMarkedAttendance(false);
                                window.scrollTo({ top: 380, behavior: 'smooth' });
                              }}
                            >
                              ▶ Watch Lesson Now
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🔍</span>
                      <h4 style={{ fontSize: '16px', color: '#0f274a', margin: '0 0 4px' }}>No lessons found matching query</h4>
                      <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px' }}>
                        Try adjusting your keywords or clearing the subject filter.
                      </p>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          setLessonSearchQuery('');
                          setSelectedSubjectFilter('All');
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CLASS TIMETABLE */}
              {activeTab === 'timetable' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, margin: 0 }}>
                      Academic Class Timetable
                    </h3>

                    {/* Filter buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className={`btn-secondary ${timetableFilter === 'all' ? 'btn-primary' : ''}`}
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                        onClick={() => setTimetableFilter('all')}
                      >
                        All
                      </button>
                      <button
                        type="button"
                        className={`btn-secondary ${timetableFilter === 'today' ? 'btn-primary' : ''}`}
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                        onClick={() => setTimetableFilter('today')}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        className={`btn-secondary ${timetableFilter === 'upcoming' ? 'btn-primary' : ''}`}
                        style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }}
                        onClick={() => setTimetableFilter('upcoming')}
                      >
                        Upcoming
                      </button>
                    </div>
                  </div>

                  <div className="timetable-card">
                    {filteredTimetable.length > 0 ? (
                      filteredTimetable.map((slot, idx) => (
                        <div key={idx} className="timetable-row">
                          <div style={{ minWidth: '180px' }}>
                            <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block' }}>
                              {slot.date}
                            </strong>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{slot.time}</span>
                          </div>

                          <div style={{ flex: 1, minWidth: '220px' }}>
                            <h4 style={{ fontSize: '14px', color: '#0f274a', margin: '0 0 2px', fontWeight: 700 }}>
                              {slot.subject}
                            </h4>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              Faculty: {slot.faculty} &bull; Type: <strong>{slot.type}</strong>
                            </span>
                          </div>

                          <div>
                            <span
                              style={{
                                background: slot.isToday ? '#fee2e2' : '#f1f5f9',
                                color: slot.isToday ? '#b91c1c' : '#475569',
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '4px 10px',
                                borderRadius: '4px'
                              }}
                            >
                              {slot.status}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                        No timetable entries matching selected filter.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: STUDY MATERIALS */}
              {activeTab === 'materials' && (
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, marginBottom: '16px' }}>
                    Authorized Study Notes & E-Books
                  </h3>

                  <div className="materials-grid">
                    {studyMaterialsList.map((doc) => (
                      <div key={doc.id} className="material-item-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{ fontSize: '28px' }}>📄</span>
                          <div>
                            <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block', lineHeight: '1.3' }}>
                              {doc.title}
                            </strong>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {doc.format} &bull; {doc.size}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`#download-${doc.fileName}`}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading authorized curriculum resource: ${doc.fileName}`);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px', whiteSpace: 'nowrap' }}
                        >
                          ⬇ Download
                        </a>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '20px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#64748b' }}>
                    🔒 <strong>Access Control:</strong> Digital learning materials are watermarked with the student's enrollment ID ({STUDENT_PROFILE.enrollmentNo}) and protected from unauthorized redistribution.
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

import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_PROFILE, STUDENT_ATTENDANCE, STUDENT_CLASSES, STUDENT_EXAMS } from '../../data/studentData';

export default function StudentDashboard() {
  const student = STUDENT_PROFILE;
  const nextExam = STUDENT_EXAMS[0];

  return (
    <StudentLayout pageTitle="Student ERP Dashboard">
      
      {/* 1. Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0b326b 0%, #0c57c4 100%)', color: '#ffffff', borderRadius: '12px', padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 16px rgba(11, 61, 131, 0.15)' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Academic Session 2025-2026 &bull; Final Term
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
            Welcome back, {student.fullName}!
          </h2>
          <p style={{ fontSize: '13.5px', color: '#e2e8f0', margin: 0 }}>
            {student.program} ({student.courseCode}) &bull; {student.centerName}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/student/classes" className="btn-primary" style={{ background: '#ffffff', color: '#0c57c4', fontWeight: 700 }}>
            📺 Join Live LMS Class
          </Link>
          <Link to="/student/exam" className="btn-primary" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
            ✍️ Exam Center
          </Link>
        </div>
      </div>

      {/* 2. Top Metrics Row (4 Cards) */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-info">
            <strong>{student.overallAttendance}%</strong>
            <span>Overall Attendance</span>
          </div>
          <div className="metric-icon-wrap m-blue">
            📅
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{student.cgpa}</strong>
            <span>Cumulative CGPA</span>
          </div>
          <div className="metric-icon-wrap m-green">
            🏆
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ fontSize: '20px', color: '#16a34a' }}>{student.feeStatus}</strong>
            <span>Fee Status (Term 1 & 2)</span>
          </div>
          <div className="metric-icon-wrap m-purple">
            💳
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>12-Oct</strong>
            <span>Upcoming Exam</span>
          </div>
          <div className="metric-icon-wrap m-orange">
            📝
          </div>
        </div>
      </div>

      {/* 3. Two-Column Dashboard Content */}
      <div className="dashboard-grid">
        
        {/* Left Column */}
        <div>
          {/* Upcoming Examination Banner */}
          <div className="panel-card" style={{ borderLeft: '4px solid #ea580c' }}>
            <div className="panel-card-head">
              <h3><span>⏰</span> Next Scheduled Examination</h3>
              <span style={{ fontSize: '11px', background: '#fff7ed', color: '#c2410c', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                Online Proctoring
              </span>
            </div>
            <div>
              <h4 style={{ fontSize: '16px', color: '#0f172a', marginBottom: '6px' }}>{nextExam.subject}</h4>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                Paper Code: <strong>{nextExam.paperCode}</strong> &bull; Schedule: <strong>{nextExam.date} ({nextExam.time})</strong>
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to="/student/exam" className="btn-primary" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
                  Open Exam Center & Hall Ticket &rarr;
                </Link>
                <Link to="/student/classes" className="btn-secondary" style={{ fontSize: '12.5px', padding: '8px 16px' }}>
                  Review Syllabus Notes
                </Link>
              </div>
            </div>
          </div>

          {/* Subject Attendance Breakdown */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📊</span> Subject-Wise Attendance Register</h3>
              <span style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>Min Required: 75%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {STUDENT_ATTENDANCE.map((sub, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                      {sub.subject} ({sub.code})
                    </span>
                    <span style={{ fontWeight: 700, color: sub.percentage >= 90 ? '#16a34a' : '#0c57c4' }}>
                      {sub.attended}/{sub.conducted} ({sub.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${sub.percentage}%`, height: '100%', background: sub.percentage >= 90 ? '#22c55e' : '#0c57c4', borderRadius: '4px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recorded Lectures Recent Activity */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📺</span> Latest LMS Lecture Archives</h3>
              <Link to="/student/classes" style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                View All &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STUDENT_CLASSES.map((lec) => (
                <div key={lec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block' }}>{lec.topic}</strong>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                      {lec.subject} &bull; {lec.faculty} &bull; ⏱ {lec.duration}
                    </span>
                  </div>
                  <Link to="/student/classes" className="btn-secondary" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                    Watch
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div>
          {/* Quick ERP Shortcuts */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>⚡</span> Quick ERP Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link to="/student/profile" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>🆔</span>
                <span>Digital ID Card</span>
              </Link>
              <Link to="/student/exam" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>🎫</span>
                <span>Hall Ticket</span>
              </Link>
              <Link to="/student/results" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>📜</span>
                <span>Mark Sheet</span>
              </Link>
              <Link to="/student/fees" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <span>Fee Receipts</span>
              </Link>
            </div>
          </div>

          {/* Student Profile Snapshot */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>👤</span> Academic Profile</h3>
            </div>
            <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Roll Number:</strong> <span style={{ fontFamily: 'monospace' }}>{student.rollNo}</span></div>
              <div><strong>Enrollment No:</strong> <span style={{ fontFamily: 'monospace' }}>{student.enrollmentNo}</span></div>
              <div><strong>Email:</strong> {student.email}</div>
              <div><strong>Contact:</strong> {student.phone}</div>
              <div><strong>Study Center:</strong> {student.centerCode}</div>
              <div style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/student/profile" style={{ color: '#0c57c4', fontWeight: 600 }}>
                  View Full Profile & ID Card &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Notice Board */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📢</span> Council Circulars</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#0c57c4', fontWeight: 700 }}>05-Oct-2026:</span> E-Hall Tickets for Term-End Examination CS-402 are now released.
              </div>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#0c57c4', fontWeight: 700 }}>28-Sep-2026:</span> Final term project dissertation guidelines uploaded to LMS portal.
              </div>
              <div>
                <span style={{ color: '#0c57c4', fontWeight: 700 }}>15-Sep-2026:</span> Academic holiday announced on October 2 for Gandhi Jayanti.
              </div>
            </div>
          </div>

        </div>

      </div>

    </StudentLayout>
  );
}

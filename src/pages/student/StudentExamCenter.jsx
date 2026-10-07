import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_PROFILE, STUDENT_EXAMS } from '../../data/studentData';

export default function StudentExamCenter() {
  const student = STUDENT_PROFILE;
  const [showHallTicket, setShowHallTicket] = useState(false);

  return (
    <StudentLayout pageTitle="Online Examination Center & Hall Ticket">
      
      {/* 1. System Readiness Banner */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px 26px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
            PROCTORING SYSTEM COMPATIBLE
          </span>
          <h2 style={{ fontSize: '18px', color: '#0b326b', margin: '6px 0 2px', fontWeight: 800 }}>
            NCTMS Central Online Proctoring Engine
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Webcam, audio level, secure browser environment, and high-speed network connection verified.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => setShowHallTicket(true)}
          >
            🎫 View & Print E-Hall Ticket
          </button>
          <Link 
            to="/student/exam/take" 
            className="btn-primary"
            style={{ background: '#16a34a' }}
          >
            🚀 Launch Live Exam Test Room &rarr;
          </Link>
        </div>
      </div>

      {/* 2. Scheduled Examinations Table */}
      <div className="panel-card" style={{ marginBottom: '24px' }}>
        <div className="panel-card-head">
          <h3><span>📅</span> Scheduled Term-End Online Examinations</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Academic Session 2025-2026</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {STUDENT_EXAMS.map((exam) => (
            <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px 20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="course-code-tag">{exam.paperCode}</span>
                  <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    Max Marks: {exam.totalMarks}
                  </span>
                </div>
                <h4 style={{ fontSize: '16px', color: '#0b326b', margin: '0 0 4px', fontWeight: 700 }}>
                  {exam.subject}
                </h4>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Date: <strong>{exam.date}</strong> &bull; Slot: <strong>{exam.time}</strong> &bull; Hall Ticket: <strong>{exam.hallTicketNo}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowHallTicket(true)}
                >
                  Hall Ticket
                </button>
                {exam.canLaunch ? (
                  <Link 
                    to="/student/exam/take" 
                    className="btn-primary"
                  >
                    Start Test Now &rarr;
                  </Link>
                ) : (
                  <button type="button" className="btn-secondary" disabled style={{ opacity: 0.6 }}>
                    Opens on {exam.date}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Examination Guidelines */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="panel-card">
          <div className="panel-card-head">
            <h3><span>🛡️</span> Code of Conduct & Rules</h3>
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Students must be in a well-lit room with the web camera turned on continuously.</li>
            <li>Switching browser tabs or opening developer tools will log an automatic violation.</li>
            <li>System automatically saves your answers after every selection.</li>
            <li>Exam timer automatically submits the test room upon reaching zero.</li>
          </ul>
        </div>

        <div className="panel-card">
          <div className="panel-card-head">
            <h3><span>🛠️</span> Technical Support Desk</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', marginBottom: '12px' }}>
            Experiencing power failure or internet disconnection? Re-open the exam URL within 15 minutes to resume with all auto-saved answers intact.
          </p>
          <div style={{ fontSize: '12px', color: '#0b326b', background: '#eff6ff', padding: '10px 14px', borderRadius: '6px' }}>
            📞 <strong>Live Proctor Hotline:</strong> +91 44 2855 0192 (Ext: 4) &bull; Monitored 24/7 during exam windows.
          </div>
        </div>
      </div>

      {/* 4. Hall Ticket Modal */}
      {showHallTicket && (
        <div className="modal-backdrop" onClick={() => setShowHallTicket(false)}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
            <button className="modal-close-btn" onClick={() => setShowHallTicket(false)}>&times;</button>
            
            <div style={{ border: '2px solid #0b326b', borderRadius: '8px', padding: '24px', background: '#ffffff' }}>
              
              {/* Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0b326b', paddingBottom: '14px', marginBottom: '18px' }}>
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="56" height="56" style={{ margin: '0 auto 6px', display: 'block' }} />
                <h3 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800 }}>
                  NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES
                </h3>
                <p style={{ fontSize: '12px', color: '#334155', fontWeight: 700, textTransform: 'uppercase' }}>
                  TERM-END ONLINE PROCTORED EXAMINATION ADMIT CARD (HALL TICKET) &bull; OCTOBER 2026
                </p>
              </div>

              {/* Candidate Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '14px', fontSize: '12.5px', marginBottom: '18px', background: '#f8fafc', padding: '14px', borderRadius: '6px' }}>
                <div>
                  <p style={{ margin: '0 0 4px' }}>Candidate Name: <strong>{student.fullName}</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Roll Number: <strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{student.rollNo}</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Enrollment No: <strong style={{ fontFamily: 'monospace' }}>{student.enrollmentNo}</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Programme: <strong>{student.program}</strong></p>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px' }}>Hall Ticket No: <strong>HT-2026-NCTMS-8812</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Affiliated Center: <strong>{student.centerCode}</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Date of Birth: <strong>{student.dob}</strong></p>
                  <p style={{ margin: '0 0 4px' }}>Proctoring Room ID: <strong style={{ color: '#16a34a' }}>PR-CS402-LIVE</strong></p>
                </div>
              </div>

              {/* Papers Table */}
              <table className="cert-marks-table" style={{ marginBottom: '18px' }}>
                <thead>
                  <tr>
                    <th>Paper Code</th>
                    <th>Subject Description</th>
                    <th>Date of Exam</th>
                    <th>Time Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENT_EXAMS.map((ex, i) => (
                    <tr key={i}>
                      <td><strong>{ex.paperCode}</strong></td>
                      <td>{ex.subject}</td>
                      <td>{ex.date}</td>
                      <td>{ex.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px', borderTop: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  <span>Digital Security Token: 8fa7...92d1</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '130px', borderBottom: '1px solid #000', marginBottom: '4px' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Controller of Examinations</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => window.print()}>
                  🖨️ Print Admit Card
                </button>
                <Link to="/student/exam/take" className="btn-primary" onClick={() => setShowHallTicket(false)}>
                  Enter Live Exam Room &rarr;
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

    </StudentLayout>
  );
}

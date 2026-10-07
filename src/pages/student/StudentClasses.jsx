import React, { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_CLASSES } from '../../data/studentData';

export default function StudentClasses() {
  const [selectedLecture, setSelectedLecture] = useState(STUDENT_CLASSES[0]);
  const [markedAttendance, setMarkedAttendance] = useState(false);
  const [studentQuestion, setStudentQuestion] = useState('');
  const [questionsList, setQuestionsList] = useState([
    {
      student: 'Alexander James Thompson',
      question: 'In BCNF decomposition, can we always guarantee dependency preservation?',
      reply: 'No, BCNF guarantees lossless joins but not always dependency preservation. That is why 3NF is often preferred in practical enterprise systems.',
      faculty: 'Dr. V. Sharma'
    }
  ]);

  const handleMarkAttendance = () => {
    setMarkedAttendance(true);
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (studentQuestion.trim()) {
      setQuestionsList([
        {
          student: 'Alexander James Thompson',
          question: studentQuestion.trim(),
          reply: 'Pending review by instructor during next live doubt clearing session.',
          faculty: 'Academic Teaching Assistant'
        },
        ...questionsList
      ]);
      setStudentQuestion('');
    }
  };

  return (
    <StudentLayout pageTitle="Online Classroom & Digital LMS">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Active Video Player & Lesson Notes */}
        <div>
          {/* Video Player Box */}
          <div style={{ background: '#000000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', marginBottom: '18px' }}>
            <div style={{ position: 'relative', width: '100%', height: '360px', background: '#0f172a' }}>
              <img 
                src={selectedLecture.thumbnail} 
                alt={selectedLecture.topic} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0c57c4', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', cursor: 'pointer', boxShadow: '0 0 20px rgba(12,87,196,0.6)' }} onClick={() => alert(`Streaming lecture: ${selectedLecture.topic}`)}>
                  ▶
                </div>
                <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', marginTop: '10px' }}>
                  Click to Stream Lecture Video
                </span>
              </div>
              <span style={{ position: 'absolute', top: '14px', left: '14px', background: '#dc2626', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                ● {selectedLecture.status}
              </span>
              <span style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'rgba(0,0,0,0.7)', color: '#ffffff', fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
                ⏱ {selectedLecture.duration}
              </span>
            </div>
          </div>

          {/* Current Lesson Details Card */}
          <div className="panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', background: '#eff6ff', color: '#0c57c4', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                  {selectedLecture.code}
                </span>
                <h2 style={{ fontSize: '18px', color: '#0b326b', margin: '6px 0 2px', fontWeight: 800 }}>
                  {selectedLecture.topic}
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Faculty: <strong>{selectedLecture.faculty}</strong> &bull; Subject: <strong>{selectedLecture.subject}</strong>
                </p>
              </div>

              {/* Attendance Button */}
              <button 
                type="button" 
                className={markedAttendance ? 'btn-secondary' : 'btn-primary'}
                style={{ fontSize: '12.5px', padding: '8px 16px' }}
                onClick={handleMarkAttendance}
                disabled={markedAttendance}
              >
                {markedAttendance ? '✓ Attendance Logged' : '📌 Mark Class Attendance'}
              </button>
            </div>

            {/* Study Notes & Download */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '14px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#0f274a', display: 'block' }}>📄 Official Lecture E-Notes & Reference PPT</strong>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>File: {selectedLecture.notesFileName} (PDF &bull; 4.8 MB)</span>
              </div>
              <button 
                type="button" 
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => alert(`Downloading ${selectedLecture.notesFileName}`)}
              >
                📥 Download PDF Notes
              </button>
            </div>
          </div>

          {/* Q&A Doubt Clearance Section */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>💬</span> Student Q&A & Doubt Clearance</h3>
            </div>

            <form onSubmit={handlePostQuestion} style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
              <input 
                type="text" 
                placeholder="Ask faculty a conceptual doubt about this topic..." 
                value={studentQuestion}
                onChange={(e) => setStudentQuestion(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              />
              <button type="submit" className="btn-primary" style={{ fontSize: '12.5px' }}>
                Post Question
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questionsList.map((q, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', fontSize: '12.5px' }}>
                  <p style={{ fontWeight: 700, color: '#0b326b', marginBottom: '6px' }}>Q: {q.question}</p>
                  <p style={{ color: '#334155', margin: '0 0 6px', background: '#ffffff', padding: '8px 10px', borderRadius: '4px', borderLeft: '3px solid #0c57c4' }}>
                    <strong style={{ color: '#0c57c4' }}>{q.faculty}:</strong> {q.reply}
                  </p>
                  <small style={{ color: '#94a3b8' }}>Asked by {q.student}</small>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Playlist & Upcoming Schedule */}
        <div>
          {/* Lecture Playlist */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📚</span> Course Video Playlist</h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>{STUDENT_CLASSES.length} Lectures</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {STUDENT_CLASSES.map((lec) => (
                <div 
                  key={lec.id}
                  onClick={() => { setSelectedLecture(lec); setMarkedAttendance(false); }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedLecture.id === lec.id ? '#eff6ff' : '#ffffff',
                    border: selectedLecture.id === lec.id ? '2px solid #0c57c4' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', flexShrink: 0 }}>
                    ▶
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <strong style={{ fontSize: '12.5px', color: '#0f172a', display: 'block', lineHeight: '1.3', marginBottom: '3px' }}>
                      {lec.topic}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>
                      {lec.faculty} &bull; ⏱ {lec.duration}
                    </span>
                    <small style={{ fontSize: '10.5px', color: '#0c57c4', fontWeight: 600 }}>
                      {lec.status}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Downloadable Syllabus Packs */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📦</span> Semester E-Library</h3>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#334155' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                <span>📖 CS101: Data Structures Handbook</span>
                <button type="button" style={{ color: '#0c57c4', fontWeight: 700, background: 'none' }} onClick={() => alert('Downloaded CS101 Handbook')}>📥 PDF</button>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                <span>📖 CS102: Relational DBMS Laboratory Manual</span>
                <button type="button" style={{ color: '#0c57c4', fontWeight: 700, background: 'none' }} onClick={() => alert('Downloaded CS102 Manual')}>📥 PDF</button>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                <span>📖 CS103: Full-Stack React & Node Guide</span>
                <button type="button" style={{ color: '#0c57c4', fontWeight: 700, background: 'none' }} onClick={() => alert('Downloaded CS103 Guide')}>📥 PDF</button>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </StudentLayout>
  );
}

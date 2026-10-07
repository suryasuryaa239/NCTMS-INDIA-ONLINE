import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_EXAMS_MANAGEMENT, ADMIN_QUESTION_BANK, ADMIN_PROCTORING_LOGS } from '../../data/adminData';

export default function AdminExams() {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'qbank' | 'proctor'
  const [exams, setExams] = useState(ADMIN_EXAMS_MANAGEMENT);
  const [questions, setQuestions] = useState(ADMIN_QUESTION_BANK);
  const [procLogs, setProcLogs] = useState(ADMIN_PROCTORING_LOGS);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedPaperCode, setSelectedPaperCode] = useState('CS402-OCT26');
  const [toastMsg, setToastMsg] = useState('');

  // New exam form state
  const [newPaper, setNewPaper] = useState({
    paperCode: '',
    subject: '',
    course: 'Diploma in Computer Science',
    scheduledDate: '25-Oct-2026',
    time: '10:00 AM - 12:00 PM',
    passMarks: 40
  });

  // New question form state
  const [newQ, setNewQ] = useState({
    paperCode: 'CS402-OCT26',
    question: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    correct: '',
    difficulty: 'Intermediate'
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newPaper.paperCode || !newPaper.subject) {
      alert('Please fill Paper Code and Subject name.');
      return;
    }

    const created = {
      id: `exam-${Date.now()}`,
      paperCode: newPaper.paperCode.toUpperCase(),
      subject: newPaper.subject,
      course: newPaper.course,
      scheduledDate: newPaper.scheduledDate,
      time: newPaper.time,
      totalCandidates: 250,
      mode: 'Online AI Proctored',
      questionCount: 50,
      passMarks: newPaper.passMarks,
      status: 'Question Bank Ready'
    };

    setExams([created, ...exams]);
    setShowScheduleModal(false);
    setToastMsg(`Exam session ${created.paperCode} successfully scheduled!`);
    setNewPaper({
      paperCode: '',
      subject: '',
      course: 'Diploma in Computer Science',
      scheduledDate: '25-Oct-2026',
      time: '10:00 AM - 12:00 PM',
      passMarks: 40
    });
  };

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQ.question || !newQ.opt1 || !newQ.opt2 || !newQ.correct) {
      alert('Please fill question text, at least two options, and specify the correct option.');
      return;
    }

    const createdQ = {
      id: `q-${Date.now()}`,
      paperCode: newQ.paperCode,
      question: newQ.question,
      options: [newQ.opt1, newQ.opt2, newQ.opt3, newQ.opt4].filter(Boolean),
      correct: newQ.correct,
      difficulty: newQ.difficulty
    };

    setQuestions([...questions, createdQ]);
    setShowQuestionModal(false);
    setToastMsg(`New question added to repository for ${newQ.paperCode}!`);
    setNewQ({
      paperCode: 'CS402-OCT26',
      question: '',
      opt1: '',
      opt2: '',
      opt3: '',
      opt4: '',
      correct: '',
      difficulty: 'Intermediate'
    });
  };

  const handleDismissProcLog = (id) => {
    setProcLogs(procLogs.filter((l) => l.id !== id));
    setToastMsg('Proctoring warning flag acknowledged and resolved.');
  };

  return (
    <AdminLayout pageTitle="National Examination & Proctoring Control">
      
      {/* 1. Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
            Central Examination &amp; Evaluation Authority
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Configure national test schedules, curate question repositories, and monitor AI proctoring integrity streams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: activeTab === 'schedule' ? '#2563eb' : '#f1f5f9',
              color: activeTab === 'schedule' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1'
            }}
            onClick={() => setActiveTab('schedule')}
          >
            📅 Exam Schedule
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: activeTab === 'qbank' ? '#2563eb' : '#f1f5f9',
              color: activeTab === 'qbank' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1'
            }}
            onClick={() => setActiveTab('qbank')}
          >
            📚 Question Bank ({questions.length})
          </button>
          <button
            type="button"
            className="btn-primary"
            style={{
              background: activeTab === 'proctor' ? '#2563eb' : '#f1f5f9',
              color: activeTab === 'proctor' ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1'
            }}
            onClick={() => setActiveTab('proctor')}
          >
            👁️ AI Proctor Stream ({procLogs.length})
          </button>
        </div>
      </div>

      {toastMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span>✅ {toastMsg}</span>
          <button type="button" onClick={() => setToastMsg('')} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}>&times;</button>
        </div>
      )}

      {/* 2. TAB 1: EXAMINATION SCHEDULE */}
      {activeTab === 'schedule' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>Upcoming Council Examination Papers</h3>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowScheduleModal(true)}
            >
              ➕ Schedule Exam Paper
            </button>
          </div>

          <div className="portal-table-wrap">
            <div style={{ overflowX: 'auto' }}>
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Paper Code</th>
                    <th>Subject Title</th>
                    <th>Enrolled Course</th>
                    <th>Date &amp; Slot</th>
                    <th>Candidates</th>
                    <th>MCQs &amp; Pass %</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((ex) => (
                    <tr key={ex.id || ex.paperCode}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb' }}>
                          {ex.paperCode}
                        </span>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{ex.mode}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{ex.subject}</strong>
                      </td>
                      <td>{ex.course}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{ex.scheduledDate}</div>
                        <small style={{ color: '#64748b' }}>{ex.time || '10:00 AM - 12:00 PM'}</small>
                      </td>
                      <td>
                        <strong>{ex.totalCandidates}</strong> Candidates
                      </td>
                      <td>
                        <div>{ex.questionCount} Questions</div>
                        <small style={{ color: '#15803d', fontWeight: 700 }}>Pass: {ex.passMarks || 40}%</small>
                      </td>
                      <td>
                        <span className={ex.status.includes('Locked') ? 'badge-neutral' : 'badge-approved'}>
                          {ex.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ fontSize: '11px', padding: '4px 8px' }}
                          onClick={() => {
                            setSelectedPaperCode(ex.paperCode);
                            setActiveTab('qbank');
                          }}
                        >
                          View Q-Bank &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: QUESTION BANK REPOSITORY */}
      {activeTab === 'qbank' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Filter Paper:</label>
              <select
                className="admin-select"
                value={selectedPaperCode}
                onChange={(e) => setSelectedPaperCode(e.target.value)}
              >
                <option value="CS402-OCT26">CS402-OCT26 (DBMS)</option>
                <option value="CS403-OCT26">CS403-OCT26 (Web & Cloud)</option>
                <option value="MGT101-OCT26">MGT101-OCT26 (Management)</option>
              </select>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowQuestionModal(true)}
            >
              ➕ Add Question to Bank
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {questions
              .filter((q) => q.paperCode === selectedPaperCode)
              .map((q, idx) => (
                <div key={q.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                      Question #{idx + 1} &bull; {q.paperCode}
                    </span>
                    <span className="badge-info">{q.difficulty}</span>
                  </div>

                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 12px' }}>
                    {q.question}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          border: opt === q.correct ? '1px solid #86efac' : '1px solid #e2e8f0',
                          background: opt === q.correct ? '#f0fdf4' : '#f8fafc',
                          color: opt === q.correct ? '#166534' : '#334155',
                          fontWeight: opt === q.correct ? 700 : 500
                        }}
                      >
                        <span style={{ marginRight: '6px', fontWeight: 700 }}>{String.fromCharCode(65 + i)}.</span>
                        {opt} {opt === q.correct && '✓ (Key Answer)'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. TAB 3: AI PROCTORING AUDIT STREAM */}
      {activeTab === 'proctor' && (
        <div>
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>👁️</span> Real-Time Candidate Integrity &amp; Session Audit</h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Live Monitoring from Web AI Proctor Agent</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {procLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderLeft: `4px solid ${log.type === 'Warning' ? '#f59e0b' : log.type === 'Success' ? '#16a34a' : '#3b82f6'}`,
                    borderRadius: '8px',
                    padding: '14px 18px',
                    background: '#ffffff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>{log.studentName}</strong>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2563eb' }}>({log.rollNo})</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Paper: {log.paperCode}</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '12.5px', color: '#334155' }}>
                      {log.event}
                    </p>
                    <small style={{ color: '#94a3b8' }}>Timestamp: {log.timestamp}</small>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {log.type === 'Warning' ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ fontSize: '11px', padding: '5px 10px' }}
                        onClick={() => handleDismissProcLog(log.id)}
                      >
                        Resolve &amp; Clear Flag
                      </button>
                    ) : (
                      <span className="badge-approved">Clean</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Schedule Exam Modal */}
      {showScheduleModal && (
        <div className="admin-modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Schedule New Examination Session</h3>
              <button type="button" className="close-btn" onClick={() => setShowScheduleModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateExam}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Paper Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CS405-NOV26"
                      value={newPaper.paperCode}
                      onChange={(e) => setNewPaper({ ...newPaper, paperCode: e.target.value })}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Enrolled Course</label>
                    <select
                      value={newPaper.course}
                      onChange={(e) => setNewPaper({ ...newPaper, course: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Diploma in Computer Science">Diploma in Computer Science</option>
                      <option value="PG Diploma in Management">PG Diploma in Management</option>
                      <option value="Cert in Medical Lab Tech">Cert in Medical Lab Tech</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Subject Full Title</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-405 Mobile Application Development"
                    value={newPaper.subject}
                    onChange={(e) => setNewPaper({ ...newPaper, subject: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Date</label>
                    <input
                      type="text"
                      value={newPaper.scheduledDate}
                      onChange={(e) => setNewPaper({ ...newPaper, scheduledDate: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Time Slot</label>
                    <input
                      type="text"
                      value={newPaper.time}
                      onChange={(e) => setNewPaper({ ...newPaper, time: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Lock &amp; Schedule Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add MCQ Question Modal */}
      {showQuestionModal && (
        <div className="admin-modal-overlay" onClick={() => setShowQuestionModal(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Add MCQ Question to Repository</h3>
              <button type="button" className="close-btn" onClick={() => setShowQuestionModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateQuestion}>
              <div className="admin-modal-body">
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Paper Code</label>
                  <input
                    type="text"
                    value={newQ.paperCode}
                    onChange={(e) => setNewQ({ ...newQ, paperCode: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Question Text</label>
                  <textarea
                    rows={3}
                    placeholder="Type MCQ question stem..."
                    value={newQ.question}
                    onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600 }}>Option A</label>
                    <input
                      type="text"
                      value={newQ.opt1}
                      onChange={(e) => setNewQ({ ...newQ, opt1: e.target.value })}
                      required
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600 }}>Option B</label>
                    <input
                      type="text"
                      value={newQ.opt2}
                      onChange={(e) => setNewQ({ ...newQ, opt2: e.target.value })}
                      required
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600 }}>Option C</label>
                    <input
                      type="text"
                      value={newQ.opt3}
                      onChange={(e) => setNewQ({ ...newQ, opt3: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600 }}>Option D</label>
                    <input
                      type="text"
                      value={newQ.opt4}
                      onChange={(e) => setNewQ({ ...newQ, opt4: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Correct Answer (Exact Text)</label>
                  <input
                    type="text"
                    placeholder="Exact text matching the correct option"
                    value={newQ.correct}
                    onChange={(e) => setNewQ({ ...newQ, correct: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowQuestionModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

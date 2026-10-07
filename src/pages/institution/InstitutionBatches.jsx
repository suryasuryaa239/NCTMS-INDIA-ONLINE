import React, { useState } from 'react';
import InstitutionLayout from '../../layouts/InstitutionLayout';
import { INSTITUTION_BATCHES, INSTITUTION_STUDENTS_LIST } from '../../data/institutionData';

export default function InstitutionBatches() {
  const [batches, setBatches] = useState(INSTITUTION_BATCHES);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [activeAttendanceBatch, setActiveAttendanceBatch] = useState(null);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [todayDate] = useState(() => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));

  // New Batch Form
  const [newBatch, setNewBatch] = useState({
    code: '',
    title: '',
    course: 'PGDCS-201',
    facultyInCharge: '',
    classSchedule: '',
    classroom: ''
  });

  const handleCreateBatch = (e) => {
    e.preventDefault();
    const batchObj = {
      id: `batch-${Date.now()}`,
      code: newBatch.code,
      title: newBatch.title,
      course: newBatch.course,
      studentsCount: 0,
      facultyInCharge: newBatch.facultyInCharge,
      classSchedule: newBatch.classSchedule,
      classroom: newBatch.classroom,
      syllabusProgress: '0% (Newly Started)'
    };
    setBatches([...batches, batchObj]);
    setShowAddBatchModal(false);
    setNewBatch({ code: '', title: '', course: 'PGDCS-201', facultyInCharge: '', classSchedule: '', classroom: '' });
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => {
      setAttendanceSaved(false);
      setActiveAttendanceBatch(null);
    }, 1500);
  };

  return (
    <InstitutionLayout pageTitle="Academic Batches & Classroom Allocation">
      
      {/* 1. Action Header */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '17px', color: '#0b326b', margin: '0 0 2px', fontWeight: 800 }}>
            Center Batches Directory
          </h2>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
            Manage course timetables, faculty allocations, and laboratory schedules.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-primary"
          onClick={() => setShowAddBatchModal(true)}
        >
          + Create New Academic Batch
        </button>
      </div>

      {/* 2. Batches Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
        {batches.map((b) => (
          <div key={b.id} className="panel-card" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="course-code-tag">{b.code}</span>
              <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                {b.syllabusProgress}
              </span>
            </div>

            <h3 style={{ fontSize: '16px', color: '#0b326b', fontWeight: 700, marginBottom: '6px' }}>{b.title}</h3>
            
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '14px', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 4px' }}>👨‍🏫 Faculty: <strong>{b.facultyInCharge}</strong></p>
              <p style={{ margin: '0 0 4px' }}>⏱ Schedule: <strong>{b.classSchedule}</strong></p>
              <p style={{ margin: '0 0 4px' }}>🏛️ Classroom: <strong>{b.classroom}</strong></p>
              <p style={{ margin: '0' }}>👥 Total Intake: <strong style={{ color: '#0c57c4' }}>{b.studentsCount} Enrolled Students</strong></p>
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <button 
                type="button" 
                className="btn-primary" 
                style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
                onClick={() => setActiveAttendanceBatch(b)}
              >
                📋 Take Daily Attendance
              </button>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
                onClick={() => alert(`Exporting student attendance register for batch ${b.code}`)}
              >
                📊 Export Register
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Take Attendance Modal */}
      {activeAttendanceBatch && (
        <div className="modal-backdrop" onClick={() => setActiveAttendanceBatch(null)}>
          <div className="modal-box large-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
            <button className="modal-close-btn" onClick={() => setActiveAttendanceBatch(null)}>&times;</button>
            <div className="modal-header">
              <span className="course-code-tag">{activeAttendanceBatch.code}</span>
              <h3 style={{ marginTop: '6px' }}>Daily Attendance Register</h3>
              <p className="modal-desc">Date: {todayDate} &bull; {activeAttendanceBatch.title}</p>
            </div>

            <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '18px' }}>
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INSTITUTION_STUDENTS_LIST.map((s, idx) => (
                    <tr key={s.id}>
                      <td><span style={{ fontFamily: 'monospace' }}>{s.rollNo}</span></td>
                      <td><strong>{s.name}</strong></td>
                      <td>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#15803d', fontWeight: 600 }}>
                          <input type="checkbox" defaultChecked={idx !== 3} style={{ accentColor: '#16a34a' }} /> Present
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {attendanceSaved ? (
              <div style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700, padding: '10px', background: '#dcfce7', borderRadius: '6px' }}>
                ✓ Attendance Saved and Synced with Council Server!
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setActiveAttendanceBatch(null)}>Cancel</button>
                <button type="button" className="btn-primary" onClick={handleSaveAttendance}>
                  Save Attendance Records &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Create Batch Modal */}
      {showAddBatchModal && (
        <div className="modal-backdrop" onClick={() => setShowAddBatchModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddBatchModal(false)}>&times;</button>
            <div className="modal-header">
              <h3>Create New Academic Batch</h3>
              <p className="modal-desc">Setup a new batch schedule for Center NCTMS-TN-104</p>
            </div>

            <form onSubmit={handleCreateBatch} className="modal-form">
              <div className="form-group">
                <label>Batch Code *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. DCS-2026-TERM1"
                  value={newBatch.code}
                  onChange={(e) => setNewBatch({ ...newBatch, code: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Batch Description / Title *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Diploma in Computer Science (Morning Batch)"
                  value={newBatch.title}
                  onChange={(e) => setNewBatch({ ...newBatch, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Faculty In Charge *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Dr. V. Sharma, M.Tech, Ph.D."
                  value={newBatch.facultyInCharge}
                  onChange={(e) => setNewBatch({ ...newBatch, facultyInCharge: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Weekly Schedule *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Mon, Wed, Fri 10:00 AM - 01:00 PM"
                  value={newBatch.classSchedule}
                  onChange={(e) => setNewBatch({ ...newBatch, classSchedule: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Classroom / Lab *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Lab 3 (Advanced Systems)"
                  value={newBatch.classroom}
                  onChange={(e) => setNewBatch({ ...newBatch, classroom: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full-btn" style={{ marginTop: '10px' }}>
                Save & Initialize Batch &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

    </InstitutionLayout>
  );
}

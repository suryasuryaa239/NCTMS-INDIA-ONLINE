import React, { useState } from 'react';
import InstitutionLayout from '../../layouts/InstitutionLayout';
import { INSTITUTION_STUDENTS_LIST, INSTITUTION_BATCHES } from '../../data/institutionData';

export default function InstitutionStudents() {
  const [students, setStudents] = useState(INSTITUTION_STUDENTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // New Student Form
  const [newStudent, setNewStudent] = useState({
    name: '',
    course: 'PG Diploma in Computer Science',
    batch: 'PGDCS-2025-26',
    email: '',
    phone: ''
  });

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'All' || s.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    const nextRoll = `NCTMS2026CS${Math.floor(1100 + Math.random() * 8900)}`;
    const studentObj = {
      id: `stud-${Date.now()}`,
      rollNo: nextRoll,
      name: newStudent.name,
      course: newStudent.course,
      batch: newStudent.batch,
      enrollmentNo: `ENR-2026-TN-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      feeStatus: 'PAID',
      attendance: '100.0%',
      status: 'Active Student'
    };

    setStudents([studentObj, ...students]);
    setShowAddModal(false);
    setNewStudent({ name: '', course: 'PG Diploma in Computer Science', batch: 'PGDCS-2025-26', email: '', phone: '' });
  };

  return (
    <InstitutionLayout pageTitle="Student Intake & Enrolment Management">
      
      {/* 1. Header Action Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
          <input 
            type="text" 
            placeholder="Search by candidate name or roll number..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
          />
          <select 
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}
          >
            <option value="All">All Batches</option>
            {INSTITUTION_BATCHES.map((b) => (
              <option key={b.id} value={b.code}>{b.code}</option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          className="btn-primary"
          style={{ fontSize: '13px', padding: '10px 18px' }}
          onClick={() => setShowAddModal(true)}
        >
          + Enroll New Student
        </button>
      </div>

      {/* 2. Students Data Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <h3 style={{ fontSize: '15px', color: '#0b326b', margin: 0, fontWeight: 700 }}>
            Student Roster ({filteredStudents.length} Students)
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Center Code: NCTMS-TN-104</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Candidate Name</th>
                <th>Programme</th>
                <th>Batch</th>
                <th>Admission Date</th>
                <th>Attendance</th>
                <th>Fee Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td><strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{s.rollNo}</strong></td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.course}</td>
                  <td><span className="course-code-tag">{s.batch}</span></td>
                  <td>{s.admissionDate}</td>
                  <td><strong>{s.attendance}</strong></td>
                  <td>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: s.feeStatus.includes('PAID') ? '#15803d' : '#b45309'
                    }}>
                      {s.feeStatus}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      background: s.status === 'Active Student' ? '#dcfce7' : '#fef3c7',
                      color: s.status === 'Active Student' ? '#15803d' : '#92400e',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => setSelectedStudent(s)}
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Enroll New Student Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            <div className="modal-header">
              <h3>Direct Student Enrolment</h3>
              <p className="modal-desc">Register a new candidate under Center NCTMS-TN-104</p>
            </div>

            <form onSubmit={handleAddStudent} className="modal-form">
              <div className="form-group">
                <label>Candidate Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. R. Ananthakrishnan"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Academic Programme *</label>
                <select 
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                >
                  <option value="PG Diploma in Computer Science">PG Diploma in Computer Science (PGDCS-201)</option>
                  <option value="PG Diploma in Management (PGDM)">PG Diploma in Management (PGDM-201)</option>
                  <option value="Diploma in Computer Science & Engg">Diploma in Computer Science & Engg (DCS-101)</option>
                  <option value="Advance Diploma in AI & Data Science">Advance Diploma in AI & Data Science (ADAI-102)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Assigned Batch *</label>
                <select 
                  value={newStudent.batch}
                  onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                >
                  {INSTITUTION_BATCHES.map((b) => (
                    <option key={b.id} value={b.code}>{b.code} ({b.title})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Candidate Contact Phone *</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+91 98401 23456"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Candidate Email *</label>
                <input 
                  type="email" 
                  required 
                  placeholder="student@example.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full-btn" style={{ marginTop: '10px' }}>
                Complete Enrolment & Issue Roll No &rarr;
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Student Details Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>&times;</button>
            <div className="modal-header">
              <span className="course-code-tag">{selectedStudent.rollNo}</span>
              <h3 style={{ marginTop: '6px' }}>{selectedStudent.name}</h3>
              <p className="modal-desc">{selectedStudent.course}</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <div><strong>Enrollment Number:</strong> {selectedStudent.enrollmentNo}</div>
              <div><strong>Batch Code:</strong> {selectedStudent.batch}</div>
              <div><strong>Admission Date:</strong> {selectedStudent.admissionDate}</div>
              <div><strong>Attendance Percentage:</strong> <strong style={{ color: '#16a34a' }}>{selectedStudent.attendance}</strong></div>
              <div><strong>Fee Payment Status:</strong> <strong style={{ color: '#0c57c4' }}>{selectedStudent.feeStatus}</strong></div>
              <div><strong>Study Center:</strong> National Academy (NCTMS-TN-104)</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => alert(`Mark sheet record downloaded for ${selectedStudent.name}`)}>
                📜 View Marks
              </button>
              <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </InstitutionLayout>
  );
}

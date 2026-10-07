import React, { useState } from 'react';
import InstitutionLayout from '../../layouts/InstitutionLayout';
import { INSTITUTION_MARKS_DATA } from '../../data/institutionData';

export default function InstitutionMarksEntry() {
  const [marksData, setMarksData] = useState(INSTITUTION_MARKS_DATA);
  const [selectedSubject, setSelectedSubject] = useState('CS102 Database Management Systems');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleMarkChange = (index, field, value) => {
    const updated = [...marksData];
    const num = Math.max(0, parseInt(value) || 0);
    updated[index][field] = num;

    // Recalculate total
    updated[index].totalInternal = 
      (updated[index].attendanceMarks || 0) + 
      (updated[index].assignmentMarks || 0) + 
      (updated[index].practicalMarks || 0);

    setMarksData(updated);
  };

  const handleFinalSubmit = () => {
    const updated = marksData.map(m => ({ ...m, status: 'Submitted to Council' }));
    setMarksData(updated);
    setIsSubmitted(true);
  };

  return (
    <InstitutionLayout pageTitle="Internal Assessment & Practical Marks Entry">
      
      {/* 1. Header Filter & Action Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 22px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0b326b' }}>Select Examination Paper:</label>
          <select 
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', background: '#ffffff' }}
          >
            <option value="CS102 Database Management Systems">CS102: Relational Database Management Systems</option>
            <option value="CS101 Advanced Data Structures">CS101: Advanced Data Structures & Algorithms</option>
            <option value="CS103 Full-Stack Web Architectures">CS103: Full-Stack Web Architectures & React</option>
            <option value="CS104 Cloud Infrastructure">CS104: Cloud Infrastructure & DevOps Practices</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => alert('Marks sheet draft saved locally.')}
          >
            💾 Save Draft
          </button>
          <button 
            type="button" 
            className="btn-primary"
            style={{ background: '#16a34a' }}
            onClick={handleFinalSubmit}
          >
            🚀 Submit to Council Exam Board
          </button>
        </div>
      </div>

      {/* 2. Success Banner */}
      {isSubmitted && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: '8px', padding: '14px 18px', color: '#15803d', fontWeight: 700, fontSize: '13px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✓ Internal marks for {selectedSubject} have been digitally signed & uploaded to the NCTMS evaluation server.</span>
          <button type="button" style={{ background: 'none', color: '#15803d', textDecoration: 'underline', fontWeight: 700 }} onClick={() => setIsSubmitted(false)}>Dismiss</button>
        </div>
      )}

      {/* 3. Editable Marks Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <div>
            <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 2px', fontWeight: 700 }}>
              Assessment Evaluation Sheet — {selectedSubject}
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Attendance (Max 10) &bull; Continuous Assessment (Max 15) &bull; Practical Lab (Max 25) &bull; Total (Max 50)
            </span>
          </div>
          <span style={{ background: '#eff6ff', color: '#0c57c4', fontWeight: 700, fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
            Term 2 Assessment
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Candidate Name</th>
                <th>Attendance (10)</th>
                <th>Assignments (15)</th>
                <th>Practical Lab (25)</th>
                <th>Total Internal (50)</th>
                <th>Council Status</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((row, idx) => (
                <tr key={idx}>
                  <td><strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{row.rollNo}</strong></td>
                  <td><strong>{row.studentName}</strong></td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="10" 
                      value={row.attendanceMarks}
                      onChange={(e) => handleMarkChange(idx, 'attendanceMarks', e.target.value)}
                      style={{ width: '60px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="15" 
                      value={row.assignmentMarks}
                      onChange={(e) => handleMarkChange(idx, 'assignmentMarks', e.target.value)}
                      style={{ width: '60px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="0" 
                      max="25" 
                      value={row.practicalMarks}
                      onChange={(e) => handleMarkChange(idx, 'practicalMarks', e.target.value)}
                      style={{ width: '60px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                    />
                  </td>
                  <td>
                    <strong style={{ color: '#0c57c4', fontSize: '15px' }}>{row.totalInternal} / 50</strong>
                  </td>
                  <td>
                    <span style={{
                      background: row.status.includes('Submitted') ? '#dcfce7' : '#fef3c7',
                      color: row.status.includes('Submitted') ? '#15803d' : '#92400e',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </InstitutionLayout>
  );
}

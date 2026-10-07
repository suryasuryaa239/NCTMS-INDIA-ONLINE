import React from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_PROFILE } from '../../data/studentData';
import { CERTIFICATES_DATA } from '../../data/certificatesData';

export default function StudentResults() {
  const student = STUDENT_PROFILE;
  const certRecord = CERTIFICATES_DATA[student.rollNo];

  return (
    <StudentLayout pageTitle="Academic Results & Cumulative Marksheet">
      
      {/* 1. Performance Overview Ribbon */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '22px 26px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
            COUNCIL VERIFIED RECORD
          </span>
          <h2 style={{ fontSize: '18px', color: '#0b326b', margin: '6px 0 2px', fontWeight: 800 }}>
            Cumulative Grade Point Average: {student.cgpa} / 10.00
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Overall Division: <strong>First Class with Distinction</strong> &bull; Total Marks: <strong>{certRecord.totalObtained} / {certRecord.totalMax} ({certRecord.percentage})</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="btn-secondary" onClick={() => window.print()}>
            🖨️ Print Mark Memo
          </button>
          <button type="button" className="btn-primary" onClick={() => alert(`Downloading verified provisional certificate PDF for ${student.fullName}`)}>
            📜 Download Provisional Certificate PDF
          </button>
        </div>
      </div>

      {/* 2. Official Marks Statement Card */}
      <div className="panel-card">
        <div className="panel-card-head">
          <h3><span>📜</span> Semester-Wise Consolidated Mark Statement</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Certificate No: {certRecord.certificateNo}</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cert-marks-table" style={{ width: '100%', marginBottom: '16px' }}>
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Title</th>
                <th>Max Marks</th>
                <th>Min Pass</th>
                <th>Theory Marks</th>
                <th>Grade Awarded</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {certRecord.marks.map((m, idx) => (
                <tr key={idx}>
                  <td><strong>{m.code}</strong></td>
                  <td>{m.name}</td>
                  <td>{m.maxMarks}</td>
                  <td>{m.passMarks}</td>
                  <td><strong style={{ color: '#0c57c4' }}>{m.marksObtained}</strong></td>
                  <td><span style={{ fontWeight: 700, color: '#16a34a' }}>{m.grade}</span></td>
                  <td>4.0</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="2" style={{ textAlign: 'right' }}>GRAND TOTAL & PERCENTAGE:</td>
                <td>{certRecord.totalMax}</td>
                <td>--</td>
                <td>{certRecord.totalObtained}</td>
                <td>{certRecord.percentage}</td>
                <td>20.0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Grading Scale Footnote */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11.5px', color: '#475569', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span><strong>Grading Scheme:</strong> O: Outstanding (90-100) &bull; A+: Excellent (80-89) &bull; A: Very Good (70-79) &bull; B+: Good (60-69) &bull; B: Above Average (50-59)</span>
          <span style={{ color: '#15803d', fontWeight: 700 }}>✓ Minimum passing grade: B (50%)</span>
        </div>
      </div>

      {/* 3. Verification Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="panel-card">
          <div className="panel-card-head">
            <h3><span>🛡️</span> Digital Certificate Security Details</h3>
          </div>
          <div style={{ fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div><strong>Registration Roll Number:</strong> <span style={{ fontFamily: 'monospace' }}>{student.rollNo}</span></div>
            <div><strong>Enrollment Number:</strong> <span style={{ fontFamily: 'monospace' }}>{student.enrollmentNo}</span></div>
            <div><strong>Examination Session:</strong> {certRecord.examinationMonthYear}</div>
            <div><strong>Date of Publication:</strong> {certRecord.issueDate}</div>
            <div><strong>Digital Signature Hash:</strong> <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#0c57c4' }}>NCTMS-SHA256-8A7F9C2B341</span></div>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-head">
            <h3><span>ℹ️</span> Re-Evaluation & Transcript Request</h3>
          </div>
          <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', marginBottom: '14px' }}>
            Need an official academic transcript dispatched to an overseas university or employer? Apply for consolidated transcripts directly through our official downloads center.
          </p>
          <a href="/downloads" className="btn-secondary" style={{ display: 'inline-block', fontSize: '12px' }}>
            Apply for Official Migration & Transcripts &rarr;
          </a>
        </div>
      </div>

    </StudentLayout>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import InstitutionLayout from '../../layouts/InstitutionLayout';
import { INSTITUTION_CENTER_DETAILS, INSTITUTION_STUDENTS_LIST, INSTITUTION_BATCHES } from '../../data/institutionData';

export default function InstitutionDashboard() {
  const center = INSTITUTION_CENTER_DETAILS;
  const students = INSTITUTION_STUDENTS_LIST;
  const batches = INSTITUTION_BATCHES;

  return (
    <InstitutionLayout pageTitle="Affiliated Center Management Dashboard">
      
      {/* 1. Welcome & Center Profile Banner */}
      <div style={{ background: 'linear-gradient(135deg, #071c3b 0%, #0c4da2 100%)', color: '#ffffff', borderRadius: '12px', padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 16px rgba(7, 28, 59, 0.2)' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            NCTMS AUTHORIZED CENTER &bull; CODE: {center.centerCode}
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
            {center.name}
          </h2>
          <p style={{ fontSize: '13px', color: '#e2e8f0', margin: 0 }}>
            Center Head: <strong>{center.principal}</strong> &bull; Accreditation: <strong>{center.inspectionGrade}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/institution/students" className="btn-primary" style={{ background: '#ffffff', color: '#0c57c4', fontWeight: 700 }}>
            + Manage Students
          </Link>
          <Link to="/institution/marks-entry" className="btn-primary" style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
            ✍️ Internal Marks Entry
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-info">
            <strong>{center.currentEnrollment}</strong>
            <span>Active Enrolled Students</span>
          </div>
          <div className="metric-icon-wrap m-blue">
            👥
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{center.approvedIntake}</strong>
            <span>Council Approved Intake</span>
          </div>
          <div className="metric-icon-wrap m-green">
            🏛️
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{batches.length}</strong>
            <span>Running Academic Batches</span>
          </div>
          <div className="metric-icon-wrap m-purple">
            📅
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{center.facultyCount}</strong>
            <span>Approved Faculty Members</span>
          </div>
          <div className="metric-icon-wrap m-orange">
            👨‍🏫
          </div>
        </div>
      </div>

      {/* 3. Two Column Content */}
      <div className="dashboard-grid">
        
        {/* Left Column: Active Batches & Student Roster */}
        <div>
          
          {/* Active Batches Overview */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📅</span> Active Term Batches & Classroom Allocation</h3>
              <Link to="/institution/batches" style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                Manage All Batches &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {batches.map((b) => (
                <div key={b.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="course-code-tag">{b.code}</span>
                    <h4 style={{ fontSize: '14.5px', color: '#0b326b', margin: '4px 0 2px', fontWeight: 700 }}>
                      {b.title}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                      Faculty: <strong>{b.facultyInCharge}</strong> &bull; Schedule: <strong>{b.classSchedule}</strong>
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0c57c4', display: 'block' }}>
                      {b.studentsCount} Students
                    </span>
                    <small style={{ color: '#16a34a', fontWeight: 600, fontSize: '11px' }}>
                      {b.syllabusProgress}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Roster Snapshot */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>👥</span> Recent Student Enrollments</h3>
              <Link to="/institution/students" style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                View Full Roster ({students.length}) &rarr;
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Candidate Name</th>
                    <th>Course</th>
                    <th>Attendance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s) => (
                    <tr key={s.id}>
                      <td><strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{s.rollNo}</strong></td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.course}</td>
                      <td><strong>{s.attendance}</strong></td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Accreditation & Affiliation Snapshot */}
        <div>
          
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>🏛️</span> Center Affiliation Status</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div><strong>Affiliation Reg No:</strong> <span style={{ fontFamily: 'monospace' }}>{center.affiliationNo}</span></div>
              <div><strong>Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>● {center.affiliationStatus}</span></div>
              <div><strong>Validity Period:</strong> Valid through {center.validUpto}</div>
              <div><strong>Quality Audit Grade:</strong> <strong style={{ color: '#0c57c4' }}>{center.inspectionGrade}</strong></div>
              <div><strong>Total Laboratory Units:</strong> {center.labCount} Specialized Tech Labs</div>
              <div><strong>Computer Workstations:</strong> {center.computerSystems} High-Speed PCs</div>
              
              <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <Link to="/institution/profile" className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}>
                  📜 Download Affiliation Certificate
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Institutional Actions */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>⚡</span> Center Operations</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/institution/students" className="btn-secondary" style={{ textAlign: 'left', padding: '10px 14px', fontSize: '12.5px' }}>
                📝 Register New Student Intake
              </Link>
              <Link to="/institution/marks-entry" className="btn-secondary" style={{ textAlign: 'left', padding: '10px 14px', fontSize: '12.5px' }}>
                ✍️ Submit Practical & Internal Marks
              </Link>
              <Link to="/institution/batches" className="btn-secondary" style={{ textAlign: 'left', padding: '10px 14px', fontSize: '12.5px' }}>
                📅 Classroom Attendance Registers
              </Link>
              <a href="/downloads" className="btn-secondary" style={{ textAlign: 'left', padding: '10px 14px', fontSize: '12.5px' }}>
                📂 Download Council Inspection Proforma
              </a>
            </div>
          </div>

        </div>

      </div>

    </InstitutionLayout>
  );
}

import React from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_PROFILE } from '../../data/studentData';

export default function StudentProfile() {
  const s = STUDENT_PROFILE;

  return (
    <StudentLayout pageTitle="My Academic Profile & Digital ID Card">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Comprehensive Profile Information */}
        <div className="panel-card">
          <div className="panel-card-head">
            <h3><span>👤</span> Student Enrollment Record</h3>
            <span style={{ fontSize: '11.5px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '3px 10px', borderRadius: '4px' }}>
              Verified Candidate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Section 1: Personal Details */}
            <div>
              <h4 style={{ fontSize: '13.5px', color: '#0b326b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}>
                1. Personal Particulars
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><span style={{ color: '#64748b' }}>Full Name:</span> <strong>{s.fullName}</strong></div>
                <div><span style={{ color: '#64748b' }}>Date of Birth:</span> <strong>{s.dob}</strong></div>
                <div><span style={{ color: '#64748b' }}>Father's Name:</span> <strong>{s.fatherName}</strong></div>
                <div><span style={{ color: '#64748b' }}>Mother's Name:</span> <strong>{s.motherName}</strong></div>
                <div><span style={{ color: '#64748b' }}>Gender:</span> <strong>{s.gender}</strong></div>
                <div><span style={{ color: '#64748b' }}>Blood Group:</span> <strong>{s.bloodGroup}</strong></div>
              </div>
            </div>

            {/* Section 2: Contact Info */}
            <div>
              <h4 style={{ fontSize: '13.5px', color: '#0b326b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}>
                2. Contact & Communications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><span style={{ color: '#64748b' }}>Registered Email:</span> <strong>{s.email}</strong></div>
                <div><span style={{ color: '#64748b' }}>Mobile Phone:</span> <strong>{s.phone}</strong></div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: '#64748b' }}>Permanent Address:</span> <strong>{s.address}</strong>
                </div>
              </div>
            </div>

            {/* Section 3: Academic Details */}
            <div>
              <h4 style={{ fontSize: '13.5px', color: '#0b326b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '12px' }}>
                3. Academic & Center Enrollment
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><span style={{ color: '#64748b' }}>Roll Number:</span> <strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{s.rollNo}</strong></div>
                <div><span style={{ color: '#64748b' }}>Enrollment No:</span> <strong style={{ fontFamily: 'monospace' }}>{s.enrollmentNo}</strong></div>
                <div><span style={{ color: '#64748b' }}>Program:</span> <strong>{s.program}</strong></div>
                <div><span style={{ color: '#64748b' }}>Course Code:</span> <strong>{s.courseCode}</strong></div>
                <div><span style={{ color: '#64748b' }}>Study Center:</span> <strong>{s.centerName}</strong></div>
                <div><span style={{ color: '#64748b' }}>Center Code:</span> <strong>{s.centerCode}</strong></div>
                <div><span style={{ color: '#64748b' }}>Admission Date:</span> <strong>{s.admissionDate}</strong></div>
                <div><span style={{ color: '#64748b' }}>Current Term:</span> <strong>{s.currentSemester}</strong></div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Digital Student ID Card */}
        <div>
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>🆔</span> Official Digital Student ID Card</h3>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => window.print()}
              >
                🖨️ Print ID
              </button>
            </div>

            {/* Printable ID Card */}
            <div style={{
              background: 'linear-gradient(135deg, #072652 0%, #0b3d83 100%)',
              color: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 24px rgba(11, 61, 131, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #38bdf8'
            }}>
              {/* Council Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px', marginBottom: '16px' }}>
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="42" height="42" />
                <div>
                  <h4 style={{ fontSize: '13px', margin: 0, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                    NCTMS INDIA ONLINE
                  </h4>
                  <span style={{ fontSize: '9px', color: '#7dd3fc', fontWeight: 600, textTransform: 'uppercase' }}>
                    National Council for Technical and Management Studies
                  </span>
                </div>
              </div>

              {/* Photo & Core Meta */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '8px', background: '#ffffff', color: '#0c57c4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '38px', border: '2px solid #38bdf8', flexShrink: 0 }}>
                  👨‍🎓
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', margin: '0 0 2px' }}>{s.fullName}</h3>
                  <span style={{ fontSize: '11px', color: '#fcd34d', fontWeight: 700, display: 'block', margin: '0 0 4px' }}>
                    Roll: {s.rollNo}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#cbd5e1' }}>
                    {s.program}
                  </span>
                </div>
              </div>

              {/* ID Card Fields */}
              <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '6px', padding: '10px', fontSize: '11px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
                <div><span style={{ color: '#94a3b8' }}>Center:</span> <strong>{s.centerCode}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Valid Thru:</span> <strong>June 2027</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Blood Group:</span> <strong>{s.bloodGroup}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Contact:</span> <strong>{s.phone}</strong></div>
              </div>

              {/* Barcode & Signature */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                {/* Barcode representation */}
                <div style={{ letterSpacing: '3px', fontFamily: 'monospace', fontSize: '14px', color: '#ffffff' }}>
                  ||| | |||| | ||||| ||
                  <small style={{ display: 'block', fontSize: '8px', letterSpacing: '1px', color: '#94a3b8' }}>{s.enrollmentNo}</small>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', borderBottom: '1px solid #fff', marginBottom: '2px' }}></div>
                  <span style={{ fontSize: '8.5px', color: '#cbd5e1' }}>Registrar / Council</span>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
              💡 Present this digital identity token during practical lab examinations and study center sessions.
            </div>

          </div>
        </div>

      </div>

    </StudentLayout>
  );
}

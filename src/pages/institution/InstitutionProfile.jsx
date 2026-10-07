import React from 'react';
import InstitutionLayout from '../../layouts/InstitutionLayout';
import { INSTITUTION_CENTER_DETAILS } from '../../data/institutionData';

export default function InstitutionProfile() {
  const center = INSTITUTION_CENTER_DETAILS;

  return (
    <InstitutionLayout pageTitle="Center Accreditation & Institutional Profile">
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Official Printable Affiliation Certificate */}
        <div>
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📜</span> Certificate of Institutional Affiliation</h3>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ fontSize: '12px', padding: '6px 14px' }}
                onClick={() => window.print()}
              >
                🖨️ Print Certificate
              </button>
            </div>

            {/* Official Certificate Layout */}
            <div style={{
              background: '#ffffff',
              border: '6px double #0b326b',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
              textAlign: 'center',
              position: 'relative'
            }}>
              <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="68" height="68" style={{ margin: '0 auto 8px', display: 'block' }} />
              
              <h2 style={{ fontSize: '18px', color: '#0b326b', fontWeight: 800, margin: '0 0 2px', letterSpacing: '-0.2px' }}>
                NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES
              </h2>
              <p style={{ fontSize: '11px', color: '#475569', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                DIRECTORATE OF INSTITUTIONAL ACCREDITATION & VOCATIONAL STANDARDS
              </p>

              <div style={{ width: '80px', height: '2px', background: '#f59e0b', margin: '0 auto 16px' }}></div>

              <h3 style={{ fontSize: '20px', fontFamily: 'serif', color: '#0c57c4', fontWeight: 700, margin: '0 0 12px' }}>
                CERTIFICATE OF AFFILIATION
              </h3>

              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px' }}>
                This is to officially certify that
              </p>

              <h4 style={{ fontSize: '17px', color: '#0b326b', fontWeight: 800, margin: '0 0 6px' }}>
                {center.name}
              </h4>
              <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px' }}>
                Located at: {center.address}
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '12px', margin: '0 0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', textAlign: 'left' }}>
                <div><strong>Center Code:</strong> <span style={{ fontFamily: 'monospace', color: '#0c57c4' }}>{center.centerCode}</span></div>
                <div><strong>Affiliation Reg No:</strong> {center.affiliationNo}</div>
                <div><strong>Approved Intake:</strong> {center.approvedIntake} Students / Cycle</div>
                <div><strong>Audit Quality Rating:</strong> <strong style={{ color: '#16a34a' }}>{center.inspectionGrade}</strong></div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Validity:</strong> Valid Through {center.validUpto}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #cbd5e1' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '130px', borderBottom: '1px solid #000', marginBottom: '3px' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Director of Accreditation</span>
                </div>
                <div>
                  <span style={{ fontSize: '10.5px', color: '#16a34a', fontWeight: 700 }}>✓ DIGITALLY SEALED</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '130px', borderBottom: '1px solid #000', marginBottom: '3px' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: 600 }}>Council Chairman</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Infrastructure & Center Details */}
        <div>
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>🏛️</span> Infrastructure & Facilities</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div><strong>Center Head / Principal:</strong> {center.principal}</div>
              <div><strong>Category:</strong> {center.category}</div>
              <div><strong>Official Email:</strong> {center.email}</div>
              <div><strong>Contact Number:</strong> {center.phone}</div>
              <div><strong>Established Year:</strong> {center.establishedYear}</div>
              <div><strong>Approved Technical Labs:</strong> {center.labCount} Units</div>
              <div><strong>Workstations in Labs:</strong> {center.computerSystems} Terminals</div>
              <div><strong>Qualified Faculty Members:</strong> {center.facultyCount} Lecturers</div>
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>🎓</span> Approved Academic Programmes</h3>
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {center.coursesApproved.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </InstitutionLayout>
  );
}

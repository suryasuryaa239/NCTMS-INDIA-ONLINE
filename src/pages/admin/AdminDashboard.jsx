import React from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_STATS, ADMIN_ADMISSIONS_QUEUE, ADMIN_AFFILIATIONS_QUEUE, ADMIN_TRANSACTIONS } from '../../data/adminData';

export default function AdminDashboard() {
  const stats = ADMIN_STATS;
  const admissions = ADMIN_ADMISSIONS_QUEUE;
  const affiliations = ADMIN_AFFILIATIONS_QUEUE;
  const txns = ADMIN_TRANSACTIONS;

  return (
    <AdminLayout pageTitle="National Council Master Administration">
      
      {/* 1. Master Council Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #090e1a 0%, #1e293b 50%, #312e81 100%)', color: '#ffffff', borderRadius: '12px', padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)' }}>
        <div>
          <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            CENTRAL COUNCIL DIRECTORY &bull; NATIONAL HEADQUARTERS CHENNAI
          </span>
          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 6px', letterSpacing: '-0.3px' }}>
            Council Academic & Institutional Governance Suite
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
            Overseeing 184 Affiliated Centers across 12 States &bull; 14,820 Active Enrolled Diplomates
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/admissions" className="btn-primary" style={{ background: '#3b82f6', fontWeight: 700 }}>
            📋 Review Admissions ({stats.pendingAdmissions})
          </Link>
          <Link to="/admin/institutions" className="btn-primary" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
            🏫 Center Approvals ({stats.pendingAffiliations})
          </Link>
        </div>
      </div>

      {/* 2. Top Stats Grid (4 Metrics) */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-info">
            <strong>{stats.totalStudentsNational}</strong>
            <span>Total Enrolled Diplomates</span>
          </div>
          <div className="metric-icon-wrap m-blue">
            👥
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{stats.totalAffiliatedCenters}</strong>
            <span>Accredited Centers</span>
          </div>
          <div className="metric-icon-wrap m-purple">
            🏫
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ color: '#16a34a' }}>{stats.totalRevenueYear}</strong>
            <span>Fiscal Fee Collection</span>
          </div>
          <div className="metric-icon-wrap m-green">
            💳
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong>{stats.certificatesIssued}</strong>
            <span>Certificates Dispatched</span>
          </div>
          <div className="metric-icon-wrap m-orange">
            📜
          </div>
        </div>
      </div>

      {/* 3. Two Column Operations Grid */}
      <div className="dashboard-grid">
        
        {/* Left Column: Pending Admissions Review Queue */}
        <div>
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>📋</span> Pending Admission Verification Queue</h3>
              <Link to="/admin/admissions" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                Open Approval Desk &rarr;
              </Link>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="portal-data-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Candidate</th>
                    <th>Programme</th>
                    <th>Center</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admissions.slice(0, 3).map((app) => (
                    <tr key={app.id}>
                      <td><strong style={{ color: '#2563eb', fontFamily: 'monospace' }}>{app.appId}</strong></td>
                      <td><strong>{app.candidateName}</strong></td>
                      <td>{app.courseCode}</td>
                      <td>{app.centerCode}</td>
                      <td>
                        <span className={app.status.includes('Approved') ? 'badge-approved' : 'badge-pending'}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/admin/admissions" className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Affiliations Queue */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>🏫</span> Center Affiliation Requisitions</h3>
              <Link to="/admin/institutions" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                Manage Affiliations &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {affiliations.map((aff) => (
                <div key={aff.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 2px', fontWeight: 700 }}>{aff.instName}</h4>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                      Location: <strong>{aff.city}, {aff.state}</strong> &bull; Proposed Intake: <strong>{aff.proposedIntake} Seats</strong>
                    </p>
                    <small style={{ color: '#2563eb', fontWeight: 600 }}>Audit Status: {aff.inspectionStatus}</small>
                  </div>
                  <Link to="/admin/institutions" className="btn-primary" style={{ fontSize: '11.5px', padding: '6px 12px' }}>
                    Process Affiliation &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Financial Stream & Quick Control */}
        <div>
          {/* Central Governance Action Shortcuts */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>⚡</span> Governance Hub</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link to="/admin/courses" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>🎓</span>
                <span>Course Builder</span>
              </Link>
              <Link to="/admin/exams" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>✍️</span>
                <span>Exam Scheduler</span>
              </Link>
              <Link to="/admin/results" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>📜</span>
                <span>Publish Results</span>
              </Link>
              <Link to="/admin/payments" className="btn-secondary" style={{ padding: '12px 10px', textAlign: 'center', fontSize: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '20px' }}>💳</span>
                <span>Revenue Ledger</span>
              </Link>
            </div>
          </div>

          {/* Recent Fee Transactions */}
          <div className="panel-card">
            <div className="panel-card-head">
              <h3><span>💳</span> Real-Time Revenue Stream</h3>
              <Link to="/admin/payments" style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                Full Ledger &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {txns.map((t) => (
                <div key={t.txnId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{t.payer}</strong>
                    <span style={{ color: '#64748b' }}>{t.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: '#16a34a', display: 'block' }}>{t.amount}</strong>
                    <small style={{ color: '#64748b' }}>{t.mode}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

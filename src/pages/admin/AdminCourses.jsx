import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { ADMIN_COURSES_MANAGEMENT } from '../../data/adminData';

export default function AdminCourses() {
  const [courses, setCourses] = useState(ADMIN_COURSES_MANAGEMENT);
  const [selectedStream, setSelectedStream] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEditCourse, setSelectedEditCourse] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Form state for adding new course
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newStream, setNewStream] = useState('Computer Science & IT');
  const [newDuration, setNewDuration] = useState('1 Year (2 Sem)');
  const [newCredits, setNewCredits] = useState('40');
  const [newFee, setNewFee] = useState('₹ 15,000');
  const [newEligibility, setNewEligibility] = useState('10+2 / Higher Secondary Pass');

  const streams = [
    'All',
    'Computer Science & IT',
    'Management & Business',
    'Healthcare & Paramedical',
    'Vocational Technical (ITI)'
  ];

  const filteredCourses = courses.filter((c) => {
    const matchStream = selectedStream === 'All' || c.stream === selectedStream;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStream && matchSearch;
  });

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCode || !newTitle) {
      alert('Please fill in Course Code and Title.');
      return;
    }

    const newCourseObj = {
      id: `c-${Date.now()}`,
      code: newCode.toUpperCase(),
      title: newTitle,
      stream: newStream,
      duration: newDuration,
      credits: parseInt(newCredits, 10) || 40,
      annualFee: newFee,
      centersOffering: 12,
      activeStudents: 0,
      status: 'Active',
      eligibility: newEligibility,
      syllabusUnits: 10
    };

    setCourses([newCourseObj, ...courses]);
    setShowAddModal(false);
    setToastMsg(`Course ${newCode.toUpperCase()} successfully added to the National Catalog!`);
    setNewCode('');
    setNewTitle('');
  };

  const toggleStatus = (id) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'Active' ? 'Under Revision' : 'Active' }
          : c
      )
    );
  };

  const handleUpdateCourse = (e) => {
    e.preventDefault();
    setCourses((prev) =>
      prev.map((c) => (c.id === selectedEditCourse.id ? selectedEditCourse : c))
    );
    setSelectedEditCourse(null);
    setToastMsg(`Curriculum updated for ${selectedEditCourse.code}!`);
  };

  return (
    <AdminLayout pageTitle="National Course Catalog & Curriculum Manager">
      
      {/* 1. Header Banner */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px 24px', marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', fontFamily: 'var(--font-heading)' }}>
            Curriculum & Academic Standards Directory
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Configure accredited diploma programs, syllabus frameworks, credits, and annual fee benchmarks.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          ➕ Introduce New Course
        </button>
      </div>

      {toastMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 600 }}>
          <span>✅ {toastMsg}</span>
          <button type="button" onClick={() => setToastMsg('')} style={{ background: 'transparent', border: 'none', color: '#166534', cursor: 'pointer', fontWeight: 800 }}>&times;</button>
        </div>
      )}

      {/* 2. Stream Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '18px', paddingBottom: '4px' }}>
        {streams.map((stream) => (
          <button
            key={stream}
            type="button"
            onClick={() => setSelectedStream(stream)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedStream === stream ? 'none' : '1px solid #cbd5e1',
              background: selectedStream === stream ? '#2563eb' : '#ffffff',
              color: selectedStream === stream ? '#ffffff' : '#475569',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {stream}
          </button>
        ))}
      </div>

      {/* 3. Filter & Search */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Search course title, syllabus code, or eligibility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
          Showing <strong>{filteredCourses.length}</strong> Courses
        </div>
      </div>

      {/* 4. Courses Table */}
      <div className="portal-table-wrap">
        <div className="portal-table-header">
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>
            Accredited Courses Registry
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Council Approved Curricula (2026-2027)</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Title</th>
                <th>Academic Stream</th>
                <th>Duration & Credits</th>
                <th>Prescribed Fee</th>
                <th>Offering Centers</th>
                <th>Active Diplomates</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#2563eb', fontSize: '13px' }}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a', display: 'block' }}>{c.title}</strong>
                    <small style={{ color: '#64748b' }}>Eligibility: {c.eligibility}</small>
                  </td>
                  <td>
                    <span className="badge-info">{c.stream}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.duration}</div>
                    <small style={{ color: '#64748b' }}>{c.credits} Credits &bull; {c.syllabusUnits} Units</small>
                  </td>
                  <td>
                    <strong style={{ color: '#0f172a' }}>{c.annualFee}</strong>
                  </td>
                  <td>{c.centersOffering} Centers</td>
                  <td>
                    <strong>{c.activeStudents.toLocaleString()}</strong>
                  </td>
                  <td>
                    <span
                      onClick={() => toggleStatus(c.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      {c.status === 'Active' ? (
                        <span className="badge-approved">Active</span>
                      ) : (
                        <span className="badge-danger">Under Revision</span>
                      )}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '11.5px', padding: '5px 10px' }}
                      onClick={() => setSelectedEditCourse({ ...c })}
                    >
                      ✏️ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Introduce New Course Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Introduce New Course to National Catalog</h3>
              <button type="button" className="close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleCreateCourse}>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Course Code</label>
                    <input
                      type="text"
                      placeholder="e.g. ADAI-103"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Academic Stream</label>
                    <select
                      value={newStream}
                      onChange={(e) => setNewStream(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="Computer Science & IT">Computer Science & IT</option>
                      <option value="Management & Business">Management & Business</option>
                      <option value="Healthcare & Paramedical">Healthcare & Paramedical</option>
                      <option value="Vocational Technical (ITI)">Vocational Technical (ITI)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Full Course Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Advance Diploma in Cloud Computing & DevOps"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Duration</label>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Credits</label>
                    <input
                      type="number"
                      value={newCredits}
                      onChange={(e) => setNewCredits(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Annual Fee</label>
                    <input
                      type="text"
                      value={newFee}
                      onChange={(e) => setNewFee(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Eligibility Criteria</label>
                  <input
                    type="text"
                    value={newEligibility}
                    onChange={(e) => setNewEligibility(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Course Modal */}
      {selectedEditCourse && (
        <div className="admin-modal-overlay" onClick={() => setSelectedEditCourse(null)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>Edit Curriculum &bull; {selectedEditCourse.code}</h3>
              <button type="button" className="close-btn" onClick={() => setSelectedEditCourse(null)}>&times;</button>
            </div>

            <form onSubmit={handleUpdateCourse}>
              <div className="admin-modal-body">
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Course Title</label>
                  <input
                    type="text"
                    value={selectedEditCourse.title}
                    onChange={(e) => setSelectedEditCourse({ ...selectedEditCourse, title: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Annual Fee</label>
                    <input
                      type="text"
                      value={selectedEditCourse.annualFee}
                      onChange={(e) => setSelectedEditCourse({ ...selectedEditCourse, annualFee: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Credits</label>
                    <input
                      type="number"
                      value={selectedEditCourse.credits}
                      onChange={(e) => setSelectedEditCourse({ ...selectedEditCourse, credits: Number(e.target.value) })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Eligibility Criteria</label>
                  <input
                    type="text"
                    value={selectedEditCourse.eligibility}
                    onChange={(e) => setSelectedEditCourse({ ...selectedEditCourse, eligibility: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div className="admin-modal-foot">
                <button type="button" className="btn-secondary" onClick={() => setSelectedEditCourse(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

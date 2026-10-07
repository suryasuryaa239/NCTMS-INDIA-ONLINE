import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { COURSES_DATA } from '../data/coursesData';

export default function CourseDetailsPage() {
  const { courseId } = useParams();

  // Find the course by ID from real COURSES_DATA
  const course = COURSES_DATA.find((c) => c.id === courseId);

  // Curriculum accordion state: set first semester open by default
  const [openSemIndex, setOpenSemIndex] = useState(0);

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Brochure action toast
  const [brochureMsg, setBrochureMsg] = useState('');

  const toggleSem = (idx) => {
    setOpenSemIndex((prev) => (prev === idx ? -1 : idx));
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? -1 : idx));
  };

  // Helper for relevant thumbnail image
  const getCourseImage = (c) => {
    if (!c) return '/assets/images/portal.jpg';
    if (c.category.includes('Computer') || c.code.includes('AI')) {
      return '/assets/images/portal.jpg';
    }
    if (c.category.includes('Management')) {
      return '/assets/images/hero-students.jpg';
    }
    if (c.category.includes('Healthcare')) {
      return '/assets/images/certificate.jpg';
    }
    return '/assets/images/institutions.jpg';
  };

  // 13. INVALID COURSE STATE
  if (!course) {
    return (
      <PublicLayout>
        <section className="subpage-hero">
          <div className="container subpage-hero-container">
            <div>
              <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
                <Link to="/">Home</Link> &rsaquo; <Link to="/courses">Courses</Link> &rsaquo; <span>Not Found</span>
              </nav>
              <h1>Course Not Found</h1>
              <p className="subpage-hero-subtitle">
                The requested course catalog entry could not be located in the national registry.
              </p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="container">
            <div className="cd-not-found" role="alert">
              <span className="cd-not-found-icon">🔍</span>
              <h2>Course Not Found</h2>
              <p>Sorry, the course you are looking for is unavailable.</p>
              <Link to="/courses" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>
                &larr; Back to Courses
              </Link>
            </div>
          </div>
        </section>
      </PublicLayout>
    );
  }

  // Related courses (same category or general, excluding current course)
  const relatedCourses = COURSES_DATA
    .filter((c) => c.id !== course.id)
    .slice(0, 3);

  // Workflow steps for Learning Experience
  const workflowSteps = [
    { icon: '📝', text: 'Enroll' },
    { icon: '📚', text: 'Access Learning Materials' },
    { icon: '🎥', text: 'Attend Classes' },
    { icon: '📋', text: 'Complete Assignments' },
    { icon: '✍️', text: 'Attend Examination' },
    { icon: '📊', text: 'Receive Results' },
    { icon: '📜', text: 'Receive Certificate' }
  ];

  // Course-specific FAQs
  const courseFaqs = [
    {
      question: 'What is the duration of this course?',
      answer: `The duration of ${course.title} (${course.code}) is ${course.duration}, structured into progressive learning modules with practical assignments.`
    },
    {
      question: 'What are the eligibility requirements?',
      answer: `Eligibility for enrollment is ${course.eligibility}. Prospective candidates must furnish scanned copies of prior qualification certificates during online admission.`
    },
    {
      question: 'How are classes conducted?',
      answer: `Classes are conducted via ${course.mode}. Students receive full access to self-paced online lecture recordings, digital study notes, and faculty-led interactive webinars.`
    },
    {
      question: 'How are examinations conducted?',
      answer: 'Term examinations are administered through our AI-proctored online testing portal. Evaluations encompass objective multiple-choice questionnaires, practical projects, and continuous internal assessments.'
    },
    {
      question: 'How can I apply?',
      answer: `You can click the "Apply Now" button to proceed directly to the Online Admission Wizard for ${course.code}, complete your registration details, and submit your enrollment credentials.`
    },
    {
      question: 'When will I receive my certificate?',
      answer: 'Upon successful evaluation and marks moderation, digital certificates are issued with cryptographic QR validation and dispatched to your registered address / center within 30 days.'
    }
  ];

  const handleDownloadBrochure = () => {
    setBrochureMsg(`Prospectus and curriculum breakdown initiated for ${course.code}`);
    setTimeout(() => setBrochureMsg(''), 3500);
  };

  return (
    <PublicLayout>
      {/* 1. BREADCRUMB & 2. COURSE HERO */}
      <section className="cd-hero">
        <div className="container">
          <nav className="subpage-breadcrumbs" aria-label="Breadcrumb" style={{ marginBottom: '18px' }}>
            <Link to="/">Home</Link> &rsaquo; <Link to="/courses">Courses</Link> &rsaquo; <span>{course.title}</span>
          </nav>

          <div className="cd-hero-grid">
            {/* Left Column: Details & CTAs */}
            <div>
              <div className="cd-hero-badges">
                <span className="cd-code-pill">{course.code}</span>
                <span className="cd-level-pill">{course.level}</span>
                <span style={{ fontSize: '12px', color: '#bfdbfe', fontWeight: 600 }}>{course.category}</span>
              </div>

              <h1>{course.title}</h1>
              <p className="cd-hero-desc">{course.description}</p>

              <div className="cd-hero-meta-row">
                <div className="cd-hero-meta-item">
                  <span>⏱️</span>
                  <span>Duration: <strong>{course.duration}</strong></span>
                </div>
                <div className="cd-hero-meta-item">
                  <span>💻</span>
                  <span>Mode: <strong>{course.mode}</strong></span>
                </div>
                <div className="cd-hero-meta-item">
                  <span>🎓</span>
                  <span>Eligibility: <strong>{course.eligibility}</strong></span>
                </div>
              </div>

              <div className="cd-hero-actions">
                <Link
                  to={`/admission?course=${course.id}`}
                  className="btn-primary"
                  style={{ background: '#f59e0b', color: '#0f172a', padding: '13px 28px', fontSize: '14.5px', borderRadius: '8px', fontWeight: 800 }}
                  aria-label={`Apply now for ${course.title}`}
                >
                  Apply Now &rarr;
                </Link>

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', padding: '13px 22px', fontSize: '14px', borderRadius: '8px' }}
                  onClick={handleDownloadBrochure}
                  aria-label="Download syllabus brochure"
                >
                  📥 Download Brochure
                </button>
              </div>

              {brochureMsg && (
                <div style={{ marginTop: '12px', fontSize: '12.5px', color: '#fde68a', fontWeight: 600 }}>
                  ✓ {brochureMsg}
                </div>
              )}
            </div>

            {/* Right Column: Hero Visual Card */}
            <div>
              <div className="cd-hero-visual-card">
                <img
                  src={getCourseImage(course)}
                  alt={`${course.title} visual overview`}
                  className="cd-hero-thumb"
                />
                <div className="cd-hero-visual-body">
                  <div className="cd-hero-visual-fee">
                    <span>Prescribed Course Fee:</span>
                    <strong>{course.fees}</strong>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#16a34a' }}>✓</span>
                      <span>Council Recognized Diploma Credential</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#16a34a' }}>✓</span>
                      <span>Online Learning + Digital Exam Support</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#16a34a' }}>✓</span>
                      <span>Public QR Certificate Verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="content-section">
        <div className="container">
          <div className="cd-layout">
            
            {/* Left Main Column */}
            <div className="cd-content-area">
              
              {/* 3. COURSE OVERVIEW */}
              <article className="cd-section-card">
                <h2><span>📖</span> Course Overview</h2>
                <p>{course.description}</p>

                {course.highlights && course.highlights.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '15px', color: '#0b326b', marginBottom: '12px', fontWeight: 700 }}>
                      Key Academic Highlights:
                    </h3>
                    <ul className="cd-highlights-list">
                      {course.highlights.map((item, idx) => (
                        <li key={idx}>
                          <span className="cd-check-badge">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>

              {/* 5. ELIGIBILITY */}
              <article className="cd-section-card">
                <h2><span>🎯</span> Eligibility Criteria</h2>
                <div className="cd-eligibility-box">
                  <strong>Prescribed Academic Qualification:</strong>
                  <p>{course.eligibility}</p>
                </div>
                <div style={{ marginTop: '16px', fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                  Candidates must submit self-attested copies of their qualifying marks memo, transfer certificate (TC), and government-approved photo identity proof during the admission verification process.
                </div>
              </article>

              {/* 6. COURSE CURRICULUM */}
              <article className="cd-section-card">
                <h2><span>📚</span> Course Curriculum</h2>
                <p>
                  Structured academic framework divided into progressive terms. Click any semester to view module subjects:
                </p>

                <div className="cd-curriculum-accordion" role="tablist">
                  {course.semesters && course.semesters.map((sem, sIdx) => {
                    const isOpen = openSemIndex === sIdx;
                    return (
                      <div key={sIdx} className={`cd-curriculum-item ${isOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="cd-curriculum-header"
                          onClick={() => toggleSem(sIdx)}
                          aria-expanded={isOpen}
                        >
                          <span>📑 {sem.sem} ({sem.subjects.length} Subjects)</span>
                          <span style={{ fontSize: '16px', color: '#0c57c4', fontWeight: 800 }}>
                            {isOpen ? '−' : '+'}
                          </span>
                        </button>

                        {isOpen && (
                          <div className="cd-curriculum-body">
                            <ul className="cd-subjects-list">
                              {sem.subjects.map((sub, subIdx) => (
                                <li key={subIdx}>
                                  <span style={{ color: '#0c57c4', fontWeight: 700, fontSize: '12px' }}>
                                    Module {subIdx + 1}:
                                  </span>
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>

              {/* 7. LEARNING EXPERIENCE */}
              <article className="cd-section-card">
                <h2><span>🚀</span> Learning Experience &amp; Academic Workflow</h2>
                <p>
                  Our modern education methodology guides you from initial admission to career-ready certification:
                </p>

                <div className="cd-workflow-pipeline">
                  {workflowSteps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="cd-workflow-step">
                        <span className="cd-wf-icon">{step.icon}</span>
                        <span className="cd-wf-text">{step.text}</span>
                      </div>
                      {idx < workflowSteps.length - 1 && (
                        <span className="cd-wf-arrow">&rarr;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </article>

              {/* 8. EXAMINATION & CERTIFICATION */}
              <article className="cd-section-card">
                <h2><span>🛡️</span> Examination &amp; Certification</h2>
                
                <div className="cd-exam-grid">
                  <div className="cd-exam-card">
                    <h3><span>✍️</span> Online Examination</h3>
                    <p>
                      Evaluations are conducted through scheduled AI-proctored online examination rooms with webcam verification, anti-cheat screen monitoring, and automated timed submissions.
                    </p>
                  </div>

                  <div className="cd-exam-card">
                    <h3><span>📜</span> Verified Certification</h3>
                    <p>
                      Successful candidates receive digitally signed certificates containing cryptographic verification codes and a QR code instantly verifiable via our public portal.
                    </p>
                  </div>
                </div>
              </article>

              {/* 9. CAREER / OUTCOME SECTION */}
              {course.careerOpportunities && course.careerOpportunities.length > 0 && (
                <article className="cd-section-card">
                  <h2><span>💼</span> Career Opportunities</h2>
                  <p>
                    Graduates of {course.title} are qualified for diverse technical, managerial, and operational positions across industries:
                  </p>

                  <div className="cd-career-tags">
                    {course.careerOpportunities.map((career, cIdx) => (
                      <span key={cIdx} className="cd-career-tag">
                        <span>🎯</span> {career}
                      </span>
                    ))}
                  </div>
                </article>
              )}

              {/* 10. COURSE FAQ */}
              <article className="cd-section-card">
                <h2><span>❓</span> Course Frequently Asked Questions</h2>

                <div className="faq-accordion" style={{ marginTop: '16px' }}>
                  {courseFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="faq-question-btn"
                          onClick={() => toggleFaq(idx)}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </article>

            </div>

            {/* Right Sidebar: 4. COURSE INFORMATION PANEL */}
            <aside>
              <div className="cd-sidebar-info">
                <h3>Course Information</h3>

                <div className="cd-info-list">
                  <div className="cd-info-row">
                    <span className="cd-info-label">Program Code:</span>
                    <span className="cd-info-val" style={{ fontFamily: 'monospace', color: '#0c57c4' }}>{course.code}</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Duration:</span>
                    <span className="cd-info-val">{course.duration}</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Eligibility:</span>
                    <span className="cd-info-val">{course.eligibility}</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Learning Mode:</span>
                    <span className="cd-info-val">{course.mode}</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Course Type:</span>
                    <span className="cd-info-val">{course.level}</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Examination:</span>
                    <span className="cd-info-val">Online AI Proctored</span>
                  </div>

                  <div className="cd-info-row">
                    <span className="cd-info-label">Certification:</span>
                    <span className="cd-info-val">Council Recognized</span>
                  </div>

                  {course.fees && (
                    <div className="cd-info-row" style={{ paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span className="cd-info-label">Prescribed Fee:</span>
                      <span className="cd-info-val" style={{ color: '#16a34a', fontSize: '15px' }}>{course.fees}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/admission?course=${course.id}`}
                  className="btn-primary"
                  style={{ width: '100%', textAlign: 'center', padding: '12px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}
                  aria-label={`Enroll now in ${course.title}`}
                >
                  Apply Online Now &rarr;
                </Link>

                <div style={{ marginTop: '14px', textAlign: 'center' }}>
                  <Link to="/contact" style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                    Have questions? Talk to Academic Helpdesk &rarr;
                  </Link>
                </div>
              </div>
            </aside>

          </div>

          {/* 11. RELATED COURSES */}
          <div style={{ marginTop: '64px' }}>
            <div className="about-section-header">
              <span className="section-tag">Explore More</span>
              <h2>Related Courses &amp; Programs</h2>
              <p>Discover other recognized qualifications available under the NCTMS educational framework.</p>
            </div>

            <div className="cd-related-grid">
              {relatedCourses.map((rel) => (
                <div key={rel.id} className="cd-related-card">
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, color: '#0c57c4', marginBottom: '4px' }}>
                    {rel.code} &bull; {rel.level}
                  </span>
                  <h4>{rel.title}</h4>
                  <p>{rel.description.slice(0, 110)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <small style={{ color: '#64748b', fontWeight: 600 }}>⏱️ {rel.duration}</small>
                    <Link to={`/courses/${rel.id}`} className="btn-secondary" style={{ fontSize: '11.5px', padding: '5px 12px' }}>
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12. FINAL CTA */}
          <div className="courses-bottom-cta">
            <h2>Ready to Start Your Learning Journey?</h2>
            <p>
              Take the next step in your professional development with NCTMS certified qualifications.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to={`/admission?course=${course.id}`}
                className="btn-primary"
                style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 28px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}
              >
                Apply Now &rarr;
              </Link>
              <Link
                to="/courses"
                className="btn-primary"
                style={{ background: '#ffffff', color: '#0c57c4', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}
              >
                Explore Other Courses
              </Link>
            </div>
          </div>

        </div>
      </section>
    </PublicLayout>
  );
}

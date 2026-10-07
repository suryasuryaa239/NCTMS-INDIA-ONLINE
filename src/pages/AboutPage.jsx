import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';

export default function AboutPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const keyPoints = [
    'Digital Education',
    'Online Learning',
    'Online Examination',
    'Student Services',
    'Institutional Support',
    'Verified Certificates'
  ];

  const missionPoints = [
    'Provide accessible digital education.',
    'Support flexible online learning.',
    'Deliver secure online examinations.',
    'Provide transparent student services.',
    'Enable institutions to manage academic activities digitally.',
    'Provide reliable certificate and result verification.'
  ];

  const whyFeatures = [
    {
      icon: '🎓',
      title: 'Quality Education',
      desc: 'Industry-aligned curricula and rigorous academic standards designed to empower students with contemporary knowledge and professional skills.'
    },
    {
      icon: '💻',
      title: 'Digital Learning',
      desc: 'Anywhere, anytime access to comprehensive digital course modules, recorded video lectures, and syllabus materials through our learning platform.'
    },
    {
      icon: '⏳',
      title: 'Flexible Learning',
      desc: 'Self-paced learning opportunities engineered to support working executives, adult learners, and students seeking career upskilling.'
    },
    {
      icon: '🛡️',
      title: 'Secure Examination',
      desc: 'Robust online examination infrastructure backed by AI proctoring, randomized question sets, and real-time candidate integrity monitoring.'
    },
    {
      icon: '📜',
      title: 'Verified Certificates',
      desc: 'Tamper-proof digital certifications featuring cryptographic serial numbers and instant QR-based public verification for employers.'
    },
    {
      icon: '🎧',
      title: 'Student Support',
      desc: 'Dedicated academic helpdesk, digital grievance redressal, and seamless communication channels between students and affiliated centers.'
    }
  ];

  const services = [
    {
      icon: '📝',
      title: 'Online Admission',
      desc: 'Direct online enrollment and document submission for accredited diploma courses.',
      link: '/admission'
    },
    {
      icon: '🎥',
      title: 'Online Classes',
      desc: 'Virtual video classroom, e-learning materials, and lesson Q&A for registered students.',
      link: '/student/classes'
    },
    {
      icon: '✍️',
      title: 'Online Examination',
      desc: 'Secured term evaluations with live webcam proctoring and online exam scheduling.',
      link: '/student/exam'
    },
    {
      icon: '👤',
      title: 'Student ERP',
      desc: 'Unified student dashboard managing profiles, attendance, marks, and hall tickets.',
      link: '/student/dashboard'
    },
    {
      icon: '🏫',
      title: 'Affiliated Institutions',
      desc: 'Accredited training centers and study colleges offering NCTMS recognized programs.',
      link: '/institutions'
    },
    {
      icon: '📥',
      title: 'Applications & Downloads',
      desc: 'Official admission prospectuses, syllabi, exam forms, and verification formats.',
      link: '/downloads'
    },
    {
      icon: '💳',
      title: 'Online Payment',
      desc: 'Secure digital payment gateways with instant fee receipts and ledger records.',
      link: '/student/fees'
    },
    {
      icon: '📊',
      title: 'Results',
      desc: 'Published examination marksheets and performance scorecards across terms.',
      link: '/verify'
    },
    {
      icon: '🔍',
      title: 'Certificate Verification',
      desc: 'Public national registry for instant verification of student credentials.',
      link: '/verify'
    }
  ];

  const trustCards = [
    {
      icon: '🌐',
      title: 'Digital Education Platform',
      desc: 'End-to-end cloud-powered academic delivery for seamless continuous education.'
    },
    {
      icon: '⚡',
      title: 'Online Student Services',
      desc: 'Instant online admissions, fee tracking, hall tickets, and e-learning access.'
    },
    {
      icon: '🔒',
      title: 'Secure Examination',
      desc: 'High-integrity proctored assessments upholding national academic standards.'
    },
    {
      icon: '🏅',
      title: 'Verified Certificates',
      desc: 'Nationally recognized credentials with 100% public online authenticity validation.'
    }
  ];

  const faqs = [
    {
      question: 'What is NCTMS India Online?',
      answer: 'The National Council for Technical and Management Studies (NCTMS) is an autonomous academic body promoting vocational, technical, management, and skill-based educational programs through modernized digital learning infrastructure and affiliated institution networks.'
    },
    {
      question: 'What services are available online?',
      answer: 'Through NCTMS India Online, students and institutions can access online admissions, virtual classes, digital course materials, AI-proctored online examinations, fee payments, result publications, transcript requests, and instant certificate verification.'
    },
    {
      question: 'How can I apply for a course?',
      answer: 'Prospective students can visit the Online Admission page (/admission), choose their desired diploma or certificate program, fill out the application form with personal and academic credentials, upload supporting documents, and track their enrollment status.'
    },
    {
      question: 'How can students access online classes?',
      answer: 'Enrolled students can log in to their Student ERP portal and navigate to the "Online Classes" section (/student/classes) to stream video lectures, view unit presentations, and download digital reading resources anytime.'
    },
    {
      question: 'How can I verify a certificate?',
      answer: 'Any student, employer, or institutional authority can use the Public Certificate Verification desk (/verify) by entering the candidate’s official Roll Number or Certificate ID to review verified academic records instantaneously.'
    },
    {
      question: 'How can I contact student support?',
      answer: 'You can reach the NCTMS Helpdesk through the Contact page (/contact) via email at helpdesk@nctms.in, or by phone at +91 44 2855 0192 during regular office hours (Monday to Saturday, 9:00 AM to 6:00 PM).'
    }
  ];

  return (
    <PublicLayout>
      {/* 1. PAGE HERO SECTION */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <div className="subpage-breadcrumbs">
              <Link to="/">Home</Link> &rsaquo; <span>About NCTMS</span>
            </div>
            <h1>About NCTMS</h1>
            <p className="subpage-hero-subtitle" style={{ fontSize: '18px', fontWeight: 600, color: '#fef08a', marginBottom: '8px' }}>
              Empowering Education Through Digital Learning
            </p>
            <p className="subpage-hero-subtitle">
              NCTMS India Online provides digital education, online learning, examinations, student services, certification, and institutional support across technical and management disciplines.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🏛️</span>
            <div>
              <strong>National Council</strong>
              <span>Technical &amp; Management Studies</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT NCTMS SECTION (Two Columns) */}
      <section className="about-section">
        <div className="container">
          <div className="about-overview-grid">
            {/* Left: Professional Visual */}
            <div className="about-visual-box">
              <img
                src="/assets/images/hero-students.jpg"
                alt="Students Learning at NCTMS"
                className="about-visual-img"
              />
              <div className="about-badge-float">
                <span className="badge-num">100%</span>
                <div>
                  <strong>Digital Education Platform</strong>
                  <small>Serving Students Nationwide</small>
                </div>
              </div>
            </div>

            {/* Right: Council Description & Key Points */}
            <div className="about-overview-content">
              <span className="section-tag" style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, color: '#0c57c4', background: '#e0edff', padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
                Academic Leadership &amp; Governance
              </span>
              <h2>National Council for Technical and Management Studies</h2>
              <p className="about-overview-desc">
                The National Council for Technical and Management Studies (NCTMS) is dedicated to advancing career-oriented education through modernized curricula, accessible learning methodologies, and standardized evaluation processes. Our digital platform bridges the gap between traditional classroom training and modern technological tools, ensuring equal learning opportunities for all aspiring candidates.
              </p>

              {/* Key Points Checklist */}
              <div className="about-points-grid">
                {keyPoints.map((point, idx) => (
                  <div key={idx} className="about-point-item">
                    <span className="about-point-check">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link to="/courses" className="btn-primary" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px' }}>
                Explore Our Courses &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. OUR VISION & OUR MISSION */}
      <section className="about-section-alt">
        <div className="container">
          <div className="vision-mission-grid">
            {/* Vision Card */}
            <div className="vm-card vm-vision">
              <div className="vm-icon-wrap">
                👁️
              </div>
              <h3>Our Vision</h3>
              <p className="vm-text">
                To make quality education accessible, flexible, technology-driven, and available beyond geographical boundaries.
              </p>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px', color: '#0c57c4', fontSize: '13px', fontWeight: 700 }}>
                <span>🎯</span>
                <span>Bridging Boundaries Through Technology</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className="vm-card vm-mission">
              <div className="vm-icon-wrap">
                🚀
              </div>
              <h3>Our Mission</h3>
              <ul className="vm-mission-list">
                {missionPoints.map((point, idx) => (
                  <li key={idx}>
                    <span className="vm-bullet">&bull;</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE NCTMS (6 Feature Cards) */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header">
            <span className="section-tag">Distinctive Strengths</span>
            <h2>Why Choose NCTMS</h2>
            <p>
              Discover the core pillars that position NCTMS India Online as a premier digital learning and evaluation platform for career advancement.
            </p>
          </div>

          <div className="why-nctms-grid">
            {whyFeatures.map((item, idx) => (
              <div key={idx} className="why-card">
                <div className="why-icon-box">
                  {item.icon}
                </div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OUR EDUCATION ECOSYSTEM */}
      <section className="about-section-alt">
        <div className="container">
          <div className="about-section-header">
            <span className="section-tag">Integrated Lifecycle</span>
            <h2>Our Education Ecosystem</h2>
            <p>
              A seamless student-centered digital lifecycle from enrollment to verified certification.
            </p>
          </div>

          <div className="ecosystem-container">
            {/* Sequential Flow */}
            <div className="ecosystem-pipeline">
              <div className="eco-step">
                <span className="eco-step-icon">👨‍🎓</span>
                <span className="eco-step-title">Students</span>
              </div>
              <span className="eco-arrow">&rarr;</span>

              <div className="eco-step">
                <span className="eco-step-icon">📚</span>
                <span className="eco-step-title">Courses</span>
              </div>
              <span className="eco-arrow">&rarr;</span>

              <div className="eco-step">
                <span className="eco-step-icon">💻</span>
                <span className="eco-step-title">Online Learning</span>
              </div>
              <span className="eco-arrow">&rarr;</span>

              <div className="eco-step">
                <span className="eco-step-icon">✍️</span>
                <span className="eco-step-title">Online Examination</span>
              </div>
              <span className="eco-arrow">&rarr;</span>

              <div className="eco-step">
                <span className="eco-step-icon">📊</span>
                <span className="eco-step-title">Results</span>
              </div>
              <span className="eco-arrow">&rarr;</span>

              <div className="eco-step">
                <span className="eco-step-icon">📜</span>
                <span className="eco-step-title">Certificates</span>
              </div>
            </div>

            {/* Tripartite Hub */}
            <div className="eco-hub-wrapper">
              <div className="eco-hub-node">
                <div className="node-icon">🏫</div>
                <div>
                  <strong>Affiliated Institutions</strong>
                  <div style={{ fontSize: '11px', color: '#93c5fd' }}>Centers &amp; Colleges</div>
                </div>
              </div>

              <div className="eco-bidirectional">&harr;</div>

              <div className="eco-hub-node">
                <div className="node-icon" style={{ background: '#2563eb' }}>⚡</div>
                <div>
                  <strong>NCTMS Digital Platform</strong>
                  <div style={{ fontSize: '11px', color: '#93c5fd' }}>Central Council Core</div>
                </div>
              </div>

              <div className="eco-bidirectional">&harr;</div>

              <div className="eco-hub-node">
                <div className="node-icon">🎓</div>
                <div>
                  <strong>Enrolled Students</strong>
                  <div style={{ fontSize: '11px', color: '#93c5fd' }}>Empowered Diplomates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR SERVICES (Grid with Real Routes) */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header">
            <span className="section-tag">Comprehensive Offerings</span>
            <h2>Our Services</h2>
            <p>
              Explore our complete suite of academic and administrative web portals, designed to provide instant access to vital student and institutional facilities.
            </p>
          </div>

          <div className="about-services-grid">
            {services.map((srv, idx) => (
              <Link key={idx} to={srv.link} className="about-service-card">
                <div className="about-service-icon">
                  {srv.icon}
                </div>
                <div className="about-service-details">
                  <h4>{srv.title}</h4>
                  <p>{srv.desc}</p>
                  <span className="about-service-link">
                    Access Portal &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. TRUST / STATISTICS SECTION */}
      <section className="about-section-alt">
        <div className="container">
          <div className="about-section-header">
            <span className="section-tag">Reliability &amp; Integrity</span>
            <h2>Commitment to Academic Excellence</h2>
            <p>
              Qualitative trust indicators reflecting our continuous commitment to student satisfaction, security, and quality governance.
            </p>
          </div>

          <div className="about-trust-grid">
            {trustCards.map((card, idx) => (
              <div key={idx} className="about-trust-card">
                <span className="about-trust-icon">{card.icon}</span>
                <h4>{card.title}</h4>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION */}
      <section className="about-section" style={{ paddingBottom: '20px' }}>
        <div className="container">
          <div className="about-cta-banner">
            <h2>Start Your Learning Journey With NCTMS</h2>
            <p>
              Explore courses, apply online, learn digitally, and access your academic services from anywhere.
            </p>
            <div className="about-cta-actions">
              <Link to="/courses" className="btn-primary" style={{ background: '#ffffff', color: '#0c57c4', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}>
                Explore Courses &rarr;
              </Link>
              <Link to="/admission" className="btn-primary" style={{ background: '#f59e0b', color: '#0f172a', padding: '12px 24px', fontSize: '14px', borderRadius: '8px', fontWeight: 800 }}>
                Apply Online &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="about-section">
        <div className="container">
          <div className="about-section-header">
            <span className="section-tag">Help &amp; Answers</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Find clear answers to common questions about NCTMS programs, admissions, classes, and certification verification.
            </p>
          </div>

          <div className="faq-accordion">
            {faqs.map((faq, idx) => {
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
        </div>
      </section>
    </PublicLayout>
  );
}

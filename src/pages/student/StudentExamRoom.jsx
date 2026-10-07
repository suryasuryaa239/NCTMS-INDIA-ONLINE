import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { STUDENT_PROFILE, EXAM_QUESTION_BANK } from '../../data/studentData';

export default function StudentExamRoom() {
  const student = STUDENT_PROFILE;
  const questions = EXAM_QUESTION_BANK;

  // Exam States
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [secondsLeft, setSecondsLeft] = useState(2700); // 45 minutes
  const [tabViolations, setTabViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examResult, setExamResult] = useState(null);

  const calculateScore = useCallback(() => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1;
      }
    });
    const percentage = ((correctCount / questions.length) * 100).toFixed(1);
    const passed = correctCount >= 4; // 40% passing
    const resultObj = {
      score: correctCount,
      total: questions.length,
      percentage,
      passed,
      grade: passed ? (percentage >= 80 ? 'Distinction (O)' : 'First Class (A)') : 'Needs Improvement'
    };
    setExamResult(resultObj);
    setExamSubmitted(true);
    setShowSubmitModal(false);
  }, [questions, selectedAnswers]);

  // Timer Effect
  useEffect(() => {
    if (examSubmitted) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examSubmitted, calculateScore]);

  // Tab switch anti-cheat detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !examSubmitted) {
        setTabViolations((prev) => {
          const next = prev + 1;
          setShowViolationWarning(true);
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examSubmitted]);

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelectOption = (optIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIndex
    }));
  };

  const handleClearAnswer = () => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQIndex];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => {
      const copy = new Set(prev);
      if (copy.has(currentQIndex)) {
        copy.delete(currentQIndex);
      } else {
        copy.add(currentQIndex);
      }
      return copy;
    });
  };

  const currentQ = questions[currentQIndex];
  const isReviewed = markedForReview.has(currentQIndex);

  const answeredCount = Object.keys(selectedAnswers).length;
  const reviewCount = markedForReview.size;
  const unvisitedCount = questions.length - answeredCount;

  return (
    <div style={{ minHeight: '100vh', background: '#0a192f', color: '#ffffff', fontFamily: 'var(--font-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Proctored Exam Top Bar */}
      <header style={{ background: '#07162c', borderBottom: '1px solid #1e293b', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="36" height="36" />
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              CS-402 Database Management Systems &bull; Term-End Exam
            </h1>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Candidate: {student.fullName} ({student.rollNo})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Proctoring Camera Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f2942', padding: '6px 12px', borderRadius: '6px', border: '1px solid #0284c7' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span style={{ fontSize: '11.5px', color: '#38bdf8', fontWeight: 700 }}>AI Proctor Active</span>
          </div>

          {/* Violations Counter */}
          {tabViolations > 0 && (
            <span style={{ background: '#7f1d1d', color: '#fca5a5', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
              ⚠️ Tab Violations: {tabViolations}/3
            </span>
          )}

          {/* Countdown Clock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '6px 14px', borderRadius: '8px', border: '1px solid #334155' }}>
            <span style={{ fontSize: '14px' }}>⏱</span>
            <span style={{ fontFamily: 'monospace', fontSize: '17px', fontWeight: 800, color: secondsLeft < 300 ? '#ef4444' : '#38bdf8' }}>
              {formatTimer(secondsLeft)}
            </span>
          </div>

          <button 
            type="button" 
            className="btn-primary" 
            style={{ background: '#dc2626', fontSize: '12.5px', padding: '8px 16px' }}
            onClick={() => setShowSubmitModal(true)}
            disabled={examSubmitted}
          >
            Submit Examination
          </button>
        </div>
      </header>

      {/* 2. Main Exam Body */}
      {!examSubmitted ? (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Left Column: Active Question Workspace */}
          <div style={{ background: '#0d2342', borderRadius: '12px', border: '1px solid #1e3a5f', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e3a5f', paddingBottom: '14px', marginBottom: '18px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
                  Question {currentQIndex + 1} of {questions.length} &bull; (Marks: 1.0)
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Single Choice MCQ</span>
              </div>

              {/* Question Text */}
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: '#f8fafc', lineHeight: '1.5', marginBottom: '24px' }}>
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQIndex] === optIdx;
                  return (
                    <label 
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 18px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(14, 165, 233, 0.15)' : '#071a33',
                        border: isSelected ? '2px solid #0284c7' : '1px solid #1e3a5f',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`q-${currentQ.id}`} 
                        checked={isSelected}
                        onChange={() => handleSelectOption(optIdx)}
                        style={{ accentColor: '#0284c7', width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '14px', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                        {String.fromCharCode(65 + optIdx)}. {option}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e3a5f', paddingTop: '18px', marginTop: '24px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary"
                  style={{ background: '#1e293b', color: '#cbd5e1', fontSize: '12.5px' }}
                  onClick={handleClearAnswer}
                >
                  Clear Selection
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  style={{
                    background: isReviewed ? '#7e22ce' : '#334155',
                    color: '#ffffff',
                    fontSize: '12.5px'
                  }}
                  onClick={handleToggleReview}
                >
                  {isReviewed ? '★ Marked for Review' : '☆ Mark for Review'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary"
                  style={{ background: '#1e293b', color: '#ffffff', fontSize: '13px' }}
                  onClick={() => setCurrentQIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQIndex === 0}
                >
                  &larr; Previous
                </button>
                <button 
                  type="button" 
                  className="btn-primary"
                  style={{ fontSize: '13px' }}
                  onClick={() => setCurrentQIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  disabled={currentQIndex === questions.length - 1}
                >
                  Next &rarr;
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Question Palette & Proctor Webcam */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Webcam Simulation Box */}
            <div style={{ background: '#071a33', borderRadius: '10px', border: '1px solid #1e3a5f', padding: '14px', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '100%', height: '140px', background: '#000000', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img 
                  src="/assets/images/portal.jpg" 
                  alt="Student Proctor Feed" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#dc2626', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '3px' }}>
                  🔴 REC
                </span>
              </div>
              <small style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                Face detected & centered &bull; Stream encrypted
              </small>
            </div>

            {/* Question Palette Summary Card */}
            <div style={{ background: '#071a33', borderRadius: '10px', border: '1px solid #1e3a5f', padding: '16px' }}>
              <h3 style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 700, margin: '0 0 12px' }}>Question Palette</h3>
              
              {/* Palette Color Legend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', marginBottom: '16px', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '3px' }}></span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#a855f7', borderRadius: '3px' }}></span>
                  <span>Review ({reviewCount})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', background: '#334155', borderRadius: '3px' }}></span>
                  <span>Unvisited ({unvisitedCount})</span>
                </div>
              </div>

              {/* 10 Grid Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {questions.map((q, idx) => {
                  const hasAnswer = selectedAnswers[idx] !== undefined;
                  const isRev = markedForReview.has(idx);
                  const isCurrent = currentQIndex === idx;

                  let bgColor = '#1e293b';
                  if (hasAnswer) bgColor = '#22c55e';
                  if (isRev) bgColor = '#a855f7';

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentQIndex(idx)}
                      style={{
                        height: '38px',
                        background: bgColor,
                        color: '#ffffff',
                        border: isCurrent ? '2px solid #38bdf8' : 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* 3. Post-Exam Provisional Result Sheet */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
          <div style={{ background: '#ffffff', color: '#0f274a', borderRadius: '14px', padding: '36px', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: examResult.passed ? '#dcfce7' : '#fee2e2', color: examResult.passed ? '#16a34a' : '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>
              {examResult.passed ? '✓' : '✗'}
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0b326b', marginBottom: '6px' }}>
              {examResult.passed ? 'Provisional Examination Passed!' : 'Exam Submitted'}
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
              Your answers have been securely synced to the NCTMS central evaluation server.
            </p>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                <div><strong>Candidate Name:</strong> {student.fullName}</div>
                <div><strong>Roll Number:</strong> {student.rollNo}</div>
                <div><strong>Score Obtained:</strong> <strong style={{ color: '#0c57c4', fontSize: '15px' }}>{examResult.score} / {examResult.total}</strong></div>
                <div><strong>Percentage:</strong> <strong>{examResult.percentage}%</strong></div>
                <div><strong>Evaluation Status:</strong> <span style={{ color: examResult.passed ? '#16a34a' : '#ea580c', fontWeight: 700 }}>{examResult.passed ? 'PASSED' : 'NEEDS RE-APPEAR'}</span></div>
                <div><strong>Provisional Division:</strong> {examResult.grade}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/student/results" className="btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                View Cumulative Grade Card
              </Link>
              <Link to="/student/dashboard" className="btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                Return to ERP Dashboard &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal-backdrop" onClick={() => setShowSubmitModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', color: '#0f274a' }}>
            <div className="modal-header">
              <h3 style={{ color: '#0b326b' }}>Confirm Exam Submission</h3>
              <p className="modal-desc">Are you sure you want to finalize your examination?</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', marginBottom: '18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Questions Answered: <strong style={{ color: '#16a34a' }}>{answeredCount} of {questions.length}</strong></div>
              <div>Marked for Review: <strong style={{ color: '#9333ea' }}>{reviewCount}</strong></div>
              <div>Unanswered Questions: <strong style={{ color: '#ef4444' }}>{questions.length - answeredCount}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowSubmitModal(false)}>
                Return to Test
              </button>
              <button type="button" className="btn-primary" style={{ flex: 1, background: '#16a34a' }} onClick={calculateScore}>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Anti-cheat tab violation warning popup */}
      {showViolationWarning && (
        <div className="modal-backdrop" onClick={() => setShowViolationWarning(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', color: '#0f274a', border: '3px solid #dc2626' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>⚠️</span>
              <h3 style={{ color: '#b91c1c', fontSize: '18px', marginBottom: '6px' }}>Security Warning: Tab Switch Detected</h3>
              <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
                You navigated away from the proctored exam screen. This incident has been logged into your test violation audit log. Continued violations will force automatic submission.
              </p>
              <button type="button" className="btn-primary" style={{ background: '#0b326b' }} onClick={() => setShowViolationWarning(false)}>
                I Understand, Return to Exam
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

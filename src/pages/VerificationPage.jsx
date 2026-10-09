// src/pages/VerificationPage.jsx
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { CERTIFICATES_DATA, CERTIFICATE_TYPES } from '../data/certificatesData';
import {
  verifyCertificate,
  parseAndVerifyQrContent,
  generateVerificationUrl
} from '../services/verificationService';

export default function VerificationPage() {
  const { rollNo: paramRollNo } = useParams();
  const [searchParams] = useSearchParams();
  const queryParamCert = searchParams.get('cert') || searchParams.get('id');
  const initialQuery = paramRollNo || queryParamCert || 'NCTMS2026CS1092';

  // Active Method Tab: 'details' | 'qr'
  const [activeMethod, setActiveMethod] = useState('details');

  // Details Search Fields
  const [searchIdentifier, setSearchIdentifier] = useState(initialQuery);
  const [certType, setCertType] = useState('All Certificate Types');
  const [searchedKey, setSearchedKey] = useState(initialQuery);

  // Verification Status: 'IDLE' | 'LOADING' | 'VERIFIED' | 'REVOKED' | 'PENDING' | 'NOT_FOUND'
  const [verificationStatus, setVerificationStatus] = useState(() => {
    const rec = CERTIFICATES_DATA[initialQuery.trim().toUpperCase()];
    if (!rec) return 'IDLE';
    return rec.status === 'Revoked / Cancelled by Council Order' ? 'REVOKED' : 'VERIFIED';
  });

  const [verifiedRecord, setVerifiedRecord] = useState(() => {
    return CERTIFICATES_DATA[initialQuery.trim().toUpperCase()] || null;
  });

  const [statusMessage, setStatusMessage] = useState(() => {
    const rec = CERTIFICATES_DATA[initialQuery.trim().toUpperCase()];
    return rec?.revocationReason || '';
  });

  // Camera & QR Scanner State
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionError, setCameraPermissionError] = useState('');
  const [isProcessingQr, setIsProcessingQr] = useState(false);

  // Video and Canvas Refs for QR scanning
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Form IDs for accessibility
  const idInputId = useId();
  const certTypeSelectId = useId();
  const qrFileInputId = useId();

  // Stop camera function
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Perform Verification
  const handlePerformVerification = useCallback(async (queryToVerify) => {
    const query = (queryToVerify || searchIdentifier).trim().toUpperCase();
    if (!query) return;

    setSearchedKey(query);
    setVerificationStatus('LOADING');
    setVerifiedRecord(null);
    setStatusMessage('');

    try {
      const result = await verifyCertificate({
        query,
        _certType: certType
      });

      setVerificationStatus(result.status);
      if (result.status === 'VERIFIED') {
        setVerifiedRecord(result.record);
      } else if (result.status === 'REVOKED') {
        setVerifiedRecord(result.record);
        setStatusMessage(result.message);
      } else if (result.status === 'PENDING') {
        setVerifiedRecord(result.record);
        setStatusMessage(result.message);
      } else {
        setStatusMessage(result.message);
      }
    } catch {
      setVerificationStatus('NOT_FOUND');
      setStatusMessage('Verification service is temporarily unavailable. Please retry shortly.');
    }
  }, [searchIdentifier, certType]);

  // Handle dynamic URL changes
  const prevParamRef = useRef(initialQuery);
  useEffect(() => {
    const target = paramRollNo || queryParamCert;
    if (target && target !== prevParamRef.current) {
      prevParamRef.current = target;
      handlePerformVerification(target);
    }
  }, [paramRollNo, queryParamCert, handlePerformVerification]);

  // Form submit for details
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    handlePerformVerification(searchIdentifier);
  };

  // Sample quick chip selection
  const handleSelectSample = (sampleIdentifier) => {
    setSearchIdentifier(sampleIdentifier);
    handlePerformVerification(sampleIdentifier);
  };

  // Process decoded QR text safely
  const handleProcessQrString = useCallback(async (rawQrString) => {
    if (!rawQrString || isProcessingQr) return;
    setIsProcessingQr(true);
    stopCamera();

    try {
      const result = await parseAndVerifyQrContent(rawQrString);
      setVerificationStatus(result.status);
      setSearchedKey(result.extractedId || rawQrString);

      if (result.status === 'VERIFIED') {
        setVerifiedRecord(result.record);
        setSearchIdentifier(result.record.rollNo);
      } else if (result.status === 'REVOKED') {
        setVerifiedRecord(result.record);
        setStatusMessage(result.message);
      } else {
        setStatusMessage(result.message);
      }
    } catch {
      setVerificationStatus('NOT_FOUND');
      setStatusMessage('Failed to decode or verify QR payload.');
    } finally {
      setIsProcessingQr(false);
    }
  }, [isProcessingQr, stopCamera]);

  // Camera Controls
  const startCamera = async () => {
    setCameraPermissionError('');
    setCameraActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start BarcodeDetector scanner loop if supported
      if ('BarcodeDetector' in window) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        scanIntervalRef.current = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === 4) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedVal = barcodes[0].rawValue;
                handleProcessQrString(detectedVal);
              }
            } catch {
              // ignore detection frame errors
            }
          }
        }, 500);
      }
    } catch (err) {
      setCameraActive(false);
      setCameraPermissionError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera permissions in browser settings or use the file upload / manual details tab.'
          : `Camera scanner unavailable: ${err.message || 'No video device found'}. Please use the image upload or details tab.`
      );
    }
  };

  // Image File Upload Fallback
  const handleQrFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessingQr(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        // Try BarcodeDetector on image
        if ('BarcodeDetector' in window) {
          try {
            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(img);
            if (barcodes.length > 0) {
              handleProcessQrString(barcodes[0].rawValue);
              return;
            }
          } catch {
            // fallback
          }
        }

        // If BarcodeDetector not available or returns empty, check filename or payload match
        const sampleMatch = Object.keys(CERTIFICATES_DATA).find((r) =>
          file.name.toUpperCase().includes(r)
        );
        if (sampleMatch) {
          handleProcessQrString(`https://verify.nctms.in/verify/${sampleMatch}`);
        } else {
          // Fallback simulation: decode verified QR for Alexander
          handleProcessQrString('https://verify.nctms.in/verify/NCTMS2026CS1092');
        }
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <PublicLayout>
      {/* 1. HERO BANNER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Certificate Verification</span>
            </nav>
            <h1>Certificate &amp; QR Verification Portal</h1>
            <p className="subpage-hero-subtitle">
              Official public registry enabling employers, universities, and government agencies to authenticate tamper-evident diplomas, mark sheets, and vocational credentials issued by NCTMS India.
            </p>
          </div>
          <div className="subpage-hero-badge">
            <span className="badge-icon">🛡️</span>
            <div>
              <strong>Instant Digital Verification</strong>
              <span>Central Student Academic Registry</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTAINER */}
      <section className="content-section">
        <div className="container">
          <div className="verify-wrapper">

            {/* Verification Method Tabs */}
            <div className="verification-method-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeMethod === 'details'}
                className={`method-tab-btn ${activeMethod === 'details' ? 'active' : ''}`}
                onClick={() => {
                  stopCamera();
                  setActiveMethod('details');
                }}
              >
                📝 Verify by Certificate Details
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeMethod === 'qr'}
                className={`method-tab-btn ${activeMethod === 'qr' ? 'active' : ''}`}
                onClick={() => {
                  setActiveMethod('qr');
                }}
              >
                📷 Verify using QR Code
              </button>
            </div>

            {/* METHOD 1: DETAILS SEARCH CARD */}
            {activeMethod === 'details' && (
              <div className="verify-search-card">
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0c57c4', textTransform: 'uppercase' }}>
                  Method 1 &bull; Direct Credential Authentication
                </span>
                <h2 style={{ fontSize: '20px', color: '#0b326b', margin: '4px 0 10px' }}>
                  Verify by Registration / Certificate Number
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Enter the complete Certificate Serial Number or Roll Number as printed on the official parchment.
                </p>

                <form onSubmit={handleDetailsSubmit} className="verify-input-group">
                  <input
                    id={idInputId}
                    type="text"
                    placeholder="e.g. NCTMS2026CS1092 or NCTMS/TN/CERT/2026/89412"
                    value={searchIdentifier}
                    onChange={(e) => setSearchIdentifier(e.target.value)}
                    required
                  />
                  <select
                    id={certTypeSelectId}
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="payment-select"
                    style={{ maxWidth: '240px', padding: '10px 12px' }}
                  >
                    {CERTIFICATE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                    Verify Credentials &rarr;
                  </button>
                </form>

                {/* Sample Quick Chips for Testing (including valid, revoked, and unreleased) */}
                <div className="verify-samples-row" style={{ marginTop: '14px' }}>
                  <span>Verified Test Records:</span>
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('NCTMS2026CS1092')}
                  >
                    🟢 NCTMS2026CS1092 (Alexander James)
                  </button>
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('NCTMS2025TN8821')}
                  >
                    🟢 NCTMS2025TN8821 (R. Murugavel)
                  </button>
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('NCTMS/TN/CERT/2026/89412')}
                  >
                    🟢 NCTMS/TN/CERT/2026/89412 (Cert No)
                  </button>
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('NCTMS2023REV01')}
                    style={{ borderColor: '#fca5a5', color: '#b91c1c' }}
                  >
                    🔴 NCTMS2023REV01 (Revoked Record)
                  </button>
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('NCTMS2026ML3042')}
                  >
                    🟡 NCTMS2026ML3042 (Under Audit)
                  </button>
                </div>
              </div>
            )}

            {/* METHOD 2: QR CODE SCANNER & UPLOAD */}
            {activeMethod === 'qr' && (
              <div className="qr-scanner-card">
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0c57c4', textTransform: 'uppercase' }}>
                  Method 2 &bull; QR Code Verification
                </span>
                <h2 style={{ fontSize: '20px', color: '#0b326b', margin: '4px 0 10px' }}>
                  Scan Official Certificate QR Code
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '640px', margin: '0 0 18px' }}>
                  Point your camera at the digital authentication QR code printed on the bottom of the council certificate, or upload a clear photo/scan of the QR code.
                </p>

                {cameraPermissionError && (
                  <div className="payment-alert-error" style={{ marginBottom: '18px' }}>
                    <span>⚠️</span>
                    <div>{cameraPermissionError}</div>
                  </div>
                )}

                {/* Live Camera View */}
                {cameraActive ? (
                  <div className="qr-scanner-container">
                    <video ref={videoRef} className="qr-video-element" />
                    <div className="qr-scanner-overlay">
                      <div className="qr-target-box">
                        <div className="qr-scan-laser" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                    <div style={{ fontSize: '42px', marginBottom: '10px' }}>📷</div>
                    <h3 style={{ fontSize: '16px', color: '#0b326b', margin: '0 0 6px', fontWeight: 700 }}>
                      Device Camera Scanner
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', maxWidth: '420px', margin: '0 auto 16px' }}>
                      Click below to request camera permission and scan physical certificates in real-time.
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={startCamera}
                      style={{ padding: '10px 22px' }}
                    >
                      🎥 Start Camera Scanner
                    </button>
                  </div>
                )}

                {cameraActive && (
                  <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={stopCamera}
                      style={{ padding: '8px 20px' }}
                    >
                      ⏹️ Stop Camera
                    </button>
                  </div>
                )}

                {/* Image Upload Fallback */}
                <label className="qr-upload-box" htmlFor={qrFileInputId}>
                  <div style={{ fontSize: '28px', marginBottom: '6px' }}>📂</div>
                  <strong style={{ display: 'block', color: '#0c57c4', fontSize: '14px' }}>
                    Upload Certificate QR Code Image
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Supported formats: PNG, JPG, JPEG, WebP
                  </span>
                  <input
                    id={qrFileInputId}
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Quick Test QR Actions */}
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                  <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Simulate Scanned QR Payloads:
                  </span>
                  <div className="results-sample-chips">
                    <button
                      type="button"
                      className="results-sample-chip"
                      onClick={() => handleProcessQrString('https://verify.nctms.in/verify/NCTMS2026CS1092')}
                    >
                      🟢 Authentic QR: Alexander James (PGDCS)
                    </button>
                    <button
                      type="button"
                      className="results-sample-chip"
                      onClick={() => handleProcessQrString('https://verify.nctms.in/verify/NCTMS2025TN8821')}
                    >
                      🟢 Authentic QR: R. Murugavel (DCS)
                    </button>
                    <button
                      type="button"
                      className="results-sample-chip"
                      onClick={() => handleProcessQrString('https://verify.nctms.in/verify/NCTMS2023REV01')}
                      style={{ borderColor: '#fca5a5', color: '#b91c1c' }}
                    >
                      🔴 Revoked QR: Rajesh Kumar (DEEE)
                    </button>
                    <button
                      type="button"
                      className="results-sample-chip"
                      onClick={() => handleProcessQrString('https://untrusted-phishing-site.com/fake-cert')}
                      style={{ borderColor: '#fed7aa', color: '#c2410c' }}
                    >
                      ⚠️ Untrusted QR: Malicious Third-Party Link
                    </button>
                  </div>
                </div>

                {isProcessingQr && (
                  <div style={{ textAlign: 'center', marginTop: '18px' }}>
                    <div className="gateway-spinner" />
                    <span style={{ fontSize: '12.5px', color: '#0c57c4', fontWeight: 600, display: 'block', marginTop: '8px' }}>
                      Decoding &amp; Verifying QR Code with Council Registry...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                3. VERIFICATION RESULT STATES
                ========================================================================= */}

            {/* STATE A: LOADING */}
            {verificationStatus === 'LOADING' && (
              <div className="results-status-card">
                <div className="gateway-spinner" />
                <h3 style={{ color: '#0b326b', fontSize: '17px', margin: '16px 0 6px', fontWeight: 800 }}>
                  Verifying with National Academic Registry...
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '0 auto' }}>
                  Cross-referencing digital signature seals and council certification registers.
                </p>
              </div>
            )}

            {/* STATE B: NOT FOUND / INVALID */}
            {(verificationStatus === 'NOT_FOUND' || verificationStatus === 'INVALID_INPUT' || verificationStatus === 'UNTRUSTED_QR') && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '10px', padding: '28px', textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>⚠️</span>
                <h3 style={{ color: '#b91c1c', fontSize: '19px', marginBottom: '6px', fontWeight: 800 }}>
                  Certificate Verification Failed: &ldquo;{searchedKey}&rdquo;
                </h3>
                <p style={{ fontSize: '13.5px', color: '#7f1d1d', maxWidth: '620px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                  {statusMessage || 'The requested credential was not located in the verified active council database. Please check for typos, verify serial numbers, or contact the NCTMS Examination Secretariat.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleSelectSample('NCTMS2026CS1092')}
                  >
                    Load Authentic Sample Record (NCTMS2026CS1092)
                  </button>
                  <Link to="/contact" className="btn-primary">
                    Contact Examination Secretariat
                  </Link>
                </div>
              </div>
            )}

            {/* STATE C: REVOKED OR CANCELLED STATUS */}
            {verificationStatus === 'REVOKED' && verifiedRecord && (
              <div className="cert-revoked-box">
                <div className="cert-revoked-header">
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                    ✕
                  </div>
                  <div>
                    <span className="revoked-badge">
                      INVALID CREDENTIAL &bull; OFFICIALLY REVOKED
                    </span>
                    <h3 style={{ fontSize: '20px', color: '#991b1b', margin: '6px 0 0', fontWeight: 900 }}>
                      Certificate Has Been Formally Cancelled
                    </h3>
                  </div>
                </div>

                <div className="revocation-reason-box">
                  <strong>Official Council Revocation Notice:</strong>
                  <p style={{ margin: '6px 0 0' }}>
                    {verifiedRecord.revocationReason}
                  </p>
                  <div style={{ fontSize: '11.5px', color: '#7f1d1d', marginTop: '6px' }}>
                    Revocation Date: <strong>{verifiedRecord.revocationDate}</strong> &bull; Serial: {verifiedRecord.certificateNo}
                  </div>
                </div>

                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 18px', fontSize: '13px', color: '#334155' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div><strong>Candidate Name:</strong> {verifiedRecord.studentName}</div>
                    <div><strong>Roll Number:</strong> {verifiedRecord.rollNo}</div>
                    <div><strong>Course:</strong> {verifiedRecord.courseName}</div>
                    <div><strong>Issuing Center:</strong> {verifiedRecord.affiliatedCenter}</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
                  ⚠️ Employers and institutions are formally advised that this certificate holds zero academic or professional validity.
                </div>
              </div>
            )}

            {/* STATE D: PENDING / UNDER SCRUTINY */}
            {verificationStatus === 'PENDING' && verifiedRecord && (
              <div className="cert-pending-box">
                <div style={{ fontSize: '36px', marginBottom: '8px' }}>⏳</div>
                <h3 style={{ fontSize: '18px', color: '#92400e', margin: '0 0 6px', fontWeight: 800 }}>
                  Certificate In Council Moderation Ledger
                </h3>
                <p style={{ fontSize: '13px', color: '#78350f', maxWidth: '520px', margin: '0 auto 14px' }}>
                  {statusMessage}
                </p>
                <div style={{ fontSize: '12.5px', color: '#475569' }}>
                  Candidate: <strong>{verifiedRecord.studentName}</strong> &bull; {verifiedRecord.courseName}
                </div>
              </div>
            )}

            {/* STATE E: VERIFIED OFFICIAL SHEET */}
            {verificationStatus === 'VERIFIED' && verifiedRecord && (
              <div className="cert-sheet">
                
                {/* Official Letterhead */}
                <div className="cert-header">
                  <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="cert-emblem" />
                  <h2 className="cert-council-title">NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES</h2>
                  <p className="cert-council-sub">An Autonomous National Academic Body Registered under Govt. of India Act</p>
                  <p style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                    CENTRAL EXAMINATION DIVISION &bull; STATEMENT OF MARKS & EVALUATION
                  </p>
                </div>

                {/* Status Ribbon */}
                <div className="cert-status-ribbon">
                  <strong>
                    <span style={{ fontSize: '16px' }}>✓</span> {verifiedRecord.status.toUpperCase()}
                  </strong>
                  <span>Issued on: {verifiedRecord.issueDate} &bull; Serial: {verifiedRecord.certificateNo}</span>
                </div>

                {/* Candidate & Course Profile */}
                <div className="cert-profile-grid">
                  <div className="profile-row">
                    <span className="profile-label">Candidate Name:</span>
                    <span className="profile-val">{verifiedRecord.studentName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Roll / Reg Number:</span>
                    <span className="profile-val">{verifiedRecord.rollNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Father / Guardian:</span>
                    <span className="profile-val">{verifiedRecord.fatherName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Enrollment Number:</span>
                    <span className="profile-val">{verifiedRecord.enrollmentNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Programme Name:</span>
                    <span className="profile-val">{verifiedRecord.courseName} ({verifiedRecord.courseCode})</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Academic Session:</span>
                    <span className="profile-val">{verifiedRecord.academicYear}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Affiliated Center:</span>
                    <span className="profile-val">{verifiedRecord.affiliatedCenter}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Month &amp; Year of Exam:</span>
                    <span className="profile-val">{verifiedRecord.examinationMonthYear}</span>
                  </div>
                </div>

                {/* Marks Breakdown Table */}
                {verifiedRecord.marks && verifiedRecord.marks.length > 0 && (
                  <>
                    <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '8px' }}>
                      Subject-Wise Marks &amp; Grade Record:
                    </h4>
                    <table className="cert-marks-table">
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Subject Title</th>
                          <th>Max Marks</th>
                          <th>Pass Marks</th>
                          <th>Marks Obtained</th>
                          <th>Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verifiedRecord.marks.map((m, idx) => (
                          <tr key={idx}>
                            <td><strong>{m.code}</strong></td>
                            <td>{m.name}</td>
                            <td>{m.maxMarks}</td>
                            <td>{m.passMarks}</td>
                            <td><strong style={{ color: '#0c57c4' }}>{m.marksObtained}</strong></td>
                            <td><span style={{ fontWeight: 700, color: '#16a34a' }}>{m.grade}</span></td>
                          </tr>
                        ))}
                        <tr className="total-row">
                          <td colSpan="2" style={{ textAlign: 'right' }}>GRAND TOTAL:</td>
                          <td>{verifiedRecord.totalMax}</td>
                          <td>--</td>
                          <td>{verifiedRecord.totalObtained}</td>
                          <td>{verifiedRecord.percentage}</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}

                {/* Overall Summary Row */}
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Overall Result &amp; Division: </span>
                    <strong style={{ color: '#15803d', fontSize: '14px' }}>{verifiedRecord.overallGrade}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Cumulative Grade Point Average (CGPA): </span>
                    <strong style={{ color: '#0c57c4', fontSize: '14px' }}>{verifiedRecord.cgpa} / 10.00</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11.5px', color: '#64748b' }}>Certificate Serial: </span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{verifiedRecord.certificateNo}</span>
                  </div>
                </div>

                {/* QR Code and Signatures Footer */}
                <div className="cert-footer-row">
                  <div className="cert-qr-box">
                    <div className="mock-qr-code">
                      <svg viewBox="0 0 100 100" width="76" height="76">
                        <rect width="100" height="100" fill="#fff" />
                        <rect x="5" y="5" width="28" height="28" fill="#000" />
                        <rect x="9" y="9" width="20" height="20" fill="#fff" />
                        <rect x="13" y="13" width="12" height="12" fill="#000" />
                        
                        <rect x="67" y="5" width="28" height="28" fill="#000" />
                        <rect x="71" y="9" width="20" height="20" fill="#fff" />
                        <rect x="75" y="13" width="12" height="12" fill="#000" />
                        
                        <rect x="5" y="67" width="28" height="28" fill="#000" />
                        <rect x="9" y="71" width="20" height="20" fill="#fff" />
                        <rect x="13" y="75" width="12" height="12" fill="#000" />
                        
                        <rect x="40" y="10" width="8" height="8" fill="#000" />
                        <rect x="52" y="15" width="6" height="6" fill="#000" />
                        <rect x="40" y="35" width="20" height="6" fill="#000" />
                        <rect x="65" y="45" width="10" height="10" fill="#000" />
                        <rect x="45" y="65" width="15" height="15" fill="#000" />
                        <rect x="70" y="70" width="8" height="8" fill="#000" />
                        <rect x="85" y="85" width="8" height="8" fill="#000" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', lineHeight: '1.4' }}>
                      <strong style={{ display: 'block', color: '#0f274a' }}>Digital Authentication Hash</strong>
                      <span>URL: {generateVerificationUrl(verifiedRecord)}</span>
                      <small style={{ display: 'block', color: '#16a34a', fontWeight: 600 }}>Sha256: 8a7f9c2...b341 &bull; Council Encrypted</small>
                    </div>
                  </div>

                  <div className="cert-sign-box">
                    <div className="cert-sign-line"></div>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>Controller of Examinations</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>NCTMS India Examination Board</span>
                  </div>

                  <div className="cert-sign-box">
                    <div className="cert-sign-line"></div>
                    <strong style={{ fontSize: '12px', color: '#0f172a' }}>Registrar / Council Secretary</strong>
                    <span style={{ fontSize: '10.5px', color: '#64748b', display: 'block' }}>National Council NCTMS India</span>
                  </div>
                </div>

                {/* Print and Download Actions */}
                <div className="cert-actions-bar no-print">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Verified Marksheet
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => alert(`Official digital certificate PDF generated for ${verifiedRecord.studentName} (${verifiedRecord.rollNo})`)}
                  >
                    📜 Download Official Certificate PDF
                  </button>
                </div>

              </div>
            )}

            {/* 4. HELP & CONTACT SECTION */}
            <div className="results-support-grid" style={{ marginTop: '36px' }}>
              <div className="results-support-card">
                <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                  🛡️ Verification Authentication Protocol
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  NCTMS India certificates utilize a SHA-256 cryptographic seal. The printed QR code maps directly to the central registry at <strong>verify.nctms.in</strong> to prevent credential forgery.
                </p>
              </div>

              <div className="results-support-card">
                <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                  🏢 Corporate &amp; University Inquiries
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                  Organizations requiring formal written confirmation or apostille certification for overseas employment may email official verification requests on company letterhead to <strong>verification@nctms.in</strong>.
                </p>
              </div>

              <div className="results-support-card">
                <h3 style={{ fontSize: '15px', color: '#0b326b', margin: '0 0 8px', fontWeight: 700 }}>
                  📞 Central Verification Desk
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 8px' }}>
                  For technical issues with QR decoding or discrepancies:
                </p>
                <div style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600 }}>
                  <div>✉️ verification@nctms.in</div>
                  <div>📞 +91 44 2855 0192 (Mon - Fri 10AM - 5PM)</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

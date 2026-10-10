// src/pages/VerificationPage.jsx
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import jsQR from 'jsqr';
import PublicLayout from '../components/layout/PublicLayout';
import { CERTIFICATES_DATA, CERTIFICATE_TYPES, EXAMINATION_SESSIONS } from '../data/certificatesData';
import {
  verifyCertificate,
  parseAndVerifyQrContent,
  generateVerificationUrl
} from '../services/verificationService';

/**
 * Mask sensitive student identifier to safeguard student privacy on public endpoints
 */
function maskEnrollment(enr) {
  if (!enr) return '--';
  const parts = enr.split('-');
  if (parts.length >= 3) {
    return `${parts[0]}-****-${parts.slice(2).join('-')}`;
  }
  return enr.length > 6 ? `${enr.slice(0, 3)}****${enr.slice(-3)}` : enr;
}

export default function VerificationPage() {
  const { rollNo: paramRollNo } = useParams();
  const [searchParams] = useSearchParams();
  const queryParamCert = searchParams.get('cert') || searchParams.get('id');
  const initialQuery = paramRollNo || queryParamCert || 'NCTMS2026CS1092';

  // Set document title
  useEffect(() => {
    document.title = 'Certificate Verification | NCTMS INDIA ONLINE';
  }, []);

  // Active Method Tab: 'details' | 'qr'
  const [activeMethod, setActiveMethod] = useState('details');

  // Details Search Fields
  const [searchIdentifier, setSearchIdentifier] = useState(initialQuery);
  const [certType, setCertType] = useState('All Certificate Types');
  const [issueSession, setIssueSession] = useState('all');
  const [searchedKey, setSearchedKey] = useState(initialQuery);

  // Verification Status: 'IDLE' | 'LOADING' | 'VERIFIED' | 'INVALID_CERTIFICATE' | 'NOT_FOUND' | 'REVOKED' | 'PENDING' | 'UNAVAILABLE'
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
  const sessionSelectId = useId();
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
        _certType: certType,
        _issueYear: issueSession
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
      setVerificationStatus('UNAVAILABLE');
      setStatusMessage('Verification service is temporarily unavailable. Please retry shortly.');
    }
  }, [searchIdentifier, certType, issueSession]);

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
      setVerificationStatus('INVALID_CERTIFICATE');
      setStatusMessage('Failed to decode or verify QR payload.');
    } finally {
      setIsProcessingQr(false);
    }
  }, [isProcessingQr, stopCamera]);

  // Camera Controls using jsQR on offscreen canvas
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
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      // Continuous scanner loop using jsQR
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      scanIntervalRef.current = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const video = videoRef.current;
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert'
            });
            if (code && code.data) {
              handleProcessQrString(code.data);
            }
          }
        }
      }, 300);
    } catch (err) {
      setCameraActive(false);
      setCameraPermissionError(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in your browser or switch to the manual Certificate Details tab.'
          : `Camera scanner unavailable: ${err.message || 'No video device found'}. Please use the image upload or details tab.`
      );
    }
  };

  // Image File Upload Fallback using jsQR
  const handleQrFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessingQr(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleProcessQrString(code.data);
        } else {
          setIsProcessingQr(false);
          setVerificationStatus('NOT_FOUND');
          setStatusMessage('No valid or readable QR code was detected in the uploaded image. Please ensure the QR code is clearly visible, or verify using certificate details.');
        }
      };
      img.onerror = () => {
        setIsProcessingQr(false);
        setVerificationStatus('INVALID_CERTIFICATE');
        setStatusMessage('Unable to read image file. Please provide a clear PNG, JPG, or WebP file.');
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
            <h1>Certificate Verification</h1>
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

            {/* SHORT INSTRUCTIONS: HOW VERIFICATION WORKS */}
            <div className="verification-guide-grid">
              <div className="verification-guide-card">
                <div className="verification-step-badge">1</div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block' }}>Choose Verification Method</strong>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.4 }}>
                    Input the Certificate Serial Number / Roll Number or point your device camera at the tamper-evident QR code.
                  </p>
                </div>
              </div>

              <div className="verification-guide-card">
                <div className="verification-step-badge">2</div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block' }}>Central Registry Ledger Lookup</strong>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.4 }}>
                    Our secure engine validates the cryptographic SHA-256 seal against verified NCTMS National Council records.
                  </p>
                </div>
              </div>

              <div className="verification-guide-card">
                <div className="verification-step-badge">3</div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#0b326b', display: 'block' }}>Instant Status &amp; Authenticity</strong>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.4 }}>
                    Receive immediate confirmation of graduation status, qualification details, and official council credentials.
                  </p>
                </div>
              </div>
            </div>

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
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                  Enter the complete Certificate Serial Number or Roll Number as printed on the official parchment.
                </p>

                <form onSubmit={handleDetailsSubmit} className="verify-input-group">
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <label htmlFor={idInputId} style={{ display: 'none' }}>Certificate or Roll Number</label>
                    <input
                      id={idInputId}
                      type="text"
                      placeholder="e.g. NCTMS2026CS1092 or NCTMS/TN/CERT/2026/89412"
                      value={searchIdentifier}
                      onChange={(e) => setSearchIdentifier(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ minWidth: '200px' }}>
                    <label htmlFor={certTypeSelectId} style={{ display: 'none' }}>Certificate Type</label>
                    <select
                      id={certTypeSelectId}
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="payment-select"
                      style={{ width: '100%', padding: '10px 12px' }}
                    >
                      {CERTIFICATE_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ minWidth: '180px' }}>
                    <label htmlFor={sessionSelectId} style={{ display: 'none' }}>Examination Session</label>
                    <select
                      id={sessionSelectId}
                      value={issueSession}
                      onChange={(e) => setIssueSession(e.target.value)}
                      className="payment-select"
                      style={{ width: '100%', padding: '10px 12px' }}
                    >
                      {EXAMINATION_SESSIONS.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                    Verify Credentials &rarr;
                  </button>
                </form>

                {/* Sample Quick Chips for Testing (including valid, revoked, unreleased, offline) */}
                <div className="verify-samples-row" style={{ marginTop: '16px' }}>
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
                    🟢 NCTMS/TN/CERT/2026/89412 (Cert Serial)
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
                  <button
                    type="button"
                    className="sample-chip"
                    onClick={() => handleSelectSample('SERVICE_DOWN')}
                    style={{ borderColor: '#fed7aa', color: '#c2410c' }}
                  >
                    ⚠️ Outage Simulation (Offline)
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

                {/* Camera Permission Feedback & Fallback Option */}
                {cameraPermissionError && (
                  <div className="payment-alert-error" style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '20px' }}>⚠️</span>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '4px' }}>Camera Permission Required</strong>
                        <span>{cameraPermissionError}</span>
                        <div style={{ marginTop: '10px' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              stopCamera();
                              setActiveMethod('details');
                            }}
                            style={{ padding: '6px 14px', fontSize: '12px' }}
                          >
                            &larr; Switch to Manual Certificate Details
                          </button>
                        </div>
                      </div>
                    </div>
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
                    Supported formats: PNG, JPG, JPEG, WebP (Instant auto-decode)
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

            {/* STATE 1: LOADING */}
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

            {/* STATE 2: SERVICE UNAVAILABLE */}
            {verificationStatus === 'UNAVAILABLE' && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '28px', textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>🔧</span>
                <h3 style={{ color: '#92400e', fontSize: '19px', marginBottom: '6px', fontWeight: 800 }}>
                  Verification Service Temporarily Unavailable
                </h3>
                <p style={{ fontSize: '13.5px', color: '#78350f', maxWidth: '620px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                  {statusMessage || 'The National Academic Registry verification service is undergoing scheduled database maintenance. Please retry in a few moments or contact the Council Secretariat desk.'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSelectSample('NCTMS2026CS1092')}
                  >
                    🔄 Retry Verification
                  </button>
                  <Link to="/contact" className="btn-secondary">
                    Contact Examination Secretariat
                  </Link>
                </div>
              </div>
            )}

            {/* STATE 3: INVALID CERTIFICATE FORMAT */}
            {verificationStatus === 'INVALID_CERTIFICATE' && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '10px', padding: '28px', textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>🚫</span>
                <h3 style={{ color: '#b91c1c', fontSize: '19px', marginBottom: '6px', fontWeight: 800 }}>
                  Invalid Certificate Format: &ldquo;{searchedKey}&rdquo;
                </h3>
                <p style={{ fontSize: '13.5px', color: '#7f1d1d', maxWidth: '620px', margin: '0 auto 16px', lineHeight: 1.5 }}>
                  {statusMessage || 'The entered identifier is malformed and does not conform to official NCTMS India credential syntax rules. Please verify the serial number printed on your parchment.'}
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleSelectSample('NCTMS2026CS1092')}
                >
                  Load Valid Test Certificate (NCTMS2026CS1092)
                </button>
              </div>
            )}

            {/* STATE 4: NOT FOUND / UNVERIFIED */}
            {(verificationStatus === 'NOT_FOUND' || verificationStatus === 'INVALID_INPUT' || verificationStatus === 'UNTRUSTED_QR') && (
              <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '10px', padding: '28px', textAlign: 'center', marginBottom: '30px' }}>
                <span style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>⚠️</span>
                <h3 style={{ color: '#b91c1c', fontSize: '19px', marginBottom: '6px', fontWeight: 800 }}>
                  Certificate Not Found: &ldquo;{searchedKey}&rdquo;
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

            {/* STATE 5: REVOKED OR CANCELLED STATUS */}
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

            {/* STATE 6: PENDING / UNDER SCRUTINY */}
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

            {/* STATE 7: VERIFIED OFFICIAL RECORD (PUBLIC VIEW) */}
            {verificationStatus === 'VERIFIED' && verifiedRecord && (
              <div className="cert-sheet">
                
                {/* Official Letterhead */}
                <div className="cert-header">
                  <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" className="cert-emblem" />
                  <h2 className="cert-council-title">NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES</h2>
                  <p className="cert-council-sub">An Autonomous National Academic Body Registered under Govt. of India Act</p>
                  <p style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                    CENTRAL EXAMINATION DIVISION &bull; OFFICIAL PUBLIC VERIFICATION RECORD
                  </p>
                </div>

                {/* Status Ribbon */}
                <div className="cert-status-ribbon">
                  <strong>
                    <span style={{ fontSize: '16px' }}>✓</span> {verifiedRecord.status.toUpperCase()}
                  </strong>
                  <span>Issued on: {verifiedRecord.issueDate} &bull; Serial: {verifiedRecord.certificateNo}</span>
                </div>

                {/* Candidate & Course Profile - Approved Public Verification Fields */}
                <div className="cert-profile-grid">
                  <div className="profile-row">
                    <span className="profile-label">Student Name:</span>
                    <span className="profile-val">{verifiedRecord.studentName}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Certificate Serial No:</span>
                    <span className="profile-val" style={{ fontFamily: 'monospace' }}>{verifiedRecord.certificateNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Roll / Register No:</span>
                    <span className="profile-val" style={{ fontFamily: 'monospace' }}>{verifiedRecord.rollNo}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Enrollment ID:</span>
                    <span className="profile-val" style={{ fontFamily: 'monospace', color: '#475569' }}>
                      {maskEnrollment(verifiedRecord.enrollmentNo)}
                    </span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Course / Qualification:</span>
                    <span className="profile-val">{verifiedRecord.courseName} ({verifiedRecord.courseCode})</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Academic Department:</span>
                    <span className="profile-val">{verifiedRecord.department}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Issuing Institution:</span>
                    <span className="profile-val">{verifiedRecord.affiliatedCenter}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Month &amp; Year of Exam:</span>
                    <span className="profile-val">{verifiedRecord.examinationMonthYear}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Date of Certificate Issue:</span>
                    <span className="profile-val">{verifiedRecord.issueDate}</span>
                  </div>
                  <div className="profile-row">
                    <span className="profile-label">Current Certificate Status:</span>
                    <span className="profile-val" style={{ color: '#16a34a', fontWeight: 800 }}>{verifiedRecord.status}</span>
                  </div>
                </div>

                {/* Marks Breakdown Table */}
                {verifiedRecord.marks && verifiedRecord.marks.length > 0 && (
                  <>
                    <h4 style={{ fontSize: '14px', color: '#0b326b', marginBottom: '8px' }}>
                      Subject-Wise Evaluation &amp; Grade Record:
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
                    🖨️ Print Verified Document
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary"
                    onClick={() => alert(`Official digital certificate PDF downloaded for ${verifiedRecord.studentName} (${verifiedRecord.rollNo})`)}
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

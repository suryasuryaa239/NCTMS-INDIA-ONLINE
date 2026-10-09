// src/pages/OnlinePaymentPage.jsx
import React, { useState, useMemo, useId } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import { useAuth } from '../context/AuthContext';
import {
  PAYMENT_CATEGORIES,
  DEMO_VERIFIED_STUDENTS,
  PAYMENT_FAQ
} from '../data/paymentData';
import {
  createPaymentOrder,
  verifyAndProcessPayment,
  getSavedTransactions,
  getStudentPaymentHistory
} from '../services/paymentService';

export default function OnlinePaymentPage() {
  const { currentUser } = useAuth();

  // Active Top Tab: 'pay' | 'history' | 'structure'
  const [activeTab, setActiveTab] = useState('pay');

  // Fee category filter in checkout tab
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Lazy Initializers from Authenticated User
  const [studentId, setStudentId] = useState(() => {
    if (currentUser?.role === 'student') return currentUser.id || 'NCTMS2026CS1092';
    if (currentUser?.role === 'institution') return currentUser.id || 'NCTMS-TN-104';
    return '';
  });

  const [payerName, setPayerName] = useState(() => {
    if (currentUser?.role === 'student') return currentUser.name || 'Alexander James Thompson';
    if (currentUser?.role === 'institution') return currentUser.name || 'National Academy Chennai';
    return '';
  });

  const [mobile, setMobile] = useState(() => {
    if (currentUser?.role === 'student') return '+91 98401 23456';
    if (currentUser?.role === 'institution') return '+91 98401 99881';
    return '';
  });

  const [email, setEmail] = useState(() => {
    return currentUser?.email || '';
  });

  const [selectedFeeCode, setSelectedFeeCode] = useState(() => {
    if (currentUser?.role === 'institution') return 'FEE-AFF-01';
    return 'FEE-EXM-01';
  });

  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'neft'
  const [remarks, setRemarks] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Student auto-lookup feedback
  const [verifiedRecord, setVerifiedRecord] = useState(() => {
    const defaultId = currentUser?.id || (currentUser?.role === 'student' ? 'NCTMS2026CS1092' : '');
    return defaultId && DEMO_VERIFIED_STUDENTS[defaultId] ? DEMO_VERIFIED_STUDENTS[defaultId] : null;
  });

  const [formError, setFormError] = useState('');

  // Active Order & Gateway Checkout States
  const [activeOrder, setActiveOrder] = useState(null);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [gatewayState, setGatewayState] = useState('READY'); // 'READY' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  const [gatewayResult, setGatewayResult] = useState(null);

  // Receipt Modal
  const [receiptToView, setReceiptToView] = useState(null);

  // Payment History Search Filter
  const [historySearchId, setHistorySearchId] = useState(() => {
    if (currentUser?.id) return currentUser.id;
    return 'NCTMS2026CS1092';
  });

  // Form element IDs for accessibility
  const studentIdInputId = useId();
  const payerNameInputId = useId();
  const mobileInputId = useId();
  const emailInputId = useId();
  const feeSelectId = useId();
  const historySearchInputId = useId();

  // Selected fee details from authoritative list
  const selectedFee =
    PAYMENT_CATEGORIES.find((item) => item.code === selectedFeeCode) ||
    PAYMENT_CATEGORIES[0];

  // Unique categories for pills
  const categoriesList = [
    'All',
    'Admission',
    'Tuition',
    'Examination',
    'Certificates',
    'Convocations',
    'Institutional'
  ];

  // Filtered fee options based on selected category pill
  const filteredFees = PAYMENT_CATEGORIES.filter(
    (item) => categoryFilter === 'All' || item.category === categoryFilter
  );

  // Derived student payment history list
  const historyList = useMemo(() => {
    if (historySearchId.trim()) {
      return getStudentPaymentHistory(historySearchId.trim());
    }
    if (currentUser && currentUser.role === 'student') {
      return getStudentPaymentHistory(currentUser.id || 'NCTMS2026CS1092');
    }
    return getSavedTransactions().slice(0, 10);
  }, [historySearchId, currentUser]);

  // Handle student record lookup
  const handleLookupStudent = (idToLookup) => {
    const target = (idToLookup || studentId).trim().toUpperCase();
    if (!target) return;

    if (DEMO_VERIFIED_STUDENTS[target]) {
      const record = DEMO_VERIFIED_STUDENTS[target];
      setVerifiedRecord(record);
      setPayerName(record.name);
      setMobile(record.mobile);
      setEmail(record.email);
      if (record.recommendedFee) {
        setSelectedFeeCode(record.recommendedFee);
      }
      setFormError('');
    } else {
      setVerifiedRecord(null);
    }
  };

  // Step 1: Create Order & Open Gateway
  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!studentId.trim()) {
      setFormError('Please enter a valid Student Roll Number or Application ID.');
      return;
    }
    if (!payerName.trim()) {
      setFormError('Please enter candidate / payer full name.');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      setFormError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!termsAgreed) {
      setFormError('Please accept the council payment terms and examination guidelines.');
      return;
    }

    try {
      // Create idempotent order token
      const idempotencyKey = `IDEM-${studentId.trim()}-${selectedFee.code}-${Date.now()}`;
      const order = await createPaymentOrder({
        studentId,
        feeCode: selectedFee.code,
        payerName,
        mobile,
        email,
        idempotencyKey,
        remarks
      });

      setActiveOrder(order);
      setGatewayState('READY');
      setGatewayResult(null);
      setCheckoutModalOpen(true);
    } catch (err) {
      setFormError(err.message || 'Failed to initialize payment order.');
    }
  };

  // Step 2: Simulate Gateway Processing & Verification
  const handleProcessGatewayAction = async (outcome) => {
    if (!activeOrder) return;
    setGatewayState('PROCESSING');

    try {
      const result = await verifyAndProcessPayment({
        order: activeOrder,
        paymentMode,
        simulateOutcome: outcome // 'success' | 'failed' | 'cancelled'
      });

      setGatewayResult(result);
      if (result.status === 'SUCCESS') {
        setGatewayState('SUCCESS');
      } else if (result.status === 'FAILED') {
        setGatewayState('FAILED');
      } else if (result.status === 'CANCELLED') {
        setGatewayState('CANCELLED');
      }
    } catch (err) {
      setGatewayState('FAILED');
      setGatewayResult({
        status: 'FAILED',
        message: err.message || 'Payment communication error.'
      });
    }
  };

  // View Receipt for printing
  const handleOpenReceipt = (txn) => {
    setReceiptToView(txn);
  };

  return (
    <PublicLayout>
      {/* 1. PAGE HEADER */}
      <section className="subpage-hero">
        <div className="container subpage-hero-container">
          <div>
            <nav className="subpage-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link> &rsaquo; <span>Online Payment</span>
            </nav>
            <h1>NCTMS Online Payment Portal</h1>
            <p className="subpage-hero-subtitle">
              Central electronic remittance desk for student admissions, semester tuition, examination proctoring, certification fees, and center affiliations.
            </p>
          </div>
          <div className="subpage-hero-badge" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🛡️</span>
              <strong style={{ fontSize: '14px', color: '#ffffff' }}>PCI-DSS Level 1 Gateway</strong>
            </div>
            <span style={{ fontSize: '12px', color: '#bfdbfe' }}>
              256-Bit SSL &bull; Zero Gateway Surcharge &bull; Instant Receipt
            </span>
          </div>
        </div>
      </section>

      {/* 2. SECTION TABS */}
      <div className="container" style={{ marginTop: '28px' }}>
        <div className="apps-tabs-bar" role="tablist" aria-label="Payment Sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pay'}
            className={`apps-tab-btn ${activeTab === 'pay' ? 'active' : ''}`}
            onClick={() => setActiveTab('pay')}
          >
            💳 Pay Fees Online
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            className={`apps-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 Payment History &amp; Receipts
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'structure'}
            className={`apps-tab-btn ${activeTab === 'structure' ? 'active' : ''}`}
            onClick={() => setActiveTab('structure')}
          >
            📋 Official Fee Schedule &amp; FAQ
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PAY FEES ONLINE (CHECKOUT FORM + ORDER SUMMARY)
            ========================================================================= */}
        {activeTab === 'pay' && (
          <div style={{ marginTop: '24px' }}>
            {/* Notice Callout */}
            <div className="payment-instructions-callout">
              <div className="payment-instructions-icon">💡</div>
              <div>
                <strong>Important Council Fee Payment Instructions:</strong>
                <p>
                  1. Payments are credited immediately to student academic ledgers with an official E-Receipt issued upon payment confirmation.<br />
                  2. Council policy enforces <strong>zero gateway convenience surcharge</strong> — you pay exactly the statutory fee.<br />
                  3. Never share your OTP, UPI MPIN, or debit card CVV with anyone. NCTMS officials never ask for secret credentials.
                </p>
              </div>
            </div>

            {formError && (
              <div className="payment-alert-error" role="alert">
                <span>⚠️</span>
                <div>{formError}</div>
              </div>
            )}

            <div className="payment-portal-grid">
              {/* Left Column: Payment Details Form */}
              <div className="payment-form-card">
                <div className="payment-card-header">
                  <h2 style={{ fontSize: '18px', margin: 0, color: '#0b326b', fontWeight: 800 }}>
                    1. Student &amp; Fee Details
                  </h2>
                  <span className="secure-badge">
                    🔒 SSL Secured
                  </span>
                </div>

                <form onSubmit={handleInitiatePayment}>
                  {/* Student / Application ID */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label htmlFor={studentIdInputId} style={{ fontWeight: 700, fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Student Roll No / Application ID *</span>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>
                        Try: NCTMS2026CS1092, NCTMS-APP-2026-8841
                      </span>
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        id={studentIdInputId}
                        type="text"
                        placeholder="e.g. NCTMS2026CS1092 or NCTMS-APP-2026-8841"
                        value={studentId}
                        onChange={(e) => {
                          setStudentId(e.target.value);
                          handleLookupStudent(e.target.value);
                        }}
                        onBlur={() => handleLookupStudent(studentId)}
                        required
                        className="payment-input"
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => handleLookupStudent(studentId)}
                        style={{ whiteSpace: 'nowrap', padding: '0 14px', fontSize: '12px' }}
                      >
                        🔍 Verify
                      </button>
                    </div>

                    {/* Verified candidate callout */}
                    {verifiedRecord && (
                      <div className="verified-student-callout">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#15803d' }}>
                          <span>✓</span> Verified Council Student Record
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color: '#1e3a8a' }}>
                          <strong>{verifiedRecord.name}</strong> &bull; {verifiedRecord.course}
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                          Center: {verifiedRecord.center}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Candidate Name */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label htmlFor={payerNameInputId} style={{ fontWeight: 700, fontSize: '13px' }}>
                      Candidate / Payer Full Name *
                    </label>
                    <input
                      id={payerNameInputId}
                      type="text"
                      placeholder="Candidate Name as in council records"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      required
                      className="payment-input"
                    />
                  </div>

                  {/* Contact Row */}
                  <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label htmlFor={mobileInputId} style={{ fontWeight: 700, fontSize: '13px' }}>
                        Registered Mobile Number *
                      </label>
                      <input
                        id={mobileInputId}
                        type="tel"
                        placeholder="+91 98401 23456"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        className="payment-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={emailInputId} style={{ fontWeight: 700, fontSize: '13px' }}>
                        Email for E-Receipt
                      </label>
                      <input
                        id={emailInputId}
                        type="email"
                        placeholder="candidate@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="payment-input"
                      />
                    </div>
                  </div>

                  {/* Fee Category Selector */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label htmlFor={feeSelectId} style={{ fontWeight: 700, fontSize: '13px', margin: 0 }}>
                        Payment Fee Category *
                      </label>
                      <span style={{ fontSize: '11.5px', color: '#0c57c4', fontWeight: 600 }}>
                        {PAYMENT_CATEGORIES.length} Approved Services
                      </span>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="fee-pills-bar">
                      {categoriesList.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`fee-filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                          onClick={() => setCategoryFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <select
                      id={feeSelectId}
                      value={selectedFeeCode}
                      onChange={(e) => setSelectedFeeCode(e.target.value)}
                      className="payment-select"
                      required
                    >
                      {filteredFees.map((fee) => (
                        <option key={fee.code} value={fee.code}>
                          {fee.title} ({fee.code}) &mdash; {fee.amountFormatted}
                        </option>
                      ))}
                    </select>

                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', lineHeight: 1.4 }}>
                      ℹ️ {selectedFee.description}
                    </p>
                  </div>

                  {/* Payment Mode Selection */}
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px', display: 'block' }}>
                      Select Payment Channel *
                    </label>
                    <div className="payment-channels-grid">
                      <label className={`payment-channel-card ${paymentMode === 'upi' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="upi"
                          checked={paymentMode === 'upi'}
                          onChange={() => setPaymentMode('upi')}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b326b' }}>
                            📱 UPI / QR Code
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>GPay, PhonePe, Paytm, BHIM</span>
                        </div>
                      </label>

                      <label className={`payment-channel-card ${paymentMode === 'card' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="card"
                          checked={paymentMode === 'card'}
                          onChange={() => setPaymentMode('card')}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b326b' }}>
                            💳 Debit / Credit Card
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Visa, MasterCard, RuPay</span>
                        </div>
                      </label>

                      <label className={`payment-channel-card ${paymentMode === 'netbanking' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="netbanking"
                          checked={paymentMode === 'netbanking'}
                          onChange={() => setPaymentMode('netbanking')}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b326b' }}>
                            🏦 Internet Banking
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>All Indian Scheduled Banks</span>
                        </div>
                      </label>

                      <label className={`payment-channel-card ${paymentMode === 'neft' ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="neft"
                          checked={paymentMode === 'neft'}
                          onChange={() => setPaymentMode('neft')}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#0b326b' }}>
                            📄 NEFT / RTGS Challan
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Bank Branch Remittance</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Remarks / Reference */}
                  <div className="form-group" style={{ marginBottom: '18px' }}>
                    <label style={{ fontWeight: 700, fontSize: '13px' }}>
                      Additional Remarks / Term Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. October 2026 Examination Term, Roll CS1092"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="payment-input"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        style={{ marginTop: '2px' }}
                      />
                      <span>
                        I confirm that the details provided are accurate. I understand that fees once paid are non-transferable according to Central Academic Council regulations.
                      </span>
                    </label>
                  </div>

                  {/* Submit Action */}
                  <button type="submit" className="btn-primary full-btn" style={{ padding: '14px', fontSize: '15px' }}>
                    Proceed to Payment Gateway &bull; {selectedFee.amountFormatted} &rarr;
                  </button>
                </form>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="payment-summary-col">
                <div className="order-summary-card">
                  <div className="summary-card-header">
                    <h2 style={{ fontSize: '16px', margin: 0, fontWeight: 800, color: '#0b326b' }}>
                      Order Summary
                    </h2>
                    <span className="live-status-pill">
                      🟢 Ready for Remittance
                    </span>
                  </div>

                  <div className="summary-item-block">
                    <span className="summary-label">Selected Fee Service</span>
                    <strong className="summary-val-title">{selectedFee.title}</strong>
                    <span className="summary-val-sub">Code: {selectedFee.code} &bull; {selectedFee.category}</span>
                  </div>

                  <div className="summary-item-block">
                    <span className="summary-label">Candidate Reference</span>
                    <strong style={{ color: '#0b326b' }}>
                      {payerName || 'Candidate Name'}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      ID: {studentId || 'Not Specified'}
                    </span>
                  </div>

                  <div className="summary-item-block">
                    <span className="summary-label">Expected Processing Time</span>
                    <span style={{ fontSize: '12.5px', color: '#16a34a', fontWeight: 600 }}>
                      ⚡ {selectedFee.turnaround}
                    </span>
                  </div>

                  <hr className="summary-divider" />

                  {/* Calculations breakdown */}
                  <div className="summary-breakdown">
                    <div className="breakdown-row">
                      <span>Statutory Base Fee</span>
                      <span>{selectedFee.amountFormatted}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Gateway Convenience Surcharge</span>
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>₹ 0.00 (Waived)</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Council Service Tax / GST</span>
                      <span style={{ color: '#64748b' }}>Included</span>
                    </div>
                    <hr className="summary-divider" style={{ margin: '10px 0' }} />
                    <div className="breakdown-row total-row">
                      <strong>Total Amount Payable</strong>
                      <strong className="total-amount-highlight">{selectedFee.amountFormatted}</strong>
                    </div>
                  </div>

                  {/* Security Seals */}
                  <div className="security-assurance-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0b326b', fontWeight: 700, fontSize: '12px' }}>
                      <span>🛡️</span> Council Security Guarantee
                    </div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0', lineHeight: 1.4 }}>
                      Encrypted transmission via RBI-regulated payment aggregators. NCTMS will generate a digitally signed e-challan receipt with QR verification immediately upon bank settlement.
                    </p>
                  </div>
                </div>

                {/* Quick Help Card */}
                <div className="payment-help-card">
                  <h3 style={{ fontSize: '14px', margin: '0 0 6px', color: '#0b326b', fontWeight: 700 }}>
                    Need Payment Assistance?
                  </h3>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
                    If you encounter a bank debit without receipt generation, contact our finance cell with your transaction UTR:
                  </p>
                  <div style={{ fontSize: '12px', color: '#0c57c4', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>✉️ accounts@nctms.in</span>
                    <span>📞 +91 44 2855 0192 (Mon-Sat 9AM-6PM)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: PAYMENT HISTORY & RECEIPTS (SEARCH + LEDGER TABLE)
            ========================================================================= */}
        {activeTab === 'history' && (
          <div style={{ marginTop: '24px' }}>
            <div className="apps-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 className="apps-section-title">
                  <span>📜</span> Student Payment Ledger &amp; Official Receipts
                </h2>
                <p className="apps-section-subtitle">
                  Verify authentic past remittances, view settlement timestamps, and print digitally signed E-Fee receipts.
                </p>
              </div>

              {/* Search by Roll Number */}
              <div style={{ display: 'flex', gap: '8px', minWidth: '320px' }}>
                <input
                  id={historySearchInputId}
                  type="text"
                  placeholder="Enter Student Roll / App ID (e.g. NCTMS2026CS1092)"
                  value={historySearchId}
                  onChange={(e) => setHistorySearchId(e.target.value)}
                  className="payment-input"
                  style={{ fontSize: '12px', padding: '8px 12px' }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    // Query is already reactive with historySearchId
                  }}
                  style={{ whiteSpace: 'nowrap', padding: '8px 16px', fontSize: '12px' }}
                >
                  Filter Ledger
                </button>
              </div>
            </div>

            {/* History Table */}
            {historyList.length === 0 ? (
              <div className="apps-empty-state" style={{ background: '#ffffff', padding: '40px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '42px', marginBottom: '12px' }}>🔍</div>
                <h3 style={{ color: '#0b326b', margin: '0 0 6px' }}>No Payment Records Found</h3>
                <p style={{ color: '#64748b', fontSize: '13px', maxWidth: '420px', margin: '0 auto 16px' }}>
                  No transaction records matched ID: <strong>{historySearchId || 'Empty Query'}</strong>. Verify the enrollment number or make a new fee payment.
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setHistorySearchId('NCTMS2026CS1092');
                  }}
                >
                  Load Sample Student History (NCTMS2026CS1092)
                </button>
              </div>
            ) : (
              <div className="payment-history-table-wrap">
                <table className="payment-history-table">
                  <thead>
                    <tr>
                      <th>Date &amp; Time</th>
                      <th>Transaction ID / Receipt</th>
                      <th>Student / Payer</th>
                      <th>Fee Category</th>
                      <th>Amount</th>
                      <th>Payment Channel</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.map((txn) => (
                      <tr key={txn.txnId}>
                        <td style={{ fontSize: '12px', color: '#475569', whiteSpace: 'nowrap' }}>
                          {txn.date}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0b326b', fontSize: '12.5px' }}>
                            {txn.receiptNo}
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                            {txn.txnId}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '12.5px', color: '#1e293b' }}>
                            {txn.payerName}
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            {txn.studentId}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>
                            {txn.category}
                          </span>
                        </td>
                        <td>
                          <strong style={{ fontSize: '13px', color: '#0b326b' }}>
                            {txn.amountFormatted}
                          </strong>
                        </td>
                        <td>
                          <span style={{ fontSize: '11.5px', color: '#475569' }}>
                            {txn.paymentMode}
                          </span>
                        </td>
                        <td>
                          <span className="payment-status-pill success">
                            ✓ {txn.status || 'PAID'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleOpenReceipt(txn)}
                            style={{ fontSize: '11.5px', padding: '6px 12px' }}
                          >
                            🖨️ View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: OFFICIAL FEE SCHEDULE & FAQ
            ========================================================================= */}
        {activeTab === 'structure' && (
          <div style={{ marginTop: '24px' }}>
            <div className="apps-section-header">
              <h2 className="apps-section-title">
                <span>📋</span> Approved Central Council Fee Schedule
              </h2>
              <p className="apps-section-subtitle">
                Official statutory tariffs mandated by the Central Governing Council. No additional surcharges are levied.
              </p>
            </div>

            <div className="fee-schedule-table-wrap">
              <table className="fee-schedule-table">
                <thead>
                  <tr>
                    <th>Fee Code</th>
                    <th>Service Category</th>
                    <th>Fee Description</th>
                    <th>Eligible Candidates</th>
                    <th>Processing Turnaround</th>
                    <th style={{ textAlign: 'right' }}>Statutory Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {PAYMENT_CATEGORIES.map((item) => (
                    <tr key={item.code}>
                      <td>
                        <span className="fee-code-badge">{item.code}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0b326b' }}>
                        {item.title}
                      </td>
                      <td style={{ fontSize: '12.5px', color: '#475569' }}>
                        {item.description}
                      </td>
                      <td style={{ fontSize: '12px', color: '#64748b' }}>
                        {item.eligiblePayer}
                      </td>
                      <td style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>
                        {item.turnaround}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#0b326b', fontSize: '14px' }}>
                        {item.amountFormatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FAQs Accordion / Grid */}
            <div style={{ marginTop: '36px' }}>
              <div className="apps-section-header">
                <h3 className="apps-section-title" style={{ fontSize: '18px' }}>
                  <span>❓</span> Frequently Asked Payment Questions
                </h3>
              </div>
              <div className="payment-faq-grid">
                {PAYMENT_FAQ.map((faq, idx) => (
                  <div key={idx} className="payment-faq-card">
                    <h4 style={{ fontSize: '14px', margin: '0 0 8px', color: '#0b326b', fontWeight: 700 }}>
                      {faq.q}
                    </h4>
                    <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. GATEWAY CHECKOUT & VERIFICATION DIALOG MODAL
          ========================================================================= */}
      {checkoutModalOpen && activeOrder && (
        <div className="modal-backdrop" onClick={() => {
          if (gatewayState !== 'PROCESSING') setCheckoutModalOpen(false);
        }}>
          <div className="modal-box" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="gateway-modal-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS" width="36" height="36" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0b326b', fontWeight: 800 }}>
                    NCTMS Central Fee Gateway
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    Order ID: {activeOrder.orderId}
                  </span>
                </div>
              </div>
              {gatewayState !== 'PROCESSING' && (
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setCheckoutModalOpen(false)}
                >
                  &times;
                </button>
              )}
            </div>

            {/* STATE A: READY TO AUTHORIZE */}
            {gatewayState === 'READY' && (
              <div style={{ padding: '16px 0 0' }}>
                <div className="gateway-amount-banner">
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>AMOUNT PAYABLE</span>
                  <div className="gateway-amount-text">
                    ₹ {activeOrder.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span style={{ fontSize: '11px', color: '#0c57c4' }}>
                    {activeOrder.feeTitle} &bull; {activeOrder.payerName}
                  </span>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                    <strong>Selected Payment Mode:</strong>{' '}
                    {paymentMode === 'upi'
                      ? 'UPI / Instant QR Code'
                      : paymentMode === 'card'
                      ? 'Credit / Debit Card (PCI-DSS 3DS)'
                      : paymentMode === 'netbanking'
                      ? 'Internet Banking'
                      : 'NEFT / RTGS Challan'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                    Channel verification will be initiated on RBI-regulated aggregator sandbox.
                  </div>
                </div>

                {/* Sandbox / Testing Action Buttons as requested in prompt */}
                <div style={{ border: '1px dashed #cbd5e1', padding: '14px', borderRadius: '8px', background: '#f8fafc', marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Gateway Sandbox Simulation Controls
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ background: '#16a34a', borderColor: '#15803d' }}
                      onClick={() => handleProcessGatewayAction('success')}
                    >
                      🟢 Authorize Payment (Simulate Success)
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ color: '#dc2626', borderColor: '#fca5a5', background: '#fef2f2' }}
                      onClick={() => handleProcessGatewayAction('failed')}
                    >
                      🔴 Simulate Bank Decline / Error (Test Failure)
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => handleProcessGatewayAction('cancelled')}
                    >
                      ⚪ Dismiss / Cancel Payment (Test Cancel)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE B: PROCESSING */}
            {gatewayState === 'PROCESSING' && (
              <div style={{ textAlign: 'center', padding: '36px 10px' }}>
                <div className="gateway-spinner" />
                <h3 style={{ color: '#0b326b', fontSize: '17px', margin: '16px 0 6px' }}>
                  Communicating with Payment Aggregator...
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', maxWidth: '340px', margin: '0 auto' }}>
                  Verifying cryptographic signature with NCTMS academic controller server. Please do not refresh or hit back button.
                </p>
              </div>
            )}

            {/* STATE C: SUCCESS */}
            {gatewayState === 'SUCCESS' && gatewayResult && (
              <div style={{ textAlign: 'center', padding: '16px 10px' }}>
                <div className="gateway-success-icon">✓</div>
                <h3 style={{ color: '#15803d', fontSize: '20px', margin: '10px 0 6px', fontWeight: 800 }}>
                  Fee Remittance Successful!
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 16px' }}>
                  Your fee payment has been confirmed and credited to the council ledger.
                </p>

                <div className="gateway-receipt-summary">
                  <div className="receipt-row">
                    <span>Official Receipt No:</span>
                    <strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>
                      {gatewayResult.transaction.receiptNo}
                    </strong>
                  </div>
                  <div className="receipt-row">
                    <span>Transaction ID:</span>
                    <span style={{ fontFamily: 'monospace' }}>
                      {gatewayResult.transaction.txnId}
                    </span>
                  </div>
                  <div className="receipt-row">
                    <span>Payer Name:</span>
                    <span>{gatewayResult.transaction.payerName}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Amount Paid:</span>
                    <strong>{gatewayResult.transaction.amountFormatted}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Mode:</span>
                    <span>{gatewayResult.transaction.paymentMode}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '18px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setReceiptToView(gatewayResult.transaction);
                    }}
                  >
                    🖨️ View &amp; Print E-Receipt
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setCheckoutModalOpen(false);
                      setActiveTab('history');
                      setHistorySearchId(gatewayResult.transaction.studentId);
                    }}
                  >
                    📜 Go to Ledger History
                  </button>
                </div>
              </div>
            )}

            {/* STATE D: FAILED */}
            {gatewayState === 'FAILED' && (
              <div style={{ textAlign: 'center', padding: '16px 10px' }}>
                <div className="gateway-error-icon">✕</div>
                <h3 style={{ color: '#dc2626', fontSize: '19px', margin: '10px 0 6px', fontWeight: 800 }}>
                  Payment Authorization Failed
                </h3>
                <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 16px' }}>
                  {gatewayResult?.message || 'Your bank declined the transaction. No charges were debited.'}
                </p>

                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#991b1b', marginBottom: '16px', textAlign: 'left' }}>
                  <strong>Troubleshooting Advice:</strong>
                  <ul style={{ paddingLeft: '18px', margin: '6px 0 0' }}>
                    <li>Ensure sufficient balance or credit limit in your bank account.</li>
                    <li>Verify daily UPI transaction limits set by your bank.</li>
                    <li>You may safely retry without fear of duplicate charges.</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => setGatewayState('READY')}
                  >
                    🔄 Retry Payment Safely
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setCheckoutModalOpen(false)}
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}

            {/* STATE E: CANCELLED */}
            {gatewayState === 'CANCELLED' && (
              <div style={{ textAlign: 'center', padding: '16px 10px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 12px' }}>
                  ⚠️
                </div>
                <h3 style={{ color: '#92400e', fontSize: '18px', margin: '0 0 6px', fontWeight: 700 }}>
                  Payment Window Dismissed
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px' }}>
                  You cancelled the payment request. No amount has been deducted.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => setGatewayState('READY')}
                  >
                    Resume Checkout
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setCheckoutModalOpen(false)}
                  >
                    Back to Form
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          5. OFFICIAL E-RECEIPT PRINT MODAL
          ========================================================================= */}
      {receiptToView && (
        <div className="modal-backdrop" onClick={() => setReceiptToView(null)}>
          <div className="modal-box large-modal receipt-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ fontWeight: 700, color: '#0b326b', fontSize: '14px' }}>
                📄 Official NCTMS E-Fee Receipt Preview
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px' }}
                  onClick={() => window.print()}
                >
                  🖨️ Print Receipt
                </button>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setReceiptToView(null)}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Printable Receipt Canvas */}
            <div className="printable-receipt-canvas">
              {/* Receipt Header */}
              <div className="receipt-header">
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="60" height="60" />
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '18px', color: '#0b326b', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>
                    National Council for Technical &amp; Management Studies
                  </h2>
                  <p style={{ fontSize: '11px', color: '#475569', margin: '2px 0 0' }}>
                    An Autonomous Institution Registered under Govt. of India Act &bull; New Delhi &amp; Chennai
                  </p>
                  <p style={{ fontSize: '10px', color: '#64748b', margin: '2px 0 0', fontWeight: 600 }}>
                    COUNCIL GSTIN: 33AAACN1924M1Z2 &bull; ACCOUNTS &amp; FINANCE CONTROLLER DESK
                  </p>
                </div>
                <div style={{ width: '60px', height: '60px', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', textAlign: 'center', color: '#64748b' }}>
                  QR CODE<br />VERIFIED
                </div>
              </div>

              <div className="receipt-title-bar">
                <span>OFFICIAL ELECTRONIC FEE REMITTANCE RECEIPT</span>
              </div>

              {/* Receipt Meta Details */}
              <div className="receipt-meta-grid">
                <div>
                  <strong>Receipt No:</strong> <span style={{ fontFamily: 'monospace' }}>{receiptToView.receiptNo}</span>
                </div>
                <div>
                  <strong>Date &amp; Time:</strong> <span>{receiptToView.date}</span>
                </div>
                <div>
                  <strong>Transaction ID:</strong> <span style={{ fontFamily: 'monospace' }}>{receiptToView.txnId}</span>
                </div>
                <div>
                  <strong>Payment Channel:</strong> <span>{receiptToView.paymentMode}</span>
                </div>
              </div>

              {/* Payer Details */}
              <div className="receipt-payer-box">
                <table style={{ width: '100%', fontSize: '12px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '22%', color: '#64748b', padding: '3px 0' }}>Candidate Name:</td>
                      <td style={{ fontWeight: 700, color: '#0b326b' }}>{receiptToView.payerName}</td>
                      <td style={{ width: '20%', color: '#64748b', padding: '3px 0' }}>Roll / App ID:</td>
                      <td style={{ fontWeight: 700, color: '#0b326b' }}>{receiptToView.studentId}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#64748b', padding: '3px 0' }}>Contact Mobile:</td>
                      <td>{receiptToView.mobile || 'Registered Mobile'}</td>
                      <td style={{ color: '#64748b', padding: '3px 0' }}>Payment Gateway Ref:</td>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{receiptToView.gatewayRef || 'pg_ref_online'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Itemized Table */}
              <table className="receipt-item-table">
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Sl. No</th>
                    <th>Fee Service Description</th>
                    <th style={{ width: '18%' }}>Fee Code</th>
                    <th style={{ width: '22%', textAlign: 'right' }}>Amount Paid (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <strong>{receiptToView.category}</strong>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                        Statutory council educational &amp; examination fee
                      </div>
                    </td>
                    <td style={{ fontFamily: 'monospace' }}>{receiptToView.feeCode || 'FEE-GENERAL'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{receiptToView.amountFormatted}</td>
                  </tr>
                  <tr style={{ background: '#f8fafc' }}>
                    <td colSpan="3" style={{ textAlign: 'right', fontWeight: 700 }}>Total Remitted:</td>
                    <td style={{ textAlign: 'right', fontWeight: 900, color: '#0b326b', fontSize: '13px' }}>
                      {receiptToView.amountFormatted}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Footer signatures */}
              <div className="receipt-footer-signatures">
                <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '320px' }}>
                  * This is an authentic computer-generated digital receipt and requires no physical ink signature. Validity can be verified at verify.nctms.in quoting Receipt No: {receiptToView.receiptNo}.
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', color: '#0c57c4' }}>🔏</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#0b326b' }}>Academic Finance Controller</div>
                  <div style={{ fontSize: '9px', color: '#64748b' }}>NCTMS India Council Secretariat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}

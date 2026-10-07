import React, { useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { STUDENT_PROFILE, STUDENT_FEES_LEDGER } from '../../data/studentData';

export default function StudentFees() {
  const student = STUDENT_PROFILE;
  const [ledger, setLedger] = useState(STUDENT_FEES_LEDGER);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payCategory, setPayCategory] = useState('Certificate & Convocation Fee - ₹ 850');
  const [payAmount, setPayAmount] = useState('₹ 850.00');
  const [payMethod, setPayMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const newTxn = {
        receiptNo: `REC-NCTMS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: payCategory,
        amount: payAmount,
        mode: payMethod === 'upi' ? 'UPI / QR Code' : payMethod === 'card' ? 'Credit/Debit Card' : 'Internet Banking',
        status: 'PAID',
        invoiceUrl: 'NCTMS_Receipt_New.pdf'
      };
      setLedger([newTxn, ...ledger]);
      setIsProcessing(false);
      setShowPayModal(false);
      setSelectedReceipt(newTxn);
    }, 1200);
  };

  return (
    <StudentLayout pageTitle="Student Fees Ledger & Payment Receipts">
      
      {/* 1. Fee Summary Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ fontSize: '22px' }}>₹ 23,200</strong>
            <span>Total Prescribed Fee</span>
          </div>
          <div className="metric-icon-wrap m-blue">
            💰
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ fontSize: '22px', color: '#16a34a' }}>₹ 23,200</strong>
            <span>Total Fees Cleared</span>
          </div>
          <div className="metric-icon-wrap m-green">
            ✓
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ fontSize: '22px', color: '#2563eb' }}>₹ 0.00</strong>
            <span>Outstanding Balance</span>
          </div>
          <div className="metric-icon-wrap m-purple">
            0
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <strong style={{ fontSize: '18px', color: '#16a34a' }}>CLEARED</strong>
            <span>No Dues Certificate Status</span>
          </div>
          <div className="metric-icon-wrap m-orange">
            📜
          </div>
        </div>
      </div>

      {/* 2. Fee Transactions History Table */}
      <div className="panel-card">
        <div className="panel-card-head">
          <h3><span>💳</span> Official Fee Payment History & Receipts</h3>
          <button 
            type="button" 
            className="btn-primary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
            onClick={() => setShowPayModal(true)}
          >
            + Pay Ancillary Fees
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cert-marks-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Receipt Number</th>
                <th>Payment Date</th>
                <th>Fee Category Description</th>
                <th>Amount Paid</th>
                <th>Payment Mode</th>
                <th>Status</th>
                <th>Invoice Action</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((item, idx) => (
                <tr key={idx}>
                  <td><strong style={{ color: '#0c57c4', fontFamily: 'monospace' }}>{item.receiptNo}</strong></td>
                  <td>{item.date}</td>
                  <td>{item.category}</td>
                  <td><strong>{item.amount}</strong></td>
                  <td>{item.mode}</td>
                  <td><span style={{ background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{item.status}</span></td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => setSelectedReceipt(item)}
                    >
                      🧾 View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Printable GST E-Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" onClick={() => setSelectedReceipt(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <button className="modal-close-btn" onClick={() => setSelectedReceipt(null)}>&times;</button>
            
            <div style={{ border: '2px solid #0b326b', padding: '22px', borderRadius: '8px', background: '#ffffff' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px solid #0b326b', paddingBottom: '10px', marginBottom: '14px' }}>
                <img src="/assets/images/nctms-logo.svg" alt="NCTMS Emblem" width="48" height="48" style={{ margin: '0 auto 4px', display: 'block' }} />
                <h3 style={{ fontSize: '16px', color: '#0b326b', fontWeight: 800 }}>NATIONAL COUNCIL FOR TECHNICAL AND MANAGEMENT STUDIES</h3>
                <p style={{ fontSize: '11.5px', color: '#475569', margin: '2px 0 0' }}>OFFICIAL E-FEE PAYMENT RECEIPT &bull; GSTIN: 33AAACN1924M1Z2</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                <div><strong>Receipt No:</strong> {selectedReceipt.receiptNo}</div>
                <div><strong>Payment Date:</strong> {selectedReceipt.date}</div>
                <div><strong>Student Name:</strong> {student.fullName}</div>
                <div><strong>Roll Number:</strong> {student.rollNo}</div>
                <div><strong>Course:</strong> {student.program}</div>
                <div><strong>Study Center:</strong> {student.centerCode}</div>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '12px', marginBottom: '16px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>Particulars: <strong>{selectedReceipt.category}</strong></span>
                  <strong>{selectedReceipt.amount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '11px', borderTop: '1px dotted #cbd5e1', paddingTop: '6px' }}>
                  <span>Payment Channel: {selectedReceipt.mode}</span>
                  <span>CGST (9%) + SGST (9%): Inclusive</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px' }}>
                <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700 }}>
                  ✓ DIGITALLY PAID & RECONCILED
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', borderBottom: '1px solid #000', marginBottom: '3px' }}></div>
                  <span style={{ fontSize: '10.5px' }}>Accounts Officer, NCTMS</span>
                </div>
              </div>

              <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => window.print()}>
                  🖨️ Print Receipt
                </button>
                <button type="button" className="btn-primary" onClick={() => setSelectedReceipt(null)}>
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. Pay Ancillary Fees Modal */}
      {showPayModal && (
        <div className="modal-backdrop" onClick={() => setShowPayModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowPayModal(false)}>&times;</button>
            
            <div className="modal-header">
              <h3>Pay Academic Fees & Services</h3>
              <p className="modal-desc">Instant online payment via UPI, Cards, and NetBanking</p>
            </div>

            <form onSubmit={handleProcessPayment} className="modal-form">
              <div className="form-group">
                <label>Student Roll Number</label>
                <input type="text" value={student.rollNo} readOnly className="bold-input" />
              </div>

              <div className="form-group">
                <label>Fee Category *</label>
                <select 
                  value={payCategory} 
                  onChange={(e) => {
                    const cat = e.target.value;
                    setPayCategory(cat);
                    if (cat.includes('850')) setPayAmount('₹ 850.00');
                    else if (cat.includes('1,200')) setPayAmount('₹ 1,200.00');
                    else if (cat.includes('600')) setPayAmount('₹ 600.00');
                    else setPayAmount('₹ 1,500.00');
                  }}
                >
                  <option value="Certificate & Convocation Fee - ₹ 850">Certificate & Convocation Registration - ₹ 850</option>
                  <option value="Duplicate Marksheet Re-issuance - ₹ 1,200">Duplicate Marksheet Re-issuance - ₹ 1,200</option>
                  <option value="Transfer Certificate Requisition - ₹ 600">Transfer Certificate (TC) - ₹ 600</option>
                  <option value="Annual Convocation In-Person - ₹ 1,500">Convocation Attendance (In-Person) - ₹ 1,500</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount Payable (INR)</label>
                <input type="text" value={payAmount} readOnly className="bold-input" />
              </div>

              <div className="form-group">
                <label>Payment Method *</label>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                  <option value="upi">UPI (GPay / PhonePe / Paytm / QR)</option>
                  <option value="card">Credit Card / Debit Card (Visa / Mastercard / RuPay)</option>
                  <option value="nb">Internet Banking (HDFC / SBI / ICICI / Axis)</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="btn-primary full-btn" 
                disabled={isProcessing}
                style={{ marginTop: '10px' }}
              >
                {isProcessing ? 'Connecting to Payment Gateway...' : `Proceed to Pay ${payAmount} &rarr;`}
              </button>
            </form>

          </div>
        </div>
      )}

    </StudentLayout>
  );
}

// src/data/paymentData.js
/**
 * Official Fee Schedule and Payment Configurations for NCTMS INDIA ONLINE
 * All fee structures adhere to Central Academic Council Resolutions.
 */

export const PAYMENT_CATEGORIES = [
  {
    id: 'adm-fee',
    code: 'FEE-ADM-01',
    title: 'Admission & Enrollment Fee',
    category: 'Admission',
    amount: 4500,
    amountFormatted: '₹ 4,500.00',
    description: 'Statutory registration and enrollment fee for newly admitted diploma and post-graduate candidates.',
    turnaround: 'Instant Electronic Confirmation',
    eligiblePayer: 'Approved Admission Applicants / Students'
  },
  {
    id: 'tui-sem1',
    code: 'FEE-TUI-01',
    title: 'Semester 1 Tuition & LMS Access Fee',
    category: 'Tuition',
    amount: 11000,
    amountFormatted: '₹ 11,000.00',
    description: 'Term tuition, syllabus course packs, and digital learning portal access for Semester 1.',
    turnaround: 'Instant Activation',
    eligiblePayer: 'Enrolled Students'
  },
  {
    id: 'tui-sem2',
    code: 'FEE-TUI-02',
    title: 'Semester 2 Tuition & LMS Access Fee',
    category: 'Tuition',
    amount: 11000,
    amountFormatted: '₹ 11,000.00',
    description: 'Term tuition, laboratory simulations, and examination eligibility fee for Semester 2.',
    turnaround: 'Instant Activation',
    eligiblePayer: 'Enrolled Students'
  },
  {
    id: 'exam-fee',
    code: 'FEE-EXM-01',
    title: 'Semester Examination & AI Proctoring Fee',
    category: 'Examination',
    amount: 1200,
    amountFormatted: '₹ 1,200.00',
    description: 'Form submission, examination center admit card generation, and AI proctoring surveillance fee.',
    turnaround: 'Instant Admit Card Clearance',
    eligiblePayer: 'Semester Exam Candidates'
  },
  {
    id: 'cert-mig',
    code: 'FEE-CRT-01',
    title: 'Migration & Provisional Certificate Fee',
    category: 'Certificates',
    amount: 850,
    amountFormatted: '₹ 850.00',
    description: 'Administrative processing, digital signature verification, and speed-post delivery of certificates.',
    turnaround: '3 - 5 Working Days',
    eligiblePayer: 'Course Completed Students'
  },
  {
    id: 'cert-tc',
    code: 'FEE-TC-01',
    title: 'Transfer Certificate (TC) Issuance Fee',
    category: 'Certificates',
    amount: 450,
    amountFormatted: '₹ 450.00',
    description: 'Council institutional clearance and formal Transfer Certificate dispatch.',
    turnaround: '3 - 5 Working Days',
    eligiblePayer: 'Registered Students'
  },
  {
    id: 'cert-dup',
    code: 'FEE-DUP-01',
    title: 'Duplicate Certificate / Mark Sheet Fee',
    category: 'Certificates',
    amount: 850,
    amountFormatted: '₹ 850.00',
    description: 'Re-issuance fee for lost or damaged diploma parchment and consolidated grade card.',
    turnaround: '7 - 10 Working Days',
    eligiblePayer: 'Alumni / Enrolled Students'
  },
  {
    id: 'corr-rec',
    code: 'FEE-COR-01',
    title: 'Name / DOB / Record Correction Fee',
    category: 'Certificates',
    amount: 500,
    amountFormatted: '₹ 500.00',
    description: 'Gazette-backed administrative record amendment in permanent central register.',
    turnaround: '5 - 7 Working Days',
    eligiblePayer: 'Registered Students'
  },
  {
    id: 'conv-reg',
    code: 'FEE-CNV-01',
    title: 'Convocation Degree Registration Fee',
    category: 'Convocations',
    amount: 1500,
    amountFormatted: '₹ 1,500.00',
    description: 'Annual National Convocation registration and original council graduation degree parchment.',
    turnaround: 'Annual Convocation Cycle',
    eligiblePayer: 'Graduated Students'
  },
  {
    id: 'aff-ann',
    code: 'FEE-AFF-01',
    title: 'Annual Center Affiliation Renewal Fee',
    category: 'Institutional',
    amount: 25000,
    amountFormatted: '₹ 25,000.00',
    description: 'Annual institutional quality audit, recognition renewal, and center portal licensing.',
    turnaround: 'Immediate Audit Clearance',
    eligiblePayer: 'Affiliated Institutions & ITIs'
  }
];

export const DEMO_VERIFIED_STUDENTS = {
  'NCTMS2026CS1092': {
    id: 'NCTMS2026CS1092',
    name: 'Alexander James Thompson',
    mobile: '+91 98401 23456',
    email: 'alexander.cs@nctms.in',
    course: 'Post Graduate Diploma in Computer Science (PGDCS-201)',
    center: 'National Academy of Technical & Computer Science, Chennai (TN-104)',
    recommendedFee: 'FEE-CRT-01'
  },
  'NCTMS2026CS1104': {
    id: 'NCTMS2026CS1104',
    name: 'R. Kirthika',
    mobile: '+91 98402 33445',
    email: 'kirthika.r@nctms.in',
    course: 'Diploma in Computer Science & Engineering (DCS-101)',
    center: 'National Academy of Technical & Computer Science, Chennai (TN-104)',
    recommendedFee: 'FEE-EXM-01'
  },
  'NCTMS2026ML3042': {
    id: 'NCTMS2026ML3042',
    name: 'Sneha Mohan',
    mobile: '+91 94471 22334',
    email: 'sneha.m@example.com',
    course: 'Certificate in Medical Lab Technology (CMLT-301)',
    center: 'St. Jude Healthcare, Kochi (KL-308)',
    recommendedFee: 'FEE-TUI-01'
  },
  'NCTMS-APP-2026-8841': {
    id: 'NCTMS-APP-2026-8841',
    name: 'Priya Sundaram',
    mobile: '+91 98402 11223',
    email: 'priya.s@example.com',
    course: 'Post Graduate Diploma in Management (PGDM-201)',
    center: 'National Academy, Chennai (TN-104)',
    recommendedFee: 'FEE-ADM-01'
  },
  'NCTMS-TN-104': {
    id: 'NCTMS-TN-104',
    name: 'National Academy of Technical & Computer Science',
    mobile: '+91 98401 99881',
    email: 'chennai.center@nctms.in',
    course: 'Institutional Affiliation Center',
    center: 'Chennai City Headquarters',
    recommendedFee: 'FEE-AFF-01'
  }
};

export const INITIAL_TRANSACTION_LEDGER = [
  {
    txnId: 'TXN-NCTMS-2026-90412',
    receiptNo: 'REC-NCTMS-2026-7821',
    date: '15-Sep-2026, 14:22',
    studentId: 'NCTMS2026CS1092',
    payerName: 'Alexander James Thompson',
    category: 'Semester Examination & AI Proctoring Fee',
    feeCode: 'FEE-EXM-01',
    amount: 1200,
    amountFormatted: '₹ 1,200.00',
    paymentMode: 'Debit Card (Visa •••• 4012)',
    gatewayRef: 'rzp_live_pay_9041288',
    status: 'Success'
  },
  {
    txnId: 'TXN-NCTMS-2026-90414',
    receiptNo: 'REC-NCTMS-2026-1092',
    date: '18-Jan-2026, 11:35',
    studentId: 'NCTMS2026CS1092',
    payerName: 'Alexander James Thompson',
    category: 'Semester 2 Tuition & LMS Access Fee',
    feeCode: 'FEE-TUI-02',
    amount: 11000,
    amountFormatted: '₹ 11,000.00',
    paymentMode: 'NetBanking (HDFC Bank)',
    gatewayRef: 'rzp_live_pay_9041421',
    status: 'Success'
  },
  {
    txnId: 'TXN-NCTMS-2025-44129',
    receiptNo: 'REC-NCTMS-2025-4412',
    date: '12-Aug-2025, 10:14',
    studentId: 'NCTMS2026CS1092',
    payerName: 'Alexander James Thompson',
    category: 'Semester 1 Tuition & LMS Access Fee',
    feeCode: 'FEE-TUI-01',
    amount: 11000,
    amountFormatted: '₹ 11,000.00',
    paymentMode: 'UPI (Ref: 421890312451)',
    gatewayRef: 'upi_npci_421890312451',
    status: 'Success'
  },
  {
    txnId: 'TXN-NCTMS-2026-90418',
    receiptNo: 'REC-NCTMS-2026-8841',
    date: '05-Oct-2026, 09:12',
    studentId: 'NCTMS-APP-2026-8841',
    payerName: 'Priya Sundaram',
    category: 'Admission & Enrollment Fee',
    feeCode: 'FEE-ADM-01',
    amount: 4500,
    amountFormatted: '₹ 4,500.00',
    paymentMode: 'UPI / PhonePe',
    gatewayRef: 'upi_phonepe_77182910',
    status: 'Success'
  }
];

export const PAYMENT_FAQ = [
  {
    q: 'How long does it take for a fee payment to reflect in my student profile?',
    a: 'Payments completed via UPI, NetBanking, or Credit/Debit Card reflect immediately in your student fees ledger. An official digital receipt (PDF) is generated instantly with council digital verification.'
  },
  {
    q: 'Are any payment gateway surcharges or platform fees added at checkout?',
    a: 'No. NCTMS India absorbs all payment gateway processing fees. Students pay exactly the statutory fee prescribed by the council with zero additional convenience charges.'
  },
  {
    q: 'What should I do if money was debited from my account but the receipt was not generated?',
    a: 'In rare cases of bank network latency, the payment gateway auto-reconciles within 2 to 24 hours. If your fee status does not update, please forward your Bank UTR or UPI Reference to accounts@nctms.in quoting your Student Roll Number.'
  },
  {
    q: 'Is this payment portal safe for card and UPI transactions?',
    a: 'Yes. All transactions are processed through RBI-authorized payment aggregators (e.g., Razorpay / Cashfree) with 256-bit SSL encryption and PCI-DSS Level 1 compliance. NCTMS never stores raw card details or banking passwords.'
  }
];

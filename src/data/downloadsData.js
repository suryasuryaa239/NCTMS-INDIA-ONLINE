export const DOWNLOADS_DATA = [
  {
    id: 'form-tc',
    code: 'NCTMS/FORM/TC-02',
    title: 'Transfer Certificate (TC) Application Form',
    category: 'Certification & Transfer',
    fee: '₹ 600.00',
    turnaround: '3 - 5 Working Days',
    eligibility: 'Students completing their course or withdrawing with approved study center clearance.',
    status: 'Available for Online Requisition',
    description: 'Standard requisition form for issuance of institutional Transfer Certificate and Conduct Certificate upon completion of study or withdrawal.',
    documentsRequired: [
      'No Dues Certificate signed by Study Center Head',
      'Student Identity Card copy',
      'Fee receipt of final semester/term'
    ],
    fields: [
      { name: 'Candidate Full Name', type: 'text' },
      { name: 'Roll / Enrollment Number', type: 'text' },
      { name: 'Academic Session (Year of Joining & Leaving)', type: 'text' },
      { name: 'Center Name & Location', type: 'text' },
      { name: 'Contact Phone & Email', type: 'text' }
    ]
  },
  {
    id: 'form-migration',
    code: 'NCTMS/FORM/MIG-01',
    title: 'Migration Certificate Requisition Form',
    category: 'Certification & Transfer',
    fee: '₹ 850.00',
    turnaround: '5 - 7 Working Days',
    eligibility: 'Graduates or registered candidates transferring to recognized universities or technical boards.',
    status: 'Available for Online Requisition',
    description: 'Application for obtaining an official Migration Certificate for students transitioning to other universities, autonomous bodies, or higher education institutions.',
    documentsRequired: [
      'Original Course Completion Marksheet copy',
      'Provisional or Degree Certificate photocopy',
      'Valid Government Photo ID (Aadhaar / Voter ID / Passport)',
      'Fee Payment Challan / Online Payment Receipt'
    ],
    fields: [
      { name: 'Full Name of the Candidate', type: 'text' },
      { name: 'Registration / Roll Number', type: 'text' },
      { name: 'Course & Department', type: 'text' },
      { name: 'Affiliated Study Center Code', type: 'text' },
      { name: 'Reason for Migration & Target University', type: 'textarea' },
      { name: 'Dispatch Address with PIN Code', type: 'text' }
    ]
  },
  {
    id: 'form-duplicate',
    code: 'NCTMS/FORM/DUP-04',
    title: 'Duplicate Consolidated Marksheet / Certificate Request',
    category: 'Document Re-issuance',
    fee: '₹ 1,200.00',
    turnaround: '7 - 10 Working Days',
    eligibility: 'Alumni or candidates whose original mark memos/diplomas have been lost, damaged, or stolen.',
    status: 'Available for Online Requisition',
    description: 'Official application for duplicate certificate or marksheet in case of accidental loss, damage, theft, or mutilation.',
    documentsRequired: [
      'Notarized Affidavit on ₹20/₹50 Stamp Paper explaining loss',
      'Police Non-Traceable Certificate (NCR) or Damaged Original snippet',
      'Copy of ID proof and original mark memo copy if available'
    ],
    fields: [
      { name: 'Applicant Name', type: 'text' },
      { name: 'Roll Number & Year of Passing', type: 'text' },
      { name: 'Document Requested', type: 'select', options: ['Consolidated Marksheet', 'Original Diploma / Certificate', 'Both Marksheet & Certificate'] },
      { name: 'Reason for Duplicate Request', type: 'text' },
      { name: 'Affidavit & Police NCR Number', type: 'text' }
    ]
  },
  {
    id: 'form-correction',
    code: 'NCTMS/FORM/CORR-05',
    title: 'Official Name / DOB / Address Correction Form',
    category: 'Record Corrections',
    fee: '₹ 500.00',
    turnaround: '4 - 6 Working Days',
    eligibility: 'Enrolled students requiring correction of clerical or typographical errors in council records.',
    status: 'Available for Online Requisition',
    description: 'Requisition form for rectification of clerical or spelling errors in student name, parent name, date of birth, or permanent address.',
    documentsRequired: [
      '10th / SSLC Certificate or Government Birth Certificate as proof',
      'Aadhaar Card / Passport showing correct details',
      'Surrender of incorrect marksheet/certificate if already issued'
    ],
    fields: [
      { name: 'Current Name on Council Record', type: 'text' },
      { name: 'Corrected Name / DOB Requested', type: 'text' },
      { name: 'Roll Number & Center Code', type: 'text' },
      { name: 'Document Submitted as Benchmark Proof', type: 'text' }
    ]
  },
  {
    id: 'form-convocation',
    code: 'NCTMS/FORM/CONV-03',
    title: 'Annual Convocation Degree Registration Form',
    category: 'Convocations & Degrees',
    fee: '₹ 1,500.00 (In Person) / ₹ 1,200.00 (In Absentia)',
    turnaround: 'Scheduled Annual Event or Speed Post',
    eligibility: 'All diplomates and graduates who have cleared all terms and obtained provisional certificates.',
    status: 'Available for Online Requisition',
    description: 'Registration form for eligible diplomates and graduates to receive their authentic degree certificate during the Annual Council Convocation.',
    documentsRequired: [
      'Consolidated Marksheet Copy',
      'Provisional Certificate Copy',
      'Passport size color photograph in academic attire (or formal)',
      'Proof of identity'
    ],
    fields: [
      { name: 'Candidate Name (in Block Letters)', type: 'text' },
      { name: 'Registration Number', type: 'text' },
      { name: 'Course Completed & Final Grade', type: 'text' },
      { name: 'Attendance Mode (In Person / In Absentia by Courier)', type: 'select', options: ['In Person at Chennai Convocation Hall', 'In Absentia (Delivery by Registered Post)'] },
      { name: 'Permanent Postal Address', type: 'textarea' }
    ]
  },
  {
    id: 'form-affiliation',
    code: 'NCTMS/FORM/AFFIL-06',
    title: 'Institution Center Affiliation & Inspection Application',
    category: 'Institutional Services',
    fee: '₹ 15,000.00 (Inspection & Processing)',
    turnaround: '15 - 20 Working Days',
    eligibility: 'Educational institutions, technical colleges, and vocational training centers seeking authorized recognition.',
    status: 'Available for Online Requisition',
    description: 'Comprehensive application proforma for colleges, polytechnics, VTPs, and academies applying to become an authorized NCTMS India Examination & Study Center.',
    documentsRequired: [
      'Trust / Society / Company Registration Deed',
      'Building Layout & Infrastructure Blueprint',
      'Lab equipment, computer hardware & internet inventory',
      'Faculty profiles & resume dossier'
    ],
    fields: [
      { name: 'Institution Name & Organization Type', type: 'text' },
      { name: 'Principal / Director Name & Mobile', type: 'text' },
      { name: 'Campus Physical Address, City, State, PIN', type: 'textarea' },
      { name: 'Proposed Courses & Approximate Student Intake', type: 'text' }
    ]
  }
];

export const OFFICIAL_PUBLICATIONS_DATA = [
  {
    id: 'pub-prospectus',
    code: 'PUB-PROSP-2026',
    title: 'NCTMS Official Academic Prospectus & Course Directory (2026-2027)',
    category: 'Prospectus & Curricula',
    format: 'PDF Document',
    size: '4.8 MB',
    date: 'August 2026',
    description: 'Complete academic council prospectus containing diploma frameworks, program syllabi, credit distribution, and accreditation standards.',
    status: 'Available for Download',
    downloadAvailable: true
  },
  {
    id: 'pub-exam-rules',
    code: 'PUB-EXAM-REG-02',
    title: 'Code of Academic Conduct & Examination Regulations Manual',
    category: 'Regulations & Policies',
    format: 'PDF Document',
    size: '1.6 MB',
    date: 'September 2026',
    description: 'Authoritative examination regulations, online proctoring code of ethics, evaluation schemes, and grade allocation benchmarks.',
    status: 'Available for Download',
    downloadAvailable: true
  },
  {
    id: 'pub-affiliation-manual',
    code: 'PUB-AFFIL-NORM-03',
    title: 'Study Center Accreditation & Institutional Affiliation Manual',
    category: 'Institutional Guidelines',
    format: 'PDF Document',
    size: '3.2 MB',
    date: 'July 2026',
    description: 'Technical requirements, lab equipment benchmarks, faculty credentials, and inspection protocols for affiliated institutions.',
    status: 'Available for Download',
    downloadAvailable: true
  },
  {
    id: 'pub-lms-guide',
    code: 'PUB-LMS-GUIDE-04',
    title: 'Student ERP Portal & Online Classroom LMS User Handbook',
    category: 'Student Handbooks',
    format: 'PDF Document',
    size: '2.1 MB',
    date: 'August 2026',
    description: 'Step-by-step instruction manual for students on attending live lectures, accessing recorded sessions, and downloading exam hall tickets.',
    status: 'Available for Download',
    downloadAvailable: true
  },
  {
    id: 'pub-annual-report',
    code: 'PUB-ANNUAL-REP-05',
    title: 'Annual Council Statistical & Vocational Placement Report',
    category: 'Annual Reports',
    format: 'PDF Document',
    size: '5.4 MB',
    date: 'June 2026',
    description: 'Annual overview of certified graduates, vocational placement milestones, and national institutional partnerships across India.',
    status: 'Available for Download',
    downloadAvailable: true
  },
  {
    id: 'pub-convocation-gazette',
    code: 'PUB-CONV-GAZ-06',
    title: 'Special Convocation Gazette & Roll of Honor Notification',
    category: 'Convocations & Degrees',
    format: 'PDF Document',
    size: 'Pending Registrar Upload',
    date: 'Upcoming Cycle',
    description: 'Official gazette notification of graduated diplomates and medal awardees for the upcoming annual convocation ceremony.',
    status: 'Unavailable — Pending Council Release',
    downloadAvailable: false
  }
];

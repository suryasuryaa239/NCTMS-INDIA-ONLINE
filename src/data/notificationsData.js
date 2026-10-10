// src/data/notificationsData.js
/**
 * Official NCTMS India News, Circulars & Announcements Data
 */

export const NOTIFICATION_CATEGORIES = [
  'All',
  'General News',
  'Admissions',
  'Examination Updates',
  'Results',
  'Course Announcements',
  'Certificates',
  'Important Notices',
  'Events'
];

export const NOTIFICATIONS_DATA = [
  {
    id: 'exam-admit-card-oct-2026',
    date: '05-Oct-2026',
    lastUpdated: '08-Oct-2026',
    category: 'Examination Updates',
    referenceNo: 'NCTMS/EXAM/CIR/2026/88',
    badge: 'Urgent Notice',
    title: 'Admit Card Release: Term-End Online Examinations - October/November 2026 Session',
    shortDescription: 'Official e-Hall Tickets with tamper-evident QR proctoring passes are now live for all registered candidates across technical, management, and healthcare disciplines.',
    fullContent: [
      'The Central Examination Division of NCTMS India hereby notifies all eligible students registered for the Term-End Online Examinations (October/November 2026 Session) that official electronic hall tickets (e-Admit Cards) have been released.',
      'Candidates can access their personalized examination pass by logging into the Student ERP portal with their permanent registration roll number. The admit card contains the student\'s cryptographic QR proctoring token, examination slot timings, hardware verification protocols, and system compatibility guidelines.',
      'Mandatory Requirements: Candidates must present a valid physical government-issued identity proof (Aadhaar, Passport, or Voter ID) to the automated AI proctor during identity verification before beginning the test session. Hall tickets must be preserved until the final publication of marks and certificates.'
    ],
    issuingAuthority: 'Controller of Examinations, NCTMS India Examination Board',
    status: 'Active Notice',
    isPinned: true,
    isNew: true,
    attachment: {
      hasAttachment: true,
      fileName: 'Circular-NCTMS-EXAM-2026-88.pdf',
      fileSize: '420 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/downloads'
    },
    relatedLink: '/student/exam-center',
    relatedLinkText: 'Open Examination Center'
  },
  {
    id: 'winter-admissions-2026',
    date: '01-Oct-2026',
    lastUpdated: '04-Oct-2026',
    category: 'Admissions',
    referenceNo: 'NCTMS/ADM/2026/102',
    badge: 'Session 2026-27',
    title: 'Online Admission Portal Open for Winter 2026 Batch - Scholarship Applications Invited',
    shortDescription: 'Applications are formally open for Diploma, Post Graduate Diploma, and Specialized Vocational Programs. Early candidates are eligible for merit-cum-means fee concessions.',
    fullContent: [
      'The Directorate of Academic Admissions announces the commencement of online admissions for the Winter 2026 academic batch across all approved affiliated centers and remote digital study modes.',
      'Prospective candidates can explore accredited programs in Computer Science, Business Management, Paramedical Technology, and Mechanical Trades. Applications can be submitted directly through the centralized online registration portal with digital document submission.',
      'Special Merit Scholarship: Candidates securing 85% or above in qualifying 10+2 / polytechnic evaluations are invited to apply for the National Council Technical Scholarship covering up to 40% of the tuition fee structure.'
    ],
    issuingAuthority: 'Central Admissions Directorate, NCTMS India',
    status: 'Open for Application',
    isPinned: true,
    isNew: true,
    attachment: {
      hasAttachment: true,
      fileName: 'Prospectus-Winter-2026-Guidelines.pdf',
      fileSize: '1.8 MB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/downloads'
    },
    relatedLink: '/admission',
    relatedLinkText: 'Apply Online for Admission'
  },
  {
    id: 'results-august-2026',
    date: '28-Sep-2026',
    lastUpdated: '28-Sep-2026',
    category: 'Results',
    referenceNo: 'NCTMS/RES/2026/41',
    badge: 'Results Published',
    title: 'Consolidated Marksheets & Evaluation Statements Released for August 2026 Examination Cycle',
    shortDescription: 'Evaluation moderation has concluded. Candidates can verify individual subject grades and CGPA scores online via the National Academic Registry portal.',
    fullContent: [
      'The Examination Evaluation Board has officially finalized and ratified the performance ledgers for all candidates who participated in the August 2026 executive and term-end evaluations.',
      'Students and affiliated center directors can verify individual subject scores, grade point averages, and pass percentages through the Examination Results portal. E-marksheets are signed by the Controller of Examinations and carry full legal validity for employment and academic progression.',
      'Provisional certificates have been dispatched to students\' respective accredited study centers, and candidates requiring duplicate copies or expedited transcripts may apply through the official Downloads & Requisitions page.'
    ],
    issuingAuthority: 'Central Examination Division & Moderation Board',
    status: 'Published',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Gazette-Summary-August-2026.pdf',
      fileSize: '650 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/results'
    },
    relatedLink: '/results',
    relatedLinkText: 'Check Examination Results'
  },
  {
    id: 'certificate-qr-verification-advisory',
    date: '22-Sep-2026',
    lastUpdated: '25-Sep-2026',
    category: 'Certificates',
    referenceNo: 'NCTMS/SEC/2026/19',
    badge: 'Verification Advisory',
    title: 'Mandatory Digital QR Code Verification Protocol for Employers and Educational Institutions',
    shortDescription: 'Statutory advisory instructing all verification agencies, universities, and corporate recruiters to validate NCTMS parchment credentials solely through the authoritative portal.',
    fullContent: [
      'To prevent credential counterfeiting and ensure the highest standards of academic integrity, the National Council Secretariat reminds all corporate HR divisions, background verification firms, and higher education institutions of the mandatory digital authentication procedure.',
      'All genuine diplomas and marksheets issued by NCTMS India feature a SHA-256 cryptographic hash seal and a verification QR code pointing strictly to the official hostname verify.nctms.in.',
      'Institutions are cautioned against third-party verification portals. Direct verification can be carried out instantly using the student\'s permanent Roll Number or Certificate Serial Number on our public Certificate Verification page.'
    ],
    issuingAuthority: 'Secretariat & Registry Directorate, NCTMS India',
    status: 'Statutory Advisory',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Verification-Advisory-Employers-2026.pdf',
      fileSize: '340 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/verify'
    },
    relatedLink: '/verify',
    relatedLinkText: 'Open Certificate Verification'
  },
  {
    id: 'new-ai-curriculum-2026',
    date: '18-Sep-2026',
    lastUpdated: '18-Sep-2026',
    category: 'Course Announcements',
    referenceNo: 'NCTMS/ACAD/2026/74',
    badge: 'New Curriculum',
    title: 'Curriculum Notification: Launch of Advanced Diploma in Artificial Intelligence & Data Architecture',
    shortDescription: 'NCTMS India Academic Council formally ratifies an industry-aligned 2-year curriculum integrating generative intelligence, cloud pipelines, and applied machine learning.',
    fullContent: [
      'In alignment with national technical skilling frameworks, the Academic Council has approved a specialized technical qualification: Advanced Diploma in Artificial Intelligence & Data Architecture (ADAI-201).',
      'The curriculum comprises 120 credits across four academic terms, featuring hands-on laboratories in Python, neural networks, MLOps deployment pipelines, and AI governance ethics.',
      'Affiliated institutions with accredited computer science departments may apply for curriculum adoption and intake capacity allocation beginning with the upcoming academic session.'
    ],
    issuingAuthority: 'Board of Technical & Management Studies',
    status: 'Approved by Council',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Syllabus-Overview-ADAI-2026.pdf',
      fileSize: '920 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/courses'
    },
    relatedLink: '/courses',
    relatedLinkText: 'Explore Course Catalog'
  },
  {
    id: 'affiliation-inspection-2027',
    date: '15-Sep-2026',
    lastUpdated: '20-Sep-2026',
    category: 'Important Notices',
    referenceNo: 'NCTMS/AFF/2026/33',
    badge: 'Institutional Notice',
    title: 'Annual Institutional Affiliation Renewal & Quality Inspection Schedule for Academic Year 2027',
    shortDescription: 'All affiliated training institutes and technical centers are mandated to complete digital infrastructure audit filings before November 30, 2026.',
    fullContent: [
      'The Institutional Accreditation Bureau invites all designated study centers and partnered technical schools to file their annual affiliation renewal documents for the forthcoming academic year 2027.',
      'Center directors must submit faculty rosters, lab equipment certifications, safety compliance audits, and student placement reports through the designated portal.',
      'Failure to complete statutory inspection submissions before November 30, 2026, may result in provisional enrollment suspension or loss of examination center privileges.'
    ],
    issuingAuthority: 'Institutional Accreditation & Quality Bureau',
    status: 'Action Required by Centers',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Affiliation-Audit-Compliance-Form-2027.pdf',
      fileSize: '510 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/downloads'
    },
    relatedLink: '/institutions',
    relatedLinkText: 'View Affiliated Institutions'
  },
  {
    id: 'annual-convocation-symposium-2026',
    date: '10-Sep-2026',
    lastUpdated: '12-Sep-2026',
    category: 'Events',
    referenceNo: 'NCTMS/EVT/2026/08',
    badge: 'National Event',
    title: 'National Technical Convocation & Academic Excellence Symposium 2026 Announced',
    shortDescription: 'Annual graduation convocation ceremony honoring gold medalists, distinguished diplomates, and industry educators scheduled for December in Chennai.',
    fullContent: [
      'The Governing Council of NCTMS India is pleased to announce the upcoming National Technical Convocation & Academic Excellence Symposium 2026.',
      'The ceremonial gathering will confer formal degrees, awards of merit, and national technical diplomas upon eligible graduates who completed their examinations across the 2025-2026 academic year.',
      'Detailed registration procedures, guest passes, and academic regalia guidelines will be published in a supplementary gazette circular. Eligible graduates may register their intent to attend in person through the Secretariat desk.'
    ],
    issuingAuthority: 'Office of the Registrar General, NCTMS India',
    status: 'Event Registration Open',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: false,
      fileName: null,
      fileSize: null,
      fileType: null,
      isAvailable: false,
      downloadUrl: null
    },
    relatedLink: '/contact',
    relatedLinkText: 'Secretariat Inquiries'
  },
  {
    id: 'council-gazette-general-orders',
    date: '02-Sep-2026',
    lastUpdated: '02-Sep-2026',
    category: 'General News',
    referenceNo: 'NCTMS/GEN/2026/15',
    badge: 'Standing Directive',
    title: 'Council Directive on Remote Examination Proctoring Guidelines & Grievance Redressal Mechanism',
    shortDescription: 'Comprehensive procedural directives regarding student integrity safeguards, automated proctoring thresholds, and formal appeals procedure.',
    fullContent: [
      'The Central Academic Senate has issued Standing Directive NCTMS/GEN/2026/15 governing remote proctoring procedures for online terminal examinations.',
      'The regulation codifies acceptable bandwidth thresholds, permissible browser security restrictions, camera placement angles, and immediate appeal channels in case of technical connectivity disruption during tests.',
      'Students and institutions are strongly encouraged to review the full compliance guidelines ahead of test registration.'
    ],
    issuingAuthority: 'Office of the Director General, NCTMS India',
    status: 'Standing Directive',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Proctoring-Rules-Grievance-Procedure.pdf',
      fileSize: '380 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/downloads'
    },
    relatedLink: '/online-examination',
    relatedLinkText: 'Online Examination Rules'
  },
  {
    id: 'disaffiliation-warning-order',
    date: '14-Mar-2024',
    lastUpdated: '14-Mar-2024',
    category: 'Important Notices',
    referenceNo: 'NCTMS/VIG/2024/09',
    badge: 'Disaffiliation Order',
    title: 'Public Gazette Notification: Formal Disaffiliation & Credential Invalidation Notice',
    shortDescription: 'Official gazette warning concerning center disaffiliation in Salem (Center TN-088) and corresponding cancellation of fraudulently claimed marks.',
    fullContent: [
      'Notice is hereby provided to the general public, employers, and student community that following an exhaustive investigation by the Council Vigilance Committee, Center TN-088 (Salem Vocational Academy) has been permanently disaffiliated.',
      'All credentials claimed to have been issued through said disaffiliated center without central proctoring logs have been invalidated in the National Academic Registry (reference Council Order NCTMS/VIG/2024/09).',
      'The council strongly urges prospective candidates and employers to cross-check all historical credentials on our official verification portal verify.nctms.in.'
    ],
    issuingAuthority: 'Council Vigilance & Inspection Committee',
    status: 'Official Council Order',
    isPinned: false,
    isNew: false,
    attachment: {
      hasAttachment: true,
      fileName: 'Council-Order-VIG-2024-09.pdf',
      fileSize: '290 KB',
      fileType: 'PDF Document',
      isAvailable: true,
      downloadUrl: '/verify'
    },
    relatedLink: '/verify/NCTMS2023REV01',
    relatedLinkText: 'Verify Revocation Record'
  }
];

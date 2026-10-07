export const INSTITUTION_CENTER_DETAILS = {
  centerCode: 'NCTMS-TN-104',
  name: 'National Academy of Technical & Computer Science',
  category: 'Technical College & IT Training Academy',
  principal: 'Dr. K. Sundararajan, M.Tech, Ph.D.',
  affiliationNo: 'NCTMS/TN/AFFIL/2026/042',
  affiliationStatus: 'Active & Verified',
  validUpto: '30-Jun-2027',
  approvedIntake: 500,
  currentEnrollment: 412,
  address: '42, Mount Road, Guindy, Chennai - 600032',
  state: 'Tamil Nadu',
  email: 'chennai.center@nctms.in',
  phone: '+91 44 2235 8901 / +91 94441 23456',
  establishedYear: '2014',
  inspectionGrade: 'Grade A+ (Excellence in Technical Education)',
  labCount: 6,
  computerSystems: 120,
  facultyCount: 24,
  coursesApproved: [
    'Diploma in Computer Science & Engineering',
    'Post Graduate Diploma in Management (PGDM)',
    'Advance Diploma in AI & Data Science',
    'Certificate in Digital Marketing'
  ]
};

export const INSTITUTION_STUDENTS_LIST = [
  {
    id: 'stud-1',
    rollNo: 'NCTMS2026CS1092',
    name: 'Alexander James Thompson',
    course: 'PG Diploma in Computer Science',
    batch: 'PGDCS-2025-26',
    enrollmentNo: 'ENR-2025-TN-9812',
    admissionDate: '12-Aug-2025',
    feeStatus: 'PAID',
    attendance: '92.4%',
    status: 'Active Student'
  },
  {
    id: 'stud-2',
    rollNo: 'NCTMS2025TN8821',
    name: 'R. Murugavel',
    course: 'Diploma in Computer Science & Engg',
    batch: 'DCS-2025-26',
    enrollmentNo: 'ENR-2024-TN-4532',
    admissionDate: '15-Jul-2024',
    feeStatus: 'PAID',
    attendance: '88.5%',
    status: 'Active Student'
  },
  {
    id: 'stud-3',
    rollNo: 'NCTMS2026CS1093',
    name: 'S. Kousalya',
    course: 'PG Diploma in Computer Science',
    batch: 'PGDCS-2025-26',
    enrollmentNo: 'ENR-2025-TN-9813',
    admissionDate: '14-Aug-2025',
    feeStatus: 'PAID',
    attendance: '95.0%',
    status: 'Active Student'
  },
  {
    id: 'stud-4',
    rollNo: 'NCTMS2026CS1094',
    name: 'M. Vignesh',
    course: 'PG Diploma in Computer Science',
    batch: 'PGDCS-2025-26',
    enrollmentNo: 'ENR-2025-TN-9814',
    admissionDate: '18-Aug-2025',
    feeStatus: 'PARTIAL (Term 2 Due)',
    attendance: '82.1%',
    status: 'Pending Verification'
  },
  {
    id: 'stud-5',
    rollNo: 'NCTMS2026MGMT301',
    name: 'K. Divya',
    course: 'PG Diploma in Management (PGDM)',
    batch: 'PGDM-2025-26',
    enrollmentNo: 'ENR-2025-TN-7711',
    admissionDate: '01-Sep-2025',
    feeStatus: 'PAID',
    attendance: '91.2%',
    status: 'Active Student'
  },
  {
    id: 'stud-6',
    rollNo: 'NCTMS2026MGMT302',
    name: 'P. Karthik',
    course: 'PG Diploma in Management (PGDM)',
    batch: 'PGDM-2025-26',
    enrollmentNo: 'ENR-2025-TN-7712',
    admissionDate: '04-Sep-2025',
    feeStatus: 'PAID',
    attendance: '89.4%',
    status: 'Active Student'
  },
  {
    id: 'stud-7',
    rollNo: 'NCTMS2026AI101',
    name: 'R. Suresh',
    course: 'Advance Diploma in AI & Data Science',
    batch: 'ADAI-2026-28',
    enrollmentNo: 'ENR-2026-TN-3301',
    admissionDate: '10-Jan-2026',
    feeStatus: 'PAID',
    attendance: '96.2%',
    status: 'Active Student'
  }
];

export const INSTITUTION_BATCHES = [
  {
    id: 'batch-1',
    code: 'PGDCS-2025-26',
    title: 'Post Graduate Diploma in Computer Science (Term 2)',
    course: 'PGDCS-201',
    studentsCount: 42,
    facultyInCharge: 'Dr. V. Sharma, M.Tech, Ph.D.',
    classSchedule: 'Mon, Wed, Fri &bull; 10:00 AM - 01:00 PM',
    classroom: 'Lab 2 (Software Engineering Wing)',
    syllabusProgress: '85% Completed'
  },
  {
    id: 'batch-2',
    code: 'PGDM-2025-26',
    title: 'Post Graduate Diploma in Management (Term 1)',
    course: 'PGDM-201',
    studentsCount: 38,
    facultyInCharge: 'Dr. R. Rajesh, MBA, Ph.D.',
    classSchedule: 'Tue, Thu, Sat &bull; 02:00 PM - 05:00 PM',
    classroom: 'Seminar Hall B',
    syllabusProgress: '90% Completed'
  },
  {
    id: 'batch-3',
    code: 'DCS-2025-26',
    title: 'Diploma in Computer Science & Engineering (Year 1)',
    course: 'DCS-101',
    studentsCount: 55,
    facultyInCharge: 'Er. K. Anitha, M.E.',
    classSchedule: 'Mon to Fri &bull; 09:00 AM - 12:00 PM',
    classroom: 'Lab 1 (Computer Systems)',
    syllabusProgress: '78% Completed'
  },
  {
    id: 'batch-4',
    code: 'ADAI-2026-28',
    title: 'Advance Diploma in AI & Data Science (Term 1)',
    course: 'ADAI-102',
    studentsCount: 30,
    facultyInCharge: 'Prof. M. Arun, M.Tech (AI)',
    classSchedule: 'Weekends &bull; 09:30 AM - 04:30 PM',
    classroom: 'AI Cloud Lab 4',
    syllabusProgress: '60% Completed'
  }
];

export const INSTITUTION_MARKS_DATA = [
  {
    rollNo: 'NCTMS2026CS1092',
    studentName: 'Alexander James Thompson',
    subject: 'CS102 Database Management Systems',
    attendanceMarks: 10,
    assignmentMarks: 15,
    practicalMarks: 20,
    totalInternal: 45,
    maxInternal: 50,
    status: 'Submitted to Council'
  },
  {
    rollNo: 'NCTMS2026CS1093',
    studentName: 'S. Kousalya',
    subject: 'CS102 Database Management Systems',
    attendanceMarks: 10,
    assignmentMarks: 14,
    practicalMarks: 20,
    totalInternal: 44,
    maxInternal: 50,
    status: 'Submitted to Council'
  },
  {
    rollNo: 'NCTMS2026CS1094',
    studentName: 'M. Vignesh',
    subject: 'CS102 Database Management Systems',
    attendanceMarks: 8,
    assignmentMarks: 12,
    practicalMarks: 17,
    totalInternal: 37,
    maxInternal: 50,
    status: 'Draft / Editable'
  }
];

export const ADMIN_STATS = {
  totalStudentsNational: '14,820',
  totalAffiliatedCenters: 184,
  totalApprovedCourses: 36,
  totalRevenueYear: '₹ 4.82 Cr',
  pendingAdmissions: 5,
  pendingAffiliations: 3,
  examCompletionRate: '98.4%',
  certificatesIssued: '12,410'
};

export const ADMIN_ADMISSIONS_QUEUE = [
  {
    id: 'app-8841',
    appId: 'NCTMS-APP-2026-8841',
    candidateName: 'Priya Sundaram',
    courseName: 'PG Diploma in Management (PGDM)',
    courseCode: 'PGDM-201',
    centerCode: 'NCTMS-TN-104',
    centerName: 'National Academy, Chennai',
    dateApplied: '05-Oct-2026',
    qualification: 'B.Com (78.4%)',
    mobile: '+91 98402 11223',
    email: 'priya.s@example.com',
    status: 'Pending Verification',
    docsAttached: ['10th_Memo.pdf', 'Degree_Certificate.pdf', 'Aadhaar_Card.jpg']
  },
  {
    id: 'app-8842',
    appId: 'NCTMS-APP-2026-8842',
    candidateName: 'Rahul Venkatraman',
    courseName: 'Diploma in Computer Science & Engg',
    courseCode: 'DCS-101',
    centerCode: 'NCTMS-KA-212',
    centerName: 'Apex Institute, Bengaluru',
    dateApplied: '04-Oct-2026',
    qualification: 'HSC / 12th (84.2%)',
    mobile: '+91 98801 44556',
    email: 'rahul.v@example.com',
    status: 'Pending Verification',
    docsAttached: ['12th_Marksheet.pdf', 'Transfer_Cert.pdf', 'Aadhaar.pdf']
  },
  {
    id: 'app-8843',
    appId: 'NCTMS-APP-2026-8843',
    candidateName: 'Deepak Rajan',
    courseName: 'Advance Diploma in AI & Data Science',
    courseCode: 'ADAI-102',
    centerCode: 'NCTMS-TN-104',
    centerName: 'National Academy, Chennai',
    dateApplied: '03-Oct-2026',
    qualification: 'Polytechnic Diploma (81.0%)',
    mobile: '+91 94440 99881',
    email: 'deepak.ai@example.com',
    status: 'Pending Verification',
    docsAttached: ['Diploma_Final_Marks.pdf', 'Photo_ID.jpg']
  },
  {
    id: 'app-8844',
    appId: 'NCTMS-APP-2026-8844',
    candidateName: 'Sneha Mohan',
    courseName: 'Certificate in Medical Lab Technology',
    courseCode: 'CMLT-301',
    centerCode: 'NCTMS-KL-308',
    centerName: 'St. Jude Healthcare, Kochi',
    dateApplied: '02-Oct-2026',
    qualification: '10+2 Biology (79.0%)',
    mobile: '+91 94471 22334',
    email: 'sneha.m@example.com',
    status: 'Approved & Enrolled',
    enrollmentNo: 'NCTMS2026ML3042',
    docsAttached: ['HSC_Bio_Marks.pdf', 'Medical_Fitness.pdf']
  },
  {
    id: 'app-8845',
    appId: 'NCTMS-APP-2026-8845',
    candidateName: 'K. Vignesh',
    courseName: 'Diploma in Electrical & Electronics Engineering',
    courseCode: 'DEEE-104',
    centerCode: 'NCTMS-MH-450',
    centerName: 'Pioneer ITI, Mumbai',
    dateApplied: '01-Oct-2026',
    qualification: 'SSLC 10th (76.5%)',
    mobile: '+91 98201 55667',
    email: 'vignesh.k@example.com',
    status: 'Pending Verification',
    docsAttached: ['10th_Certificate.pdf', 'Community_Cert.pdf']
  }
];

export const ADMIN_AFFILIATIONS_QUEUE = [
  {
    id: 'aff-1',
    instName: 'St. Peter Polytechnic & Vocational Institute',
    city: 'Madurai',
    state: 'Tamil Nadu',
    principalName: 'Dr. S. Jebaraj, Ph.D.',
    proposedIntake: 300,
    coursesRequested: ['Diploma in Computer Science', 'Vocational Electrical Trade'],
    appliedDate: '28-Sep-2026',
    inspectionStatus: 'Inspection Committee Formed',
    status: 'Under Review',
    phone: '+91 452 258 4401',
    email: 'stpeter.madurai@example.edu',
    labs: '4 Fully Equipped Labs',
    classrooms: 12
  },
  {
    id: 'aff-2',
    instName: 'Greenwood College of Healthcare & Allied Sciences',
    city: 'Pune',
    state: 'Maharashtra',
    principalName: 'Dr. Neelam Deshmukh',
    proposedIntake: 250,
    coursesRequested: ['Medical Laboratory Technology', 'Hospital Management'],
    appliedDate: '24-Sep-2026',
    inspectionStatus: 'Inspection Audit Completed (Grade A)',
    status: 'Ready for Approval',
    phone: '+91 20 2712 9980',
    email: 'greenwood.pune@example.org',
    labs: '6 Pathology & Bio Labs',
    classrooms: 10
  },
  {
    id: 'aff-3',
    instName: 'Vanguard Academy of Management & Computing',
    city: 'Hyderabad',
    state: 'Telangana',
    principalName: 'Prof. T. Srinivas Rao',
    proposedIntake: 400,
    coursesRequested: ['PGDM', 'AI & Data Science', 'Digital Marketing'],
    appliedDate: '15-Sep-2026',
    inspectionStatus: 'Document Scrutiny Passed',
    status: 'Under Review',
    phone: '+91 40 2331 7744',
    email: 'vanguard.hyd@example.ac.in',
    labs: '8 Computing & Server Labs',
    classrooms: 16
  }
];

export const ADMIN_COURSES_MANAGEMENT = [
  {
    id: 'c-101',
    code: 'DCS-101',
    title: 'Diploma in Computer Science & Engineering',
    stream: 'Computer Science & IT',
    duration: '1 Year (2 Sem)',
    credits: 40,
    annualFee: '₹ 14,500',
    centersOffering: 42,
    activeStudents: 3240,
    status: 'Active',
    eligibility: '10th / SSLC Pass',
    syllabusUnits: 10
  },
  {
    id: 'c-102',
    code: 'PGDM-201',
    title: 'Post Graduate Diploma in Management (PGDM)',
    stream: 'Management & Business',
    duration: '1 Year (2 Sem)',
    credits: 44,
    annualFee: '₹ 22,000',
    centersOffering: 38,
    activeStudents: 2850,
    status: 'Active',
    eligibility: 'Any Bachelor Degree',
    syllabusUnits: 12
  },
  {
    id: 'c-103',
    code: 'ADAI-102',
    title: 'Advance Diploma in AI & Machine Learning',
    stream: 'Computer Science & IT',
    duration: '1 Year (2 Sem)',
    credits: 42,
    annualFee: '₹ 18,500',
    centersOffering: 26,
    activeStudents: 1680,
    status: 'Active',
    eligibility: 'Diploma / Degree in Science/Engg',
    syllabusUnits: 12
  },
  {
    id: 'c-104',
    code: 'CMLT-301',
    title: 'Certificate in Medical Lab Technology (CMLT)',
    stream: 'Healthcare & Paramedical',
    duration: '6 Months',
    credits: 24,
    annualFee: '₹ 12,000',
    centersOffering: 31,
    activeStudents: 2120,
    status: 'Active',
    eligibility: '10+2 with Science/Biology',
    syllabusUnits: 8
  },
  {
    id: 'c-105',
    code: 'DEEE-104',
    title: 'Diploma in Electrical & Electronics Engineering',
    stream: 'Vocational Technical (ITI)',
    duration: '1 Year (2 Sem)',
    credits: 38,
    annualFee: '₹ 13,000',
    centersOffering: 28,
    activeStudents: 1940,
    status: 'Active',
    eligibility: '10th Standard Pass',
    syllabusUnits: 10
  },
  {
    id: 'c-106',
    code: 'DDM-202',
    title: 'Diploma in Digital Marketing & E-Commerce',
    stream: 'Management & Business',
    duration: '6 Months',
    credits: 20,
    annualFee: '₹ 9,500',
    centersOffering: 35,
    activeStudents: 1450,
    status: 'Active',
    eligibility: '10+2 Higher Secondary',
    syllabusUnits: 8
  },
  {
    id: 'c-107',
    code: 'CYB-401',
    title: 'Executive Diploma in Cyber Security & Forensics',
    stream: 'Computer Science & IT',
    duration: '1 Year (2 Sem)',
    credits: 42,
    annualFee: '₹ 21,000',
    centersOffering: 18,
    activeStudents: 890,
    status: 'Under Revision',
    eligibility: 'Diploma / Degree in CS / IT',
    syllabusUnits: 10
  }
];

export const ADMIN_EXAMS_MANAGEMENT = [
  {
    id: 'exam-1',
    paperCode: 'CS402-OCT26',
    subject: 'CS-402 Database Management Systems',
    course: 'Diploma in Computer Science',
    scheduledDate: '12-Oct-2026',
    time: '10:00 AM - 12:00 PM',
    totalCandidates: 342,
    mode: 'Online AI Proctored',
    questionCount: 50,
    passMarks: 40,
    status: 'Question Bank Locked'
  },
  {
    id: 'exam-2',
    paperCode: 'CS403-OCT26',
    subject: 'CS-403 Web Technologies & Cloud',
    course: 'Diploma in Computer Science',
    scheduledDate: '15-Oct-2026',
    time: '02:00 PM - 04:00 PM',
    totalCandidates: 310,
    mode: 'Online AI Proctored',
    questionCount: 50,
    passMarks: 40,
    status: 'Question Bank Ready'
  },
  {
    id: 'exam-3',
    paperCode: 'MGT101-OCT26',
    subject: 'MGT-101 Principles of Management',
    course: 'PG Diploma in Management',
    scheduledDate: '18-Oct-2026',
    time: '10:00 AM - 12:00 PM',
    totalCandidates: 280,
    mode: 'Online AI Proctored',
    questionCount: 50,
    passMarks: 40,
    status: 'Question Bank Ready'
  },
  {
    id: 'exam-4',
    paperCode: 'MLT201-OCT26',
    subject: 'MLT-201 Clinical Biochemistry & Hematology',
    course: 'Cert in Medical Lab Tech',
    scheduledDate: '22-Oct-2026',
    time: '11:00 AM - 01:00 PM',
    totalCandidates: 195,
    mode: 'Online AI Proctored',
    questionCount: 50,
    passMarks: 40,
    status: 'Draft / Schedule Open'
  }
];

export const ADMIN_QUESTION_BANK = [
  {
    id: 'q-1',
    paperCode: 'CS402-OCT26',
    question: 'Which of the following normal forms deals with multivalued dependency in relational databases?',
    options: ['1NF', '2NF', '3NF', '4NF'],
    correct: '4NF',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-2',
    paperCode: 'CS402-OCT26',
    question: 'In SQL, which command is used to remove a table structure along with all its data permanently?',
    options: ['DELETE', 'TRUNCATE', 'DROP', 'REMOVE'],
    correct: 'DROP',
    difficulty: 'Easy'
  },
  {
    id: 'q-3',
    paperCode: 'CS402-OCT26',
    question: 'What property in ACID guarantees that a database transaction is never left in an incomplete state upon crash?',
    options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
    correct: 'Atomicity',
    difficulty: 'Easy'
  },
  {
    id: 'q-4',
    paperCode: 'CS403-OCT26',
    question: 'Which HTTP method is idempotent and primarily used to completely replace an existing resource?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    correct: 'PUT',
    difficulty: 'Intermediate'
  }
];

export const ADMIN_PROCTORING_LOGS = [
  {
    id: 'proc-1',
    rollNo: 'NCTMS2026CS1092',
    studentName: 'Alexander James Thompson',
    paperCode: 'CS402-OCT26',
    timestamp: '10:14:22 AM',
    event: 'Active Camera & Microphone stream verified. Integrity index 99.2%',
    type: 'Normal'
  },
  {
    id: 'proc-2',
    rollNo: 'NCTMS2026CS1104',
    studentName: 'R. Kirthika',
    paperCode: 'CS402-OCT26',
    timestamp: '10:28:40 AM',
    event: 'Tab switch / blur event flagged (Duration 4.2s). Warning prompt shown to candidate.',
    type: 'Warning'
  },
  {
    id: 'proc-3',
    rollNo: 'NCTMS2026CS1088',
    studentName: 'M. Senthilkumar',
    paperCode: 'CS402-OCT26',
    timestamp: '10:41:05 AM',
    event: 'Multiple faces momentarily detected in web camera bounding box.',
    type: 'Warning'
  },
  {
    id: 'proc-4',
    rollNo: 'NCTMS2026CS1092',
    studentName: 'Alexander James Thompson',
    paperCode: 'CS402-OCT26',
    timestamp: '11:45:10 AM',
    event: 'Candidate submitted examination paper cleanly. Integrity verified.',
    type: 'Success'
  }
];

export const ADMIN_RESULTS_BATCH = [
  {
    id: 'res-1',
    rollNo: 'NCTMS2026CS1092',
    candidateName: 'Alexander James Thompson',
    courseCode: 'DCS-101',
    courseName: 'Diploma in Computer Science & Engineering',
    centerCode: 'NCTMS-TN-104',
    internalMarks: 184,
    externalMarks: 436,
    totalMarks: 620,
    maxMarks: 700,
    percentage: '88.5%',
    grade: 'First Class with Distinction',
    publishStatus: 'Published Online',
    certStatus: 'Digitally Signed & Issued',
    certNo: 'NCTMS-CERT-2026-9921'
  },
  {
    id: 'res-2',
    rollNo: 'NCTMS2026CS1093',
    candidateName: 'K. Divyabharathi',
    courseCode: 'DCS-101',
    courseName: 'Diploma in Computer Science & Engineering',
    centerCode: 'NCTMS-TN-104',
    internalMarks: 172,
    externalMarks: 412,
    totalMarks: 584,
    maxMarks: 700,
    percentage: '83.4%',
    grade: 'First Class',
    publishStatus: 'Published Online',
    certStatus: 'Digitally Signed & Issued',
    certNo: 'NCTMS-CERT-2026-9922'
  },
  {
    id: 'res-3',
    rollNo: 'NCTMS2026CS1094',
    candidateName: 'Mohammed Ashiq',
    courseCode: 'DCS-101',
    courseName: 'Diploma in Computer Science & Engineering',
    centerCode: 'NCTMS-TN-104',
    internalMarks: 165,
    externalMarks: 395,
    totalMarks: 560,
    maxMarks: 700,
    percentage: '80.0%',
    grade: 'First Class',
    publishStatus: 'Ready for Publication',
    certStatus: 'Pending Digital Signature',
    certNo: 'Pending'
  },
  {
    id: 'res-4',
    rollNo: 'NCTMS2026MG2011',
    candidateName: 'Rohit Sharma',
    courseCode: 'PGDM-201',
    courseName: 'Post Graduate Diploma in Management',
    centerCode: 'NCTMS-KA-212',
    internalMarks: 190,
    externalMarks: 440,
    totalMarks: 630,
    maxMarks: 700,
    percentage: '90.0%',
    grade: 'First Class with Distinction',
    publishStatus: 'Ready for Publication',
    certStatus: 'Pending Digital Signature',
    certNo: 'Pending'
  },
  {
    id: 'res-5',
    rollNo: 'NCTMS2026ML3042',
    candidateName: 'Sneha Mohan',
    courseCode: 'CMLT-301',
    courseName: 'Certificate in Medical Lab Technology',
    centerCode: 'NCTMS-KL-308',
    internalMarks: 92,
    externalMarks: 215,
    totalMarks: 307,
    maxMarks: 400,
    percentage: '76.8%',
    grade: 'First Class',
    publishStatus: 'Draft / Internal Scrutiny',
    certStatus: 'Pending Digital Signature',
    certNo: 'Pending'
  }
];

export const ADMIN_TRANSACTIONS = [
  {
    txnId: 'TXN-NCTMS-2026-90412',
    date: '06-Oct-2026, 14:22',
    payer: 'Alexander James Thompson',
    category: 'Final Term Examination Fee',
    amount: '₹ 1,200.00',
    mode: 'Razorpay / Card',
    status: 'Success',
    center: 'NCTMS-TN-104'
  },
  {
    txnId: 'TXN-NCTMS-2026-90413',
    date: '05-Oct-2026, 11:45',
    payer: 'National Academy Chennai (TN-104)',
    category: 'Annual Center Affiliation Fee',
    amount: '₹ 25,000.00',
    mode: 'RTGS / Bank Transfer',
    status: 'Success',
    center: 'NCTMS-TN-104'
  },
  {
    txnId: 'TXN-NCTMS-2026-90414',
    date: '05-Oct-2026, 09:12',
    payer: 'Priya Sundaram',
    category: 'Admission Enrollment Fee',
    amount: '₹ 4,500.00',
    mode: 'UPI / PhonePe',
    status: 'Success',
    center: 'NCTMS-TN-104'
  },
  {
    txnId: 'TXN-NCTMS-2026-90415',
    date: '04-Oct-2026, 16:30',
    payer: 'R. Murugavel',
    category: 'Provisional Certificate Fee',
    amount: '₹ 850.00',
    mode: 'UPI / GooglePay',
    status: 'Success',
    center: 'NCTMS-TN-104'
  },
  {
    txnId: 'TXN-NCTMS-2026-90416',
    date: '04-Oct-2026, 10:15',
    payer: 'Apex Institute Bengaluru (KA-212)',
    category: 'Student Examination Fee Batch 2026',
    amount: '₹ 38,400.00',
    mode: 'NEFT / NetBanking',
    status: 'Success',
    center: 'NCTMS-KA-212'
  },
  {
    txnId: 'TXN-NCTMS-2026-90417',
    date: '03-Oct-2026, 18:04',
    payer: 'K. Vignesh',
    category: 'Online Admission Application Fee',
    amount: '₹ 500.00',
    mode: 'PayTM / UPI',
    status: 'Success',
    center: 'NCTMS-MH-450'
  }
];

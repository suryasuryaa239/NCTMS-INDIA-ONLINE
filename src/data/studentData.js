export const STUDENT_PROFILE = {
  rollNo: 'NCTMS2026CS1092',
  enrollmentNo: 'ENR-2025-TN-9812',
  fullName: 'Alexander James Thompson',
  fatherName: 'Robert Thompson',
  motherName: 'Helen Thompson',
  dob: '14-Aug-2001',
  gender: 'Male',
  bloodGroup: 'O+',
  email: 'alexander.cs@nctms.in',
  phone: '+91 98401 23456',
  address: 'No. 12, Greenways Road, R.A. Puram, Chennai - 600028',
  state: 'Tamil Nadu',
  program: 'Post Graduate Diploma in Computer Science',
  courseCode: 'PGDCS-201',
  department: 'Computer Science & Information Technology',
  currentSemester: 'Semester 2 (Final Term)',
  admissionDate: '12-Aug-2025',
  centerName: 'National Academy of Technical & Computer Science, Chennai',
  centerCode: 'NCTMS-TN-104',
  overallAttendance: 92.4,
  cgpa: 8.84,
  feeStatus: 'PAID'
};

export const STUDENT_ATTENDANCE = [
  { subject: 'Advanced Data Structures & Algorithms', code: 'CS101', conducted: 45, attended: 42, percentage: 93.3 },
  { subject: 'Relational Database Management Systems', code: 'CS102', conducted: 50, attended: 46, percentage: 92.0 },
  { subject: 'Full-Stack Web Architectures & React', code: 'CS103', conducted: 48, attended: 47, percentage: 97.9 },
  { subject: 'Cloud Infrastructure & DevOps Practices', code: 'CS104', conducted: 40, attended: 35, percentage: 87.5 },
  { subject: 'Software Project Implementation & Lab', code: 'CS105', conducted: 30, attended: 29, percentage: 96.6 }
];

export const STUDENT_CLASSES = [
  {
    id: 'lec-1',
    subject: 'Relational Database Management Systems',
    code: 'CS102',
    topic: 'Relational Algebra & Normalization (1NF, 2NF, 3NF & BCNF)',
    faculty: 'Dr. V. Sharma, M.Tech, Ph.D.',
    duration: '52 mins',
    date: '04-Oct-2026',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/images/classes.jpg',
    notesFileName: 'CS102_Normalization_Complete_Notes.pdf',
    status: 'Recorded Archive',
    views: '1,420 students'
  },
  {
    id: 'lec-2',
    subject: 'Full-Stack Web Architectures & React',
    code: 'CS103',
    topic: 'React 19 State Architecture, Hooks & Server Component Lifecycles',
    faculty: 'Er. K. Anitha, Senior Architect',
    duration: '65 mins',
    date: '02-Oct-2026',
    videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    thumbnail: '/assets/images/portal.jpg',
    notesFileName: 'CS103_React_Architecture_Guide.pdf',
    status: 'Recorded Archive',
    views: '2,105 students'
  },
  {
    id: 'lec-3',
    subject: 'Advanced Data Structures',
    code: 'CS101',
    topic: 'Graph Algorithms: Dijkstra, Bellman-Ford & Minimum Spanning Trees',
    faculty: 'Prof. R. Rajesh, M.E.',
    duration: '45 mins',
    date: 'Today • 04:00 PM',
    videoUrl: '',
    thumbnail: '/assets/images/hero-students.jpg',
    notesFileName: 'CS101_Graph_Algorithms.pdf',
    status: 'Upcoming Live Session',
    views: 'Live Stream'
  }
];

export const STUDENT_EXAMS = [
  {
    id: 'exam-cs402',
    subject: 'CS-402 Database Management Systems',
    paperCode: 'CS402-OCT26',
    date: '12-Oct-2026',
    time: '10:00 AM - 12:00 PM (2 Hours)',
    totalMarks: 50,
    passingMarks: 20,
    status: 'Scheduled',
    hallTicketNo: 'HT-2026-NCTMS-8812',
    canLaunch: true
  },
  {
    id: 'exam-cs403',
    subject: 'CS-403 Web Technologies & Cloud',
    paperCode: 'CS403-OCT26',
    date: '15-Oct-2026',
    time: '02:00 PM - 04:00 PM (2 Hours)',
    totalMarks: 50,
    passingMarks: 20,
    status: 'Scheduled',
    hallTicketNo: 'HT-2026-NCTMS-8812',
    canLaunch: false
  }
];

export const EXAM_QUESTION_BANK = [
  {
    id: 1,
    question: 'Which of the following database normal forms specifically eliminates transitive functional dependencies in a relation schema?',
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)'
    ],
    correctAnswer: 2,
    explanation: '3NF requires that the relation is in 2NF and no non-prime attribute is transitively dependent on the primary key.'
  },
  {
    id: 2,
    question: 'In the ACID properties of database transactions, what does the "I" stand for?',
    options: [
      'Integrity',
      'Isolation',
      'Indexing',
      'Iteration'
    ],
    correctAnswer: 1,
    explanation: 'Isolation ensures that concurrent execution of transactions leaves the database in the same state as if transactions were executed sequentially.'
  },
  {
    id: 3,
    question: 'Which SQL clause is used to filter records that result from an aggregate function grouped by GROUP BY?',
    options: [
      'WHERE',
      'HAVING',
      'ORDER BY',
      'LIMIT'
    ],
    correctAnswer: 1,
    explanation: 'The HAVING clause was added to SQL because the WHERE keyword cannot be used with aggregate functions like COUNT, SUM, or AVG.'
  },
  {
    id: 4,
    question: 'What type of lock allows multiple concurrent transactions to read data, but prevents any transaction from writing to that data?',
    options: [
      'Exclusive Lock (X)',
      'Shared Lock (S)',
      'Intent Exclusive Lock (IX)',
      'Deadlock'
    ],
    correctAnswer: 1,
    explanation: 'A shared lock (S lock) allows multiple transactions to read the locked resource simultaneously without allowing modifications.'
  },
  {
    id: 5,
    question: 'Which index structure is most widely implemented in relational databases like PostgreSQL and MySQL InnoDB for primary keys and range scans?',
    options: [
      'Hash Index',
      'B+ Tree Index',
      'Binary Search Tree',
      'Linear Array'
    ],
    correctAnswer: 1,
    explanation: 'B+ Trees maintain balanced depth and keep all record pointers at leaf nodes linked sequentially, making range queries exceptionally fast.'
  },
  {
    id: 6,
    question: 'In SQL, what is the key difference between DELETE and TRUNCATE statements?',
    options: [
      'DELETE cannot use a WHERE clause, while TRUNCATE can',
      'TRUNCATE is a DDL operation that cannot be rolled back in standard SQL and resets auto-increment keys, whereas DELETE is a DML logged row-by-row',
      'DELETE completely drops the table schema, while TRUNCATE only removes rows',
      'There is no functional difference'
    ],
    correctAnswer: 1,
    explanation: 'TRUNCATE deallocates data pages quickly as a DDL statement, whereas DELETE deletes records row-by-row firing triggers and logging each row.'
  },
  {
    id: 7,
    question: 'What is the phenomenon called when two transactions are each waiting for the other to release locks, leading to indefinite stalling?',
    options: [
      'Starvation',
      'Deadlock',
      'Phantom Read',
      'Dirty Read'
    ],
    correctAnswer: 1,
    explanation: 'A deadlock is a situation where two or more transactions form a cycle of dependency, each waiting for a lock held by another.'
  },
  {
    id: 8,
    question: 'Which of the following NoSQL database paradigms is best suited for complex networks of interrelated entities like social networks and recommendation systems?',
    options: [
      'Key-Value Store (Redis)',
      'Document Store (MongoDB)',
      'Graph Database (Neo4j)',
      'Column-Family Store (Cassandra)'
    ],
    correctAnswer: 2,
    explanation: 'Graph databases use nodes, edges, and properties to represent and store data, providing high performance for traversing deep relationship graphs.'
  },
  {
    id: 9,
    question: 'In database recovery algorithms, what does the WAL protocol stand for?',
    options: [
      'Wide Area Log',
      'Write-Ahead Logging',
      'Window Allocation Limit',
      'Weighted Action List'
    ],
    correctAnswer: 1,
    explanation: 'Write-Ahead Logging ensures that any change to a data page is recorded in durable log storage before the modified page is written to disk.'
  },
  {
    id: 10,
    question: 'In relational algebra, which operator is represented by the Greek letter σ (sigma)?',
    options: [
      'Projection',
      'Selection',
      'Cartesian Product',
      'Natural Join'
    ],
    correctAnswer: 1,
    explanation: 'Sigma (σ) represents Selection (filtering rows satisfying a predicate), while Pi (π) represents Projection (selecting specific columns).'
  }
];

export const STUDENT_FEES_LEDGER = [
  {
    receiptNo: 'REC-NCTMS-2025-4412',
    date: '12-Aug-2025',
    category: 'Admission & Term 1 Tuition Fee',
    amount: '₹ 11,000.00',
    mode: 'UPI (Ref: 421890312451)',
    status: 'PAID',
    invoiceUrl: 'NCTMS_Receipt_Term1.pdf'
  },
  {
    receiptNo: 'REC-NCTMS-2026-1092',
    date: '18-Jan-2026',
    category: 'Term 2 Tuition & LMS Access Fee',
    amount: '₹ 11,000.00',
    mode: 'NetBanking (HDFC Bank)',
    status: 'PAID',
    invoiceUrl: 'NCTMS_Receipt_Term2.pdf'
  },
  {
    receiptNo: 'REC-NCTMS-2026-7821',
    date: '15-Sep-2026',
    category: 'Final Semester Examination & Proctoring Fee',
    amount: '₹ 1,200.00',
    mode: 'Debit Card (Visa •••• 4012)',
    status: 'PAID',
    invoiceUrl: 'NCTMS_Receipt_ExamFee.pdf'
  }
];

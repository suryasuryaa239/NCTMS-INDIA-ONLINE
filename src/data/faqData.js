// src/data/faqData.js
/**
 * Official NCTMS India Institutional Frequently Asked Questions (FAQ)
 * Verified against existing project modules, council policies, and academic frameworks.
 */

export const FAQ_CATEGORIES = [
  'All',
  'Admissions',
  'Courses',
  'Examinations',
  'Results',
  'Certificates',
  'Online Payments',
  'Student Portal'
];

export const FAQ_DATA = [
  // 1. Admissions
  {
    id: 'faq-adm-1',
    category: 'Admissions',
    question: 'How do I apply for an NCTMS India academic or technical program?',
    answer: 'Prospective students can submit applications directly through the centralized online admission portal (/admission). You will select your desired course and accredited study center, complete personal and qualification details, and upload supporting academic documents. A tracking ID is generated upon submission to monitor application review.',
    keywords: 'apply online registration admissions procedure application form'
  },
  {
    id: 'faq-adm-2',
    category: 'Admissions',
    question: 'What are the general eligibility requirements for Diploma and PG Diploma programs?',
    answer: 'Eligibility criteria depend on the qualification level: Certificate programs require secondary school completion (10th standard pass); Technical and Vocational Diplomas require Higher Secondary (10+2) or equivalent technical trade qualification; Post Graduate Diplomas require a recognized Bachelor\'s degree or three-year polytechnic diploma from an approved board.',
    keywords: 'eligibility criteria qualification 10+2 graduation requirements'
  },
  {
    id: 'faq-adm-3',
    category: 'Admissions',
    question: 'How can I check my submitted admission application status?',
    answer: 'You can check your application review progress using the Application Status Tracker on the Admission page (/admission/status) by entering your unique Application Reference Number (e.g. NCTMS-APP-...) and registered mobile number.',
    keywords: 'admission status tracking application reference number review'
  },

  // 2. Courses
  {
    id: 'faq-crs-1',
    category: 'Courses',
    question: 'What disciplines and technical trades are offered by NCTMS India?',
    answer: 'NCTMS India provides programs across Computer Science & Information Technology, Management & Business Studies, Paramedical & Allied Healthcare Sciences, Electrical & Electronics Engineering, and Vocational Technical Trades. Detailed course brochures and syllabi can be viewed on the Courses page (/courses).',
    keywords: 'programs courses disciplines computer science management paramedical'
  },
  {
    id: 'faq-crs-2',
    category: 'Courses',
    question: 'Are study materials and live online lectures provided for remote learners?',
    answer: 'Yes. Registered students have access to digital study materials, curriculum handbooks, and scheduled interactive classes via the Online Classes portal (/online-classes) and their personalized Student ERP Dashboard.',
    keywords: 'study material digital classes lectures remote learning syllabus'
  },

  // 3. Examinations
  {
    id: 'faq-exm-1',
    category: 'Examinations',
    question: 'How are NCTMS term-end examinations conducted?',
    answer: 'Term-end assessments are conducted online via the secure Online Examination portal (/online-examination) with automated camera proctoring, screen isolation, and identity verification. Candidates answer questions within scheduled time windows as notified by the Examination Division.',
    keywords: 'online examination test proctoring assessment exam room'
  },
  {
    id: 'faq-exm-2',
    category: 'Examinations',
    question: 'When and where can I download my examination Hall Ticket?',
    answer: 'Official electronic hall tickets with digital QR proctoring passes are released prior to examination cycles. Candidates can log in to the Student Exam Center (/student/exam-center) to view their exam schedule and print their admit card.',
    keywords: 'hall ticket admit card exam schedule proctoring pass download'
  },

  // 4. Results
  {
    id: 'faq-res-1',
    category: 'Results',
    question: 'How can I check my semester or term-end examination results?',
    answer: 'Examination results can be checked through the Examination Results portal (/results) by entering your permanent Roll Number and verifying your registered Date of Birth. The system displays subject-wise marks, pass status, and cumulative grade points.',
    keywords: 'results marks marksheet score grade pass check'
  },
  {
    id: 'faq-res-2',
    category: 'Results',
    question: 'What grading standard is utilized by the NCTMS Examination Board?',
    answer: 'NCTMS India utilizes a 10-point Cumulative Grade Point Average (CGPA) system: O (Outstanding, 90-100%), A+ (Excellent, 80-89%), A (Very Good, 70-79%), B+ (Good, 60-69%), and B (Pass, 50-59%). The minimum qualifying threshold for course completion is 50%.',
    keywords: 'grading scale cgpa evaluation marks percentage pass marks'
  },

  // 5. Certificates
  {
    id: 'faq-crt-1',
    category: 'Certificates',
    question: 'How can employers or institutions verify an NCTMS certificate?',
    answer: 'Employers, embassies, and universities can verify authentic parchments in real-time on the Certificate Verification portal (/verify) by entering the Certificate Serial Number or scanning the tamper-evident QR code printed on the credential.',
    keywords: 'certificate verification qr code authenticate diploma check'
  },
  {
    id: 'faq-crt-2',
    category: 'Certificates',
    question: 'What happens if a certificate has been revoked or cancelled?',
    answer: 'Certificates cancelled due to disciplinary inquiry or center disaffiliation are clearly flagged as "Revoked / Cancelled by Council Order" on the public registry with the formal order reference (e.g. NCTMS/VIG/2024/09). A revoked credential holds zero academic or employment validity.',
    keywords: 'revoked cancelled certificate fake fraud invalidation'
  },
  {
    id: 'faq-crt-3',
    category: 'Certificates',
    question: 'How do I apply for duplicate certificates or official migration transcripts?',
    answer: 'Students requiring duplicate diplomas, migration certificates, or consolidated mark statements can submit official requisition forms through the Applications & Downloads portal (/downloads).',
    keywords: 'duplicate certificate migration transcript download requisition'
  },

  // 6. Online Payments
  {
    id: 'faq-pay-1',
    category: 'Online Payments',
    question: 'What fee categories can be paid through the online portal?',
    answer: 'The Online Payment portal (/online-payment) supports payments for Term Tuition Fees, Examination Registration Fees, Re-Evaluation & Scrutiny Fees, Provisional Certificate Fees, and Migration Requisition Fees.',
    keywords: 'fees payment online payment payment categories pay tuition'
  },
  {
    id: 'faq-pay-2',
    category: 'Online Payments',
    question: 'How do I obtain a payment receipt after an online transaction?',
    answer: 'Upon successful transaction settlement, the portal generates an official digitized council receipt with a unique transaction reference number (e.g. NCTMS-PAY-...) that can be printed or saved immediately.',
    keywords: 'receipt payment confirmation challan proof invoice'
  },

  // 7. Student Portal
  {
    id: 'faq-stu-1',
    category: 'Student Portal',
    question: 'How do I access my personalized Student ERP account?',
    answer: 'Students can access their profile, online courses, fee receipts, and exam schedules by clicking "Student Login" in the header navigation or navigating to /student/dashboard using their registered roll number and password.',
    keywords: 'student login erp portal dashboard account access'
  },
  {
    id: 'faq-stu-2',
    category: 'Student Portal',
    question: 'What should I do if I am unable to log in to my student account?',
    answer: 'If you encounter authentication issues, verify your Roll Number credentials or contact the institutional helpdesk at helpdesk@nctms.in. Study center coordinators can also reset portal access for enrolled candidates.',
    keywords: 'login issue forgot password reset account helpdesk'
  }
];

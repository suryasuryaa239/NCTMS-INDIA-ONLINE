export const COURSES_DATA = [
  {
    id: 'cs-dip-101',
    code: 'DCS-101',
    title: 'Diploma in Computer Science & Engineering',
    category: 'Computer Science & IT',
    level: 'Diploma',
    duration: '1 Year / 2 Semesters',
    eligibility: '10th Standard / SSLC Pass or Equivalent',
    fees: '₹ 14,500 per year',
    mode: 'Online & Blended Learning',
    description: 'A comprehensive technical program covering software fundamentals, data structures, full-stack web development, database management systems, and networking essentials designed for aspiring IT professionals.',
    highlights: [
      'Industry-aligned syllabus updated for 2026',
      'Hands-on lab simulations and practical projects',
      'Digital study materials and recorded video lectures',
      'Recognized council certification valid across public & private sectors'
    ],
    semesters: [
      {
        sem: 'Semester 1',
        subjects: [
          'CS101: Fundamentals of Computing & C Programming',
          'CS102: Digital Electronics & Logic Design',
          'CS103: Operating Systems & Shell Scripting',
          'CS104: Communication Skills & Professional Ethics',
          'CS105: Programming Lab - C & Linux'
        ]
      },
      {
        sem: 'Semester 2',
        subjects: [
          'CS201: Object Oriented Programming with Java',
          'CS202: Data Structures & Algorithms',
          'CS203: Database Management Systems (SQL & NoSQL)',
          'CS204: Web Technologies (HTML5, CSS3, JavaScript, React)',
          'CS205: Capstone Technical Project & Viva-Voce'
        ]
      }
    ],
    careerOpportunities: ['Junior Software Developer', 'Web Developer', 'Technical Support Engineer', 'Database Administrator Assistant']
  },
  {
    id: 'pgdm-201',
    code: 'PGDM-201',
    title: 'Post Graduate Diploma in Management (PGDM)',
    category: 'Management & Business',
    level: 'Post Graduate Diploma',
    duration: '1 Year / 2 Semesters',
    eligibility: 'Any Bachelor Degree from a recognized University',
    fees: '₹ 22,000 per year',
    mode: 'Online Interactive',
    description: 'Designed for working executives and graduates aiming to master corporate leadership, strategic finance, human resource management, digital marketing, and business analytics in modern business ecosystems.',
    highlights: [
      'Case study-based pedagogy inspired by global business schools',
      'Weekend live webinars with corporate industry leaders',
      'Executive project mentorship and career guidance',
      'Dual specialization options in Marketing, Finance, or HR'
    ],
    semesters: [
      {
        sem: 'Semester 1',
        subjects: [
          'MGT101: Principles of Management & Organizational Behavior',
          'MGT102: Managerial Economics & Quantitative Methods',
          'MGT103: Accounting & Financial Statement Analysis',
          'MGT104: Marketing Management & Consumer Research',
          'MGT105: Business Communication & Executive Presence'
        ]
      },
      {
        sem: 'Semester 2',
        subjects: [
          'MGT201: Strategic Management & Corporate Governance',
          'MGT202: Human Resource Planning & Talent Analytics',
          'MGT203: Digital Business Transformation & E-Commerce',
          'MGT204: Supply Chain & Operations Management',
          'MGT205: Executive Capstone Dissertation / Industry Internship'
        ]
      }
    ],
    careerOpportunities: ['Business Analyst', 'Operations Manager', 'Marketing Strategist', 'HR Business Partner', 'Management Consultant']
  },
  {
    id: 'cmlt-301',
    code: 'CMLT-301',
    title: 'Certificate in Medical Laboratory Technology',
    category: 'Healthcare & Paramedical',
    level: 'Certificate',
    duration: '6 Months',
    eligibility: '10+2 with Science stream (PCB / PCM) or equivalent',
    fees: '₹ 9,500 total',
    mode: 'Hybrid (Online Theory + Hospital Practicum)',
    description: 'Focuses on clinical pathology, hematology, blood banking, clinical biochemistry, and diagnostic microbiology, training students for careers in diagnostic centers and hospitals.',
    highlights: [
      'Comprehensive coverage of laboratory instrumentation',
      'Standard operating procedures (SOP) and bio-safety protocols',
      'Hands-on clinical internship tie-ups with affiliated healthcare centers',
      'Government and private diagnostic lab employability'
    ],
    semesters: [
      {
        sem: 'Term Modules',
        subjects: [
          'MLT101: Basic Anatomy, Physiology & Medical Terminology',
          'MLT102: Clinical Hematology & Blood Banking Procedures',
          'MLT103: Clinical Biochemistry & Routine Lab Tests',
          'MLT104: Diagnostic Microbiology, Parasitology & Urinalysis',
          'MLT105: Practical Lab Diagnostics & Hospital Internship'
        ]
      }
    ],
    careerOpportunities: ['Lab Technician', 'Phlebotomist', 'Pathology Assistant', 'Quality Control Lab Assistant']
  },
  {
    id: 'ai-adv-102',
    code: 'ADAI-102',
    title: 'Advance Diploma in Artificial Intelligence & Data Science',
    category: 'Computer Science & IT',
    level: 'Advance Diploma',
    duration: '2 Years / 4 Semesters',
    eligibility: '10+2 with Mathematics / Computer Science or Polytechnic Diploma',
    fees: '₹ 18,500 per year',
    mode: 'Online with Cloud Lab Access',
    description: 'Cutting-edge program covering machine learning pipelines, deep learning architectures, Python for data science, computer vision, natural language processing, and generative AI deployments.',
    highlights: [
      'Hands-on Jupyter notebooks and GPU cloud lab access',
      'Over 20+ real-world machine learning dataset projects',
      'Curated mentorship by senior AI researchers',
      'Portfolio building for AI engineer and data analyst roles'
    ],
    semesters: [
      {
        sem: 'Semester 1',
        subjects: ['AI101: Python Programming for Data Science', 'AI102: Applied Linear Algebra & Statistics', 'AI103: Data Wrangling with Pandas & NumPy', 'AI104: Data Visualization & Business Dashboards']
      },
      {
        sem: 'Semester 2',
        subjects: ['AI201: Classical Machine Learning Algorithms', 'AI202: Feature Engineering & Model Evaluation', 'AI203: SQL for Advanced Analytics', 'AI204: Supervised & Unsupervised Mini-Project']
      },
      {
        sem: 'Semester 3',
        subjects: ['AI301: Deep Neural Networks with PyTorch & TensorFlow', 'AI302: Computer Vision & Convolutional Networks', 'AI303: Natural Language Processing & Transformers', 'AI304: AI Ethics & Governance']
      },
      {
        sem: 'Semester 4',
        subjects: ['AI401: Generative AI & Large Language Models (LLMs)', 'AI402: MLOps: Model Deployment & API Serving', 'AI403: Cloud AI Infrastructure (AWS / GCP)', 'AI404: Major Industry Capstone Project']
      }
    ],
    careerOpportunities: ['Data Scientist', 'Machine Learning Engineer', 'AI Solutions Consultant', 'Business Intelligence Developer']
  },
  {
    id: 'hosp-mgmt-202',
    code: 'DHM-202',
    title: 'Diploma in Hospital & Healthcare Management',
    category: 'Healthcare & Paramedical',
    level: 'Diploma',
    duration: '1 Year / 2 Semesters',
    eligibility: '10+2 in any stream or equivalent qualification',
    fees: '₹ 16,000 per year',
    mode: 'Online Interactive',
    description: 'Equips aspiring healthcare administrators with hospital operations management, patient care coordination, medical records administration, healthcare laws, and NABH quality standards.',
    highlights: [
      'End-to-end understanding of hospital operations & OPD/IPD workflows',
      'Healthcare economics and insurance claim processing',
      'NABH and JCI accreditation guidelines',
      'Hospital front-office and patient relationship excellence'
    ],
    semesters: [
      {
        sem: 'Semester 1',
        subjects: ['HM101: Overview of Health & Hospital Systems', 'HM102: Hospital Front Office & Patient Services', 'HM103: Medical Records Science & Health Informatics', 'HM104: Healthcare Economics & Financial Management']
      },
      {
        sem: 'Semester 2',
        subjects: ['HM201: Hospital Quality Management & NABH Standards', 'HM202: Medical Ethics, Laws & Patient Rights', 'HM203: Materials & Pharmacy Inventory Management', 'HM204: Hospital Operations Internship & Case Study']
      }
    ],
    careerOpportunities: ['Hospital Administrator', 'Patient Care Coordinator', 'Medical Records Executive', 'Healthcare Operations Associate']
  },
  {
    id: 'iti-elec-401',
    code: 'VTI-401',
    title: 'Vocational Diploma in Electrical & Electronics Engineering',
    category: 'Vocational & ITI Trades',
    level: 'Diploma',
    duration: '1 Year / 2 Semesters',
    eligibility: '10th Standard / Matriculation Pass',
    fees: '₹ 12,000 per year',
    mode: 'Hybrid (Online Modules + Center Workshop)',
    description: 'Practical technical training in industrial wiring, domestic electrical installations, transformer maintenance, solar power systems, motor drives, and safety protocols.',
    highlights: [
      'Comprehensive wiring diagrams and circuit troubleshooting',
      'Solar PV installation and renewable energy systems module',
      'Adherence to Indian Electricity Rules and industrial safety',
      'Authorized training center practical workshop access'
    ],
    semesters: [
      {
        sem: 'Semester 1',
        subjects: ['EE101: Electrical Safety, Tools & Basic Circuits', 'EE102: Domestic & Industrial Electrical Wiring', 'EE103: AC & DC Machines Fundamentals', 'EE104: Measuring Instruments & Workshop Practice']
      },
      {
        sem: 'Semester 2',
        subjects: ['EE201: Transformers, Alternators & Control Panels', 'EE202: Solar Panel Installation & Power Conditioning', 'EE203: Power Distribution & Maintenance', 'EE204: Practical Trade Test & Industrial Project']
      }
    ],
    careerOpportunities: ['Industrial Electrician', 'Electrical Supervisor', 'Solar Plant Technician', 'Maintenance Engineer']
  },
  {
    id: 'digi-mkt-203',
    code: 'CDM-203',
    title: 'Certificate in Digital Marketing & E-Commerce Growth',
    category: 'Management & Business',
    level: 'Certificate',
    duration: '6 Months',
    eligibility: '10+2 / Intermediate in any discipline',
    fees: '₹ 8,500 total',
    mode: '100% Online & Project-Based',
    description: 'Learn modern search engine optimization (SEO), Google Ads, social media performance marketing, content strategy, email automation, and conversion rate optimization with live campaign simulations.',
    highlights: [
      'Google Analytics 4 and Meta Ads Manager training',
      'Live budget allocation exercises and ROI analytics',
      'AI tools for automated copywriting and graphics generation',
      'Freelancing and agency launch roadmap'
    ],
    semesters: [
      {
        sem: 'Term Modules',
        subjects: [
          'DM101: Search Engine Optimization (On-Page, Off-Page & Technical SEO)',
          'DM102: Search Engine Marketing & Google Search / Display Ads',
          'DM103: Social Media Marketing & Meta Ads (Instagram / Facebook / LinkedIn)',
          'DM104: Content Marketing, Email Marketing & Marketing Automation',
          'DM105: E-Commerce Store Building (Shopify/WooCommerce) & Live Project'
        ]
      }
    ],
    careerOpportunities: ['Digital Marketing Executive', 'SEO Specialist', 'Social Media Manager', 'Performance Marketer']
  },
  {
    id: 'rad-tech-302',
    code: 'DRIT-302',
    title: 'Diploma in Radiography & Medical Imaging Technology',
    category: 'Healthcare & Paramedical',
    level: 'Diploma',
    duration: '2 Years / 4 Semesters',
    eligibility: '10+2 with Physics, Chemistry & Biology',
    fees: '₹ 19,500 per year',
    mode: 'Hybrid (Classroom + Hospital Practicum)',
    description: 'Comprehensive program covering X-ray physics, radiation protection, positioning techniques, computed tomography (CT), magnetic resonance imaging (MRI), and ultrasonography.',
    highlights: [
      'AERB radiation safety standards and protection protocols',
      'Diagnostic positioning for skeletal and soft-tissue imaging',
      'Affiliated medical diagnostic facility clinical rotation',
      'High demand in corporate hospitals and diagnostic imaging chains'
    ],
    semesters: [
      {
        sem: 'Year 1',
        subjects: ['RIT101: Human Anatomy & Physiology', 'RIT102: Radiation Physics & X-Ray Equipment', 'RIT103: Radiographic Positioning - Part 1', 'RIT104: Radiation Safety & Darkroom Techniques']
      },
      {
        sem: 'Year 2',
        subjects: ['RIT201: Special Radiographic Procedures & Contrast Media', 'RIT202: Principles of Computed Tomography (CT Scan)', 'RIT203: Magnetic Resonance Imaging (MRI) & Ultrasound', 'RIT204: Hospital Clinical Practicum & Viva']
      }
    ],
    careerOpportunities: ['Radiology Technician', 'X-Ray Technologist', 'CT/MRI Assistant', 'Imaging Center Executive']
  }
];

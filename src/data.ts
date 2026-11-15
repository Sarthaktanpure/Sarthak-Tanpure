// Canonical Typed Data Source for Sarthak Tanpure Portfolio
// Exact Records from Sarthak Tanpure Resume & Verified Profiles

export interface Project {
  id: string;
  index: string;
  title: string;
  dates: string;
  category: string;
  tags: string[];
  shape: 'circle' | 'square' | 'triangle';
  shapeColor: string;
  problem: string;
  approach: string;
  result: string;
  keyMetric: string;
  metricLabel: string;
  stack: string[];
  bullets: string[];
  githubUrl: string;
  liveUrl?: string;
}

export interface NoteItem {
  type: string;
  title: string;
  meta: string;
  detail: string;
  bullets?: string[];
  link?: string;
}

export interface PortfolioData {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  resumeUrl: string;
  tagline: string;
  summary: string;
  statement: string[];
  technicalSkills: {
    programming: string[];
    dataAnalytics: string[];
    frontendBackend: string[];
    databases: string[];
    aiMl: string[];
    csFundamentals: string[];
    tools: string[];
    professional: string[];
  };
  projects: Project[];
  toolBands: {
    band1: string[]; // AI, ML, Data & Analytics
    band2: string[]; // Frontend, Backend, Databases & Systems
  };
  notes: {
    experience: NoteItem[];
    achievements: NoteItem[];
    education: NoteItem[];
  };
  links: {
    github: string;
    linkedin: string;
    leetcode: string;
    emailMailto: string;
    resumePdf: string;
    website: string;
  };
}

export const DATA: PortfolioData = {
  name: "Sarthak Tanpure",
  firstName: "SARTHAK",
  lastName: "TANPURE",
  role: "Data & Analytics, Applied Machine Learning, Full-Stack Developer",
  email: "sarthaktanpure255@gmail.com",
  phone: "+91 9307919092",
  location: "Maharashtra, India (UTC +05:30)",
  resumeUrl: "/sarthak_tanpure_resume.pdf",
  tagline: "B.E. IT student specializing in data analysis, machine learning & scalable full-stack MERN systems.",
  summary: "B.E. Information Technology student (full-time, graduating 2028) with hands-on experience in data analysis, analytics dashboards and machine learning, seeking a Technology Consulting Intern role in data and analytics. Analyzed 20,000+ financial transactions with XGBoost and Isolation Forest, built full-stack MERN apps with REST APIs and Python-based ML services, and delivered a paid client project by translating business requirements into a deployed web application. Solved 250+ DSA problems in Java. Strong written and oral English, teamwork and a learning mindset.",
  statement: [
    "B.E. Information Technology student (Rank 1 in cohort, graduating 2028) at Pravara Rural Engineering College, Loni.",
    "Hands-on experience in data analysis, analytics dashboards, and machine learning — analyzed 20,000+ transactions with XGBoost & Isolation Forest.",
    "Built full-stack MERN apps with REST APIs & Flask ML services, delivered a paid client project (INR 4,999), and solved 250+ DSA problems in Java."
  ],
  technicalSkills: {
    programming: ["Python", "Java", "JavaScript (ES6+)", "SQL"],
    dataAnalytics: ["Data Analysis", "Data and Analytics", "Data Visualization", "Anomaly Detection", "Predictive Modeling", "Data Pipelines"],
    frontendBackend: ["React.js", "Node.js", "Express.js", "MERN Stack", "REST APIs", "Flask", "Socket.IO", "JWT", "RBAC"],
    databases: ["MongoDB", "PostgreSQL"],
    aiMl: ["Machine Learning", "Deep Learning", "Computer Vision", "Deep Reinforcement Learning", "PyTorch", "CNN", "PPO", "XGBoost", "Isolation Forest", "Stable-Baselines3"],
    csFundamentals: ["Algorithms", "Data Structures", "OOP", "DBMS", "Computer Networks", "System Design"],
    tools: ["Git", "GitHub", "Postman", "Vercel", "Render"],
    professional: ["Client Support", "Requirements Gathering", "Research & Problem Solving", "Teamwork & Collaboration", "Active Listening", "Written & Oral English"]
  },
  projects: [
    {
      id: "fraud-detection",
      index: "01",
      title: "Fraud Detection System",
      dates: "May 2026 – Jun 2026",
      category: "AI-Powered Financial Risk Screening",
      tags: ["React", "Node.js", "Express.js", "Flask", "PostgreSQL", "XGBoost", "Python"],
      shape: "circle",
      shapeColor: "#FF4A1C",
      problem: "Financial transaction platforms require sub-20ms anomaly detection across 20,000+ transactions to intercept fraud without disrupting legitimate payments.",
      approach: "Integrated a Flask-based ML service using XGBoost (supervised learning) and Isolation Forest (anomaly detection), secured via 10+ RESTful APIs with JWT authentication, bcrypt password hashing, and role-based access control (RBAC).",
      result: "Performed data analysis on 20,000+ synthetic financial transactions with real-time fraud scoring, alert generation, and a role-based React analytics dashboard presenting data-driven insights to analysts.",
      keyMetric: "20,000+",
      metricLabel: "TRANSACTIONS ANALYZED // XGBOOST + ISOLATION FOREST",
      stack: ["React.js", "Node.js", "Express.js", "Flask", "PostgreSQL", "XGBoost", "Isolation Forest", "Python"],
      bullets: [
        "Built a full-stack AI-powered fraud detection platform performing data analysis on 20,000+ synthetic financial transactions through an end-to-end machine learning detection pipeline.",
        "Designed and implemented 10+ RESTful APIs with JWT authentication, bcrypt password hashing, role-based access control (RBAC) and input validation to secure transaction workflows.",
        "Integrated a Flask-based ML service using XGBoost (supervised learning) and Isolation Forest (anomaly detection), enabling real-time fraud scoring and alert generation; debugged data-pipeline and API integration issues.",
        "Developed a role-based React analytics dashboard with real-time fraud metrics, transaction monitoring and alert investigation workflows, presenting data-driven insights to analysts."
      ],
      githubUrl: "https://github.com/Sarthaktanpure/Fraud-Detection-System"
    },
    {
      id: "developer-networking",
      index: "02",
      title: "Developer Networking Platform",
      dates: "Aug 2026 – Sep 2026",
      category: "Real-Time Connections & Messaging",
      tags: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.IO", "JWT"],
      shape: "square",
      shapeColor: "#FFD400",
      problem: "Developer collaboration platforms face slow query response times and messaging latency under multi-room concurrent traffic with unindexed collections.",
      approach: "Designed 13+ RESTful APIs with JWT-based authentication, route protection, input validation, and secure bcrypt password hashing, paired with Socket.IO for real-time chat.",
      result: "Enabled profile creation, connection requests and real-time messaging for 100+ simulated users, optimizing MongoDB queries using indexing and aggregation pipelines to reduce average API response time by ~30%.",
      keyMetric: "∼30%",
      metricLabel: "API RESPONSE TIME REDUCTION // 100+ SIMULATED USERS",
      stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.IO", "JWT", "Bcrypt"],
      bullets: [
        "Built a developer networking platform enabling profile creation, connection requests and real-time messaging for 100+ simulated users.",
        "Designed and implemented 13+ RESTful APIs supporting authentication, profile management, feeds and connection workflows.",
        "Implemented JWT-based authentication, route protection, input validation and secure bcrypt password hashing.",
        "Optimized MongoDB queries using indexing and aggregation pipelines, reducing average API response time by ∼30%.",
        "Integrated Socket.IO for real-time chat and instant message delivery with persistent conversation storage."
      ],
      githubUrl: "https://github.com/Sarthaktanpure/Developer-Networking-Platform"
    },
    {
      id: "autonomous-navigation",
      index: "03",
      title: "Autonomous Navigation Using Deep RL",
      dates: "Oct 2026 – Nov 2026",
      category: "Vision-Based Deep Reinforcement Learning",
      tags: ["Python", "PyTorch", "Stable-Baselines3", "CNN", "PPO", "Deep RL", "Computer Vision"],
      shape: "triangle",
      shapeColor: "#F3F1EA",
      problem: "Training an autonomous agent to negotiate complex multi-track configurations and mountain turns directly from raw RGB camera inputs without heuristic steering rules.",
      approach: "Developed an end-to-end driving agent using a CNN-based PPO (Proximal Policy Optimization) Actor-Critic architecture to learn vision-based steering and throttle control.",
      result: "Designed reward functions for lane-centering, speed regulation and collision avoidance; achieved full-lap navigation and generalization across mountain-track scenarios.",
      keyMetric: "CNN+PPO",
      metricLabel: "ACTOR-CRITIC // FULL-LAP MOUNTAIN GENERALIZATION",
      stack: ["Python", "PyTorch", "Stable-Baselines3", "CNN", "PPO", "Deep Reinforcement Learning", "Computer Vision"],
      bullets: [
        "Developed an end-to-end autonomous driving agent using a CNN-based PPO (Proximal Policy Optimization) Actor-Critic architecture to learn vision-based steering and throttle control directly from raw RGB camera inputs.",
        "Designed reward functions for lane-centering, speed regulation and collision avoidance, enabling stable lane-following and continuous control in simulation.",
        "Trained, evaluated and debugged the model across multiple track configurations, achieving full-lap navigation and generalization to mountain-track scenarios."
      ],
      githubUrl: "https://github.com/Sarthaktanpure/Autonomous-Navigation"
    }
  ],
  toolBands: {
    band1: [
      "Python", "PyTorch", "XGBoost", "Isolation Forest", "CNN Vision",
      "PPO Actor-Critic", "Data Analysis", "Anomaly Detection", "Predictive Modeling", "Java (250+ DSA)"
    ],
    band2: [
      "React.js", "Node.js", "Express.js", "MERN Stack", "REST APIs",
      "Flask", "Socket.IO", "MongoDB", "PostgreSQL", "JWT & RBAC", "Vercel"
    ]
  },
  notes: {
    experience: [
      {
        type: "EXPERIENCE & CLIENT WORK",
        title: "Jay Yogeshwar Solar – Paid Client Project",
        meta: "Client Delivery // React.js, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, REST APIs",
        detail: "Built and delivered a production website for a solar business as a paid client project worth INR 4,999, gathering business requirements and translating them into a deployed web application.",
        bullets: [
          "Built and delivered a production website for a solar business as a paid client project worth INR 4,999, gathering business requirements and translating them into a deployed web application.",
          "Developed responsive product showcase and customer enquiry workflows using React.js and Tailwind CSS, integrating frontend components with backend REST APIs.",
          "Implemented backend API endpoints and MongoDB workflows to manage product data and persist customer enquiries."
        ],
        link: "https://github.com/Sarthaktanpure"
      },
      {
        type: "EXPERIENCE & HACKATHONS",
        title: "India Tech Summit: Innovate 2026 – Team PunarnirmanAI",
        meta: "Round 2 Qualifier // Heritage Preservation AI Solution",
        detail: "Developed and presented a technology-driven solution for real-world heritage preservation challenges, advancing to Round 2 of India Tech Summit Innovate 2026 in a 4-member team.",
        bullets: [
          "Developed and presented a technology-driven solution for real-world heritage preservation challenges, advancing to Round 2 of India Tech Summit Innovate 2026.",
          "Collaborated in a 4-member team across solution design, implementation and problem-solving under strict deadlines, translating a real-world problem into a demonstrable software prototype."
        ],
        link: "https://github.com/Sarthaktanpure"
      }
    ],
    achievements: [
      {
        type: "ACHIEVEMENTS",
        title: "250+ DSA & Algorithm Problems in Java",
        meta: "LeetCode & GeeksForGeeks // Top 5% Across District Colleges",
        detail: "Solved 250+ DSA/algorithm problems in Java across Arrays, Trees, Graphs, Dynamic Programming, Stacks, and Hash Maps. Ranked in the top 5% across district engineering colleges.",
        link: "https://leetcode.com/u/Sarthak_Tanpure_01"
      }
    ],
    education: [
      {
        type: "EDUCATION",
        title: "Pravara Rural Engineering College (PREC), Loni",
        meta: "Currently Enrolled, B.E. Information Technology (Full-time) // Graduating 2028",
        detail: "Academic Standing: CGPA 8.67 / 10.0 | Rank 1 in Cohort. Full-time undergraduate degree in Information Technology.",
        link: "https://sarthaktanpure-portfolio.vercel.app/"
      },
      {
        type: "EDUCATION",
        title: "ASC College, Rahuri",
        meta: "Class XII // Higher Secondary Certificate (HSC)",
        detail: "Graduated with 74.60% in Higher Secondary Certificate (HSC) board examination.",
        link: "https://sarthaktanpure-portfolio.vercel.app/"
      }
    ]
  },
  links: {
    github: "https://github.com/Sarthaktanpure",
    linkedin: "https://www.linkedin.com/in/sarthak-tanpure-a74b5133a",
    leetcode: "https://leetcode.com/u/Sarthak_Tanpure_01",
    emailMailto: "mailto:sarthaktanpure255@gmail.com",
    resumePdf: "/sarthak_tanpure_resume.pdf",
    website: "https://sarthaktanpure-portfolio.vercel.app/"
  }
};

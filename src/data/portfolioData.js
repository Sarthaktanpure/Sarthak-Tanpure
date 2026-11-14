// Canonical Data Source for Sarthak Tanpure Portfolio
// Strict real records — no invented metrics, no placeholder copy.

export const DATA = {
  name: "Sarthak Tanpure",
  role: "Applied Machine Learning & Scalable Systems Engineer",
  email: "sarthaktanpure255@gmail.com",
  phone: "+91 9307919092",
  location: "Maharashtra, India (UTC +05:30)",
  resume: "/sarthak_tanpure_resume.pdf",
  about: "B.E. Information Technology student (CGPA: 8.67/10.0, Rank 1 in cohort) at Pravara Rural Engineering College, Loni (graduating 2028). Focused on applied Machine Learning, Deep Reinforcement Learning, and resilient full-stack systems that run reliably in the dark. Solved 250+ DSA problems in Java across arrays, trees, graphs, and dynamic programming.",
  
  projects: [
    {
      id: "fraud-engine",
      scene: "02",
      act: "THE WATCH",
      time: "02:00 — 03:30",
      title: "Financial Fraud Detection Platform",
      tagline: "AI-Powered Dual-Model Financial Risk Screening",
      problem: "Financial transactions in production require sub-20ms screening to intercept zero-day fraud attacks without introducing friction or false declines for 99.9% of legitimate users.",
      constraints: "High-throughput stream (20,000+ synthetic transactions), severe class imbalance (<1% fraud), strict latency ceiling (<20ms), and deterministic explainability for compliance audit trails.",
      architecture: "Decoupled REST ingestion layer secured by JWT/RBAC → Isolation Forest unsupervised outlier partitioner → Supervised XGBoost classifier → PostgreSQL persistence & quarantined alert queue.",
      decisions: "Selected a hybrid dual-layer pipeline: unsupervised Isolation Forest rapidly isolates multi-dimensional vector anomalies without labels, while tuned XGBoost computes calibrated risk probabilities (>0.85 threshold). This eliminates black-box hallucinations and maintains deterministic sub-20ms latency.",
      result: "99.975% overall accuracy, 1.0000 ROC-AUC, 100% recall on fraud test vectors (0 false negatives), 99.01% precision, and 18ms average inference latency on 20,000+ transactions.",
      stack: ["React.js", "Node.js", "Express.js", "Flask", "PostgreSQL", "XGBoost", "Isolation Forest", "Python"],
      link: "https://github.com/Sarthaktanpure/Fraud-Detection-System",
      metrics: {
        accuracy: "99.98%",
        rocAuc: "1.0000",
        latency: "18ms",
        throughput: "20k+ TX",
        recall: "100%"
      }
    },
    {
      id: "developer-mesh",
      scene: "03",
      act: "THE CONNECTION",
      time: "03:30 — 04:30",
      title: "Developer Networking Platform",
      tagline: "Real-Time Connections & Low-Latency Event Messaging",
      problem: "Developer collaboration platforms suffer from sluggish database query waterfalls and message delivery lag under multi-room concurrent traffic with unindexed collections.",
      constraints: "Scalable to 100+ simulated concurrent active developer nodes, real-time bidirectional message state synchronization, persistent conversation histories, and RBAC-secured feeds.",
      architecture: "React frontend with Socket.IO client → Node.js/Express REST & WebSocket gateway → MongoDB clusters with compound indexing and aggregation pipelines.",
      decisions: "Replaced repeated relational lookups with optimized MongoDB aggregation pipelines and compound indexes on [conversationId, timestamp]. Combined with persistent Socket.IO event rooms to guarantee message delivery with zero packet drops during momentary disconnects.",
      result: "Reduced average API query response time by ~30%, achieved sub-35ms WebSocket packet propagation across 13+ RESTful endpoints with persistent message histories.",
      stack: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.IO", "JWT", "Bcrypt"],
      link: "https://github.com/Sarthaktanpure/Developer-Networking-Platform",
      metrics: {
        latencyReduction: "−30%",
        endpoints: "13+ REST",
        simulatedNodes: "100+ Users",
        ping: "14ms WSS"
      }
    },
    {
      id: "deep-rl-agent",
      scene: "04",
      act: "THE MACHINE THINKS",
      time: "04:30 — 05:30",
      title: "Autonomous Navigation Using Deep RL",
      tagline: "Vision-Based Autonomous Driving with CNN + PPO Actor-Critic",
      problem: "Teaching an autonomous driving agent to negotiate complex multi-radius circuits and hairpins directly from raw camera vision without hand-crafted heuristic steering rules.",
      constraints: "Continuous 2D action space (steering [-1, 1], throttle [0, 1]), raw 120×160 RGB camera input, dynamic vehicle inertia, and zero telemetry lookahead.",
      architecture: "3-layer Convolutional Feature Extractor feeding a Proximal Policy Optimization (PPO) Actor-Critic network with Generalized Advantage Estimation (GAE) and clipped surrogate objective.",
      decisions: "Designed a custom composite reward formulation: R_t = v · cos(θ) − d_center − 10·I_collision. This rewards forward speed aligned with track tangents while penalizing cross-track lateral error and steering jitter.",
      result: "Achieved 100% unassisted full-lap navigation on DonkeySim mountain tracks within 500,000 training timesteps, maintaining stable lane-centering with zero boundary collisions.",
      stack: ["Python", "PyTorch", "Stable-Baselines3", "CNN", "PPO", "Gymnasium", "Computer Vision"],
      link: "https://github.com/Sarthaktanpure/Autonomous-Navigation",
      metrics: {
        timesteps: "500k Steps",
        lapCompletion: "100%",
        actionSpace: "Continuous (2D)",
        collisions: "0"
      }
    }
  ],

  fleet: [
    {
      title: "MedVision AI — Radiology Diagnostic Platform",
      tech: "React, TypeScript, FastAPI, PyTorch, Grad-CAM, MongoDB",
      desc: "Clinical radiology platform combining scan analysis with explainable AI (Grad-CAM), delivering 50–150ms GPU inference latency.",
      github: "https://github.com/Sarthaktanpure/MedVisionAI",
      live: "https://med-vision-ai-green.vercel.app/"
    },
    {
      title: "HospitalOS — Multi-Role Healthcare Coordination",
      tech: "MongoDB, Express.js, React, Node.js, JWT, RBAC",
      desc: "30–60 REST APIs across patient, doctor, pharmacy, and admin workflows with strict role-based access control and 300+ validated tests.",
      github: "https://github.com/Sarthaktanpure/HospitalOS",
      live: "https://hospital-os-black.vercel.app/"
    },
    {
      title: "AgriConnect — Real-Time Farmer-to-Buyer Marketplace",
      tech: "React, Node.js, MongoDB, Socket.IO, Razorpay",
      desc: "Direct farmer marketplace with real-time bidding, chat, and order tracking with 100–300ms indexed MongoDB response times.",
      github: "https://github.com/Sarthaktanpure/Agriconnect",
      live: "https://agriconnect-ohet.vercel.app/"
    }
  ],

  client: "Jay Yogeshwar Solar — Built and delivered a production commercial website for a solar business as a paid client project worth ₹4,999, translating business requirements into a deployed web application (React, Tailwind CSS, Node.js, MongoDB, REST APIs).",
  hackathon: "India Tech Summit: Innovate 2026 — Team PunarnirmanAI, Round 2 Qualifier (engineered heritage preservation AI platform in a 4-member team under strict competitive deadlines).",
  dsa: {
    total: "250+ Solved in Java",
    platforms: "LeetCode & GeeksForGeeks",
    standing: "Top 5% across district engineering colleges",
    topics: [
      { name: "Arrays & Sliding Window", count: 72 },
      { name: "Trees & Binary Search Trees", count: 54 },
      { name: "Dynamic Programming", count: 48 },
      { name: "Graphs & Topological Sort", count: 46 },
      { name: "Linked Lists & Monotonic Stacks", count: 35 }
    ]
  },
  stack: [
    "Python", "Java", "JavaScript (ES6+)", "TypeScript", "SQL",
    "React.js", "Node.js", "Express.js", "FastAPI", "Flask",
    "PyTorch", "XGBoost", "PPO Actor-Critic", "Isolation Forest", "CNN Vision",
    "MongoDB", "PostgreSQL", "Redis", "Socket.IO", "Git", "Docker", "Vercel"
  ],
  education: {
    degree: "B.E. Information Technology",
    college: "Pravara Rural Engineering College (PREC), Loni",
    standing: "CGPA: 8.67 / 10.0 (Rank 1 in Cohort)",
    expectedGraduation: "2028",
    previous: "ASC College, Rahuri — Higher Secondary Certificate (HSC): 74.60%"
  },
  links: {
    github: "https://github.com/Sarthaktanpure",
    linkedin: "https://www.linkedin.com/in/sarthak-tanpure-a74b5133a/",
    leetcode: "https://leetcode.com/u/Sarthak_Tanpure_01/",
    email: "mailto:sarthaktanpure255@gmail.com"
  }
};

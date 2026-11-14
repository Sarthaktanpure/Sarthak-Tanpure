import React, { useState } from 'react';
import { Award, Briefcase, GraduationCap, Code2, Database, Terminal, ExternalLink, CheckCircle, ShieldCheck, Cpu, X, Server, Layers } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export default function ProofScene() {
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [dsaCategory, setDsaCategory] = useState('all');

  const skills = [
    { category: 'LANGUAGES', items: ['Python', 'Java (250+ DSA)', 'JavaScript (ES6+)', 'TypeScript', 'SQL'] },
    { category: 'AI & REINFORCEMENT LEARNING', items: ['PyTorch', 'PPO Actor-Critic', 'CNN Vision', 'XGBoost', 'Isolation Forest', 'Grad-CAM', 'Stable-Baselines3'] },
    { category: 'BACKEND & PROTOCOLS', items: ['Node.js', 'Express.js', 'FastAPI', 'Flask', 'Socket.IO (WebSockets)', 'JWT & RBAC', 'RESTful API Design'] },
    { category: 'DATABASES & CLOUD', items: ['MongoDB (Aggregation & Indexing)', 'PostgreSQL', 'Redis', 'Docker (Basics)', 'Git / GitHub', 'Vercel / Render'] },
  ];

  const dsaBreakdown = [
    { topic: 'Arrays & Two Pointers', count: 72, diff: 'Medium/Hard', note: 'Sliding window, sub-array sums, binary search' },
    { topic: 'Trees & Binary Search Trees', count: 54, diff: 'Medium', note: 'DFS, BFS traversals, lowest common ancestor, path sum' },
    { topic: 'Dynamic Programming', count: 48, diff: 'Hard/Medium', note: '0/1 Knapsack, Longest Common Subsequence, Grid paths' },
    { topic: 'Graphs & BFS/DFS', count: 46, diff: 'Medium/Hard', note: 'Dijkstra, Topological sort, Cycle detection, Island count' },
    { topic: 'Linked Lists & Stacks', count: 35, diff: 'Medium', note: 'Monotonic stack, reverse k-group, LRU cache' },
  ];

  const additionalSystems = [
    {
      title: 'MedVision AI — Radiology Diagnostic Platform',
      badge: 'HEALTHCARE AI',
      tech: 'React, TypeScript, FastAPI, PyTorch, Grad-CAM, MongoDB',
      desc: 'Production-scale radiology scan analysis combining clinical dashboard with explainable AI (Grad-CAM), delivering 50–150ms GPU inference.',
      github: 'https://github.com/Sarthaktanpure/MedVisionAI',
      live: 'https://med-vision-ai-green.vercel.app/',
      blueprint: {
        arch: 'Decoupled Client-Gateway-Inference microservice topology.',
        db: 'MongoDB patient metadata collections indexed by scan hash.',
        metrics: 'GPU: 50–150ms / CPU: 200–500ms latency. Heatmap overlay generated via Grad-CAM backprop gradients.',
        security: 'HIPAA-compliant de-identification pipeline with JWT session barriers.'
      }
    },
    {
      title: 'HospitalOS — Multi-Role Healthcare Coordination',
      badge: 'ENTERPRISE MERN',
      tech: 'MongoDB, Express.js, React, Node.js, JWT, RBAC',
      desc: 'Architected 30–60 REST APIs across patient, doctor, pharmacy, and admin workflows with strict role-based access control and 300+ validated tests.',
      github: 'https://github.com/Sarthaktanpure/HospitalOS',
      live: 'https://hospital-os-black.vercel.app/',
      blueprint: {
        arch: 'Role-Based Access Control (RBAC) middleware verifying token scopes before DB query dispatch.',
        db: 'Optimized relational normalization within MongoDB with embedded sub-documents for prescription timelines.',
        metrics: '300+ automated test suites with zero regression. Sub-50ms query latency across doctors, patients, pharmacies.',
        security: 'Bcrypt salt rounds 12, CSRF mitigation, input validation schemas.'
      }
    },
    {
      title: 'AgriConnect — Real-Time Farmer Marketplace',
      badge: 'REAL-TIME COMMERCE',
      tech: 'React, Node.js, MongoDB, Socket.IO, Razorpay',
      desc: 'Direct farmer-to-buyer marketplace with real-time bidding, chat, and order tracking with 100–300ms indexed MongoDB response times.',
      github: 'https://github.com/Sarthaktanpure/Agriconnect',
      live: 'https://agriconnect-ohet.vercel.app/',
      blueprint: {
        arch: 'Bidirectional WebSocket auction rooms paired with Razorpay webhook verification worker.',
        db: 'Compound indexing on [cropType, geoRegion, priceRange] driving 100–300ms search latency.',
        metrics: 'Live bid updates propagated within 35ms to all subscribed socket clients.',
        security: 'HMAC signature verification on payment gateways; sanitized messaging channels.'
      }
    }
  ];

  return (
    <section id="act-5" className="relative min-h-screen py-24 px-4 sm:px-8 border-b border-hairline/80 bg-gradient-to-b from-void via-[#0a0f1d] to-[#0e1530]">
      {/* Dawn Horizon Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3A2A5C] to-transparent opacity-60" />

      {/* Ambient Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-dawn-coral rounded-full animate-pulse" />
              <span className="telemetry-mono text-dawn-coral font-medium">
                SCENE 05 / 05 — PROOF OF RUNTIME
              </span>
              <span className="text-muted/40 font-mono text-xs">|</span>
              <span className="telemetry-mono text-muted">05:30 — 06:30 HRS (DAWN APPROACHING)</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-display">
              Verified <span className="font-serif italic font-normal text-dawn-cream">Records</span> & Systems
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-light">
              Shipped production platforms, competitive engineering hackathons, 250+ algorithmic Java solutions, and academic cohort rank 1 at PREC Loni.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="telemetry-mono text-[10px] text-muted px-3 py-1 bg-panel border border-hairline rounded">
              VERIFIED // ZERO INCIDENTS
            </span>
          </div>
        </div>

        {/* Highlight Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-panel/70 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <div className="flex items-center gap-2 text-muted text-[10px] font-mono tracking-widest">
              <Award className="w-3.5 h-3.5 text-signal-cyan" />
              <span>COHORT STANDING</span>
            </div>
            <p className="text-2xl sm:text-3xl font-mono text-display mt-2">RANK 1</p>
            <p className="text-xs text-muted font-mono mt-0.5">CGPA 8.67 / 10.0 (PREC Loni)</p>
          </div>

          <div className="p-4 bg-panel/70 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <div className="flex items-center gap-2 text-muted text-[10px] font-mono tracking-widest">
              <Code2 className="w-3.5 h-3.5 text-signal-amber" />
              <span>DSA PROBLEMS</span>
            </div>
            <p className="text-2xl sm:text-3xl font-mono text-display mt-2">250+ SOLVED</p>
            <p className="text-xs text-muted font-mono mt-0.5">Java • LeetCode & GFG</p>
          </div>

          <div className="p-4 bg-panel/70 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <div className="flex items-center gap-2 text-muted text-[10px] font-mono tracking-widest">
              <Briefcase className="w-3.5 h-3.5 text-dawn-coral" />
              <span>PAID CLIENT WORK</span>
            </div>
            <p className="text-2xl sm:text-3xl font-mono text-display mt-2">DELIVERED</p>
            <p className="text-xs text-muted font-mono mt-0.5">Jay Yogeshwar Solar Platform</p>
          </div>

          <div className="p-4 bg-panel/70 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <div className="flex items-center gap-2 text-muted text-[10px] font-mono tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>HACKATHON HONORS</span>
            </div>
            <p className="text-2xl sm:text-3xl font-mono text-display mt-2">ROUND 2</p>
            <p className="text-xs text-muted font-mono mt-0.5">India Tech Summit Innovate 2026</p>
          </div>
        </div>
      </div>

      {/* Grid: Client & Hackathon & Additional Platforms */}
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Row 1: Client Delivery + Hackathon Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jay Yogeshwar Solar */}
          <div className="bracket-box p-6 bg-panel/80 border border-hairline rounded relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="telemetry-mono text-dawn-coral text-[10px] font-semibold">
                  COMMERCIAL CLIENT DELIVERY // 2026
                </span>
                <h3 className="text-xl font-display font-bold text-display mt-1">
                  Jay Yogeshwar Solar
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-[10px]">
                PAID & DELIVERED (₹4,999)
              </span>
            </div>

            <p className="text-muted text-xs sm:text-sm mt-3 leading-relaxed">
              Built and delivered a production commercial website for a regional solar energy enterprise. Translated business specifications into a clean, responsive customer acquisition engine with enquiry workflows and catalog showcase.
            </p>

            <div className="mt-4 pt-4 border-t border-hairline/80 flex flex-wrap gap-2 text-[10px] font-mono text-muted">
              <span className="px-2 py-1 bg-void rounded border border-hairline">React.js</span>
              <span className="px-2 py-1 bg-void rounded border border-hairline">Vite</span>
              <span className="px-2 py-1 bg-void rounded border border-hairline">Tailwind CSS</span>
              <span className="px-2 py-1 bg-void rounded border border-hairline">Node.js</span>
              <span className="px-2 py-1 bg-void rounded border border-hairline">MongoDB</span>
              <span className="px-2 py-1 bg-void rounded border border-hairline">REST APIs</span>
            </div>
          </div>

          {/* India Tech Summit & Hackathons */}
          <div className="bracket-box p-6 bg-panel/80 border border-hairline rounded relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="telemetry-mono text-signal-cyan text-[10px] font-semibold">
                  NATIONAL HACKATHON // TEAM PUNARNIRMANAI
                </span>
                <h3 className="text-xl font-display font-bold text-display mt-1">
                  India Tech Summit: Innovate 2026
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/40 text-signal-cyan font-mono text-[10px]">
                ROUND 2 QUALIFIER
              </span>
            </div>

            <p className="text-muted text-xs sm:text-sm mt-3 leading-relaxed">
              Architected a technology-driven AI solution for cultural heritage preservation under competitive deadlines. Advanced to Round 2 amongst nationwide engineering teams through prototype execution and architecture defense.
            </p>

            <div className="mt-4 pt-4 border-t border-hairline/80 space-y-1.5 text-xs font-mono text-muted">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
                <span>Adobe Hackathon (MedGuard AI): Computer vision & batch provenance verification</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan" />
                <span>Top 5% across district engineering colleges in algorithmic benchmarks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Deep Technical Capability / Systems Fleet with Blueprint Inspector */}
        <div className="bracket-box p-6 bg-panel/80 border border-hairline rounded">
          <div className="flex items-center justify-between border-b border-hairline/80 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-signal-cyan" />
              <span className="telemetry-mono text-display text-xs font-semibold">
                SYSTEMS FLEET // CLICK TO INSPECT ARCHITECTURE BLUEPRINT
              </span>
            </div>
            <span className="telemetry-mono text-[10px] text-muted">ALL REPOSITORIES VERIFIED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalSystems.map((sys, idx) => (
              <div
                key={idx}
                className="p-4 bg-void/70 border border-hairline rounded flex flex-col justify-between hover:border-signal-cyan/60 transition-all cursor-pointer group"
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedBlueprint(sys);
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-signal-cyan/10 border border-signal-cyan/40 text-signal-cyan font-mono text-[9px] rounded">
                      {sys.badge}
                    </span>
                    <span className="text-[10px] font-mono text-muted group-hover:text-signal-cyan">
                      INSPECT [⚙]
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-display mb-1">{sys.title}</h4>
                  <p className="text-[11px] font-mono text-signal-cyan/80 mb-2">{sys.tech}</p>
                  <p className="text-xs text-muted leading-relaxed">{sys.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-hairline/60 flex items-center justify-between text-[11px] font-mono">
                  <a
                    href={sys.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted hover:text-signal-cyan flex items-center gap-1 transition-colors"
                  >
                    <span>GITHUB</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {sys.live && (
                    <a
                      href={sys.live}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-signal-cyan hover:underline flex items-center gap-1"
                    >
                      <span>LIVE APP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: 250+ DSA Mastery Inspector */}
        <div className="bracket-box p-6 bg-panel/80 border border-hairline rounded">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-hairline/80 pb-3 mb-4 gap-2">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-signal-amber" />
              <span className="telemetry-mono text-display text-xs font-semibold">
                ALGORITHMIC RIGOR // 250+ PROBLEMS IN JAVA (LEETCODE / GFG)
              </span>
            </div>
            <a
              href="https://leetcode.com/u/Sarthak_Tanpure_01/"
              target="_blank"
              rel="noreferrer"
              className="text-signal-amber hover:underline text-xs font-mono flex items-center gap-1"
            >
              <span>VIEW LEETCODE PROFILE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {dsaBreakdown.map((item, i) => (
              <div key={i} className="p-3 bg-void/80 border border-hairline rounded flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-signal-amber font-semibold block">{item.diff}</span>
                  <div className="text-display font-medium text-xs mt-1">{item.topic}</div>
                  <p className="text-[10px] text-muted font-mono mt-1.5 leading-relaxed">{item.note}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-hairline/50 flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-muted">SOLVED:</span>
                  <span className="text-base font-mono font-bold text-display">{item.count}+</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Technical Skills Matrix & Academic Records */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Skills Breakdown */}
          <div className="lg:col-span-8 bracket-box p-6 bg-panel/80 border border-hairline rounded">
            <span className="telemetry-mono text-display text-xs font-semibold block mb-4">
              TECHNICAL STACK // VERIFIED IN RUNTIME
            </span>

            <div className="space-y-4">
              {skills.map((s, idx) => (
                <div key={idx} className="border-b border-hairline/60 pb-3 last:border-b-0">
                  <span className="telemetry-mono text-[10px] text-muted block mb-2">{s.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {s.items.map((it, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded bg-void/80 border border-hairline text-display text-xs font-mono hover:border-signal-cyan/40 transition-colors"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Rigor */}
          <div className="lg:col-span-4 bracket-box p-6 bg-panel/80 border border-hairline rounded flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-4 h-4 text-signal-cyan" />
                <span className="telemetry-mono text-display text-xs font-semibold">
                  ACADEMIC CREDENTIALS
                </span>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3 bg-void/80 border border-hairline rounded">
                  <div className="text-display font-semibold text-sm">Pravara Rural Engineering College (PREC), Loni</div>
                  <div className="text-signal-cyan text-[11px] mt-0.5">B.E. Information Technology (Graduating 2028)</div>
                  <div className="text-muted text-[10px] mt-2 flex justify-between">
                    <span>CGPA: 8.67 / 10.0</span>
                    <span className="text-emerald-400 font-bold">RANK 1 IN COHORT</span>
                  </div>
                </div>

                <div className="p-3 bg-void/80 border border-hairline rounded">
                  <div className="text-display font-medium text-xs">ASC College, Rahuri</div>
                  <div className="text-muted text-[11px]">Higher Secondary Certificate (HSC)</div>
                  <div className="text-muted text-[10px] mt-1">Score: 74.60%</div>
                </div>

                <div className="p-3 bg-void/80 border border-hairline rounded">
                  <div className="text-muted text-[10px] uppercase tracking-wider">CERTIFICATIONS</div>
                  <div className="text-display text-[11px] mt-1">• Full Stack Web Development (Apna College)</div>
                  <div className="text-display text-[11px]">• Data Structures & Algorithms in Java (Apna College)</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-hairline text-[10px] font-mono text-muted/70">
              STATUS: CONTINUOUS LEARNING RUNTIME
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint Detail Modal */}
      {selectedBlueprint && (
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-void/85 backdrop-blur-md">
          <div className="bracket-box w-full max-w-2xl bg-panel border border-signal-cyan/50 rounded shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-hairline/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-signal-cyan" />
                <span className="telemetry-mono text-signal-cyan font-bold text-xs">
                  ARCHITECTURE BLUEPRINT // {selectedBlueprint.badge}
                </span>
              </div>
              <button
                onClick={() => setSelectedBlueprint(null)}
                className="p-1 text-muted hover:text-display rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-display font-bold text-display mb-1">{selectedBlueprint.title}</h3>
            <p className="text-xs font-mono text-signal-cyan mb-4">{selectedBlueprint.tech}</p>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-void border border-hairline rounded">
                <span className="text-muted text-[10px] uppercase tracking-wider block mb-1">SYSTEM TOPOLOGY</span>
                <p className="text-display">{selectedBlueprint.blueprint.arch}</p>
              </div>

              <div className="p-3 bg-void border border-hairline rounded">
                <span className="text-muted text-[10px] uppercase tracking-wider block mb-1">DATABASE ARCHITECTURE</span>
                <p className="text-display">{selectedBlueprint.blueprint.db}</p>
              </div>

              <div className="p-3 bg-void border border-hairline rounded">
                <span className="text-muted text-[10px] uppercase tracking-wider block mb-1">PERFORMANCE BENCHMARKS</span>
                <p className="text-emerald-400 font-semibold">{selectedBlueprint.blueprint.metrics}</p>
              </div>

              <div className="p-3 bg-void border border-hairline rounded">
                <span className="text-muted text-[10px] uppercase tracking-wider block mb-1">SECURITY BOUNDARIES</span>
                <p className="text-display">{selectedBlueprint.blueprint.security}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-hairline">
              <a
                href={selectedBlueprint.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-panel border border-hairline hover:border-signal-cyan text-display rounded text-xs font-mono flex items-center gap-1.5"
              >
                <span>OPEN REPOSITORY</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {selectedBlueprint.live && (
                <a
                  href={selectedBlueprint.live}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-signal-cyan text-void font-bold rounded text-xs font-mono flex items-center gap-1.5 hover:bg-white"
                >
                  <span>LAUNCH LIVE APPLICATION</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

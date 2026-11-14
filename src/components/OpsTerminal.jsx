import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function OpsTerminal({ isOpen, onClose, onOpenContact, onPullLogs }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { text: 'OPS KERNEL v2.4.9 [SARTHAK CONTROL ROOM // 02:47 AM]', type: 'system' },
    { text: 'All operations nominal. Type "help" for active terminal commands.', type: 'info' },
  ]);
  const [theme, setTheme] = useState('cyan'); // 'cyan' | 'amber' | 'emerald'
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playClick();
    const newHist = [...history, { text: `> ${input}`, type: 'user' }];

    switch (cmd) {
      case 'help':
        newHist.push({
          text: `AVAILABLE COMMANDS:
  status        — Subsystem health breakdown & latency
  inspect fraud — XGBoost + Isolation Forest model reports & ROC
  inspect rl    — PPO Actor-Critic autonomous agent metrics
  inspect net   — Socket.IO mesh & MongoDB aggregation speed
  dsa           — LeetCode 250+ algorithmic mastery details
  proof         — Academic credentials, rank 1, and client work
  sound on/off  — Toggle Web Audio ambient telemetry
  theme <color> — Set CRT phosphor color (cyan | amber | green)
  cv / resume   — Pull the logs (curriculum vitae)
  contact       — Open direct transmission channel
  reboot        — Trigger control room boot cycle
  clear         — Wipe terminal console`,
          type: 'output'
        });
        break;

      case 'status':
        newHist.push({
          text: `[SYSTEM STATUS AT 02:47 AM]
• UPTIME: 99.98% [NOMINAL]
• ACTIVE NODE: SARTHAK-PREC-LONI-IT-R1
• INGESTION LATENCY: 12ms (PostgreSQL + REST)
• QUERY OPTIMIZATION: −30% latency via indexed aggregation
• RL CAR AGENT: PPO policy convergence at 500k timesteps
• NOIR OVERRIDE: READY (Trigger: "don't look back")`,
          type: 'success'
        });
        break;

      case 'inspect fraud':
        newHist.push({
          text: `[FRAUD DETECTION ENGINE REPORT]
• Supervised: XGBoost (20,000+ synthetic transactions)
• Unsupervised: Isolation Forest (Zero-day outlier scoring)
• ROC-AUC: 1.0000 | PR-AUC: 1.0000
• Accuracy: 99.975% | Precision: 99.01% | Recall: 100%
• APIs: 10+ RESTful with JWT, bcrypt hashing, and RBAC
• Repository: https://github.com/Sarthaktanpure/Fraud-Detection-System`,
          type: 'output'
        });
        break;

      case 'inspect rl':
        newHist.push({
          text: `[AUTONOMOUS DRIVING AGENT REPORT]
• Architecture: CNN Feature Extractor + PPO Actor-Critic
• Observations: 120×160 RGB camera feed
• Action Space: Continuous (Steering: [-1, 1], Throttle: [0, 1])
• Reward Formulation: R = v·cos(θ) − d_center − 10·I_collision
• Validation: Mountain Track full-lap navigation unassisted
• Repository: https://github.com/Sarthaktanpure/Autonomous-Navigation`,
          type: 'output'
        });
        break;

      case 'inspect net':
        newHist.push({
          text: `[DEVELOPER NETWORKING PLATFORM]
• Real-time Layer: Socket.IO bidirectional WebSockets
• Persistence: MongoDB with compound indexing & aggregations
• Endpoints: 13+ REST APIs (Auth, Feed, Requests, Direct Chat)
• Benchmarks: 30% reduction in query round-trip latency
• Repository: https://github.com/Sarthaktanpure/Developer-Networking-Platform`,
          type: 'output'
        });
        break;

      case 'dsa':
        newHist.push({
          text: `[ALGORITHMIC BENCHMARKS]
• Total Solved: 250+ in Java on LeetCode & GeeksForGeeks
• Core Mastery: Dynamic Programming, Graph Traversals, Binary Trees, Stacks, Heap Queues
• Standing: Top 5% across district engineering institutions
• Profile: https://leetcode.com/u/Sarthak_Tanpure_01/`,
          type: 'output'
        });
        break;

      case 'proof':
        newHist.push({
          text: `[VERIFIED PROOF OF RUNTIME]
• Institution: Pravara Rural Engineering College (PREC), Loni
• Academic Standing: CGPA 8.67 / 10.0 | Rank 1 in Cohort
• Commercial Delivery: Jay Yogeshwar Solar Platform (Paid, ₹4,999)
• Hackathon: Round 2 Qualifier, India Tech Summit Innovate 2026`,
          type: 'success'
        });
        break;

      case 'cv':
      case 'resume':
        onPullLogs();
        newHist.push({ text: 'Dispatching system logs (CV modal)…', type: 'info' });
        break;

      case 'contact':
        onOpenContact();
        newHist.push({ text: 'Navigating to secure dispatch channel…', type: 'info' });
        break;

      case 'sound on':
        soundEngine.toggle(true);
        newHist.push({ text: 'Audio telemetry enabled.', type: 'success' });
        break;

      case 'sound off':
        soundEngine.toggle(false);
        newHist.push({ text: 'Audio telemetry muted.', type: 'info' });
        break;

      case 'theme cyan':
        setTheme('cyan');
        newHist.push({ text: 'Phosphor color calibrated to SIGNAL CYAN.', type: 'info' });
        break;

      case 'theme amber':
        setTheme('amber');
        newHist.push({ text: 'Phosphor color calibrated to AMBER 580nm.', type: 'info' });
        break;

      case 'theme green':
        setTheme('emerald');
        newHist.push({ text: 'Phosphor color calibrated to EMERALD CRT.', type: 'info' });
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'reboot':
        window.location.reload();
        return;

      default:
        newHist.push({
          text: `Unknown command "${input}". Type "help" for a list of operational commands.`,
          type: 'error'
        });
        break;
    }

    setHistory(newHist);
    setInput('');
  };

  if (!isOpen) return null;

  const themeColors = {
    cyan: { text: 'text-signal-cyan', border: 'border-signal-cyan/40', bg: 'bg-void/95' },
    amber: { text: 'text-signal-amber', border: 'border-signal-amber/40', bg: 'bg-void/95' },
    emerald: { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-void/95' },
  }[theme];

  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center p-3 sm:p-6 bg-void/85 backdrop-blur-md">
      <div className={`bracket-box w-full max-w-3xl h-[520px] ${themeColors.bg} border ${themeColors.border} rounded shadow-2xl flex flex-col font-mono text-xs overflow-hidden`}>
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-3 border-b border-hairline bg-panel/80 select-none">
          <div className="flex items-center gap-2">
            <TerminalIcon className={`w-4 h-4 ${themeColors.text}`} />
            <span className="text-display font-semibold tracking-wider text-[11px]">
              OPS COMMAND TERMINAL // TTY-01
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted hidden sm:inline">
              [PRESS ESC TO CLOSE]
            </span>
            <button
              onClick={onClose}
              className="p-1 text-muted hover:text-display rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console Log Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text">
          {history.map((h, i) => (
            <div
              key={i}
              className={`leading-relaxed whitespace-pre-wrap ${
                h.type === 'user'
                  ? 'text-display font-semibold'
                  : h.type === 'error'
                  ? 'text-signal-alert'
                  : h.type === 'success'
                  ? 'text-emerald-400'
                  : h.type === 'system'
                  ? `${themeColors.text} font-bold`
                  : 'text-muted'
              }`}
            >
              {h.text}
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input Line */}
        <form onSubmit={handleCommand} className="flex items-center gap-2 p-3 border-t border-hairline bg-panel/90">
          <span className={`${themeColors.text} font-bold flex items-center gap-1`}>
            <span>sarthak@control-room:~$</span>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command (try 'status', 'inspect fraud', 'inspect rl', 'help')…"
            className="flex-1 bg-transparent border-none outline-none text-display text-xs font-mono placeholder:text-muted/40"
          />
          <button type="submit" className={`p-1.5 ${themeColors.text} hover:opacity-80`}>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

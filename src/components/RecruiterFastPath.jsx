import React, { useState } from 'react';
import { X, FileText, Mail, Phone, ExternalLink, Check, Copy, Award, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { DATA } from '../data/portfolioData';
import { soundEngine } from '../utils/soundEngine';

export default function RecruiterFastPath({ isOpen, onClose, onPullLogs }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="fastpath-title"
      className="fixed inset-0 z-[10010] flex items-center justify-center p-3 sm:p-6 bg-void/90 backdrop-blur-lg select-none"
    >
      <div className="bracket-box w-full max-w-4xl bg-panel border border-signal-cyan/50 rounded shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-display">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-hairline/90 bg-void/70">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-cyan animate-pulse" />
            <div>
              <span className="telemetry-mono text-signal-cyan text-[11px] font-bold tracking-widest block" id="fastpath-title">
                RECRUITER FAST PATH // CANDIDATE DOSSIER
              </span>
              <span className="text-[10px] text-muted font-mono">
                VERIFIED ARCHIVES • READ TIME: &lt; 30 SECONDS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onPullLogs}
              className="px-3 py-1.5 bg-signal-cyan text-void text-xs font-mono font-bold tracking-widest uppercase hover:bg-white transition-all rounded flex items-center gap-1.5 shadow-[0_0_12px_rgba(61,242,255,0.3)]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>RÉSUMÉ PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close dossier"
              className="p-1.5 text-muted hover:text-display transition-colors rounded hover:bg-void"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 select-text">
          {/* Executive Overview */}
          <div className="p-4 bg-void/80 border border-hairline rounded">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/60 pb-3 mb-3">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-display tracking-tight">
                  {DATA.name}
                </h3>
                <p className="text-xs font-mono text-signal-cyan mt-0.5">{DATA.role}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <button
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 bg-panel border border-hairline hover:border-signal-cyan text-muted hover:text-signal-cyan transition-colors rounded flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{DATA.email}</span>
                </button>
                <a
                  href={`tel:${DATA.phone}`}
                  className="text-muted hover:text-display transition-colors"
                >
                  {DATA.phone}
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted font-mono leading-relaxed">
              {DATA.about}
            </p>
          </div>

          {/* Key Qualifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-void/70 border border-hairline rounded">
              <span className="telemetry-mono text-muted text-[10px] block">ACADEMIC STANDING</span>
              <p className="text-sm font-mono font-bold text-display mt-1">PREC Loni — Rank 1</p>
              <p className="text-[11px] font-mono text-signal-cyan mt-0.5">CGPA 8.67 / 10.0 (B.E. IT 2028)</p>
            </div>
            <div className="p-3 bg-void/70 border border-hairline rounded">
              <span className="telemetry-mono text-muted text-[10px] block">DSA PROBLEM SOLVING</span>
              <p className="text-sm font-mono font-bold text-display mt-1">250+ Solved in Java</p>
              <p className="text-[11px] font-mono text-signal-amber mt-0.5">LeetCode & GFG • Top 5%</p>
            </div>
            <div className="p-3 bg-void/70 border border-hairline rounded">
              <span className="telemetry-mono text-muted text-[10px] block">COMMERCIAL & HACKATHONS</span>
              <p className="text-sm font-mono font-bold text-display mt-1">Paid Client Delivered</p>
              <p className="text-[11px] font-mono text-emerald-400 mt-0.5">India Tech Summit (Round 2)</p>
            </div>
          </div>

          {/* Top 3 Flagship Projects */}
          <div>
            <span className="telemetry-mono text-display text-xs font-semibold block mb-3">
              PRIMARY PRODUCTION SYSTEMS (TOP 3)
            </span>

            <div className="space-y-3">
              {DATA.projects.map((proj) => (
                <div key={proj.id} className="p-4 bg-void/80 border border-hairline rounded space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-signal-cyan font-bold">{proj.scene}.</span>
                      <h4 className="font-display font-bold text-sm text-display">{proj.title}</h4>
                    </div>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-signal-cyan hover:underline flex items-center gap-1"
                    >
                      <span>VIEW CODE REPOSITORY</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  <p className="text-xs text-muted font-mono leading-relaxed">
                    <span className="text-display font-semibold">Result: </span>
                    {proj.result}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.stack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-panel border border-hairline text-[10px] font-mono text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Stack Matrix */}
          <div>
            <span className="telemetry-mono text-display text-xs font-semibold block mb-2">
              VERIFIED TECHNICAL STACK
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DATA.stack.map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-void/90 border border-hairline text-display text-xs font-mono rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-hairline/90 bg-void/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-muted">
          <span>CONTACT: {DATA.email} • {DATA.phone}</span>
          <div className="flex items-center gap-3">
            <a
              href={DATA.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="hover:text-signal-cyan transition-colors"
            >
              LINKEDIN
            </a>
            <span className="opacity-30">•</span>
            <a
              href={DATA.links.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-signal-cyan transition-colors"
            >
              GITHUB
            </a>
            <span className="opacity-30">•</span>
            <a
              href={DATA.links.leetcode}
              target="_blank"
              rel="noreferrer"
              className="hover:text-signal-amber transition-colors"
            >
              LEETCODE
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, ExternalLink, ShieldCheck, Activity, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function IncidentReportModal({ project, isOpen, onClose }) {
  if (!isOpen || !project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="incident-report-title"
      className="fixed inset-0 z-[10015] flex items-center justify-center p-3 sm:p-6 bg-void/90 backdrop-blur-xl select-none"
    >
      <div className="bracket-box w-full max-w-4xl bg-panel border border-signal-cyan/60 rounded shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-display">
        {/* Header HUD */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-hairline/90 bg-void/80">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-signal-cyan animate-ping" />
            <div>
              <div className="telemetry-mono text-signal-cyan text-[11px] font-bold tracking-widest" id="incident-report-title">
                INCIDENT REPORT // CASE STUDY: ACT {project.scene}
              </div>
              <div className="text-[10px] text-muted font-mono mt-0.5">
                STATUS: RESOLVED IN RUNTIME • AUDIT: 02:47 AM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-signal-cyan/15 border border-signal-cyan/50 text-signal-cyan text-xs font-mono rounded hover:bg-signal-cyan/25 transition-all flex items-center gap-1.5"
            >
              <span>SOURCE CODE</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              aria-label="Close incident report"
              className="p-1.5 text-muted hover:text-display transition-colors rounded hover:bg-void"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 select-text font-mono">
          {/* Title Banner */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-display tracking-tight">
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm text-signal-cyan mt-1">{project.tagline}</p>
          </div>

          {/* 1. Problem Statement */}
          <div className="p-4 bg-void/80 border border-hairline rounded">
            <span className="telemetry-mono text-muted text-[10px] block mb-2 font-bold">
              01 // THE PROBLEM
            </span>
            <p className="text-xs sm:text-sm text-display leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* 2. Operational Constraints */}
          <div className="p-4 bg-void/80 border border-hairline rounded">
            <span className="telemetry-mono text-muted text-[10px] block mb-2 font-bold">
              02 // OPERATIONAL CONSTRAINTS
            </span>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {project.constraints}
            </p>
          </div>

          {/* 3. Architecture & Dataflow Topology */}
          <div className="p-4 bg-void/80 border border-hairline rounded space-y-3">
            <span className="telemetry-mono text-signal-cyan text-[10px] block font-bold">
              03 // ARCHITECTURE TOPOLOGY & DATAFLOW
            </span>
            <p className="text-xs sm:text-sm text-display leading-relaxed">
              {project.architecture}
            </p>

            {/* Dynamic Visual Dataflow Pipeline */}
            <div className="p-3 bg-panel/90 border border-hairline rounded flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] overflow-x-auto">
              <div className="px-3 py-2 bg-void border border-hairline rounded text-center w-full sm:w-auto">
                <span className="text-muted block text-[9px]">INGESTION</span>
                <span className="text-signal-cyan font-bold">REST / JWT</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted/60 hidden sm:block shrink-0" />
              <div className="px-3 py-2 bg-void border border-hairline rounded text-center w-full sm:w-auto">
                <span className="text-muted block text-[9px]">PIPELINE</span>
                <span className="text-display font-bold">FILTER & SCORING</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted/60 hidden sm:block shrink-0" />
              <div className="px-3 py-2 bg-void border border-hairline rounded text-center w-full sm:w-auto">
                <span className="text-muted block text-[9px]">PERSISTENCE</span>
                <span className="text-display font-bold">STORAGE / WSS</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted/60 hidden sm:block shrink-0" />
              <div className="px-3 py-2 bg-void border border-emerald-500/40 text-center w-full sm:w-auto">
                <span className="text-muted block text-[9px]">OUTCOME</span>
                <span className="text-emerald-400 font-bold">SUB-20MS RESULT</span>
              </div>
            </div>
          </div>

          {/* 4. Engineering Decisions */}
          <div className="p-4 bg-void/80 border border-hairline rounded">
            <span className="telemetry-mono text-muted text-[10px] block mb-2 font-bold">
              04 // ARCHITECTURAL DECISIONS
            </span>
            <p className="text-xs sm:text-sm text-display leading-relaxed">
              {project.decisions}
            </p>
          </div>

          {/* 5. Result (Verified Real Numbers) */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded">
            <span className="telemetry-mono text-emerald-400 text-[10px] block mb-2 font-bold">
              05 // VERIFIED PRODUCTION RESULTS
            </span>
            <p className="text-xs sm:text-sm text-display font-semibold leading-relaxed">
              {project.result}
            </p>
          </div>

          {/* 6. Production Stack */}
          <div>
            <span className="telemetry-mono text-muted text-[10px] block mb-2 font-bold">
              06 // PRODUCTION STACK
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((item, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-void border border-hairline text-display text-xs rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-hairline/90 bg-void/90 flex items-center justify-between text-xs font-mono text-muted">
          <span>PREC LONI • AUDITED REPOSITORIES</span>
          <span>PRESS ESC TO RETURN TO THE WATCH</span>
        </div>
      </div>
    </div>
  );
}

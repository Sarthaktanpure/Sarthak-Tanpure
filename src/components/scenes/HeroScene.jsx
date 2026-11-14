import React from 'react';
import { ArrowDown, FileText, Send, Terminal, Shield, Cpu, Activity, ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from '../Icons';
import { soundEngine } from '../../utils/soundEngine';

export default function HeroScene({ onOpenContact, onPullLogs }) {
  const scrollToAct2 = () => {
    soundEngine.playClick();
    const elem = document.getElementById('act-2');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="act-1" className="relative min-h-screen flex flex-col justify-between pt-28 pb-16 px-4 sm:px-8 border-b border-hairline/80 bg-void overflow-hidden">
      {/* Top micro-telemetry metadata */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline/80 pb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-signal-cyan animate-ping" />
          <span className="telemetry-mono text-signal-cyan font-medium">
            SCENE 01 / 05 — BOOT
          </span>
          <span className="text-muted/40 font-mono">|</span>
          <span className="telemetry-mono text-muted">00:00 — 02:00 HRS</span>
        </div>

        <div className="flex items-center gap-4 text-muted text-[11px] font-mono">
          <span className="hidden md:inline">SYSTEM: AUTONOMOUS_OPS</span>
          <span className="hidden md:inline opacity-30">•</span>
          <span className="text-emerald-400">ALL SYSTEMS ONLINE</span>
          <span className="opacity-30">•</span>
          <span>LATENCY: 12MS</span>
        </div>
      </div>

      {/* Centerpiece Hero Statement */}
      <div className="max-w-7xl mx-auto w-full my-auto py-12">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 rounded bg-panel border border-hairline text-[11px] font-mono tracking-widest text-signal-cyan/90 uppercase">
            OPERATIONS DESK // 02:47 AM
          </div>

          {/* Massive Name Typography */}
          <h1 className="text-[14vw] sm:text-[11vw] font-display font-extrabold tracking-tighter leading-[0.88] text-display uppercase select-none">
            SARTHAK<br />
            <span className="text-muted/80 hover:text-signal-cyan transition-colors duration-500">
              TANPURE
            </span>
          </h1>

          {/* Emotional Manifesto Line */}
          <div className="max-w-3xl pt-2">
            <p className="text-2xl sm:text-4xl md:text-5xl font-display font-light text-display tracking-tight leading-snug">
              I build things that <span className="font-serif italic font-normal text-signal-cyan">keep running in the dark</span>.
            </p>
            <p className="text-muted text-sm sm:text-base md:text-lg mt-4 max-w-2xl font-mono leading-relaxed">
              Everyone else is asleep; the systems are not. Applied Machine Learning, Deep Reinforcement Learning agents, and resilient full-stack platforms engineered for high-stakes calm.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-6">
            <button
              onClick={onOpenContact}
              className="bracket-box px-6 py-3.5 bg-signal-cyan text-void text-xs font-mono font-bold tracking-widest uppercase hover:bg-white transition-all shadow-[0_0_25px_rgba(61,242,255,0.3)] flex items-center gap-2 group"
            >
              <Send className="w-4 h-4 text-void group-hover:translate-x-0.5 transition-transform" />
              <span>OPEN A CHANNEL</span>
            </button>

            <button
              onClick={onPullLogs}
              className="bracket-box px-6 py-3.5 bg-panel border border-hairline text-display text-xs font-mono tracking-widest uppercase hover:border-signal-cyan/60 hover:text-signal-cyan transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-signal-cyan" />
              <span>PULL THE LOGS (RÉSUMÉ)</span>
            </button>

            {/* Quick Profile Links */}
            <div className="flex items-center gap-2 pl-2">
              <a
                href="https://github.com/Sarthaktanpure"
                target="_blank"
                rel="noreferrer"
                title="GitHub: Sarthaktanpure"
                className="p-3 rounded bg-panel/80 border border-hairline hover:border-signal-cyan hover:text-signal-cyan transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/sarthak-tanpure-a74b5133a/"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn: Sarthak Tanpure"
                className="p-3 rounded bg-panel/80 border border-hairline hover:border-signal-cyan hover:text-signal-cyan transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://leetcode.com/u/Sarthak_Tanpure_01/"
                target="_blank"
                rel="noreferrer"
                title="LeetCode: 250+ DSA Problems"
                className="p-3 rounded bg-panel/80 border border-hairline hover:border-signal-amber hover:text-signal-amber transition-colors flex items-center gap-1.5 text-xs font-mono"
              >
                <LeetCodeIcon className="w-4 h-4 text-signal-amber" />
                <span className="text-[10px] text-muted">250+</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry & Scroll Anchor */}
      <div className="max-w-7xl mx-auto w-full pt-8 border-t border-hairline/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Core Metrics Preview */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full sm:w-auto">
          <div>
            <span className="telemetry-mono text-muted text-[10px] block">ML PIPELINES</span>
            <span className="text-xl sm:text-2xl font-mono text-display">20,000+ TX</span>
          </div>
          <div>
            <span className="telemetry-mono text-muted text-[10px] block">DRL HORIZON</span>
            <span className="text-xl sm:text-2xl font-mono text-signal-cyan">500k STEPS</span>
          </div>
          <div>
            <span className="telemetry-mono text-muted text-[10px] block">PREC LONI</span>
            <span className="text-xl sm:text-2xl font-mono text-display">RANK 1</span>
          </div>
        </div>

        {/* Scroll Prompt */}
        <button
          onClick={scrollToAct2}
          className="flex items-center gap-2 telemetry-mono text-muted hover:text-signal-cyan text-[11px] transition-colors group cursor-pointer"
        >
          <span>ENTER THE WATCH</span>
          <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </section>
  );
}

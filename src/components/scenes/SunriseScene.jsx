import React, { useState } from 'react';
import { Send, FileText, Mail, Phone, MapPin, Check, Copy, ArrowUpRight, Sun } from 'lucide-react';
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from '../Icons';
import { DATA } from '../../data/portfolioData';
import { soundEngine } from '../../utils/soundEngine';

export default function SunriseScene({ onPullLogs }) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    frequency: 'Student Researcher Role / Applied ML',
    message: ''
  });

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(DATA.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundEngine.playClick();
    soundEngine.playSunriseChord();
    setFormSubmitted(true);
  };

  return (
    <footer id="contact" className="relative py-28 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-[#0E1530] via-[#3A2A5C]/40 to-[#F4D9B0]/25 text-display border-t border-hairline/80">
      {/* Volumetric Dawn Horizon Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[340px] bg-gradient-to-b from-dawn-coral/15 via-dawn-cream/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Sunrise Telemetry Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-4 h-4 text-dawn-cream animate-spin-slow" />
          <span className="telemetry-mono text-dawn-cream font-medium">
            06:47 HRS — SUNRISE // SHIFT HANDOVER
          </span>
          <span className="text-muted/40 font-mono text-xs">|</span>
          <span className="telemetry-mono text-emerald-400">100% UPTIME PRESERVED</span>
        </div>

        {/* Master Headline with Typographic Quotes */}
        <div className="mb-14 max-w-4xl">
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-display leading-[0.95]">
            Systems stayed up.<br />
            <span className="font-serif italic font-normal text-dawn-cream">Let’s build the next one.</span>
          </h2>
          <p className="text-muted text-base sm:text-lg mt-4 max-w-2xl font-light">
            The night shift is over; the code holds. Available for Student Researcher roles, Applied Machine Learning, and High-Performance Full-Stack Engineering.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Communication Lines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bracket-box p-6 bg-panel/90 backdrop-blur-md border border-hairline rounded">
              <span className="telemetry-mono text-[10px] text-muted block mb-4 font-semibold">
                COMMUNICATION PROTOCOLS // SECURE LINES
              </span>

              <div className="space-y-4">
                {/* Email line */}
                <div className="flex items-center justify-between p-3 bg-void/80 border border-hairline rounded">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-signal-cyan" />
                    <div>
                      <div className="text-[10px] font-mono text-muted">PRIMARY DISPATCH</div>
                      <a href={DATA.links.email} className="text-xs sm:text-sm font-mono text-display hover:text-signal-cyan transition-colors">
                        {DATA.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 text-muted hover:text-signal-cyan transition-colors"
                    title="Copy email to clipboard"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone line */}
                <div className="flex items-center justify-between p-3 bg-void/80 border border-hairline rounded">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-signal-amber" />
                    <div>
                      <div className="text-[10px] font-mono text-muted">DIRECT VOICE / WHATSAPP</div>
                      <a href={`tel:${DATA.phone}`} className="text-xs sm:text-sm font-mono text-display hover:text-signal-amber transition-colors">
                        {DATA.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 text-muted hover:text-signal-amber transition-colors"
                    title="Copy phone to clipboard"
                    aria-label="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center p-3 bg-void/80 border border-hairline rounded gap-3">
                  <MapPin className="w-4 h-4 text-dawn-coral" />
                  <div>
                    <div className="text-[10px] font-mono text-muted">LOCATION BASE</div>
                    <div className="text-xs font-mono text-display">{DATA.location}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Open a channel (mailto) & Pull the logs (résumé) */}
              <div className="mt-6 pt-4 border-t border-hairline space-y-2">
                <a
                  href={DATA.links.email}
                  className="w-full bracket-box py-3 bg-signal-cyan text-void text-xs font-mono font-bold tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(61,242,255,0.25)]"
                >
                  <Send className="w-4 h-4" />
                  <span>OPEN A CHANNEL</span>
                </a>

                <button
                  onClick={onPullLogs}
                  className="w-full bracket-box py-2.5 bg-signal-cyan/10 border border-signal-cyan/50 text-signal-cyan text-xs font-mono tracking-widest uppercase hover:bg-signal-cyan/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <FileText className="w-4 h-4" />
                  <span>PULL THE LOGS (RÉSUMÉ)</span>
                </button>
              </div>
            </div>

            {/* Social channels */}
            <div className="flex items-center gap-3">
              <a
                href={DATA.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-3 bg-panel border border-hairline rounded flex items-center justify-between text-xs font-mono text-muted hover:border-signal-cyan hover:text-signal-cyan transition-colors"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GITHUB</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={DATA.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-3 bg-panel border border-hairline rounded flex items-center justify-between text-xs font-mono text-muted hover:border-signal-cyan hover:text-signal-cyan transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-3.5 h-3.5" />
                  <span>LINKEDIN</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={DATA.links.leetcode}
                target="_blank"
                rel="noreferrer"
                className="flex-1 p-3 bg-panel border border-hairline rounded flex items-center justify-between text-xs font-mono text-muted hover:border-signal-amber hover:text-signal-amber transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LeetCodeIcon className="w-3.5 h-3.5 text-signal-amber" />
                  <span>LEETCODE</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Open A Channel Form */}
          <div className="lg:col-span-7 bracket-box p-6 sm:p-8 bg-panel/90 backdrop-blur-md border border-hairline rounded">
            <div className="flex items-center justify-between border-b border-hairline/80 pb-3 mb-6">
              <span className="telemetry-mono text-display text-xs font-semibold">
                TRANSMIT CHANNEL // DIRECT INBOX
              </span>
              <span className="telemetry-mono text-[10px] text-emerald-400">STATUS: READY</span>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-signal-cyan/15 border border-signal-cyan text-signal-cyan flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-display font-bold text-display">Message Dispatched into Ops Queue</h3>
                <p className="text-muted text-xs font-mono max-w-md mx-auto">
                  Thank you. Sarthak will review your signal shortly. Response latency typically &lt; 4 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="telemetry-mono text-[10px] text-signal-cyan underline pt-2"
                >
                  [TRANSMIT ANOTHER MESSAGE]
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="telemetry-mono text-[10px] text-muted block mb-1.5">NAME / IDENTIFIER</label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full p-2.5 bg-void/80 border border-hairline rounded text-xs font-mono text-display focus:border-signal-cyan focus:outline-none placeholder:text-muted/40"
                    />
                  </div>
                  <div>
                    <label className="telemetry-mono text-[10px] text-muted block mb-1.5">RETURN SIGNAL (EMAIL)</label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="e.g. alex@lab.ai"
                      className="w-full p-2.5 bg-void/80 border border-hairline rounded text-xs font-mono text-display focus:border-signal-cyan focus:outline-none placeholder:text-muted/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="telemetry-mono text-[10px] text-muted block mb-1.5">COLLABORATION SCOPE</label>
                  <select
                    value={formState.frequency}
                    onChange={(e) => setFormState({ ...formState, frequency: e.target.value })}
                    className="w-full p-2.5 bg-void/80 border border-hairline rounded text-xs font-mono text-display focus:border-signal-cyan focus:outline-none"
                  >
                    <option>Student Researcher Role / Applied ML</option>
                    <option>Deep Reinforcement Learning & Robotics</option>
                    <option>Full-Stack Engineering & Scalable Systems</option>
                    <option>Technical Consultation / Contract Project</option>
                  </select>
                </div>

                <div>
                  <label className="telemetry-mono text-[10px] text-muted block mb-1.5">TRANSMISSION CONTENT</label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Brief details about the project, role, or architecture challenge…"
                    className="w-full p-2.5 bg-void/80 border border-hairline rounded text-xs font-mono text-display focus:border-signal-cyan focus:outline-none placeholder:text-muted/40"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bracket-box py-3.5 bg-signal-cyan text-void font-bold text-xs font-mono tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(61,242,255,0.25)]"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT SIGNAL</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Very bottom sign-off */}
        <div className="mt-16 pt-8 border-t border-hairline/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-muted gap-4">
          <div>
            SARTHAK TANPURE • CONTROL ROOM 02:47 AM → 06:47 AM
          </div>
          <div className="text-signal-cyan/80">
            “Systems stayed up. Let’s build the next one.”
          </div>
          <div>
            PREC LONI // IT RANK 1 // 2028
          </div>
        </div>
      </div>
    </footer>
  );
}

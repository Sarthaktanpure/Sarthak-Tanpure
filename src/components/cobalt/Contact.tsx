import React, { useState } from 'react';
import { DATA } from '../../data';
import { Mail, ArrowUpRight, Copy, Check, FileText } from 'lucide-react';
import { useMagnetic } from './useMagnetic';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const sayHelloBtn = useMagnetic(0.25, 0.35);
  const resumeBtn = useMagnetic(0.25, 0.35);

  const handleCopy = () => {
    navigator.clipboard.writeText(DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <footer
      id="contact"
      className="relative z-20 bg-primary text-paper pt-32 sm:pt-44 pb-16 px-6 sm:px-12 border-t-2 border-paper/20 overflow-hidden"
      aria-label="Direct Contact and Communication Channel"
    >
      {/* Corner Floating Shapes: Accent 1 Circle & Accent 2 Half-Moon with Gentle Idle Float */}
      <div className="absolute -bottom-16 -right-16 pointer-events-none select-none z-0" aria-hidden="true">
        {/* Accent 1 Circle */}
        <div className="w-72 sm:w-[420px] h-72 sm:h-[420px] rounded-full bg-accent-1 animate-idle-float" />
        {/* Accent 2 Half-Moon */}
        <div className="absolute top-12 left-12 w-52 sm:w-80 h-26 sm:h-40 bg-accent-2 rounded-t-full rotate-45 animate-idle-float-rev" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col justify-between min-h-[65vh]">
        {/* Header Label with 2px Rule */}
        <div className="flex items-center gap-3 border-b-2 border-paper/30 pb-6 mb-12">
          <div className="w-4 h-4 bg-accent-2 rounded-full" />
          <span className="caption-mono font-black text-xs sm:text-sm text-paper tracking-widest">
            05 // GET IN TOUCH & DIRECT COLLABORATION
          </span>
        </div>

        {/* Master Invitation & Giant Lowercase Email */}
        <div className="my-auto py-8">
          <p className="caption-mono text-paper/80 text-sm sm:text-base mb-6 font-bold tracking-wider">
            OPEN FOR SOFTWARE ENGINEERING INTERNSHIPS & RESEARCH ROLES:
          </p>

          {/* Giant Lowercase Email Link with Accent 2 Underline Wipe on Hover */}
          <div className="relative inline-block group max-w-full">
            <a
              href={DATA.links.emailMailto}
              className="poster-headline text-[7.5vw] sm:text-[6.5vw] md:text-[5.5vw] font-black lowercase tracking-poster text-paper hover:text-accent-2 transition-colors block leading-tight break-all select-all"
              aria-label={`Send email to ${DATA.email}`}
            >
              {DATA.email}
            </a>
            {/* Accent 2 Underline that Wipes In on Hover */}
            <span
              className="absolute left-0 bottom-1 w-full h-[6px] sm:h-[8px] bg-accent-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              aria-hidden="true"
            />
          </div>

          {/* Action Buttons: Magnetic "Say hello" and ghost "Résumé" */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-12">
            <a
              ref={sayHelloBtn.ref as React.RefObject<HTMLAnchorElement>}
              style={sayHelloBtn.style}
              href={DATA.links.emailMailto}
              className="px-7 py-4 bg-accent-2 text-ink font-black caption-mono text-xs uppercase hover:bg-white transition-all shadow-[4px_4px_0px_var(--ink)] cursor-pointer"
            >
              SAY HELLO
            </a>

            <button
              onClick={handleCopy}
              className="px-6 py-4 border-2 border-paper text-paper font-black caption-mono text-xs uppercase hover:bg-paper hover:text-ink transition-all flex items-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-accent-2" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'EMAIL COPIED' : 'COPY EMAIL'}</span>
            </button>

            <a
              ref={resumeBtn.ref as React.RefObject<HTMLAnchorElement>}
              style={resumeBtn.style}
              href={DATA.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 border-2 border-paper text-paper font-black caption-mono text-xs uppercase hover:bg-paper hover:text-ink transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>RÉSUMÉ (PDF)</span>
            </a>
          </div>
        </div>

        {/* Minimal Footer Row */}
        <div className="border-t-2 border-paper/30 pt-8 mt-20 flex flex-col sm:flex-row sm:items-center justify-between gap-6 caption-mono text-xs text-paper/75">
          <div>
            <span className="font-black text-paper">SARTHAK TANPURE</span> • PREC LONI (B.E. IT RANK 1)
          </div>

          <div className="flex items-center gap-6">
            <a
              href={DATA.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-2 transition-colors font-bold"
            >
              GITHUB
            </a>
            <a
              href={DATA.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-2 transition-colors font-bold"
            >
              LINKEDIN
            </a>
            <a
              href={DATA.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-2 transition-colors font-bold"
            >
              LEETCODE
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        @keyframes floatRev {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(14px) rotate(48deg); }
        }
        .animate-idle-float {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-idle-float-rev {
          animation: floatRev 9s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}

import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { DATA } from '../data';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = DATA.resumeUrl;
    link.download = 'Sarthak_Tanpure_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 bg-ink/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Sarthak Tanpure Curriculum Vitae"
    >
      <div className="w-full max-w-4xl bg-paper border-2 border-ink shadow-[12px_12px_0px_var(--ink)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-ink bg-ink text-paper">
          <div className="flex items-center gap-2 sm:gap-3">
            <FileText className="w-4 h-4 text-accent-2" />
            <span className="caption-mono font-black text-xs sm:text-sm tracking-wider">
              CURRICULUM VITAE // SARTHAK TANPURE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 bg-accent-2 text-ink text-xs font-mono font-black uppercase hover:bg-white transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_var(--accent-1)] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-paper/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close résumé modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded PDF View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-paper/40">
          <iframe
            src={`${DATA.resumeUrl}#toolbar=0`}
            title="Sarthak Tanpure Resume PDF"
            className="w-full h-[66vh] border-2 border-ink bg-white shadow-sm"
          />
        </div>

        {/* Modal Footer with Direct Verified Links */}
        <div className="p-4 border-t-2 border-ink bg-paper flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-ink font-bold">
          <div className="flex items-center gap-4">
            <a
              href={DATA.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              GitHub
            </a>
            <a
              href={DATA.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              LinkedIn
            </a>
            <a
              href={DATA.links.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors underline"
            >
              LeetCode
            </a>
          </div>

          <span className="text-ink/70 text-[11px]">
            PREC LONI • B.E. IT RANK 1 • CGPA 8.67/10.0
          </span>
        </div>
      </div>
    </div>
  );
}

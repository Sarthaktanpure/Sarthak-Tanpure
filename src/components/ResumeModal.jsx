import React from 'react';
import { X, Download, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function ResumeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleDownload = () => {
    soundEngine.playClick();
    const link = document.createElement('a');
    link.href = '/sarthak_tanpure_resume.pdf';
    link.download = 'Sarthak_Tanpure_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-void/85 backdrop-blur-md">
      <div className="bracket-box w-full max-w-4xl bg-panel border border-hairline rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-hairline/80 bg-void/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-signal-cyan" />
            <span className="telemetry-mono text-display text-xs font-semibold">
              SYSTEM LOGS // CURRICULUM VITAE — SARTHAK TANPURE
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-signal-cyan/15 border border-signal-cyan/50 text-signal-cyan text-xs font-mono rounded hover:bg-signal-cyan/25 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-display transition-colors rounded hover:bg-void"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Embedded View or Fallback summary */}
        <div className="flex-1 overflow-y-auto p-4 bg-void/60">
          <iframe
            src="/sarthak_tanpure_resume.pdf#toolbar=0"
            title="Sarthak Tanpure Resume PDF"
            className="w-full h-[65vh] rounded border border-hairline bg-void"
          />
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-hairline/80 bg-void/80 flex items-center justify-between text-xs font-mono text-muted">
          <span>PREC LONI • B.E. IT RANK 1 • CGPA 8.67/10.0</span>
          <span>PRESS ESC OR CLOSE TO RETURN TO CONTROL ROOM</span>
        </div>
      </div>
    </div>
  );
}

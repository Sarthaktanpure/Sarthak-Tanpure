import React, { useEffect, useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function NoirModeOverlay() {
  const [isNoir, setIsNoir] = useState(false);
  const [typedBuffer, setTypedBuffer] = useState('');

  useEffect(() => {
    // 1. Konami Code sequence: Up, Up, Down, Down, Left, Right, Left, Right, b, a
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      // Toggle off with Escape
      if (e.key === 'Escape' && isNoir) {
        setIsNoir(false);
        document.body.classList.remove('noir-mode');
        return;
      }

      // Check Konami Code
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          triggerNoir();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }

      // Check phrase "don't look back" / "dont look back"
      setTypedBuffer((prev) => {
        const next = (prev + e.key.toLowerCase()).slice(-20);
        if (next.includes("don't look back") || next.includes("dont look back")) {
          triggerNoir();
          return '';
        }
        return next;
      });
    };

    const triggerNoir = () => {
      soundEngine.playHeartbeat();
      setIsNoir(true);
      document.body.classList.add('noir-mode');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNoir]);

  const handleDismiss = () => {
    setIsNoir(false);
    document.body.classList.remove('noir-mode');
  };

  if (!isNoir) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[10001] pointer-events-auto">
      <div className="bracket-box px-6 py-3 bg-black/95 border-2 border-white/80 text-white rounded shadow-2xl flex items-center gap-4 animate-pulse">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-white" />
          <div>
            <div className="text-xs font-mono tracking-widest uppercase font-bold">
              NOIR OVERRIDE ENGAGED
            </div>
            <div className="text-sm font-serif italic text-white/90">
              "You looked back."
            </div>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="ml-4 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/40 text-[10px] font-mono tracking-widest rounded"
        >
          [ESC TO RESTORE]
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
  onBurst?: (x: number, y: number, count: number) => void;
}

export default function Loader({ onComplete, onBurst }: LoaderProps) {
  const [count, setCount] = useState(0);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  useEffect(() => {
    // 1.8s smooth cubic-bezier counter in Archivo wdth 62
    const duration = 1800;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // expo.out style easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(eased * 100);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(100);
        setTimeout(() => {
          setIsSlidingUp(true);
          // Fire 40-shape confetti burst from screen center as curtain lifts
          if (onBurst) {
            onBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
          }
          setTimeout(onComplete, 700);
        }, 120);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [onComplete, onBurst]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 sm:p-12 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isSlidingUp ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-hidden={isSlidingUp}
      role="progressbar"
      aria-valuenow={count}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b-2 border-paper/20 pb-4">
        <span className="caption-mono text-paper/80 font-bold tracking-widest text-xs">
          SARTHAK TANPURE
        </span>
        <span className="caption-mono text-accent-2 font-bold text-xs">
          EDITION // 2026
        </span>
      </div>

      {/* Center Giant Counter: Archivo wdth 62, ~34vw */}
      <div className="flex flex-col items-start my-auto">
        <div
          className="text-[34vw] font-black leading-[0.8] tracking-poster-tight text-paper"
          style={{
            fontVariationSettings: "'wdth' 62, 'wght' 900",
          }}
        >
          {String(count).padStart(3, '0')}
        </div>
        <p className="caption-mono text-paper/60 text-xs sm:text-sm mt-4 tracking-wider">
          SYSTEM LOADING // SWISS POSTER ARCHITECTURE
        </p>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between border-t-2 border-paper/20 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-accent-1 animate-pulse" />
          <span className="caption-mono text-paper/80 text-xs">
            OXBLOOD // READY
          </span>
        </div>
        <span className="caption-mono text-accent-2 font-bold text-xs">
          {count}%
        </span>
      </div>
    </div>
  );
}

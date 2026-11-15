import React, { useEffect, useRef, useState } from 'react';
import { DATA } from '../../data';
import { ArrowDown } from 'lucide-react';
import { useMagnetic } from './useMagnetic';

interface HeroProps {
  scrollVelocity?: number;
  scrollProgress?: number;
}

export default function Hero({ scrollVelocity = 0, scrollProgress = 0 }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isTouch, setIsTouch] = useState(false);
  const [touchTime, setTouchTime] = useState(0);
  const [currentWdths, setCurrentWdths] = useState<number[]>([]);
  const magneticBtn = useMagnetic(0.25, 0.35);

  const firstLetters = DATA.firstName.split('');
  const lastLetters = DATA.lastName.split('');
  const totalLetters = firstLetters.length + lastLetters.length;

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Initialize base widths (75)
    setCurrentWdths(new Array(totalLetters).fill(75));

    const touch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);
    setIsTouch(touch);

    let animId: number;

    if (touch) {
      const startTime = performance.now();
      const touchLoop = (t: number) => {
        const time = (t - startTime) / 1000;
        setTouchTime(time);
        animId = requestAnimationFrame(touchLoop);
      };
      animId = requestAnimationFrame(touchLoop);
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Smooth lerp loop (lerp ~0.14) for letter proximity stretch
      const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

      const lerpLoop = () => {
        setCurrentWdths((prev) => {
          return prev.map((currWdth, idx) => {
            const span = letterRefs.current[idx];
            if (!span) return 75;

            const rect = span.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);

            const maxDistance = 300;
            let targetWdth = 75;
            if (dist < maxDistance) {
              const factor = 1 - dist / maxDistance;
              targetWdth = 75 + factor * 50; // 75 to 125
            }

            return lerp(currWdth, targetWdth, 0.14);
          });
        });

        animId = requestAnimationFrame(lerpLoop);
      };

      animId = requestAnimationFrame(lerpLoop);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animId);
      };
    }

    return () => cancelAnimationFrame(animId);
  }, [totalLetters, isTouch, mousePos.x, mousePos.y]);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll scale-down and fade as About sheet slides over
  const heroOpacity = Math.max(0, 1 - scrollProgress * 3.5);
  const heroScale = Math.max(0.88, 1 - scrollProgress * 0.4);

  // Sticker scroll rotation
  const stickerScrollRotate = scrollProgress * 720;

  return (
    <section
      id="hero"
      ref={containerRef}
      className="sticky top-0 h-[100dvh] w-full bg-cobalt-blue text-cobalt-paper pt-24 sm:pt-32 pb-8 px-6 sm:px-12 flex flex-col justify-between overflow-hidden z-10"
      style={{
        opacity: heroOpacity,
        transform: `scale(${heroScale})`,
        transformOrigin: '50% 60%',
      }}
    >
      {/* Background Shapes with Idle Loops & Parallax */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        {/* 1. Red Circle: Breathes (idle pulse) + scroll parallax */}
        <div
          className="absolute -top-12 -right-12 sm:top-8 sm:right-16 w-52 sm:w-88 h-52 sm:h-88 rounded-full bg-cobalt-red animate-idle-breathe"
          style={{
            transform: `translate3d(0, ${scrollProgress * 260}px, 0)`,
          }}
        />

        {/* 2. Yellow Half-Moon: Rocks (idle swing) + scroll parallax */}
        <div
          className="absolute top-[44%] -right-12 sm:right-28 w-56 sm:w-76 h-28 sm:h-38 bg-cobalt-yellow rounded-t-full animate-idle-rock"
          style={{
            transform: `translate3d(0, ${scrollProgress * 180}px, 0) rotate(-45deg)`,
          }}
        />

        {/* 3. Thin Ring: Spins & pulses + scroll parallax */}
        <div
          className="absolute top-[30%] left-[3%] sm:left-[7%] w-40 sm:w-64 h-40 sm:h-64 rounded-full border-2 border-cobalt-paper/35 animate-idle-spin-pulse"
          style={{
            transform: `translate3d(0, ${-scrollProgress * 150}px, 0)`,
          }}
        />

        {/* 4. Dot Grid: Drifts gently + scroll parallax */}
        <div
          className="absolute bottom-20 right-10 hidden lg:grid grid-cols-6 gap-3 opacity-30 animate-idle-drift"
          style={{
            transform: `translate3d(0, ${scrollProgress * 120}px, 0)`,
          }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-cobalt-paper" />
          ))}
        </div>
      </div>

      {/* Rotating Circular Sticker: "Click anywhere — make a mess —" */}
      <div
        className="absolute top-24 sm:top-32 right-6 sm:right-12 z-20 select-none"
        style={{
          animation: 'fadeEnterSticker 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards',
        }}
      >
        <div
          className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center animate-spin-slow"
          style={{
            transform: `rotate(${stickerScrollRotate}deg)`,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <path
              id="heroStickerPath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="none"
            />
            <text className="text-[8.5px] font-mono uppercase tracking-[0.24em] fill-cobalt-paper font-black">
              <textPath href="#heroStickerPath" startOffset="0%">
                CLICK ANYWHERE — MAKE A MESS —
              </textPath>
            </text>
          </svg>
          {/* Yellow center dot pulsing to red */}
          <div className="absolute w-5 h-5 rounded-full bg-cobalt-yellow animate-dot-pulse shadow-[0_0_14px_rgba(255,212,0,0.6)]" />
        </div>
      </div>

      {/* Hero Name Typography Stack (Clips In with 35ms Stagger) */}
      <div className="relative z-10 max-w-7xl w-full my-auto py-4 select-none">
        <h1
          className="poster-headline text-[15.5vw] sm:text-[14vw] md:text-[13.4vw] font-black leading-[0.84] text-cobalt-paper flex flex-col tracking-poster"
          aria-label={`${DATA.firstName} ${DATA.lastName}`}
        >
          {/* Line 1: SARTHAK */}
          <div className="flex flex-wrap overflow-hidden py-1">
            {firstLetters.map((char, index) => {
              const wdth = isTouch
                ? 75 + Math.floor(((Math.sin(touchTime * 3 + index * 0.45) + 1) / 2) * 50)
                : currentWdths[index] || 75;

              return (
                <span
                  key={index}
                  ref={(el) => (letterRefs.current[index] = el)}
                  className="inline-block transition-colors duration-200 cursor-default select-none"
                  style={{
                    fontVariationSettings: `'wdth' ${Math.round(wdth)}, 'wght' 900`,
                    animation: `riseInClipped 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${index * 35}ms backwards`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Line 2: TANPURE */}
          <div className="flex flex-wrap overflow-hidden py-1">
            {lastLetters.map((char, index) => {
              const globalIdx = firstLetters.length + index;
              const wdth = isTouch
                ? 75 + Math.floor(((Math.sin(touchTime * 3 + globalIdx * 0.45) + 1) / 2) * 50)
                : currentWdths[globalIdx] || 75;

              return (
                <span
                  key={index}
                  ref={(el) => (letterRefs.current[globalIdx] = el)}
                  className="inline-block transition-colors duration-200 cursor-default select-none"
                  style={{
                    fontVariationSettings: `'wdth' ${Math.round(wdth)}, 'wght' 900`,
                    animation: `riseInClipped 0.75s cubic-bezier(0.16, 1, 0.3, 1) ${globalIdx * 35}ms backwards`,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </h1>
      </div>

      {/* Bottom Row: Tagline + "See the work" Button above a 2px rule */}
      <div
        className="relative z-10 max-w-7xl w-full border-t-2 border-cobalt-paper/30 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
        style={{
          animation: 'fadeEnterRow 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.5s backwards',
        }}
      >
        <p className="poster-body text-base sm:text-lg md:text-xl text-cobalt-paper font-medium max-w-2xl leading-snug">
          {DATA.tagline}
        </p>

        <button
          ref={magneticBtn.ref as React.RefObject<HTMLButtonElement>}
          style={magneticBtn.style}
          onClick={scrollToWork}
          className="inline-flex items-center gap-3 px-6 py-3.5 bg-cobalt-yellow text-cobalt-ink font-black caption-mono text-xs uppercase hover:bg-white transition-all shadow-[4px_4px_0px_#0A0E3A] group self-start md:self-auto cursor-pointer"
        >
          <span>SEE THE WORK</span>
          <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Keyframes for Hero Animations & Idle Loops */}
      <style>{`
        @keyframes riseInClipped {
          from {
            transform: translateY(115%);
            opacity: 0;
          }
          to {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        @keyframes fadeEnterRow {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeEnterSticker {
          from {
            opacity: 0;
            transform: scale(0.6);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        .animate-idle-breathe {
          animation: breathe 5s ease-in-out infinite;
        }
        @keyframes rock {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(-55deg); }
        }
        .animate-idle-rock {
          animation: rock 6s ease-in-out infinite;
        }
        @keyframes spinPulse {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.04); }
          100% { transform: rotate(360deg) scale(1); }
        }
        .animate-idle-spin-pulse {
          animation: spinPulse 24s linear infinite;
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(8px, -10px); }
        }
        .animate-idle-drift {
          animation: drift 8s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% {
            background-color: #FFD400;
            transform: scale(1);
          }
          50% {
            background-color: #FF4A1C;
            transform: scale(1.3);
          }
        }
        .animate-dot-pulse {
          animation: dotPulse 2.4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

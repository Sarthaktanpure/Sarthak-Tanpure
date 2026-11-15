import React, { useEffect, useRef, useState } from 'react';
import { DATA } from '../../data';

interface AboutProps {
  scrollProgress?: number;
}

export default function About({ scrollProgress = 0 }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [localProgress, setLocalProgress] = useState(0);

  // Compute word-by-word scroll illumination within this section
  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start when top reaches middle, finish when bottom hits middle
      const start = windowHeight * 0.85;
      const end = windowHeight * 0.15;
      const current = rect.top;

      const progress = Math.min(1, Math.max(0, (start - current) / (start - end)));
      setLocalProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Break statements into words for the darkening effect
  const fullStatement = DATA.statement.join(' ');
  const words = fullStatement.split(' ');

  // Extra scroll-linked rotation for the circular badge
  const badgeScrollRotate = scrollProgress * 360;

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 bg-paper text-ink pt-28 sm:pt-36 pb-28 px-6 sm:px-12 sheet-rounded shadow-[0_-28px_56px_color-mix(in_srgb,var(--ink)_20%,transparent)] border-t-2 border-ink/20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with 2px Rule */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink pb-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-accent-1 rounded-full" />
            <h2 className="caption-mono font-black text-ink text-xs sm:text-sm">
              01 // STATEMENT & PERSPECTIVE
            </h2>
          </div>
          <span className="caption-mono text-ink/60 text-xs">
            SWISS POSTER FORMAT // 2026
          </span>
        </div>

        {/* Two-Column Grid: Statement on Left, Rotating Badge on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Main Statement (Darkens Word-by-Word on Scroll from grey to ink) */}
          <div className="lg:col-span-8">
            <h3 className="poster-headline text-3xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-poster">
              {words.map((word, i) => {
                const wordThreshold = i / words.length;
                const isLit = localProgress >= wordThreshold;
                return (
                  <span
                    key={i}
                    className="inline-block mr-2.5 sm:mr-3.5 transition-colors duration-300 ease-out"
                    style={{
                      color: isLit ? 'var(--ink)' : 'color-mix(in srgb, var(--ink) 22%, transparent)',
                      fontVariationSettings: isLit ? "'wdth' 105, 'wght' 900" : "'wdth' 90, 'wght' 800",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </h3>

            {/* Quick Metrics Strip */}
            <div className="mt-16 pt-8 border-t-2 border-ink/15 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <span className="caption-mono text-ink/60 text-[11px] block">ACADEMIC STANDING</span>
                <span className="poster-headline text-2xl sm:text-3xl text-primary font-black mt-1 block">
                  RANK 1
                </span>
                <span className="caption-mono text-xs text-ink/80 mt-0.5 block">
                  8.67 CGPA // PREC LONI
                </span>
              </div>

              <div>
                <span className="caption-mono text-ink/60 text-[11px] block">ALGORITHMIC RIGOR</span>
                <span className="poster-headline text-2xl sm:text-3xl text-accent-1 font-black mt-1 block">
                  250+
                </span>
                <span className="caption-mono text-xs text-ink/80 mt-0.5 block">
                  JAVA PROBLEMS SOLVED
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="caption-mono text-ink/60 text-[11px] block">TRANSACTION SCALE</span>
                <span className="poster-headline text-2xl sm:text-3xl text-ink font-black mt-1 block">
                  20,000+
                </span>
                <span className="caption-mono text-xs text-ink/80 mt-0.5 block">
                  ML FRAUD DETECTION PIPELINE
                </span>
              </div>
            </div>

            {/* Technical Skills Overview Grid */}
            <div className="mt-12 pt-8 border-t-2 border-ink/15">
              <span className="caption-mono text-primary font-black text-xs block mb-4 tracking-wider">
                CORE TECHNICAL COMPETENCIES (FROM CURRICULUM VITAE)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-white/70 border border-ink/20">
                  <span className="font-black text-ink block mb-1 text-[11px]">DATA & ANALYTICS / ML:</span>
                  <span className="text-ink/80 leading-relaxed block">
                    Data Analysis, Analytics Dashboards, Anomaly Detection, Predictive Modeling, Data Pipelines, PyTorch, XGBoost, Isolation Forest, CNN, PPO Deep RL.
                  </span>
                </div>
                <div className="p-3 bg-white/70 border border-ink/20">
                  <span className="font-black text-ink block mb-1 text-[11px]">FULL-STACK & SYSTEMS:</span>
                  <span className="text-ink/80 leading-relaxed block">
                    React.js, Node.js, Express.js, MERN Stack, REST APIs, Flask, Socket.IO, MongoDB, PostgreSQL, JWT & RBAC, Git, Postman, Vercel.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Rotating Circular Text Badge with Scroll Link */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center pt-6 lg:pt-12">
            <div
              className="relative w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center select-none"
              style={{
                transform: `rotate(${badgeScrollRotate}deg)`,
                transition: 'transform 0.1s linear',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-reverse overflow-visible">
                <path
                  id="aboutBadgeCircle"
                  d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                  fill="none"
                />
                <text className="text-[7.5px] font-mono uppercase tracking-[0.19em] fill-ink font-black">
                  <textPath href="#aboutBadgeCircle" startOffset="0%">
                    APPLIED MACHINE LEARNING • SCALABLE SYSTEMS •
                  </textPath>
                </text>
              </svg>

              {/* Accent 1 Center Circle */}
              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-accent-1 shadow-lg flex items-center justify-center text-paper font-black text-xs font-mono uppercase">
                ENGINEER
              </div>
            </div>

            <p className="caption-mono text-center text-ink/60 text-xs mt-8 max-w-xs">
              ENGINEERED FOR RIGOR, REPRODUCIBILITY, AND DETERMINISTIC BEHAVIOR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

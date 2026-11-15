import React, { useEffect, useRef, useState } from 'react';
import { DATA } from '../../data';

interface CraftProps {
  scrollVelocity?: number;
}

export default function Craft({ scrollVelocity = 0 }: CraftProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Multiplied bands for seamless infinite marquee loop
  const band1Items = [
    ...DATA.toolBands.band1,
    ...DATA.toolBands.band1,
    ...DATA.toolBands.band1,
    ...DATA.toolBands.band1,
  ];
  const band2Items = [
    ...DATA.toolBands.band2,
    ...DATA.toolBands.band2,
    ...DATA.toolBands.band2,
    ...DATA.toolBands.band2,
  ];

  // Dynamic tilt opening up ~7deg more on enter, then settling to final angles (-4deg / +3.5deg)
  const yellowTilt = hasEntered ? -4 : -11;
  const inkTilt = hasEntered ? 3.5 : 10.5;

  // Velocity boost factor for scrolling acceleration
  const velocityMultiplier = Math.min(2.8, 1 + Math.abs(scrollVelocity) * 0.05);

  return (
    <section
      id="craft"
      ref={containerRef}
      className="relative z-20 bg-cobalt-blue text-cobalt-paper py-32 sm:py-48 px-4 overflow-hidden border-t-2 border-b-2 border-cobalt-paper/20"
      aria-label="Core Engineering Technologies and Craft"
    >
      {/* Background Section Title */}
      <div className="max-w-7xl mx-auto px-6 mb-20 text-center select-none">
        <span className="caption-mono text-cobalt-paper/70 text-xs font-bold block mb-3">
          03 // ARSENAL & PROFICIENCY
        </span>
        <h2 className="poster-headline text-5xl sm:text-7xl md:text-8xl text-cobalt-paper font-black tracking-poster">
          CRAFT & ENGINE
        </h2>
      </div>

      {/* Two Tilted Marquee Bands Crossing in an X */}
      <div className="relative w-full py-16 flex items-center justify-center">
        {/* Band 1: Yellow, -4deg, Ink text, scrolls Left */}
        <div
          className="absolute w-[130vw] -left-[15vw] bg-cobalt-yellow text-cobalt-ink py-5 sm:py-7 shadow-[0_16px_40px_rgba(10,14,58,0.38)] z-10 border-y-2 border-cobalt-ink transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `rotate(${yellowTilt}deg)`,
          }}
        >
          <div
            className={`flex whitespace-nowrap overflow-hidden select-none ${
              isVisible ? 'animate-marquee-left' : ''
            }`}
            style={{
              animationDuration: `${32 / velocityMultiplier}s`,
            }}
          >
            {band1Items.map((item, idx) => {
              const isOutlined = idx % 2 === 1;
              return (
                <span
                  key={idx}
                  className={`poster-headline text-3xl sm:text-5xl md:text-6xl mx-6 font-black tracking-poster inline-block ${
                    isOutlined
                      ? 'text-transparent [-webkit-text-stroke:2px_#0A0E3A]'
                      : 'text-cobalt-ink'
                  }`}
                >
                  {item} •
                </span>
              );
            })}
          </div>
        </div>

        {/* Band 2: Ink, +3.5deg, Paper text, scrolls Right */}
        <div
          className="relative w-[130vw] -left-[15vw] bg-cobalt-ink text-cobalt-paper py-5 sm:py-7 shadow-[0_20px_48px_rgba(10,14,58,0.5)] z-20 border-y-2 border-cobalt-paper/30 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `rotate(${inkTilt}deg)`,
          }}
        >
          <div
            className={`flex whitespace-nowrap overflow-hidden select-none ${
              isVisible ? 'animate-marquee-right' : ''
            }`}
            style={{
              animationDuration: `${36 / velocityMultiplier}s`,
            }}
          >
            {band2Items.map((item, idx) => {
              const isOutlined = idx % 2 === 1;
              return (
                <span
                  key={idx}
                  className={`poster-headline text-3xl sm:text-5xl md:text-6xl mx-6 font-black tracking-poster inline-block ${
                    isOutlined
                      ? 'text-transparent [-webkit-text-stroke:2px_#F3F1EA]'
                      : 'text-cobalt-paper'
                  }`}
                >
                  {item} •
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-left {
          animation: marqueeLeft linear infinite;
        }
        .animate-marquee-right {
          animation: marqueeRight linear infinite;
        }
      `}</style>
    </section>
  );
}

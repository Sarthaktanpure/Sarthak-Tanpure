import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Loader from './components/cobalt/Loader';
import Nav from './components/cobalt/Nav';
import Hero from './components/cobalt/Hero';
import About from './components/cobalt/About';
import Work from './components/cobalt/Work';
import Craft from './components/cobalt/Craft';
import Notes from './components/cobalt/Notes';
import Contact from './components/cobalt/Contact';
import Cursor from './components/cobalt/Cursor';
import ShapeFX from './components/cobalt/ShapeFX';
import ResumeModal from './components/ResumeModal';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const shapeFXRef = useRef(null);

  // Lenis smooth momentum scroll initialization
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

    const lenis = new Lenis({
      duration: isTouch ? 0.75 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    let lastScroll = window.scrollY;
    let rafId;
    let isRunning = true;
    let ticking = false;
    let pendingProgress = 0;
    let pendingVelocity = 0;
    let velocityTimer = null;

    function raf(time) {
      if (!isRunning) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      const scrollY = typeof e.scroll === 'number' ? e.scroll : window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0;
      const delta = Math.abs(scrollY - lastScroll);
      lastScroll = scrollY;

      pendingProgress = progress;
      pendingVelocity = delta;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrollProgress(pendingProgress);
          setScrollVelocity(pendingVelocity);
          ticking = false;
        });
      }

      if (velocityTimer) clearTimeout(velocityTimer);
      velocityTimer = setTimeout(() => {
        setScrollVelocity(0);
      }, 120);
    });

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      if (velocityTimer) clearTimeout(velocityTimer);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-cobalt-blue text-cobalt-paper font-sans selection:bg-cobalt-yellow selection:text-cobalt-ink overflow-x-hidden antialiased">
      {/* 1. Full-Screen Ink Curtain Loader with Center Confetti Burst */}
      {loading && (
        <Loader
          onComplete={() => setLoading(false)}
          onBurst={(x, y, count) => shapeFXRef.current?.burst(x, y, count)}
        />
      )}

      {/* 2. Paper Grain Overlay (7% multiply blend across whole page) */}
      <div className="paper-grain-overlay" aria-hidden="true" />

      {/* 3. Interactive Physics Shape Burst & Trail Canvas */}
      <ShapeFX ref={shapeFXRef} />

      {/* 4. Minimal Difference Cursor (Fine Pointers) */}
      <Cursor />

      {/* 5. Minimal Swiss Navigation */}
      <Nav onOpenResume={() => setIsResumeOpen(true)} />

      {/* 6. Main Content Spine with Headline Skew on Velocity */}
      <main
        className="relative z-10 w-full overflow-hidden"
        style={{
          // Subtle headline skew on fast scroll velocity (max 2deg)
          transform: scrollVelocity > 40 ? `skewY(${Math.min(2, (scrollVelocity - 40) * 0.03)}deg)` : 'none',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Section 01: Hero (Sticky sheet with letter stretch and background shapes) */}
        <Hero scrollVelocity={scrollVelocity} scrollProgress={scrollProgress} />

        {/* Section 02: About (Sliding Paper Sheet with word darkening) */}
        <About scrollProgress={scrollProgress} />

        {/* Section 03: Selected Work (Paper with Red Band Header & Accordion) */}
        <Work />

        {/* Section 04: Craft (Crossing Tilted Marquee Bands with Velocity Acceleration) */}
        <Craft scrollVelocity={scrollVelocity} />

        {/* Section 05: Notes (Ruled Citations with Animated Line Reveal) */}
        <Notes />

        {/* Section 06: Contact & Footer */}
        <Contact />
      </main>

      {/* Résumé Modal Dialog */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}

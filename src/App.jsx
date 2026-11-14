import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import TelemetryHUD from './components/TelemetryHUD';
import CursorAndLight from './components/CursorAndLight';
import RadarBackground from './components/RadarBackground';
import HeroScene from './components/scenes/HeroScene';
import FraudScene from './components/scenes/FraudScene';
import NetworkScene from './components/scenes/NetworkScene';
import DeepRLScene from './components/scenes/DeepRLScene';
import ProofScene from './components/scenes/ProofScene';
import SunriseScene from './components/scenes/SunriseScene';
import ResumeModal from './components/ResumeModal';
import NoirModeOverlay from './components/NoirModeOverlay';
import OpsTerminal from './components/OpsTerminal';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);

  // Active scene calculation
  const getActiveScene = (progress) => {
    if (progress < 0.18) return { index: 1, title: 'BOOT' };
    if (progress < 0.40) return { index: 2, title: 'THE WATCH' };
    if (progress < 0.62) return { index: 3, title: 'THE CONNECTION' };
    if (progress < 0.82) return { index: 4, title: 'THE MACHINE THINKS' };
    if (progress < 0.94) return { index: 5, title: 'PROOF' };
    return { index: 5, title: 'SUNRISE' };
  };

  // Convert scroll progress (0.0 to 1.0) into continuous Night Shift time: 00:00 -> 06:47
  const getClockTime = (progress, is24) => {
    const totalMinutes = Math.min(407, Math.floor(progress * 407));
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const minStr = String(minutes).padStart(2, '0');

    if (is24) {
      return `${String(hours24).padStart(2, '0')}:${minStr}`;
    } else {
      const displayHours = hours24 % 12 || 12;
      return `${String(displayHours).padStart(2, '0')}:${minStr} AM`;
    }
  };

  // Lenis smooth momentum scroll initialization
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });

    let lastScroll = 0;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? Math.min(1, Math.max(0, e.scroll / totalHeight)) : 0;
      setScrollProgress(progress);

      const delta = Math.abs(e.scroll - lastScroll);
      lastScroll = e.scroll;
      setScrollVelocity(delta);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  // Keyboard shortcut listener for terminal ~ (backquote)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        soundEngine.playClick();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor coordinates
  useEffect(() => {
    const handleMouse = (e) => {
      setCursorCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const activeScene = getActiveScene(scrollProgress);
  const clockTime = getClockTime(scrollProgress, is24Hour);

  const getAtmosphereStyle = () => {
    if (scrollProgress > 0.85) {
      return {
        background: 'radial-gradient(circle at 50% 100%, rgba(201, 123, 90, 0.08) 0%, transparent 60%)',
      };
    }
    if (scrollProgress > 0.45 && scrollProgress <= 0.65) {
      return {
        background: 'radial-gradient(circle at 80% 50%, rgba(255, 179, 71, 0.04) 0%, transparent 70%)',
      };
    }
    if (scrollProgress > 0.20 && scrollProgress <= 0.45) {
      return {
        background: 'radial-gradient(circle at 20% 40%, rgba(255, 59, 78, 0.035) 0%, transparent 70%)',
      };
    }
    return {
      background: 'radial-gradient(circle at 50% 30%, rgba(61, 242, 255, 0.03) 0%, transparent 70%)',
    };
  };

  const scrollToContact = () => {
    soundEngine.playClick();
    const elem = document.getElementById('contact');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-void text-display font-display selection:bg-signal-cyan/20 selection:text-signal-cyan overflow-x-hidden">
      {/* Boot Loader */}
      {loading && <Loader onComplete={() => setLoading(false)} />}

      {/* Atmospheric Overlays */}
      <div className="grain-overlay" />
      <div className="scanlines-overlay" />
      <div className="vignette-overlay" />

      {/* Dynamic Background Atmosphere */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000 z-0"
        style={getAtmosphereStyle()}
      />

      {/* Radar Background Sweep */}
      <RadarBackground opacity={scrollProgress < 0.25 ? 0.35 : 0.12} />

      {/* Precision Cursor & Desk Lamp Glow */}
      <CursorAndLight />

      {/* Fixed Telemetry HUD */}
      <TelemetryHUD
        scrollProgress={scrollProgress}
        activeScene={activeScene}
        cursorCoords={cursorCoords}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        onOpenContact={scrollToContact}
        onPullLogs={() => {
          soundEngine.playClick();
          setIsResumeOpen(true);
        }}
        onOpenTerminal={() => {
          soundEngine.playClick();
          setIsTerminalOpen(true);
        }}
        clockTime={clockTime}
        is24Hour={is24Hour}
        setIs24Hour={setIs24Hour}
      />

      {/* Noir Easter Egg Listener & Overlay */}
      <NoirModeOverlay />

      {/* Ops Diagnostics Command Terminal */}
      <OpsTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onOpenContact={scrollToContact}
        onPullLogs={() => {
          setIsTerminalOpen(false);
          setIsResumeOpen(true);
        }}
      />

      {/* Main Narrative Spine (Act I -> Act V -> Sunrise) */}
      <main
        style={{
          transform: scrollVelocity > 35 ? `skewY(${Math.min(2, scrollVelocity * 0.02)}deg)` : 'none',
          transition: 'transform 0.2s cubic-bezier(0.1, 1, 0.1, 1)'
        }}
        className="relative z-10"
      >
        <HeroScene
          onOpenContact={scrollToContact}
          onPullLogs={() => {
            soundEngine.playClick();
            setIsResumeOpen(true);
          }}
        />

        <FraudScene isInView={activeScene.index === 2} />

        <NetworkScene />

        <DeepRLScene />

        <ProofScene />

        <SunriseScene
          onPullLogs={() => {
            soundEngine.playClick();
            setIsResumeOpen(true);
          }}
        />
      </main>

      {/* Resume Logs Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => {
          soundEngine.playClick();
          setIsResumeOpen(false);
        }}
      />
    </div>
  );
}

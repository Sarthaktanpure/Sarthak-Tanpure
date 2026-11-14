import React, { useState, useEffect, useRef } from 'react';
import { Compass, Eye, Cpu, Zap, ArrowUpRight, Gauge, Layers, Play, Pause, Navigation, Shield, Sliders } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export default function DeepRLScene() {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [pilotMode, setPilotMode] = useState('ai'); // 'ai' | 'manual'
  const [trackType, setTrackType] = useState('mountain'); // 'mountain' | 'monaco' | 'oval'
  const [activeTab, setActiveTab] = useState('sim'); // 'sim' | 'nn' | 'media'
  const [manualSteer, setManualSteer] = useState(0);

  const [telemetry, setTelemetry] = useState({
    steering: '0.04 rad',
    throttle: '0.82',
    speed: '31.4 km/h',
    reward: '+142.6',
    crossTrackError: '0.012 m',
    episode: 4208,
  });

  // Track generator based on selected trackType
  const getTrackPoint = (t, type, cx, cy, rx, ry) => {
    const angle = t * Math.PI * 2;
    let rMod = 1;

    if (type === 'mountain') {
      rMod = 1 + 0.22 * Math.sin(angle * 3) - 0.12 * Math.cos(angle * 2);
    } else if (type === 'monaco') {
      rMod = 1 + 0.35 * Math.sin(angle * 4) + 0.15 * Math.sin(angle * 2);
    } else {
      // Oval
      rMod = 1 + 0.05 * Math.cos(angle * 2);
    }

    const x = cx + Math.cos(angle) * (rx * rMod);
    const y = cy + Math.sin(angle) * (ry * rMod);
    return { x, y, angle };
  };

  // Canvas simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener('resize', handleResize);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const rx = Math.min(width * 0.42, 380);
    const ry = Math.min(height * 0.38, 150);

    let progress = 0;
    const speed = 0.0022;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Pure dark void background
      ctx.fillStyle = '#05070A';
      ctx.fillRect(0, 0, width, height);

      // 2. Glowing Track Outline
      const trackWidth = 46;
      const steps = 140;

      ctx.strokeStyle = pilotMode === 'ai' ? 'rgba(61, 242, 255, 0.3)' : 'rgba(255, 179, 71, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
      ctx.shadowBlur = 10;

      // Outer boundary
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const pt = getTrackPoint(i / steps, trackType, cx, cy, rx, ry);
        const normAngle = pt.angle + Math.PI / 2;
        const ox = pt.x + Math.cos(normAngle) * (trackWidth / 2);
        const oy = pt.y + Math.sin(normAngle) * (trackWidth / 2);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner boundary
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const pt = getTrackPoint(i / steps, trackType, cx, cy, rx, ry);
        const normAngle = pt.angle + Math.PI / 2;
        const ix = pt.x - Math.cos(normAngle) * (trackWidth / 2);
        const iy = pt.y - Math.sin(normAngle) * (trackWidth / 2);
        if (i === 0) ctx.moveTo(ix, iy);
        else ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.stroke();

      // Faint centerline
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const pt = getTrackPoint(i / steps, trackType, cx, cy, rx, ry);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Autonomous Agent Car Position & Heading
      const currentPt = getTrackPoint(progress, trackType, cx, cy, rx, ry);
      const nextPt = getTrackPoint((progress + 0.01) % 1.0, trackType, cx, cy, rx, ry);
      let heading = Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);

      if (pilotMode === 'manual') {
        heading += manualSteer;
      }

      ctx.save();
      ctx.translate(currentPt.x, currentPt.y);
      ctx.rotate(heading);

      // Dynamic Headlight Cone
      const lightDist = 150;
      const lightSpread = 0.45;
      const headGrad = ctx.createRadialGradient(0, 0, 5, lightDist * 0.6, 0, lightDist);
      headGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      headGrad.addColorStop(0.5, pilotMode === 'ai' ? 'rgba(61, 242, 255, 0.2)' : 'rgba(255, 179, 71, 0.25)');
      headGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(lightDist, -Math.sin(lightSpread) * lightDist);
      ctx.arc(0, 0, lightDist, -lightSpread, lightSpread);
      ctx.lineTo(12, 0);
      ctx.closePath();
      ctx.fillStyle = headGrad;
      ctx.fill();

      // Sensor LIDAR / Camera Ray-casts
      if (showRays) {
        const rayAngles = [-0.55, -0.28, 0, 0.28, 0.55];
        rayAngles.forEach((ra) => {
          const rayLength = 85 + Math.cos(ra * 3) * 22;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          const rxPos = Math.cos(ra) * rayLength;
          const ryPos = Math.sin(ra) * rayLength;
          ctx.lineTo(rxPos, ryPos);
          ctx.strokeStyle = pilotMode === 'ai' ? 'rgba(61, 242, 255, 0.7)' : 'rgba(255, 179, 71, 0.8)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Ray Intersection Dot
          ctx.beginPath();
          ctx.arc(rxPos, ryPos, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
          ctx.shadowColor = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Car Chassis
      ctx.fillStyle = '#0B0F14';
      ctx.strokeStyle = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-13, -7, 26, 14);
      ctx.strokeRect(-13, -7, 26, 14);

      // Tail lights
      ctx.fillStyle = '#FF3B4E';
      ctx.fillRect(-14, -6, 2, 3);
      ctx.fillRect(-14, 3, 2, 3);

      // Headlights
      ctx.fillStyle = '#EDEBE4';
      ctx.fillRect(12, -6, 2, 3);
      ctx.fillRect(12, 3, 2, 3);

      ctx.restore();

      if (isRunning) {
        progress = (progress + speed) % 1.0;
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning, showRays, pilotMode, trackType, manualSteer]);

  // Periodic Telemetry Updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isRunning) return;
      const angle = ((Math.random() - 0.5) * 0.12).toFixed(3);
      const throttle = (0.78 + Math.random() * 0.15).toFixed(2);
      const speed = (29.5 + Math.random() * 4.2).toFixed(1);
      const reward = (140.0 + Math.random() * 8.5).toFixed(1);
      const cte = ((Math.random() - 0.5) * 0.04).toFixed(3);

      setTelemetry({
        steering: `${angle > 0 ? '+' : ''}${angle} rad`,
        throttle,
        speed: `${speed} km/h`,
        reward: `+${reward}`,
        crossTrackError: `${cte} m`,
        episode: 4208 + Math.floor(Math.random() * 10),
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Keyboard listener for manual pilot
  useEffect(() => {
    if (pilotMode !== 'manual') return;

    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') {
        setManualSteer((prev) => Math.max(-0.4, prev - 0.08));
      } else if (e.key === 'ArrowRight') {
        setManualSteer((prev) => Math.min(0.4, prev + 0.08));
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [pilotMode]);

  return (
    <section id="act-4" className="relative min-h-screen py-24 px-4 sm:px-8 border-b border-hairline/80 bg-void">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-signal-cyan rounded-full animate-ping" />
              <span className="telemetry-mono text-signal-cyan font-medium">
                SCENE 04 / 05 — THE MACHINE THINKS
              </span>
              <span className="text-muted/40 font-mono text-xs">|</span>
              <span className="telemetry-mono text-muted">04:30 — 05:30 HRS</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-display">
              Autonomous <span className="font-serif italic font-normal text-signal-cyan">Reinforcement</span> Learning
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-light">
              End-to-end vision-based driving agent trained with CNN + PPO Actor-Critic. Learns steering and continuous throttle control directly from raw RGB observations in simulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* AI vs Manual toggle */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setPilotMode((m) => (m === 'ai' ? 'manual' : 'ai'));
                setManualSteer(0);
              }}
              className={`bracket-box px-3.5 py-2 border text-xs font-mono tracking-widest uppercase transition-all flex items-center gap-2 ${
                pilotMode === 'manual'
                  ? 'bg-signal-amber/20 border-signal-amber text-signal-amber'
                  : 'bg-panel border-hairline text-display hover:border-signal-cyan/60'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{pilotMode === 'ai' ? 'TAKE MANUAL WHEEL' : 'AI AUTOPILOT [ENGAGED]'}</span>
            </button>

            <button
              onClick={() => {
                setShowRays((r) => !r);
                soundEngine.playClick();
              }}
              className="bracket-box px-3.5 py-2 bg-panel border border-hairline text-display text-xs font-mono tracking-widest uppercase hover:border-signal-cyan/50 hover:text-signal-cyan transition-all flex items-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-signal-cyan" />
              <span>{showRays ? 'HIDE RAYS' : 'SHOW RAYS'}</span>
            </button>

            <button
              onClick={() => {
                setIsRunning((r) => !r);
                soundEngine.playClick();
              }}
              className="bracket-box px-3.5 py-2 bg-signal-cyan/10 border border-signal-cyan/50 text-signal-cyan text-xs font-mono tracking-widest uppercase hover:bg-signal-cyan/20 transition-all flex items-center gap-2"
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'PAUSE AGENT' : 'RESUME AGENT'}</span>
            </button>

            <a
              href="https://github.com/Sarthaktanpure/Autonomous-Navigation"
              target="_blank"
              rel="noreferrer"
              className="bracket-box px-3.5 py-2 bg-panel border border-hairline text-display text-xs font-mono tracking-widest uppercase hover:border-signal-cyan/50 hover:text-signal-cyan transition-all flex items-center gap-1.5"
            >
              <span>SOURCE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Real-time telemetry indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">STEERING (THETA)</span>
            <p className="text-lg sm:text-xl font-mono text-signal-cyan mt-1">{telemetry.steering}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">THROTTLE OUTPUT</span>
            <p className="text-lg sm:text-xl font-mono text-display mt-1">{telemetry.throttle}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">VEHICLE VELOCITY</span>
            <p className="text-lg sm:text-xl font-mono text-display mt-1">{telemetry.speed}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">STEP REWARD R</span>
            <p className="text-lg sm:text-xl font-mono text-emerald-400 mt-1">{telemetry.reward}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">CROSS-TRACK ERR</span>
            <p className="text-lg sm:text-xl font-mono text-display mt-1">{telemetry.crossTrackError}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">EPISODE STEPS</span>
            <p className="text-lg sm:text-xl font-mono text-display mt-1">#{telemetry.episode}</p>
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dark Void Simulation Canvas */}
        <div className="lg:col-span-8 bracket-box p-4 bg-panel/90 border border-hairline rounded relative overflow-hidden demo-container">
          <div className="flex flex-wrap items-center justify-between border-b border-hairline/70 pb-3 mb-3 gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-signal-cyan animate-spin-slow" />
              <span className="telemetry-mono text-display text-xs">
                SIMULATION TRACK // {trackType.toUpperCase()} CIRCUIT
              </span>
            </div>

            {/* Track Configuration Selector */}
            <div className="flex items-center gap-1 bg-void/80 p-1 rounded border border-hairline text-[10px] font-mono">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTrackType('mountain');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  trackType === 'mountain' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                MOUNTAIN PASS
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTrackType('monaco');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  trackType === 'monaco' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                HAIRPIN LOOP
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setTrackType('oval');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  trackType === 'oval' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                SPEEDWAY
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="w-full relative rounded bg-void overflow-hidden border border-hairline/60">
            <canvas ref={canvasRef} className="w-full block" />
            
            {/* Live Formula Tag */}
            <div className="absolute top-3 left-3 bg-panel/90 border border-hairline/70 backdrop-blur-sm p-2 rounded text-[10px] font-mono text-muted">
              <div className="text-signal-cyan font-bold mb-0.5">REWARD FORMULATION:</div>
              <div className="text-display">R = v · cos(θ) − d_center − 10·I_collision</div>
            </div>

            {/* Manual Pilot on-screen steer hint */}
            {pilotMode === 'manual' && (
              <div className="absolute bottom-3 right-3 bg-panel/90 border border-signal-amber p-2.5 rounded text-xs font-mono text-signal-amber flex items-center gap-3 shadow-lg">
                <span>USE [←] [→] KEYS TO STEER</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setManualSteer((s) => s - 0.1)}
                    className="px-2 py-1 bg-signal-amber/20 hover:bg-signal-amber/30 rounded border border-signal-amber/40"
                  >
                    ← LEFT
                  </button>
                  <button
                    onClick={() => setManualSteer((s) => s + 0.1)}
                    className="px-2 py-1 bg-signal-amber/20 hover:bg-signal-amber/30 rounded border border-signal-amber/40"
                  >
                    RIGHT →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Model Architectural Specs */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 bg-void/50 border border-hairline rounded">
              <span className="telemetry-mono text-signal-cyan block mb-1">CNN OBSERVATION</span>
              <p className="text-muted text-[11px] leading-relaxed">
                Raw 120×160 RGB camera frames processed via 3 convolutional feature extractor layers.
              </p>
            </div>
            <div className="p-2.5 bg-void/50 border border-hairline rounded">
              <span className="telemetry-mono text-signal-cyan block mb-1">PPO ACTOR-CRITIC</span>
              <p className="text-muted text-[11px] leading-relaxed">
                Proximal Policy Optimization clips surrogate objective (ε = 0.2) to maintain policy stability.
              </p>
            </div>
            <div className="p-2.5 bg-void/50 border border-hairline rounded">
              <span className="telemetry-mono text-signal-cyan block mb-1">CONTINUOUS ACTUATION</span>
              <p className="text-muted text-[11px] leading-relaxed">
                Simultaneous 2-dimensional continuous outputs: steering [-1, 1] and throttle [0, 1].
              </p>
            </div>
          </div>
        </div>

        {/* Right: Real Visual Assets from Project */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Authentic GIF / Visual Output Card */}
          <div className="bracket-box p-4 bg-panel/90 border border-hairline rounded flex-1">
            <div className="flex items-center justify-between border-b border-hairline/70 pb-2 mb-3">
              <span className="telemetry-mono text-signal-cyan text-xs">SIMULATION RECORDING</span>
              <span className="telemetry-mono text-[9px] text-muted">LIVE RUN</span>
            </div>

            <div className="relative rounded overflow-hidden border border-hairline bg-void aspect-video flex items-center justify-center">
              <img
                src="/media/Mountain_Track.gif"
                alt="Mountain Track Simulation"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="text-xs font-mono text-muted p-4 text-center">Mountain Track Neural Simulation Log Loaded</div>';
                }}
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-void/80 border border-hairline text-[9px] font-mono text-signal-cyan rounded">
                SIM_REC // MOUNTAIN_TRACK
              </div>
            </div>

            <div className="mt-3 text-xs text-muted font-mono leading-relaxed">
              Trained across varied track geometry, hairpins, and elevation changes. Model generalized successfully without collision.
            </div>
          </div>

          {/* Training Convergence & Policy Specs */}
          <div className="bracket-box p-4 bg-panel/90 border border-hairline rounded">
            <div className="flex items-center justify-between border-b border-hairline/70 pb-2 mb-3">
              <span className="telemetry-mono text-display text-xs">TRAINING CONVERGENCE</span>
              <span className="telemetry-mono text-[9px] text-emerald-400">OPTIMAL</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">TIMESTEPS:</span>
                <span className="text-display">500,000 STEPS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">FRAMEWORK:</span>
                <span className="text-display">PYTORCH + SB3</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">ACTION SPACE:</span>
                <span className="text-signal-cyan">BOX(-1.0, 1.0, (2,))</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">LAP COMPLETION:</span>
                <span className="text-emerald-400 font-bold">100% UNASSISTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

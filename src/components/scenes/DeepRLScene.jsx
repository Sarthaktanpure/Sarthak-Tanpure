import React, { useState, useEffect, useRef } from 'react';
import { Compass, Eye, Cpu, Zap, ArrowUpRight, Gauge, Layers, Play, Pause, Navigation, Shield, Sliders, FileText } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export default function DeepRLScene({ onOpenIncidentReport }) {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [showRays, setShowRays] = useState(true);
  const [pilotMode, setPilotMode] = useState('ai'); // 'ai' | 'manual'
  const [manualSteer, setManualSteer] = useState(0);

  // Checkpoints that visitor can drag to reshape track
  const checkpointsRef = useRef([
    { id: 0, x: 0.5, y: 0.16, isDragging: false, label: 'CP-1 (NORTH APEX)' },
    { id: 1, x: 0.85, y: 0.35, isDragging: false, label: 'CP-2 (EAST HAIRPIN)' },
    { id: 2, x: 0.75, y: 0.80, isDragging: false, label: 'CP-3 (SOUTH SWEEP)' },
    { id: 3, x: 0.25, y: 0.82, isDragging: false, label: 'CP-4 (WEST CHICANE)' },
    { id: 4, x: 0.15, y: 0.38, isDragging: false, label: 'CP-5 (TURN-5)' },
  ]);

  const [activeDragging, setActiveDragging] = useState(null);

  const [telemetry, setTelemetry] = useState({
    steering: '0.04 rad',
    throttle: '0.82',
    speed: '31.4 km/h',
    reward: '+142.6',
    crossTrackError: '0.012 m',
    episode: 4208,
  });

  // Smooth closed loop spline generator through checkpoints
  const getSplinePoint = (t, width, height) => {
    const cps = checkpointsRef.current;
    const n = cps.length;
    const p = t * n;
    const i = Math.floor(p) % n;
    const fract = p - Math.floor(p);

    // 4 points for Catmull-Rom
    const p0 = cps[(i - 1 + n) % n];
    const p1 = cps[i];
    const p2 = cps[(i + 1) % n];
    const p3 = cps[(i + 2) % n];

    // Convert normalized [0, 1] to canvas pixels
    const x0 = p0.x * width, y0 = p0.y * height;
    const x1 = p1.x * width, y1 = p1.y * height;
    const x2 = p2.x * width, y2 = p2.y * height;
    const x3 = p3.x * width, y3 = p3.y * height;

    const t2 = fract * fract;
    const t3 = t2 * fract;

    // Catmull-Rom formula
    const x = 0.5 * (
      (2 * x1) +
      (-x0 + x2) * fract +
      (2 * x0 - 5 * x1 + 4 * x2 - x3) * t2 +
      (-x0 + 3 * x1 - 3 * x2 + x3) * t3
    );
    const y = 0.5 * (
      (2 * y1) +
      (-y0 + y2) * fract +
      (2 * y0 - 5 * y1 + 4 * y2 - y3) * t2 +
      (-y0 + 3 * y1 - 3 * y2 + x3) * t3
    );

    return { x, y };
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

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let progress = 0;
    const speed = 0.0022;

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisible || document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Pure dark void
      ctx.fillStyle = '#05070A';
      ctx.fillRect(0, 0, width, height);

      // 2. Compute Spline Loop Points
      const steps = 180;
      const trackWidth = 46;
      const pts = [];

      for (let s = 0; s <= steps; s++) {
        const pt = getSplinePoint(s / steps, width, height);
        pts.push(pt);
      }

      // Draw Glowing Track Outlines
      ctx.strokeStyle = pilotMode === 'ai' ? 'rgba(61, 242, 255, 0.35)' : 'rgba(255, 179, 71, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
      ctx.shadowBlur = 10;

      // Outer boundary
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % steps];
        const angle = Math.atan2(next.y - curr.y, next.x - curr.x) + Math.PI / 2;
        const ox = curr.x + Math.cos(angle) * (trackWidth / 2);
        const oy = curr.y + Math.sin(angle) * (trackWidth / 2);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner boundary
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % steps];
        const angle = Math.atan2(next.y - curr.y, next.x - curr.x) + Math.PI / 2;
        const ix = curr.x - Math.cos(angle) * (trackWidth / 2);
        const iy = curr.y - Math.sin(angle) * (trackWidth / 2);
        if (i === 0) ctx.moveTo(ix, iy);
        else ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.stroke();

      // Centerline guide
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const pt = pts[i];
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Draw Draggable Checkpoints
      checkpointsRef.current.forEach((cp) => {
        const px = cp.x * width;
        const py = cp.y * height;

        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = cp.isDragging ? '#3DF2FF' : 'rgba(61, 242, 255, 0.4)';
        ctx.fill();

        ctx.strokeStyle = '#3DF2FF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, 11, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = 'rgba(61, 242, 255, 0.6)';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(cp.label, px + 14, py + 3);
      });

      // 4. Autonomous Car Navigation
      const currentPt = getSplinePoint(progress, width, height);
      const nextPt = getSplinePoint((progress + 0.008) % 1.0, width, height);
      let heading = Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);

      if (pilotMode === 'manual') {
        heading += manualSteer;
      }

      ctx.save();
      ctx.translate(currentPt.x, currentPt.y);
      ctx.rotate(heading);

      // Headlight cone cutting dark void
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

      // 5 LIDAR / Camera Sensor Rays
      if (showRays) {
        const rayAngles = [-0.55, -0.28, 0, 0.28, 0.55];
        rayAngles.forEach((ra) => {
          const rayLength = 85 + Math.cos(ra * 3) * 20;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          const rxPos = Math.cos(ra) * rayLength;
          const ryPos = Math.sin(ra) * rayLength;
          ctx.lineTo(rxPos, ryPos);
          ctx.strokeStyle = pilotMode === 'ai' ? 'rgba(61, 242, 255, 0.7)' : 'rgba(255, 179, 71, 0.8)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Sensor collision dot
          ctx.beginPath();
          ctx.arc(rxPos, ryPos, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
          ctx.shadowColor = pilotMode === 'ai' ? '#3DF2FF' : '#FFB347';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      // Draw Chassis
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

      // Floating Live Reward Tag next to the car
      ctx.fillStyle = '#3DF2FF';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`R: +142.6 | θ: ${((Math.random() - 0.5) * 0.08).toFixed(3)}`, 16, -14);

      ctx.restore();

      if (isRunning) {
        progress = (progress + speed) % 1.0;
      }
    };

    render();

    // Mouse & Touch Dragging Listeners on Canvas (Mobile, Tablet, Laptop)
    let draggedIndex = -1;

    const startDrag = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      checkpointsRef.current.forEach((cp, idx) => {
        const cx = cp.x * width;
        const cy = cp.y * height;
        if (Math.hypot(cx - mouseX, cy - mouseY) < 22) {
          draggedIndex = idx;
          cp.isDragging = true;
          setActiveDragging(cp.label);
          soundEngine.playClick();
        }
      });
    };

    const moveDrag = (clientX, clientY) => {
      if (draggedIndex === -1) return;
      const rect = canvas.getBoundingClientRect();
      const nx = Math.max(0.08, Math.min(0.92, (clientX - rect.left) / width));
      const ny = Math.max(0.08, Math.min(0.92, (clientY - rect.top) / height));
      checkpointsRef.current[draggedIndex].x = nx;
      checkpointsRef.current[draggedIndex].y = ny;
    };

    const endDrag = () => {
      if (draggedIndex !== -1) {
        checkpointsRef.current[draggedIndex].isDragging = false;
        draggedIndex = -1;
        setActiveDragging(null);
      }
    };

    const onMouseDown = (e) => startDrag(e.clientX, e.clientY);
    const onMouseMove = (e) => moveDrag(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e) => {
      if (draggedIndex !== -1 && e.touches && e.touches[0]) {
        e.preventDefault();
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => endDrag();

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning, showRays, pilotMode, manualSteer]);

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
            <button
              onClick={() => onOpenIncidentReport('deep-rl-agent')}
              className="bracket-box px-3.5 py-2.5 bg-panel border border-signal-cyan/50 text-signal-cyan text-xs font-mono tracking-widest uppercase hover:bg-signal-cyan/15 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>INCIDENT REPORT</span>
            </button>
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
              <span>{pilotMode === 'ai' ? 'MANUAL OVERRIDE' : 'AI AUTOPILOT [ENGAGED]'}</span>
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
                INTERACTIVE TRACK // DRAG ANY CHECKPOINT (CP-1 TO CP-5) TO RESHAPE
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="telemetry-mono text-[10px] text-signal-cyan">
                {activeDragging ? `DRAGGING: ${activeDragging}` : 'CLICK & DRAG TO RESHAPE TRACK'}
              </span>
            </div>
          </div>

          {/* Canvas */}
          <div className="w-full relative rounded bg-void overflow-hidden border border-hairline/60 cursor-grab active:cursor-grabbing">
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ touchAction: 'pan-y' }}
            />
            
            {/* Live Formula Tag */}
            <div className="absolute top-3 left-3 bg-panel/90 border border-hairline/70 backdrop-blur-sm p-2 rounded text-[10px] font-mono text-muted pointer-events-none">
              <div className="text-signal-cyan font-bold mb-0.5">REWARD FORMULATION:</div>
              <div className="text-display">R = v · cos(θ) − d_center − 10·I_collision</div>
            </div>
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
                alt="Autonomous Deep RL Mountain Track Simulation by Sarthak Tanpure"
                loading="lazy"
                decoding="async"
                width="480"
                height="270"
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

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export interface ShapeFXHandle {
  burst: (x: number, y: number, count?: number) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  shape: 'circle' | 'square' | 'triangle';
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  decay: number;
  bounceCount: number;
}

const ShapeFX = forwardRef<ShapeFXHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isLoopRunningRef = useRef(false);
  const trailThrottleRef = useRef(0);

  // Dynamically resolve theme colors from CSS variables at runtime
  const getThemeColors = (): string[] => {
    if (typeof window === 'undefined') return [];
    const styles = getComputedStyle(document.documentElement);
    const a1 = styles.getPropertyValue('--accent-1').trim();
    const a2 = styles.getPropertyValue('--accent-2').trim();
    const paper = styles.getPropertyValue('--paper').trim();
    const ink = styles.getPropertyValue('--ink').trim();
    const primary = styles.getPropertyValue('--primary').trim();
    const resolved = [a1, a2, paper, ink, primary].filter(Boolean);
    return resolved.length > 0 ? resolved : ['currentColor'];
  };

  const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];

  const spawnBurst = (clickX: number, clickY: number, count = 26) => {
    const themeColors = getThemeColors();

    for (let i = 0; i < count; i++) {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = themeColors[Math.floor(Math.random() * themeColors.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;

      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (count > 30 ? 9 : 6), // Higher explosive upward bias for loader
        size: Math.random() * 16 + 8,
        shape,
        color,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.28,
        alpha: 1.0,
        decay: Math.random() * 0.012 + 0.007,
        bounceCount: 0,
      });
    }

    // Start loop if not already running
    if (!isLoopRunningRef.current) {
      startLoop();
    }
  };

  useImperativeHandle(ref, () => ({
    burst: spawnBurst,
  }));

  const startLoop = () => {
    if (isLoopRunningRef.current) return;
    isLoopRunningRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.55;

    const render = () => {
      if (document.hidden) {
        requestAnimationFrame(render);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Stop loop when all particles are dead to save CPU & satisfy quality bar
      if (particlesRef.current.length === 0) {
        isLoopRunningRef.current = false;
        return;
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        // Bounce on the bottom of the screen with ground friction
        if (p.y + p.size > height && p.bounceCount < 3) {
          p.y = height - p.size;
          p.vy = -p.vy * 0.62;
          p.vx *= 0.84;
          p.bounceCount += 1;
        }

        // Remove dead particles
        if (p.alpha <= 0 || p.y > height + 60) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isTouch = window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window);

    // Global Click Listener: Burst of 26 shapes
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;
      spawnBurst(e.clientX, e.clientY, 26);
    };
    window.addEventListener('click', handleClick);

    // Shape trail behind cursor in Hero only (fine pointers)
    const handleMouseMove = (e: MouseEvent) => {
      if (isTouch) return;
      if (window.scrollY > window.innerHeight * 0.85) return;

      const now = performance.now();
      if (now - trailThrottleRef.current < 45) return;
      trailThrottleRef.current = now;

      const themeColors = getThemeColors();
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = themeColors[Math.floor(Math.random() * themeColors.length)];

      particlesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 8 + 4,
        shape,
        color,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        alpha: 0.85,
        decay: 0.038,
        bounceCount: 10,
      });

      if (!isLoopRunningRef.current) {
        startLoop();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[85] w-full h-full"
      aria-hidden="true"
    />
  );
});

export default ShapeFX;

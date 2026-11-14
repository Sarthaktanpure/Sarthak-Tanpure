import React, { useRef, useEffect } from 'react';

export default function RadarBackground({ opacity = 0.35 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Radar state
    let angle = 0;
    const speed = 0.007; // Smooth slow rotation

    // Ambient blips that light up when swept
    const blips = [
      { r: 0.25, a: 0.8, alpha: 0, label: 'NODE-01' },
      { r: 0.42, a: 2.1, alpha: 0, label: 'TX-GATEWAY' },
      { r: 0.65, a: 3.7, alpha: 0, label: 'RL-INFER' },
      { r: 0.50, a: 5.2, alpha: 0, label: 'SOCKET-HUB' },
      { r: 0.78, a: 1.4, alpha: 0, label: 'DB-REPLICA' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.45;
      const maxRadius = Math.min(width, height) * 0.65;

      // 1. Concentric Range Rings
      const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.04)';
      ctx.lineWidth = 1;

      rings.forEach((scale) => {
        const r = maxRadius * scale;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Range markers
        ctx.fillStyle = 'rgba(61, 242, 255, 0.15)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`${Math.round(scale * 100)}NM`, cx + 8, cy - r + 12);
      });

      // 2. Crosshair Axis
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.035)';
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Cardinal heading labels
      ctx.fillStyle = 'rgba(61, 242, 255, 0.25)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('000°', cx - 12, cy - maxRadius - 10);
      ctx.fillText('090°', cx + maxRadius + 10, cy + 4);
      ctx.fillText('180°', cx - 12, cy + maxRadius + 18);
      ctx.fillText('270°', cx - maxRadius - 38, cy + 4);

      // 3. Sweeping Arc with phosphorescent trailing gradient
      const sweepLength = 0.55; // Radians of tail
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      gradient.addColorStop(0, 'rgba(61, 242, 255, 0.12)');
      gradient.addColorStop(0.8, 'rgba(61, 242, 255, 0.04)');
      gradient.addColorStop(1, 'transparent');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, angle - sweepLength, angle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Sharp leading sweep edge
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * maxRadius, cy + Math.sin(angle) * maxRadius);
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // 4. Update and draw blips
      blips.forEach((blip) => {
        const bx = cx + Math.cos(blip.a) * (maxRadius * blip.r);
        const by = cy + Math.sin(blip.a) * (maxRadius * blip.r);

        // Check if sweep is currently passing over blip angle
        const angleDiff = (angle - blip.a + Math.PI * 4) % (Math.PI * 2);
        if (angleDiff < 0.1) {
          blip.alpha = 1.0;
        } else {
          blip.alpha = Math.max(0, blip.alpha - 0.006);
        }

        if (blip.alpha > 0.02) {
          // Glow
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(61, 242, 255, ${blip.alpha * 0.9})`;
          ctx.shadowColor = '#3DF2FF';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Tiny mono label
          if (blip.alpha > 0.3) {
            ctx.fillStyle = `rgba(61, 242, 255, ${blip.alpha * 0.7})`;
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.fillText(blip.label, bx + 6, by - 4);
          }
        }
      });

      angle = (angle + speed) % (Math.PI * 2);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
}

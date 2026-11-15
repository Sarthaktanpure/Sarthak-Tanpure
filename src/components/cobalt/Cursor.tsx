import React, { useEffect, useState } from 'react';

export default function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check for touch / coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches || ('ontouchstart' in window)) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, textarea, .cursor-pointer');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isTouch) return null;

  return (
    <div
      className={`fixed pointer-events-none z-[9999] rounded-full bg-white -translate-x-1/2 -translate-y-1/2 transition-[width,height] duration-200 ease-out`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: isHovering ? '70px' : '12px',
        height: isHovering ? '70px' : '12px',
        mixBlendMode: 'difference',
      }}
      aria-hidden="true"
    />
  );
}

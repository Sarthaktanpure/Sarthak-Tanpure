import React, { useEffect, useState } from 'react';

export default function CursorAndLight() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState('default'); // 'default', 'crosshair', 'play', 'drag', 'pointer'
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch-primary
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Determine hover state based on element under cursor
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) return;

      if (target.closest('[data-cursor="crosshair"]') || target.closest('.demo-container')) {
        setCursorType('crosshair');
      } else if (target.closest('[data-cursor="play"]') || target.closest('button[data-action="play"]')) {
        setCursorType('play');
      } else if (target.closest('[data-cursor="drag"]') || target.closest('.draggable-area')) {
        setCursorType('drag');
      } else if (target.closest('a') || target.closest('button') || target.closest('[role="button"]') || target.closest('.clickable')) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Volumetric ambient cone of desk lamp / monitor light */}
      <div
        className="cursor-cone-light"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />

      {/* Primary pinpoint cursor */}
      <div
        className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      >
        {cursorType === 'default' && (
          <div className="w-1.5 h-1.5 bg-signal-cyan rounded-full shadow-[0_0_8px_#3DF2FF]" />
        )}

        {cursorType === 'pointer' && (
          <div className="w-2.5 h-2.5 bg-signal-cyan rounded-full shadow-[0_0_12px_#3DF2FF] scale-125" />
        )}

        {cursorType === 'crosshair' && (
          <div className="relative w-8 h-8 -left-4 -top-4 pointer-events-none flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-signal-cyan rounded-full" />
            <div className="absolute inset-0 border border-signal-cyan/40 rounded-full animate-pulse" />
            <div className="absolute w-full h-[1px] bg-signal-cyan/40" />
            <div className="absolute h-full w-[1px] bg-signal-cyan/40" />
          </div>
        )}

        {cursorType === 'play' && (
          <div className="relative flex items-center justify-center -left-3 -top-3 w-6 h-6 rounded-full border border-signal-cyan/80 bg-void/80 backdrop-blur-sm">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-signal-cyan border-b-[4px] border-b-transparent ml-0.5" />
          </div>
        )}

        {cursorType === 'drag' && (
          <div className="px-2 py-0.5 bg-void/90 border border-signal-amber text-signal-amber text-[9px] font-mono tracking-widest uppercase rounded -translate-x-1/2 -translate-y-6">
            DRAG
          </div>
        )}
      </div>

      {/* Trailing precision ring */}
      <div
        className="fixed pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal-cyan/25 transition-all duration-300 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: cursorType === 'crosshair' ? '36px' : cursorType === 'pointer' ? '28px' : '20px',
          height: cursorType === 'crosshair' ? '36px' : cursorType === 'pointer' ? '28px' : '20px',
        }}
      />
    </>
  );
}

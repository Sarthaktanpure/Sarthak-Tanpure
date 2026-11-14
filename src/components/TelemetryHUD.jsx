import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Terminal, ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function TelemetryHUD({
  scrollProgress,
  activeScene,
  cursorCoords,
  isAudioOn,
  setIsAudioOn,
  onOpenContact,
  onPullLogs,
  onOpenTerminal,
  clockTime,
  is24Hour,
  setIs24Hour
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleClockClick = () => {
    soundEngine.playClockTick();
    setIs24Hour(prev => !prev);
  };

  const handleSoundToggle = () => {
    const newState = soundEngine.toggle();
    setIsAudioOn(newState);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 select-none">
      {/* TOP LEFT: System Clock, Status, Scene index */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Status blip */}
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeScene.index === 2 ? 'bg-signal-alert' : 'bg-signal-cyan'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${activeScene.index === 2 ? 'bg-signal-alert' : 'bg-signal-cyan'}`} />
          </span>

          {/* Interactive Clock */}
          <button
            onClick={handleClockClick}
            title="Click to toggle 12h / 24h mode"
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-panel/75 backdrop-blur-md border border-hairline/80 text-display text-[11px] font-mono tracking-widest hover:border-signal-cyan/50 hover:text-signal-cyan transition-colors"
          >
            <Clock className="w-3 h-3 text-signal-cyan opacity-80" />
            <span>{clockTime}</span>
            <span className="text-[9px] text-muted ml-0.5">{is24Hour ? '24H' : '12H'}</span>
          </button>

          {/* Scene pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-panel/60 backdrop-blur-md border border-hairline/80 text-muted text-[10px] font-mono tracking-widest">
            <span className="text-signal-cyan">ACT {activeScene.index}</span>
            <span className="opacity-40">/</span>
            <span>05</span>
            <span className="text-display ml-1">{activeScene.title}</span>
          </div>
        </div>

        {/* Ambient telemetry line */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono tracking-wider text-muted/70 pl-5">
          <span>SYS_LATENCY: 12ms</span>
          <span className="opacity-30">•</span>
          <span>NODE: SARTHAK-OPS-01</span>
          <span className="opacity-30">•</span>
          <span className="text-emerald-400/80">NOMINAL</span>
        </div>
      </div>

      {/* TOP RIGHT: Terminal, Sound Toggle & Ambient Uptime decoration */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 flex items-center gap-2.5 pointer-events-auto">
        {/* Terminal trigger */}
        <button
          onClick={onOpenTerminal}
          title="Open Control Room Diagnostics Terminal (Hotkey: ~)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-panel/75 backdrop-blur-md border border-hairline hover:border-signal-cyan/60 hover:text-signal-cyan text-display text-[10px] font-mono tracking-widest transition-all"
        >
          <Terminal className="w-3.5 h-3.5 text-signal-cyan" />
          <span className="hidden sm:inline">TERMINAL [~]</span>
        </button>

        {/* Ambient Uptime badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-panel/60 backdrop-blur-md border border-hairline text-[10px] font-mono tracking-widest text-muted">
          <Activity className="w-3 h-3 text-signal-cyan animate-pulse" />
          <span>UPTIME 99.98% <span className="opacity-50 text-[9px]">[AMBIENT]</span></span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={handleSoundToggle}
          title={isAudioOn ? "Audio telemetry active (click to mute)" : "Enable ambient control room audio"}
          className={`flex items-center gap-2 px-2.5 py-1 rounded border text-[11px] font-mono tracking-widest transition-all backdrop-blur-md ${
            isAudioOn
              ? 'bg-signal-cyan/10 border-signal-cyan/50 text-signal-cyan shadow-[0_0_12px_rgba(61,242,255,0.2)]'
              : 'bg-panel/75 border-hairline/80 text-muted hover:text-display hover:border-hairline-bright'
          }`}
        >
          {isAudioOn ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-signal-cyan animate-pulse" />
              <span className="text-[10px]">SOUND: ON</span>
              <div className="flex items-end gap-0.5 h-2.5 w-3 ml-0.5">
                <span className="w-0.5 bg-signal-cyan animate-[bounce_0.6s_ease-in-out_infinite] h-2" />
                <span className="w-0.5 bg-signal-cyan animate-[bounce_0.9s_ease-in-out_infinite_0.2s] h-3" />
                <span className="w-0.5 bg-signal-cyan animate-[bounce_0.7s_ease-in-out_infinite_0.1s] h-1.5" />
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[10px]">SOUND: OFF</span>
            </>
          )}
        </button>

        {/* Quick Résumé Access */}
        <button
          onClick={onPullLogs}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-panel/75 backdrop-blur-md border border-hairline hover:border-signal-cyan/60 hover:text-signal-cyan text-display text-[10px] font-mono tracking-widest transition-all"
        >
          <span>PULL LOGS (CV)</span>
        </button>
      </div>

      {/* BOTTOM LEFT: Cursor telemetry, scroll %, and coordinates */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-widest text-muted/80 pointer-events-auto">
        <div className="px-2.5 py-1 rounded bg-panel/60 backdrop-blur-md border border-hairline flex items-center gap-2">
          <span className="text-signal-cyan">COORD</span>
          <span>X: {String(cursorCoords.x).padStart(4, '0')}</span>
          <span className="opacity-30">|</span>
          <span>Y: {String(cursorCoords.y).padStart(4, '0')}</span>
        </div>

        <div className="px-2.5 py-1 rounded bg-panel/60 backdrop-blur-md border border-hairline flex items-center gap-1.5">
          <span>PROGRESS:</span>
          <span className="text-display">{Math.round(scrollProgress * 100)}%</span>
        </div>
      </div>

      {/* BOTTOM RIGHT: Channel shortcut & status */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex items-center gap-2.5 pointer-events-auto">
        <button
          onClick={onOpenContact}
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-panel/90 backdrop-blur-md border border-signal-cyan/40 text-signal-cyan text-[11px] font-mono tracking-widest hover:bg-signal-cyan/15 hover:border-signal-cyan transition-all shadow-[0_0_15px_rgba(61,242,255,0.15)] group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan group-hover:scale-125 transition-transform" />
          <span>OPEN A CHANNEL</span>
        </button>
      </div>
    </div>
  );
}

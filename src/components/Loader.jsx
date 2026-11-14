import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const logs = [
    "02:47:01 — BOOT KERNEL INITIALIZED",
    "02:47:04 — MOUNTING TELEMETRY BUS (DEV_SYS)",
    "02:47:09 — LOADING FRAUD DETECTOR [XGBOOST + ISOLATION FOREST]",
    "02:47:13 — INITIALIZING PPO ACTOR-CRITIC POLICY TENSORS",
    "02:47:19 — ESTABLISHING WEBSOCKET REAL-TIME MESH",
    "02:47:24 — VERIFYING SYSTEM LATENCY & 20,000+ TX QUEUES",
    "02:47:28 — ALL SYSTEMS NOMINAL. CALM UNDER PRESSURE.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              onComplete();
            }, 600);
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 4;
        return next > 100 ? 100 : next;
      });
    }, 70);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * logs.length), logs.length - 1);
    setLogIndex(idx);
  }, [progress, logs.length]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-void flex flex-col items-center justify-center p-6 select-none transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md bracket-box p-8 bg-panel/90 border border-hairline rounded shadow-2xl relative">
        <div className="corner-tr" />
        <div className="corner-bl" />

        {/* Header HUD */}
        <div className="flex items-center justify-between border-b border-hairline/80 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-signal-cyan animate-ping" />
            <span className="telemetry-mono text-signal-cyan font-semibold">
              OPS CONTROL // 02:47 AM
            </span>
          </div>
          <span className="telemetry-mono text-muted">BOOT SEQ</span>
        </div>

        {/* Center Progress */}
        <div className="my-6 space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xl sm:text-2xl font-mono font-medium text-display tracking-wider">
              {progress === 100 ? "ALL SYSTEMS NOMINAL" : "WAKING SYSTEMS…"}
            </span>
            <span className="font-mono text-signal-cyan text-sm tracking-widest">
              {progress}%
            </span>
          </div>

          {/* Precision progress bar */}
          <div className="h-1.5 w-full bg-hairline/60 rounded overflow-hidden p-0.5 border border-hairline">
            <div
              className="h-full bg-signal-cyan rounded-sm transition-all duration-150 ease-out shadow-[0_0_12px_#3DF2FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Ticking log console */}
        <div className="h-14 overflow-hidden border-t border-hairline/80 pt-3">
          <p className="telemetry-mono text-muted text-[10px] leading-relaxed transition-all">
            {logs[logIndex]}
          </p>
          <p className="telemetry-mono text-[9px] text-muted/50 mt-1">
            NODE: PREC-LONI-IT-R1 • 250+ DSA • NOIR_MONITOR
          </p>
        </div>

        {/* Bypass option */}
        <button
          onClick={() => {
            setIsFading(true);
            setTimeout(onComplete, 300);
          }}
          className="mt-6 w-full text-center telemetry-mono text-[10px] text-muted hover:text-signal-cyan py-1 transition-colors"
        >
          [PRESS TO BYPASS WAKEUP]
        </button>
      </div>
    </div>
  );
}

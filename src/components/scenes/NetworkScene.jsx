import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, GitFork, ArrowUpRight, Radio, Send, CheckCheck, Network, FileText, Zap } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export default function NetworkScene({ onOpenIncidentReport }) {
  const canvasRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'alex.dev', time: '03:41 AM', text: 'Hey Sarthak, saw your PPO reinforcement learning agent.', status: 'delivered' },
    { id: 2, sender: 'sarthak', time: '03:41 AM', text: 'Thanks Alex. Ran 500k timesteps on the mountain track.', status: 'read' },
    { id: 3, sender: 'alex.dev', time: '03:42 AM', text: 'Did you use custom reward shaping for lane centering?', status: 'delivered' },
    { id: 4, sender: 'sarthak', time: '03:42 AM', text: 'Yes: R = v·cos(θ) − d_center. Keeps it tight on high-speed hairpin turns.', status: 'read' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [activeConnections, setActiveConnections] = useState(148);
  const [connectedNodes, setConnectedNodes] = useState([
    { id: 'usr-104', name: 'dev_mumbai', ping: '14ms', state: 'ONLINE' },
    { id: 'usr-289', name: 'dev_berlin', ping: '112ms', state: 'ONLINE' },
    { id: 'usr-331', name: 'dev_tokyo', ping: '84ms', state: 'SYNCING' },
  ]);

  const activeLinksRef = useRef([
    { x1: 60, y1: 180, x2: 240, y2: 140, t: 0, speed: 0.01 },
    { x1: 280, y1: 120, x2: 480, y2: 170, t: 0.4, speed: 0.008 }
  ]);

  // Skyline Canvas with amber lit windows and interactive window-linking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 340;
    };
    window.addEventListener('resize', handleResize);

    // Generate night buildings with window grids
    const buildings = [];
    const count = Math.floor(width / 48);
    for (let i = 0; i < count; i++) {
      const bWidth = 36 + Math.random() * 28;
      const bHeight = 110 + Math.random() * 160;
      const x = i * 46;
      const windows = [];
      const cols = Math.floor(bWidth / 8);
      const rows = Math.floor(bHeight / 12);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          windows.push({
            r,
            c,
            isLit: Math.random() < 0.24,
            flickerTimer: Math.random() * 100,
          });
        }
      }

      buildings.push({
        x,
        w: bWidth,
        h: bHeight,
        windows,
      });
    }

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisible || document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // Night sky faint vertical grid
      ctx.strokeStyle = 'rgba(255, 179, 71, 0.035)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < width; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }

      // Draw buildings and lit windows
      buildings.forEach((b) => {
        const bY = height - b.h;
        ctx.fillStyle = '#080C11';
        ctx.fillRect(b.x, bY, b.w, b.h);
        ctx.strokeStyle = '#141B23';
        ctx.strokeRect(b.x, bY, b.w, b.h);

        b.windows.forEach((win) => {
          const wx = b.x + 4 + win.c * 7;
          const wy = bY + 8 + win.r * 11;
          if (wx + 4 > b.x + b.w) return;

          win.flickerTimer += 0.05;
          if (win.flickerTimer > 200) {
            win.flickerTimer = 0;
            if (Math.random() < 0.08) win.isLit = !win.isLit;
          }

          if (win.isLit) {
            ctx.fillStyle = 'rgba(255, 179, 71, 0.9)';
            ctx.shadowColor = '#FFB347';
            ctx.shadowBlur = 4;
            ctx.fillRect(wx, wy, 4, 6);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = 'rgba(27, 34, 43, 0.4)';
            ctx.fillRect(wx, wy, 4, 6);
          }
        });
      });

      // Draw dynamic lines of light connecting two windows across the skyline
      activeLinksRef.current.forEach((arc) => {
        arc.t += arc.speed;
        if (arc.t > 1) arc.t = 0;

        // Curved arc of light
        ctx.strokeStyle = 'rgba(255, 179, 71, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        const midX = (arc.x1 + arc.x2) / 2;
        const midY = Math.min(arc.y1, arc.y2) - 45;
        ctx.quadraticCurveTo(midX, midY, arc.x2, arc.y2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated amber packet along the beam
        const t = arc.t;
        const px = (1 - t) * (1 - t) * arc.x1 + 2 * (1 - t) * t * midX + t * t * arc.x2;
        const py = (1 - t) * (1 - t) * arc.y1 + 2 * (1 - t) * t * midY + t * t * arc.y2;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFB347';
        ctx.shadowColor = '#FFB347';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    render();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleLinkWindows = () => {
    soundEngine.playClick();
    setActiveConnections((prev) => prev + 1);

    const canvas = canvasRef.current;
    const w = canvas ? canvas.width : 600;
    const h = canvas ? canvas.height : 300;

    const x1 = Math.random() * (w * 0.4) + 20;
    const y1 = Math.random() * (h * 0.5) + 120;
    const x2 = Math.random() * (w * 0.4) + w * 0.5;
    const y2 = Math.random() * (h * 0.5) + 120;

    activeLinksRef.current.push({
      x1,
      y1,
      x2,
      y2,
      t: 0,
      speed: 0.012 + Math.random() * 0.008,
    });

    if (activeLinksRef.current.length > 5) {
      activeLinksRef.current.shift();
    }

    const cities = ['dev_sf', 'dev_tokyo', 'dev_seoul', 'dev_london', 'dev_zurich'];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomPing = `${Math.floor(Math.random() * 60 + 15)}ms`;

    setConnectedNodes((prev) => [
      { id: `usr-${Math.floor(Math.random() * 900 + 100)}`, name: randomCity, ping: randomPing, state: 'LINKED' },
      ...prev.slice(0, 2),
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    soundEngine.playClick();
    const userText = inputVal;
    const newMsg = {
      id: Date.now(),
      sender: 'visitor',
      time: '03:43 AM',
      text: userText,
      status: 'delivered',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );

      // Automated peer response from Sarthak's ops mesh
      setTimeout(() => {
        soundEngine.playClick();
        let reply = "Socket packet received on port 8080. Latency 14ms.";
        const low = userText.toLowerCase();
        if (low.includes('fraud') || low.includes('xgboost') || low.includes('anomaly')) {
          reply = "The fraud engine handles 20k+ records with XGBoost + Isolation Forest. Check Act II above!";
        } else if (low.includes('rl') || low.includes('car') || low.includes('ppo') || low.includes('track')) {
          reply = "The PPO driving agent converges in 500k steps with CNN vision. Try dragging track checkpoints in Act IV!";
        } else if (low.includes('hire') || low.includes('collab') || low.includes('role') || low.includes('contact')) {
          reply = "Sarthak is open for Student Researcher & ML engineering roles! Reach out at sarthaktanpure255@gmail.com";
        } else {
          reply = "Signal acknowledged across the developer mesh. Socket.IO connection active with -30% latency.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'sarthak',
            time: '03:44 AM',
            text: reply,
            status: 'read'
          }
        ]);
      }, 1000);
    }, 500);
  };

  return (
    <section id="act-3" className="relative min-h-screen py-24 px-4 sm:px-8 border-b border-hairline/80 bg-void">
      {/* Ambient header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-signal-amber rounded-full animate-ping" />
              <span className="telemetry-mono text-signal-amber font-medium">
                SCENE 03 / 05 — THE CONNECTION
              </span>
              <span className="text-muted/40 font-mono text-xs">|</span>
              <span className="telemetry-mono text-muted">03:30 — 04:30 HRS</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-display">
              Developer <span className="font-serif italic font-normal text-signal-amber">Networking</span> Platform
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-light">
              Real-time developer community architecture with Socket.IO bidirectional channels, persistent MongoDB conversations, and index-optimized aggregation pipelines reducing query latency by 30%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenIncidentReport('developer-mesh')}
              className="bracket-box px-3.5 py-2.5 bg-panel border border-signal-amber/50 text-signal-amber text-xs font-mono tracking-widest uppercase hover:bg-signal-amber/15 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>INCIDENT REPORT</span>
            </button>
            <button
              onClick={handleLinkWindows}
              className="bracket-box px-4 py-2.5 bg-signal-amber/10 border border-signal-amber/50 text-signal-amber text-xs font-mono tracking-widest uppercase hover:bg-signal-amber/20 transition-all flex items-center gap-2 group shadow-[0_0_15px_rgba(255,179,71,0.15)]"
            >
              <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>LINK TWO WINDOWS WITH LIGHT</span>
            </button>
            <a
              href="https://github.com/Sarthaktanpure/Developer-Networking-Platform"
              target="_blank"
              rel="noreferrer"
              className="bracket-box px-4 py-2.5 bg-panel border border-hairline text-display text-xs font-mono tracking-widest uppercase hover:border-signal-amber/50 hover:text-signal-amber transition-all flex items-center gap-1.5"
            >
              <span>SOURCE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Telemetry Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">SIMULATED DEVELOPERS</span>
            <p className="text-xl sm:text-2xl font-mono text-display mt-1">{activeConnections}+ ACTIVE</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">API ENDPOINTS</span>
            <p className="text-xl sm:text-2xl font-mono text-signal-amber mt-1">13+ REST APIS</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">QUERY SPEED OPTIMIZATION</span>
            <p className="text-xl sm:text-2xl font-mono text-emerald-400 mt-1">−30% LATENCY</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">REAL-TIME PROTOCOL</span>
            <p className="text-xl sm:text-2xl font-mono text-signal-cyan mt-1">SOCKET.IO / WSS</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: City Skyline Canvas */}
        <div className="lg:col-span-7 bracket-box p-4 bg-panel/90 border border-hairline rounded relative overflow-hidden demo-container">
          <div className="flex items-center justify-between border-b border-hairline/70 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-signal-amber animate-pulse" />
              <span className="telemetry-mono text-display text-xs">
                NIGHT SKYLINE // AMBER WINDOWS LINKING (03:47 AM)
              </span>
            </div>
            <span className="telemetry-mono text-[10px] text-signal-amber">
              SOCKET.IO EVENT BUS
            </span>
          </div>

          {/* Canvas container */}
          <div className="w-full relative rounded bg-void/90 overflow-hidden border border-hairline/60">
            <canvas
              ref={canvasRef}
              className="w-full block"
              style={{ touchAction: 'pan-y' }}
            />
            
            {/* Overlay Caption */}
            <div className="absolute top-3 left-3 bg-panel/80 border border-hairline/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-muted rounded">
              Two windows link with a line of light across the night skyline.
            </div>
          </div>

          {/* Mesh Connected Nodes list */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {connectedNodes.map((node) => (
              <div key={node.id} className="p-2 bg-void/60 border border-hairline rounded text-[11px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-signal-amber font-medium">{node.name}</span>
                  <span className="text-[9px] text-muted">{node.ping}</span>
                </div>
                <div className="text-[9px] text-muted/60 mt-0.5">{node.id} • {node.state}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Chat & Message Transport Engine */}
        <div className="lg:col-span-5 bracket-box p-4 bg-panel/90 border border-hairline rounded flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-hairline/70 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-signal-amber" />
                <span className="telemetry-mono text-signal-amber text-xs">PERSISTENT CHAT STREAM</span>
              </div>
              <span className="telemetry-mono text-[9px] text-muted">SOCKET.IO SYNCED</span>
            </div>

            {/* Conversation Log */}
            <div className="space-y-3 min-h-[220px] max-h-[260px] overflow-y-auto pr-2 py-1">
              {messages.map((m) => {
                const isMe = m.sender === 'sarthak';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[9px] font-mono text-muted">
                      <span>{isMe ? 'SARTHAK TANPURE' : m.sender.toUpperCase()}</span>
                      <span>•</span>
                      <span>{m.time}</span>
                    </div>

                    <div
                      className={`p-2.5 rounded max-w-[85%] text-xs font-mono leading-relaxed border transition-all ${
                        isMe
                          ? 'bg-signal-amber/10 border-signal-amber/40 text-display shadow-[0_0_12px_rgba(255,179,71,0.1)]'
                          : 'bg-void/80 border-hairline text-display'
                      }`}
                    >
                      {m.text}
                      {isMe && (
                        <div className="flex justify-end mt-1 text-[9px] text-signal-amber/70 items-center gap-1">
                          <CheckCheck className="w-3 h-3" />
                          <span className="uppercase text-[8px]">{m.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Socket Input */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-hairline flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Transmit message to socket mesh…"
              className="flex-1 bg-void/90 border border-hairline rounded px-3 py-2 text-xs font-mono text-display focus:border-signal-amber focus:outline-none placeholder:text-muted/40"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-signal-amber/15 border border-signal-amber/60 text-signal-amber hover:bg-signal-amber/25 rounded transition-colors text-xs font-mono flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

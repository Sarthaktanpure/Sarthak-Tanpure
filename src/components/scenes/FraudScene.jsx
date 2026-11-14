import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Cpu, Activity, ArrowUpRight, BarChart3, Sliders, Layers, RefreshCw, FileText, Info, X } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export default function FraudScene({ isInView, onOpenIncidentReport }) {
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'roc' | 'features' | 'matrix'
  const [riskThreshold, setRiskThreshold] = useState(0.85);
  const [inspectedPacket, setInspectedPacket] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 'TX-9021', time: '02:47:14', amount: '$14,250.00', risk: 0.988, flag: 'VELOCITY_SPIKE + GEO_MISMATCH', status: 'QUARANTINED' },
    { id: 'TX-8842', time: '02:46:58', amount: '$8,990.00', risk: 0.942, flag: 'ISOLATION_OUTLIER (-0.78)', status: 'INVESTIGATING' },
    { id: 'TX-8719', time: '02:46:31', amount: '$24,000.00', risk: 0.996, flag: 'ABNORMAL_RAPID_DRAIN', status: 'RESOLVED' },
  ]);
  const [selectedAlert, setSelectedAlert] = useState(alerts[0]);
  const [stats, setStats] = useState({
    processedCount: 20492,
    anomalyRate: '0.024%',
    rocAuc: '1.00',
    accuracy: '99.98%',
    latency: '18ms'
  });

  const packetsRef = useRef([]);

  // Canvas transaction stream simulation with interactive packet picking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener('resize', handleResize);

    const packetPoolSize = 36;
    packetsRef.current = [];

    for (let i = 0; i < packetPoolSize; i++) {
      packetsRef.current.push({
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        x: Math.random() * width * 0.2,
        y: height * 0.5 + (Math.random() - 0.5) * 80,
        speed: 1.5 + Math.random() * 2.2,
        isAnomaly: Math.random() < 0.1,
        amount: `$${(Math.random() * 18000 + 450).toFixed(2)}`,
        risk: (0.1 + Math.random() * 0.89).toFixed(3),
        velocityPercentile: Math.floor(65 + Math.random() * 34),
        geoDistance: Math.floor(Math.random() * 9200) + ' km',
        isolationScore: (-(0.45 + Math.random() * 0.45)).toFixed(3),
        progress: Math.random(),
        shake: 0,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(27, 34, 43, 0.4)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Architecture pipeline stages (X coordinates)
      const stageIngest = width * 0.15;
      const stageIsolation = width * 0.45;
      const stageXGBoost = width * 0.72;
      const stageApproved = width * 0.92;
      const stageQuarantineY = height * 0.85;

      // Pipeline routing lines
      ctx.strokeStyle = 'rgba(61, 242, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      // Main flow line
      ctx.beginPath();
      ctx.moveTo(stageIngest, height * 0.5);
      ctx.lineTo(stageApproved, height * 0.5);
      ctx.stroke();

      // Anomaly diverter line
      ctx.strokeStyle = 'rgba(255, 59, 78, 0.3)';
      ctx.beginPath();
      ctx.moveTo(stageIsolation, height * 0.5);
      ctx.quadraticCurveTo(stageXGBoost - 20, height * 0.75, stageApproved, stageQuarantineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Gateways
      const drawGate = (x, y, label, sub, isAlert = false) => {
        ctx.fillStyle = isAlert ? 'rgba(255, 59, 78, 0.12)' : 'rgba(11, 15, 20, 0.9)';
        ctx.strokeStyle = isAlert ? '#FF3B4E' : '#1B222B';
        ctx.lineWidth = 1.5;
        ctx.fillRect(x - 48, y - 28, 96, 56);
        ctx.strokeRect(x - 48, y - 28, 96, 56);

        ctx.fillStyle = isAlert ? '#FF3B4E' : '#3DF2FF';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - 4);

        ctx.fillStyle = '#7C8794';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(sub, x, y + 14);
      };

      drawGate(stageIngest, height * 0.5, 'INGESTION', 'REST / 20k TX');
      drawGate(stageIsolation, height * 0.5, 'ISOLATION FOR.', 'UNSUPERVISED');
      drawGate(stageXGBoost, height * 0.5, 'XGBOOST ML', `THR: >${riskThreshold}`);
      drawGate(stageApproved, height * 0.5, 'SETTLED', 'POSTGRESQL');
      drawGate(stageApproved, stageQuarantineY, 'QUARANTINE', 'ALERT QUEUE', true);

      // Animate packets
      packetsRef.current.forEach((p) => {
        p.progress += 0.005 * p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.isAnomaly = Math.random() < 0.12;
          p.shake = 0;
        }

        let px, py;
        if (!p.isAnomaly) {
          px = stageIngest + p.progress * (stageApproved - stageIngest);
          py = height * 0.5 + Math.sin(p.progress * Math.PI * 4) * 8;
        } else {
          if (p.progress < 0.35) {
            px = stageIngest + (p.progress / 0.35) * (stageIsolation - stageIngest);
            py = height * 0.5;
          } else {
            const divertT = (p.progress - 0.35) / 0.65;
            px = stageIsolation + divertT * (stageApproved - stageIsolation);
            py = height * 0.5 + divertT * (stageQuarantineY - height * 0.5);
            p.shake = (Math.random() - 0.5) * 4;
            py += p.shake;
          }
        }

        p.currX = px;
        p.currY = py;

        ctx.beginPath();
        ctx.arc(px, py, p.isAnomaly ? 5 : 3.5, 0, Math.PI * 2);
        if (p.isAnomaly) {
          ctx.fillStyle = '#FF3B4E';
          ctx.shadowColor = '#FF3B4E';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#3DF2FF';
          ctx.shadowColor = '#3DF2FF';
          ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let found = null;
      for (const p of packetsRef.current) {
        if (p.currX && p.currY) {
          const dist = Math.hypot(p.currX - clickX, p.currY - clickY);
          if (dist < 18) {
            found = p;
            break;
          }
        }
      }

      if (found) {
        soundEngine.playClick();
        setInspectedPacket({
          id: found.id,
          amount: found.amount,
          risk: found.isAnomaly ? (0.92 + Math.random() * 0.07).toFixed(3) : found.risk,
          isAnomaly: found.isAnomaly,
          velocity: `${found.velocityPercentile}th percentile`,
          geo: found.geoDistance,
          isolationScore: found.isolationScore,
          status: found.isAnomaly ? 'ANOMALY DETECTED → QUARANTINED' : 'VERIFIED LEGITIMATE → APPROVED',
        });
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleCanvasClick);
      cancelAnimationFrame(animationId);
    };
  }, [riskThreshold]);

  const handleInjectAnomaly = () => {
    soundEngine.playHeartbeat();
    soundEngine.playClick();

    const randomAmount = `$${(Math.random() * 45000 + 5000).toFixed(2)}`;
    const randomId = `TX-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date();
    const timeStr = `02:47:${String(now.getSeconds()).padStart(2, '0')}`;

    const newAlert = {
      id: randomId,
      time: timeStr,
      amount: randomAmount,
      risk: (0.94 + Math.random() * 0.059).toFixed(3),
      flag: 'ANOMALY DETECTED → ESCALATED → RESOLVED',
      status: 'QUARANTINED',
    };

    setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    setSelectedAlert(newAlert);
    setStats((s) => ({
      ...s,
      processedCount: s.processedCount + 1,
    }));
  };

  return (
    <section id="act-2" className="relative min-h-screen py-24 px-4 sm:px-8 border-b border-hairline/80 bg-void">
      {/* Background Section Ambient Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-hairline pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-signal-alert rounded-full animate-ping" />
              <span className="telemetry-mono text-signal-alert font-medium">
                SCENE 02 / 05 — THE WATCH
              </span>
              <span className="text-muted/40 font-mono text-xs">|</span>
              <span className="telemetry-mono text-muted">02:00 — 03:30 HRS</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-display">
              Financial <span className="font-serif italic font-normal text-signal-cyan">Fraud</span> Engine
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-light">
              High-stakes real-time financial anomaly detection. Supervised XGBoost + unsupervised Isolation Forest screening 20,000+ synthetic transactions with sub-20ms inference latency.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenIncidentReport('fraud-engine')}
              className="bracket-box px-3.5 py-2.5 bg-panel border border-signal-cyan/50 text-signal-cyan text-xs font-mono tracking-widest uppercase hover:bg-signal-cyan/15 transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>INCIDENT REPORT</span>
            </button>
            <button
              onClick={handleInjectAnomaly}
              className="bracket-box px-4 py-2.5 bg-signal-alert/10 border border-signal-alert/50 text-signal-alert text-xs font-mono tracking-widest uppercase hover:bg-signal-alert/20 transition-all flex items-center gap-2 group shadow-[0_0_15px_rgba(255,59,78,0.15)]"
            >
              <AlertTriangle className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>TRIGGER ANOMALY PROBE</span>
            </button>
            <a
              href="https://github.com/Sarthaktanpure/Fraud-Detection-System"
              target="_blank"
              rel="noreferrer"
              className="bracket-box px-4 py-2.5 bg-panel border border-hairline text-display text-xs font-mono tracking-widest uppercase hover:border-signal-cyan/50 hover:text-signal-cyan transition-all flex items-center gap-1.5"
            >
              <span>SOURCE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">TOTAL TX PROCESSED</span>
            <p className="text-xl sm:text-2xl font-mono text-display mt-1">{stats.processedCount.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">ROC-AUC SCORE</span>
            <p className="text-xl sm:text-2xl font-mono text-signal-cyan mt-1">{stats.rocAuc}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">DETECTION ACCURACY</span>
            <p className="text-xl sm:text-2xl font-mono text-emerald-400 mt-1">{stats.accuracy}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">INFERENCE LATENCY</span>
            <p className="text-xl sm:text-2xl font-mono text-display mt-1">{stats.latency}</p>
          </div>
          <div className="p-3 bg-panel/80 border border-hairline rounded bracket-corners col-span-2 md:col-span-1">
            <div className="corner-tr" />
            <span className="telemetry-mono text-muted text-[10px]">ANOMALY RATE</span>
            <p className="text-xl sm:text-2xl font-mono text-signal-alert mt-1">{stats.anomalyRate}</p>
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace with Interactive Diagnostics Tabs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Diagnostics Viewport */}
        <div className="lg:col-span-8 bracket-box p-4 bg-panel/90 border border-hairline rounded relative overflow-hidden demo-container">
          <div className="flex flex-wrap items-center justify-between border-b border-hairline/70 pb-3 mb-3 gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-signal-cyan animate-pulse" />
              <span className="telemetry-mono text-display text-xs">
                DATASTREAM STREAMING // CLICK ANY PACKET TO INSPECT
              </span>
            </div>

            {/* Diagnostic View Tabs */}
            <div className="flex items-center gap-1 bg-void/80 p-1 rounded border border-hairline text-[10px] font-mono">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('pipeline');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  activeTab === 'pipeline' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                LIVE PIPELINE
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('roc');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  activeTab === 'roc' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                ROC CURVE (1.00)
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('features');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  activeTab === 'features' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                FEATURE IMPORTANCE
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('matrix');
                }}
                className={`px-2 py-1 rounded transition-colors ${
                  activeTab === 'matrix' ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40' : 'text-muted hover:text-display'
                }`}
              >
                CONFUSION MATRIX
              </button>
            </div>
          </div>

          {/* Viewport content */}
          <div className="w-full relative rounded bg-void/90 overflow-hidden border border-hairline/60 min-h-[360px] flex items-center justify-center cursor-crosshair">
            {activeTab === 'pipeline' && (
              <>
                <canvas ref={canvasRef} className="w-full block" />
                <div className="absolute bottom-2 left-3 pointer-events-none text-[9px] font-mono text-muted flex items-center gap-3">
                  <span>MODEL: XGBOOST_v2.4</span>
                  <span>ISOLATION_CONTAMINATION: 0.025</span>
                  <span>CLICK PACKET: INSPECT VECTOR</span>
                </div>
              </>
            )}

            {activeTab === 'roc' && (
              <div className="p-4 w-full flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="relative max-w-sm rounded overflow-hidden border border-hairline bg-void">
                  <img
                    src="/media/roc_curve.png"
                    alt="ROC Curve (AUC = 1.00)"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-void/90 border border-signal-cyan text-signal-cyan text-[9px] font-mono rounded">
                    AUC = 1.0000 [PERFECT DISCRIMINATION]
                  </div>
                </div>
                <div className="max-w-xs space-y-2 text-xs font-mono">
                  <div className="text-signal-cyan font-bold">RECEIVER OPERATING CHARACTERISTIC</div>
                  <p className="text-muted leading-relaxed text-[11px]">
                    Evaluated across 4,000 hold-out test samples. 0 false negatives, achieving a precision of 99.01% on fraudulent vectors and 100% recall.
                  </p>
                  <div className="p-2 bg-void border border-hairline rounded text-[10px]">
                    <span className="text-emerald-400 font-bold">F1-Score: 0.9950</span> | Support: 100 fraud / 3900 legitimate
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="p-4 w-full flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="relative max-w-sm rounded overflow-hidden border border-hairline bg-void">
                  <img
                    src="/media/feature_importance.png"
                    alt="Feature Importance Analysis"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-void/90 border border-signal-cyan text-signal-cyan text-[9px] font-mono rounded">
                    XGBOOST FEATURE GAIN
                  </div>
                </div>
                <div className="max-w-xs space-y-2 text-xs font-mono">
                  <div className="text-signal-cyan font-bold">PREDICTIVE ATTRIBUTION WEIGHTS</div>
                  <p className="text-muted leading-relaxed text-[11px]">
                    Feature importance ranked by gain: Transaction Velocity, Cross-Border Distance, Device Fingerprint Entropy, and Isolation Forest anomaly score.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="p-4 w-full flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="relative max-w-sm rounded overflow-hidden border border-hairline bg-void">
                  <img
                    src="/media/confusion_matrix.png"
                    alt="Confusion Matrix"
                    className="w-full h-auto object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-void/90 border border-signal-cyan text-signal-cyan text-[9px] font-mono rounded">
                    3,999 / 4,000 ACCURATE
                  </div>
                </div>
                <div className="max-w-xs space-y-2 text-xs font-mono">
                  <div className="text-emerald-400 font-bold">99.975% OVERALL ACCURACY</div>
                  <p className="text-muted leading-relaxed text-[11px]">
                    Only 1 borderline transaction flagged as false positive out of 4,000 validations, guaranteeing frictionless customer transactions while neutralizing fraud.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Clicked Packet Inspector Popup */}
          {inspectedPacket && (
            <div className="mt-3 p-3 bg-panel/95 border border-signal-cyan/50 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${inspectedPacket.isAnomaly ? 'bg-signal-alert' : 'bg-signal-cyan'}`} />
                  <span className="font-bold text-display">{inspectedPacket.id} ({inspectedPacket.amount})</span>
                  <span className="text-[10px] text-muted">• RISK: {inspectedPacket.risk}</span>
                </div>
                <div className="text-[10px] text-muted">
                  VELOCITY: {inspectedPacket.velocity} | GEO: {inspectedPacket.geo} | ISOLATION: {inspectedPacket.isolationScore}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold ${inspectedPacket.isAnomaly ? 'text-signal-alert' : 'text-emerald-400'}`}>
                  {inspectedPacket.status}
                </span>
                <button
                  onClick={() => setInspectedPacket(null)}
                  className="p-1 text-muted hover:text-display rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Interactive Risk Threshold Slider */}
          <div className="mt-4 p-3 bg-void/60 border border-hairline rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-signal-cyan" />
              <span className="text-display">DYNAMIC QUARANTINE THRESHOLD:</span>
              <span className="text-signal-alert font-bold">{riskThreshold}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted">0.50</span>
              <input
                type="range"
                min="0.50"
                max="0.99"
                step="0.01"
                value={riskThreshold}
                onChange={(e) => {
                  setRiskThreshold(parseFloat(e.target.value));
                  soundEngine.playClick();
                }}
                className="w-36 accent-signal-cyan cursor-pointer"
              />
              <span className="text-[10px] text-muted">0.99</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Anomaly Queue & Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Quarantine Queue */}
          <div className="bracket-box p-4 bg-panel/90 border border-hairline rounded flex-1">
            <div className="flex items-center justify-between border-b border-hairline/70 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-signal-alert" />
                <span className="telemetry-mono text-signal-alert text-xs">ALERT QUEUE</span>
              </div>
              <span className="telemetry-mono text-[9px] text-muted">LIVE SYNC</span>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    setSelectedAlert(alert);
                    soundEngine.playClick();
                  }}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    selectedAlert.id === alert.id
                      ? 'bg-signal-alert/15 border-signal-alert/70 text-display shadow-[0_0_10px_rgba(255,59,78,0.15)]'
                      : 'bg-void/60 border-hairline hover:border-hairline-bright text-muted'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-semibold text-display">{alert.id}</span>
                    <span className="text-signal-alert font-mono">RISK {alert.risk}</span>
                  </div>
                  <div className="flex justify-between items-baseline mt-1 text-[11px]">
                    <span className="text-display font-mono">{alert.amount}</span>
                    <span className="text-[9px] text-muted font-mono">{alert.time}</span>
                  </div>
                  <div className="mt-1 text-[9px] font-mono text-signal-alert/90 truncate">
                    {alert.flag}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Anomaly Deep Inspection Card */}
          <div className="bracket-box p-4 bg-panel/90 border border-hairline rounded">
            <div className="flex items-center justify-between border-b border-hairline/70 pb-2 mb-3">
              <span className="telemetry-mono text-display text-xs">SIGNAL INSPECTION</span>
              <span className="telemetry-mono text-[9px] text-emerald-400">RESOLVED</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">TX_HASH:</span>
                <span className="text-display font-mono">{selectedAlert.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">DECISION:</span>
                <span className="text-signal-alert font-mono font-bold">{selectedAlert.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">RISK METRIC:</span>
                <span className="text-signal-alert font-mono">{selectedAlert.risk} / 1.000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-hairline/50">
                <span className="text-muted">RULE ENGINE:</span>
                <span className="text-display text-[10px] truncate max-w-[160px]">{selectedAlert.flag}</span>
              </div>
              <div className="p-2 bg-void/80 rounded border border-hairline text-[10px] text-muted mt-2">
                ANOMALY DETECTED → ESCALATED → RESOLVED
                <div className="text-[9px] text-muted/60 mt-0.5">Nothing to see here. Everything is working.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Project } from '../../data';

export default function ProjectScene({ project }: { project: Project }) {
  const isDriving = project.id === 'autonomous-navigation';
  const isFraud = project.id === 'fraud-detection';
  const isNetwork = project.id === 'developer-networking';
  const isMedical = project.id === 'medvision-ai';
  const isAgri = project.id === 'agriconnect';

  return (
    <div className={`project-scene project-scene--${project.id} relative isolate overflow-hidden min-h-[250px] sm:min-h-[390px] bg-ink text-paper border-2 border-ink`} aria-label={`${project.title} animated visualization`}>
      <div className="project-scene__meta absolute z-20 top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 caption-mono text-[10px] sm:text-xs">
        <span className="project-scene__live-dot" /> LIVE SYSTEM STUDY <span className="opacity-50">/ {project.index}</span>
      </div>
      {isDriving ? (
        <>
          <img className="project-scene__track" src="/media/DonkeyCar2.gif" alt="DonkeyCar autonomous driving simulation" />
          <div className="project-scene__track-shade" />
          <div className="project-scene__hud project-scene__hud--left"><span>VISION INPUT</span><b>120 × 160 RGB</b><i>FRAME / 0482</i></div>
          <div className="project-scene__hud project-scene__hud--right"><span>POLICY OUTPUT</span><b>STEER <em>+0.18</em></b><b>THROTTLE <em>0.74</em></b><i>PPO ACTOR-CRITIC</i></div>
          <div className="project-scene__scanline" />
          <div className="project-scene__tracking-box"><span>TRACK TARGET <b>98.4%</b></span></div>
          <div className="project-scene__trajectory"><span>PLANNED PATH</span></div>
          <div className="project-scene__bottom-label"><strong>01 / AUTONOMOUS NAVIGATION</strong><span>CNN → PPO → CONTINUOUS CONTROL</span></div>
        </>
      ) : isFraud ? (
        <>
          <div className="fraud-grid" />
          <div className="fraud-radar"><i /><i /><i /><b /></div>
          <div className="fraud-stream" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <span key={i} style={{ '--i': i } as React.CSSProperties}><b>TX-{(7830 + i * 19).toString()}</b><em>{i % 5 === 0 ? 'REVIEW' : 'CLEARED'}</em></span>)}</div>
          <div className="fraud-readout"><span>ANOMALY DETECTED</span><strong>RISK SCORE <b>0.97</b></strong><i>ISOLATION FOREST → XGBOOST</i></div>
          <div className="project-scene__bottom-label"><strong>01 / FINANCIAL RISK SCREENING</strong><span>20,000+ SYNTHETIC TRANSACTIONS ANALYZED</span></div>
        </>
      ) : isNetwork ? (
        <>
          <div className="network-orbit network-orbit--one" /><div className="network-orbit network-orbit--two" />
          <div className="network-lines"><i /><i /><i /><i /><i /><i /></div>
          <div className="network-nodes">{Array.from({ length: 7 }, (_, i) => <span key={i} className={`network-node network-node--${i}`}><b>{['ST','AK','MR','RJ','PN','DV','+'][i]}</b></span>)}</div>
          <div className="network-message"><span>ROOM / engineering-chat</span><b>message delivered</b><i>14 ms · socket event</i></div>
          <div className="network-readout"><b>100+ NODES</b><span>13+ REST ENDPOINTS</span><strong>~30% LOWER QUERY TIME</strong></div>
          <div className="project-scene__bottom-label"><strong>02 / DEVELOPER NETWORK</strong><span>REAL-TIME CONNECTIONS · PERSISTENT CHAT</span></div>
        </>
      ) : isMedical ? (
        <>
          <div className="med-scan-grid" />
          <div className="med-scan-frame"><img src={project.previewImage} alt="Model evaluation visualization for MedVision AI" /><span className="med-crosshair med-crosshair--a" /><span className="med-crosshair med-crosshair--b" /><i className="med-heat med-heat--a" /><i className="med-heat med-heat--b" /><div className="med-scanline" /></div>
          <div className="med-readout"><span>EXPLAINABLE IMAGING / GRAD-CAM</span><b>INFERENCE <em>50—150 ms*</em></b><i>*Reported project range</i></div>
          <div className="med-side-label">MODEL ATTENTION MAP <span>LIVE ANALYSIS</span></div>
          <div className="project-scene__bottom-label"><strong>04 / MEDVISION AI</strong><span>SCAN ANALYSIS · EXPLAINABLE AI</span></div>
        </>
      ) : isAgri ? (
        <>
          <div className="agri-sun" /><div className="agri-field"><i /><i /><i /><i /><i /><i /></div>
          <div className="agri-market-label"><span>FARM DIRECT / LIVE MARKET</span><b>FRESH LOTS <i>● OPEN</i></b></div>
          <div className="agri-product agri-product--one"><span>LOT 014 / TOMATO</span><b>₹ 24 <small>/ kg</small></b><i>BUYER BID <strong>₹ 26</strong></i></div>
          <div className="agri-product agri-product--two"><span>LOT 027 / ONION</span><b>₹ 31 <small>/ kg</small></b><i>BUYER BID <strong>₹ 33</strong></i></div>
          <div className="agri-route"><i /><i /><i /><span>FARM → BUYER</span></div>
          <div className="project-scene__bottom-label"><strong>05 / AGRICONNECT</strong><span>REAL-TIME BIDDING · CHAT · ORDER TRACKING</span></div>
        </>
      ) : (
        <>
          {project.previewImage && <img className="project-scene__still" src={project.previewImage} alt={`${project.title} project visualization`} />}
          <div className="project-scene__still-overlay" />
          <div className="generic-orbit"><i /><i /><i /></div>
          <div className="project-scene__bottom-label"><strong>{project.index} / {project.category}</strong><span>{project.tags.slice(0, 4).join(' · ')}</span></div>
        </>
      )}
      <span className="project-scene__corner project-scene__corner--tl" /><span className="project-scene__corner project-scene__corner--br" />
    </div>
  );
}

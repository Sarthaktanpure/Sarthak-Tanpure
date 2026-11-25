import React, { useState, useRef, useEffect } from 'react';
import { DATA, Project } from '../../data';
import { Plus, X, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../Icons';
import ProjectScene from './ProjectScene';

export default function Work() {
  const [openId, setOpenId] = useState<string | null>(DATA.projects[0].id);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [shapePos, setShapePos] = useState({ x: -100, y: -100, targetX: -100, targetY: -100 });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Smooth lerp loop for the floating cursor shape
  useEffect(() => {
    let animId: number;
    const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

    const loop = () => {
      setShapePos((prev) => ({
        ...prev,
        x: lerp(prev.x, prev.targetX, 0.16),
        y: lerp(prev.y, prev.targetY, 0.16),
      }));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent, project: Project) => {
    setHoveredProject(project);
    setShapePos((prev) => ({
      ...prev,
      targetX: e.clientX,
      targetY: e.clientY,
    }));
  };

  const handleMouseLeave = () => {
    setHoveredProject(null);
  };

  return (
    <section
      id="work"
      className="relative z-30 bg-paper text-ink sheet-rounded shadow-[0_-28px_56px_color-mix(in_srgb,var(--ink)_20%,transparent)] overflow-hidden"
    >
      {/* 1. Distinctive Accent 1 Band Header with High-Contrast Ink Text (WCAG AAA 7.50:1) */}
      <div className="w-full bg-accent-1 text-ink py-5 px-6 sm:px-12 flex items-center justify-between border-b-2 border-ink select-none">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-accent-2 rounded-full" />
          <span className="caption-mono font-black text-xs sm:text-sm tracking-widest text-ink">
            SECTION 02 // SELECTED WORK & PLATFORMS
          </span>
        </div>
        <span className="caption-mono text-xs font-black text-ink/85 hidden sm:inline-block">
          ENGINEERING ARCHIVE • 2024 — 2026
        </span>
      </div>

      {/* Floating Cursor Shape for Active Project Hover (Fine Pointers with Lerp) */}
      <div
        className={`fixed pointer-events-none z-[100] transition-opacity duration-150 -translate-x-1/2 -translate-y-1/2 hidden md:block ${
          hoveredProject ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          left: `${shapePos.x}px`,
          top: `${shapePos.y}px`,
        }}
      >
        {hoveredProject?.shape === 'circle' && (
          <div
            className="w-16 h-16 rounded-full shadow-2xl transition-transform duration-100 ease-out"
            style={{ backgroundColor: hoveredProject.shapeColor }}
          />
        )}
        {hoveredProject?.shape === 'square' && (
          <div
            className="w-14 h-14 shadow-2xl transition-transform duration-100 ease-out rotate-12"
            style={{ backgroundColor: hoveredProject.shapeColor }}
          />
        )}
        {hoveredProject?.shape === 'triangle' && (
          <div
            className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[54px] shadow-2xl transition-transform duration-100 ease-out"
            style={{ borderBottomColor: hoveredProject.shapeColor }}
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 pb-28">
        {/* Full-Width Project Rows */}
        <div className="border-t-2 border-ink divide-y-2 border-b-2 border-ink divide-ink">
          {DATA.projects.map((project) => {
            const isOpen = openId === project.id;
            const isHovered = hoveredProject?.id === project.id;

            return (
              <div
                key={project.id}
                className="group relative transition-all duration-300"
                onMouseMove={(e) => handleMouseMove(e, project)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Clickable Header Row Button */}
                <button
                  onClick={() => toggleAccordion(project.id)}
                  aria-expanded={isOpen}
                  className={`w-full text-left py-8 sm:py-12 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 focus:outline-none cursor-pointer ${
                    isOpen
                      ? 'bg-primary text-paper'
                      : isHovered
                      ? 'bg-primary text-paper pl-8 sm:pl-12'
                      : 'hover:bg-primary hover:text-paper hover:pl-8 sm:hover:pl-12'
                  }`}
                >
                  {/* Left: Index & Title with Variable Width Expansion on Hover */}
                  <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                    <span className="caption-mono font-black text-lg sm:text-2xl opacity-75">
                      /{project.index}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3
                          className="poster-headline text-3xl sm:text-5xl md:text-6xl font-black tracking-poster transition-all duration-300"
                          style={{
                            fontVariationSettings: isHovered || isOpen ? "'wdth' 118, 'wght' 900" : "'wdth' 85, 'wght' 900",
                          }}
                        >
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="caption-mono text-xs opacity-80">
                          {project.category}
                        </span>
                        <span className="caption-mono text-xs opacity-40">•</span>
                        <span className="caption-mono text-xs text-accent-2 font-bold">
                          {project.dates}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Tags & Plus / X Icon */}
                  <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-10">
                    <div className="hidden lg:flex items-center gap-2">
                      {project.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="caption-mono text-[10px] px-2.5 py-1 border border-current font-bold uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="caption-mono text-xs font-bold hidden sm:inline-block">
                        {isOpen ? 'COLLAPSE' : 'EXPAND'}
                      </span>
                      <div
                        className={`w-11 h-11 rounded-full border-2 border-current flex items-center justify-center transition-transform duration-300 ${
                          isOpen ? 'rotate-45 bg-accent-1 text-paper border-accent-1' : ''
                        }`}
                      >
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Smooth Expandable Accordion Panel (0fr to 1fr) on Paper Sheet */}
                <div
                  className={`accordion-grid ${isOpen ? 'open' : ''} bg-paper text-ink`}
                >
                  <div className="accordion-inner">
                    <div className="p-6 sm:p-12 border-t-2 border-ink/20">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        <div className="lg:col-span-12"><ProjectScene project={project} /></div>
                        {/* Problem / Approach / Result: Using var(--primary) labels on paper per Rule 7 */}
                        <div className="lg:col-span-7 space-y-6">
                          <div>
                            <span className="caption-mono text-primary text-xs font-black block mb-2">
                              01 // THE PROBLEM
                            </span>
                            <p className="poster-body text-ink/90 text-base sm:text-lg">
                              {project.problem}
                            </p>
                          </div>

                          <div>
                            <span className="caption-mono text-primary text-xs font-black block mb-2">
                              02 // THE APPROACH
                            </span>
                            <p className="poster-body text-ink/90 text-base sm:text-lg">
                              {project.approach}
                            </p>
                          </div>

                          <div>
                            <span className="caption-mono text-primary text-xs font-black block mb-2">
                              03 // REAL RESULT & IMPACT
                            </span>
                            <p className="poster-body text-ink/90 text-base sm:text-lg font-bold">
                              {project.result}
                            </p>
                          </div>

                          {project.bullets && project.bullets.length > 0 && (
                            <div className="pt-4 border-t border-ink/15">
                              <span className="caption-mono text-primary text-xs font-black block mb-3">
                                04 // VERIFIED ENGINEERING CONTRIBUTIONS
                              </span>
                              <ul className="space-y-2.5">
                                {project.bullets.map((b, bIdx) => (
                                 <li key={bIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-ink/85 leading-relaxed">
                                    <span className="text-accent-1 font-bold mt-0.5">•</span>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Specs & Link Card */}
                        <div className="lg:col-span-5 bg-primary/10 border-2 border-primary/30 p-6 sm:p-8 space-y-6">
                          <div>
                            <span className="caption-mono text-ink/60 text-[10px] block">
                              KEY PERFORMANCE BENCHMARK
                            </span>
                            <span className="poster-headline text-4xl sm:text-5xl text-primary font-black mt-1 block">
                              {project.keyMetric}
                            </span>
                            <span className="caption-mono text-xs text-ink/85 font-bold mt-1 block">
                              {project.metricLabel}
                            </span>
                          </div>

                          <div>
                            <span className="caption-mono text-ink/60 text-[10px] block mb-2">
                              ENGINEERING STACK
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {project.stack.map((item, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="caption-mono text-[10px] px-2 py-0.5 bg-paper border border-ink/20 text-ink font-bold"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-ink/15 flex flex-wrap items-center gap-4">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-3 bg-accent-2 text-ink font-black caption-mono text-xs uppercase hover:bg-ink hover:text-paper transition-all shadow-[2px_2px_0px_var(--accent-1)] cursor-pointer"
                            >
                              <GithubIcon className="w-4 h-4" />
                              <span>INSPECT REPO</span>
                            </a>
                            {project.liveUrl && project.liveUrl !== project.githubUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border-2 border-ink text-ink font-black caption-mono text-xs uppercase hover:bg-ink hover:text-paper transition-all">LIVE PROJECT ↗</a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

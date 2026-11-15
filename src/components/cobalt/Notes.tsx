import React, { useEffect, useRef, useState } from 'react';
import { DATA } from '../../data';
import { ExternalLink } from 'lucide-react';

export default function Notes() {
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const allNotes = [
    ...DATA.notes.experience,
    ...DATA.notes.education,
    ...DATA.notes.achievements,
  ];

  return (
    <section
      id="notes"
      ref={containerRef}
      className="relative z-20 bg-paper text-ink sheet-rounded shadow-[0_-28px_56px_color-mix(in_srgb,var(--ink)_20%,transparent)] py-28 sm:py-36 px-6 sm:px-12 border-t-2 border-ink/20"
      aria-label="Verified Education, Research, Client Work, and Competition Records"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink pb-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-accent-1 rounded-full" />
            <h2 className="caption-mono font-black text-ink text-xs sm:text-sm">
              04 // CITATIONS, RESEARCH & CREDENTIALS
            </h2>
          </div>
          <span className="caption-mono text-ink/60 text-xs">
            EDUCATION • RESEARCH • INDUSTRY • HONORS
          </span>
        </div>

        {/* Ruled List with Animated Lines that Draw from Left to Right */}
        <div className="divide-y-0">
          {allNotes.map((note, index) => (
            <div key={index} className="relative group">
              {/* Ruled Line that Draws In (scaleX 0 to 1) on reveal */}
              <div
                className="w-full h-[2px] bg-ink origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
                  transitionDelay: `${index * 85}ms`,
                }}
                aria-hidden="true"
              />

              <div className="py-8 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group hover:bg-white/60 transition-colors px-2 sm:px-4">
                {/* Left Column: Mono Label */}
                <div className="md:col-span-4">
                  <span className="caption-mono text-xs font-black text-primary block tracking-wider">
                    [{note.type}]
                  </span>
                  <span className="caption-mono text-[11px] text-ink/70 block mt-1 font-medium">
                    {note.meta}
                  </span>
                </div>

                {/* Right Column: Big Title + Description */}
                <div className="md:col-span-8">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="poster-headline text-2xl sm:text-4xl md:text-5xl font-black tracking-poster group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    {note.link && (
                      <a
                        href={note.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border-2 border-ink/20 hover:border-primary hover:text-primary transition-colors rounded-none cursor-pointer"
                        aria-label={`View ${note.title} link`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="poster-body text-ink/85 text-base sm:text-lg mt-3 leading-relaxed">
                    {note.detail}
                  </p>
                  {note.bullets && note.bullets.length > 0 && (
                    <ul className="mt-3.5 space-y-1.5 pl-1">
                      {note.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="text-sm sm:text-base text-ink/80 flex items-start gap-2.5">
                          <span className="text-accent-1 font-bold mt-1">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Terminal Rule */}
          <div
            className="w-full h-[2px] bg-ink origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
              transitionDelay: `${allNotes.length * 85}ms`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

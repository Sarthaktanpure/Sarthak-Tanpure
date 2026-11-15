import React from 'react';
import { DATA } from '../../data';

interface NavProps {
  onOpenResume?: () => void;
}

export default function Nav({ onOpenResume }: NavProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cobalt-blue/95 backdrop-blur-md text-cobalt-paper border-b-2 border-cobalt-paper/20 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={() => scrollTo('hero')}
          className="text-left group flex items-center gap-3 focus:outline-none"
          aria-label="Sarthak Tanpure Home"
        >
          <div className="w-3.5 h-3.5 bg-cobalt-red rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex flex-col">
            <span className="font-black text-sm sm:text-base tracking-tight leading-none uppercase">
              {DATA.name}
            </span>
            <span className="caption-mono text-[10px] text-cobalt-paper/70 mt-0.5">
              APPLIED ML & SYSTEMS
            </span>
          </div>
        </button>

        {/* Action Links */}
        <nav className="flex items-center gap-4 sm:gap-8 caption-mono text-[11px] sm:text-xs">
          <button
            onClick={() => scrollTo('work')}
            className="hidden sm:inline-block hover:text-cobalt-yellow transition-colors font-bold uppercase py-1"
          >
            SELECTED WORK
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="hidden sm:inline-block hover:text-cobalt-yellow transition-colors font-bold uppercase py-1"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo('notes')}
            className="hidden md:inline-block hover:text-cobalt-yellow transition-colors font-bold uppercase py-1"
          >
            RECORDS
          </button>
          
          <a
            href={DATA.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 border-2 border-cobalt-paper text-cobalt-paper hover:bg-cobalt-paper hover:text-cobalt-ink font-bold transition-all uppercase"
            aria-label="View Sarthak Tanpure Résumé PDF"
          >
            RÉSUMÉ
          </a>

          <button
            onClick={() => scrollTo('contact')}
            className="px-3.5 py-1.5 bg-cobalt-yellow text-cobalt-ink font-black hover:bg-white transition-all uppercase"
          >
            SAY HELLO
          </button>
        </nav>
      </div>
    </header>
  );
}

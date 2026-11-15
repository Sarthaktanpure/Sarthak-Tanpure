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
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md text-paper border-b-2 border-paper/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Brand Lockup */}
        <button
          onClick={() => scrollTo('hero')}
          className="text-left group flex items-center gap-2.5 sm:gap-3 focus:outline-none cursor-pointer"
          aria-label="Sarthak Tanpure Home"
        >
          <div className="w-3.5 h-3.5 bg-accent-1 rounded-full group-hover:scale-125 transition-transform" />
          <div className="flex flex-col">
            <span className="font-black text-xs sm:text-base tracking-tight leading-none uppercase">
              {DATA.name}
            </span>
            <span className="caption-mono text-[9px] sm:text-[10px] text-paper/70 mt-0.5">
              APPLIED ML & SYSTEMS
            </span>
          </div>
        </button>

        {/* Action Links */}
        <nav className="flex items-center gap-2.5 sm:gap-8 caption-mono text-[10px] sm:text-xs">
          <button
            onClick={() => scrollTo('work')}
            className="hidden sm:inline-block hover:text-accent-2 transition-colors font-bold uppercase py-1 cursor-pointer"
          >
            SELECTED WORK
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="hidden sm:inline-block hover:text-accent-2 transition-colors font-bold uppercase py-1 cursor-pointer"
          >
            ABOUT
          </button>
          <button
            onClick={() => scrollTo('notes')}
            className="hidden md:inline-block hover:text-accent-2 transition-colors font-bold uppercase py-1 cursor-pointer"
          >
            RECORDS
          </button>
          
          <a
            href={DATA.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-paper text-paper hover:bg-paper hover:text-ink font-bold transition-all uppercase"
            aria-label="View Sarthak Tanpure Résumé PDF"
          >
            RÉSUMÉ
          </a>

          <button
            onClick={() => scrollTo('contact')}
            className="px-3 sm:px-3.5 py-1 sm:py-1.5 bg-accent-2 text-ink font-black hover:bg-white transition-all uppercase cursor-pointer"
          >
            SAY HELLO
          </button>
        </nav>
      </div>
    </header>
  );
}

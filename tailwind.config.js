/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cobalt Swiss Poster Palette
        cobalt: {
          blue: "#1B2BFF",     // Electric Cobalt background
          paper: "#F3F1EA",    // Poster Paper
          ink: "#0A0E3A",      // Deep Contrast Ink
          red: "#FF4A1C",      // Geometric Red Accent
          yellow: "#FFD400",   // Half-Moon Yellow Accent
        },
        // Backward-compatibility aliases
        blue: {
          cobalt: "#1B2BFF",
        },
        paper: "#F3F1EA",
        ink: "#0A0E3A",
        // Legacy colors kept for safe fallback
        void: "#1B2BFF",
        display: "#F3F1EA",
        muted: "#7C8794",
      },
      fontFamily: {
        display: ['"Archivo"', 'sans-serif'],
        sans: ['"Archivo"', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sheet: '44px',
      },
      letterSpacing: {
        poster: '-0.04em',
        'poster-tight': '-0.06em',
        widest: '0.15em',
      },
      borderWidth: {
        '2': '2px',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'spin-reverse': 'spin-rev 22s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'spin-rev': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}

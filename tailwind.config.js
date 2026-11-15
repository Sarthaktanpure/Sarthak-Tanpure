/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'accent-1': 'var(--accent-1)',
        'accent-2': 'var(--accent-2)',
        accent1: 'var(--accent-1)',
        accent2: 'var(--accent-2)',
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

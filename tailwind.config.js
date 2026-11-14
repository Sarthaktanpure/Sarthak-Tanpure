/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#05070A",
        panel: {
          DEFAULT: "#0B0F14",
          subtle: "#0e1319",
          card: "rgba(11, 15, 20, 0.75)",
        },
        hairline: {
          DEFAULT: "#1B222B",
          subtle: "rgba(27, 34, 43, 0.6)",
          bright: "#2A3644",
        },
        display: "#EDEBE4",
        muted: "#7C8794",
        signal: {
          cyan: "#3DF2FF",
          alert: "#FF3B4E",
          amber: "#FFB347",
        },
        dawn: {
          deep: "#0E1530",
          violet: "#3A2A5C",
          coral: "#C97B5A",
          cream: "#F4D9B0",
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        widest: '0.15em',
        ultra: '0.25em',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sweep': 'sweep 8s linear infinite',
        'scanline': 'scanline 10s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

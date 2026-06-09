/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gobi': {
          50: '#f9f7f4',
          100: '#f0ebe3',
          200: '#e0d5c5',
          300: '#ccb99f',
          400: '#b89d7a',
          500: '#a6835c',
          600: '#9a7550',
          700: '#7f5e43',
          800: '#684d3a',
          900: '#554032',
          950: '#2d2118',
        },
        'archive': {
          paper: '#f4f1ea',
          ink: '#2c2416',
          faded: '#8b7d6b',
          stamp: '#c41e3a',
        }
      },
      fontFamily: {
        'serif-cn': ['"Noto Serif SC"', 'serif'],
        'sans-cn': ['"Noto Sans SC"', 'sans-serif'],
        'mono-cn': ['"Noto Sans Mono"', 'monospace'],
      },
      animation: {
        'typewriter': 'typewriter 2s steps(40) forwards',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

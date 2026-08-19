/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#030712',
        surface: '#0f172a',
        primary: '#8b5cf6',
        'primary-2': '#38bdf8',
        accent: '#fbbf24',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'float': 'float 4s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.3s ease',
        'slideUp': 'slideUp 0.3s ease'
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      }
    },
  },
  plugins: [],
}
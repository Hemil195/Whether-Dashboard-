/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s ease-in-out infinite',
        'fall-slow': 'fall 2.5s linear infinite',
        'flash': 'flash 1.5s ease-out infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(10px)' },
        },
        flash: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
};
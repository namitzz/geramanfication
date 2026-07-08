/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'dyslexic': ['OpenDyslexic', 'Arial', 'sans-serif'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // "Midnight Arcade" identity: primary accent is the Sprint Bolt red.
        brand: {
          50: '#fff1f2',
          100: '#ffe1e4',
          200: '#ffc3ca',
          300: '#ff94a0',
          400: '#ff5468',
          500: '#ef2140',
          600: '#d01234',
          700: '#a90e2c',
          800: '#8a1129',
          900: '#701226',
        },
        // Gold from the bolt — XP, streaks, celebration.
        gold: {
          300: '#ffe066',
          400: '#ffd83d',
          500: '#ffce00',
          600: '#e0b400',
        },
        // Ink-tinted neutral scale: dark mode becomes deep blue-black
        // ("midnight") and light mode a cool paper — remapping gray restyles
        // the whole app consistently.
        gray: {
          50: '#f7f8fc',
          100: '#eef0f8',
          200: '#dde1ef',
          300: '#c2c8de',
          400: '#9aa2c0',
          500: '#6e7694',
          600: '#4e5570',
          700: '#343a54',
          800: '#1c2138',
          900: '#10142a',
          950: '#0a0d1f',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(10 13 31 / 0.08), 0 1px 2px -1px rgb(10 13 31 / 0.08)',
        'card-hover': '0 10px 25px -5px rgb(10 13 31 / 0.14), 0 8px 10px -6px rgb(10 13 31 / 0.08)',
        'glow-red': '0 0 24px rgba(239, 33, 64, 0.35)',
        'glow-gold': '0 0 20px rgba(255, 206, 0, 0.35)',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.95)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Springy entrance for cards/tiles.
        'spring-in': {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.97)' },
          '60%': { opacity: '1', transform: 'translateY(-2px) scale(1.005)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        // Soft glow pulse (streak flame, live mic, etc.).
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 2px rgba(255,140,0,0.6))' },
          '50%': { filter: 'drop-shadow(0 0 10px rgba(255,140,0,0.9))' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-8vh) rotate(0deg)', opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(105vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.35s ease-out',
        'pop': 'pop 0.2s ease-out',
        'spring-in': 'spring-in 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)',
        'glow-pulse': 'glow-pulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

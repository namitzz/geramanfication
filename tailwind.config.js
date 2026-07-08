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
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        // "Fuchs & The Trail" identity: indigo -> violet brand range.
        brand: {
          50: '#f0effc',
          100: '#e7e5fb',
          200: '#c9c5f4',
          300: '#a29bec',
          400: '#7b6ef0',
          500: '#6e67e0',
          600: '#4e47c9',
          700: '#3b36a0',
          800: '#2b2870',
          900: '#211e45',
        },
        // Amber is reserved for Fuchs's coat + the streak flame (spec rule).
        gold: {
          300: '#f6ce9b',
          400: '#f0a860',
          500: '#ee9b4d',
          600: '#dd8531',
        },
        // Neutrals derived from the handoff's ink/faint/line/surface ramps so
        // legacy gray-* usages sit naturally on cream (light) / indigo night
        // (dark) without touching every file.
        gray: {
          50: '#faf8f4',
          100: '#f1ede4',
          200: '#dedaef',
          300: '#c9c5de',
          400: '#9491ac',
          500: '#5b5775',
          600: '#4a4668',
          700: '#332f55',
          800: '#211e3d',
          900: '#161428',
          950: '#12102a',
        },
        // Theme-aware semantic tokens (CSS variables from index.css).
        surface: 'var(--surface)',
        surface2: 'var(--surface2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        primary: 'var(--primary)',
        'primary-ink': 'var(--primary-ink)',
        'primary-soft': 'var(--primary-soft)',
        violet: 'var(--violet)',
        amber: 'var(--amber)',
        'amber-deep': 'var(--amber-deep)',
        'amber-soft': 'var(--amber-soft)',
        good: 'var(--good)',
        'good-soft': 'var(--good-soft)',
        bad: 'var(--bad)',
        'bad-soft': 'var(--bad-soft)',
        track: 'var(--ring)',
      },
      boxShadow: {
        // Spec: restrained card shadow; elevated for gradient hero cards.
        card: '0 8px 24px -12px rgba(33, 30, 69, 0.25)',
        'card-hover': '0 12px 28px -12px rgba(33, 30, 69, 0.3)',
        hero: '0 18px 34px -20px var(--primary)',
      },
    },
  },
  plugins: [],
}

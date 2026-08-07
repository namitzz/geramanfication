/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        'surface-solid': 'var(--surface-solid)',
        elevated: 'var(--elevated)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        'accent-ink': 'var(--accent-ink)',
        'accent-soft': 'var(--accent-soft)',
        good: 'var(--good)',
        'good-soft': 'var(--good-soft)',
        bad: 'var(--bad)',
        'bad-soft': 'var(--bad-soft)',
      },
      fontFamily: {
        sans: ['Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: '18px',
        '2xl': '24px',
        '3xl': '30px',
      },
      boxShadow: {
        soft: 'var(--shadow)',
      },
      maxWidth: {
        app: '460px',
      },
    },
  },
  plugins: [],
};

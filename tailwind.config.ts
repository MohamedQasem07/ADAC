import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#0A1929',
          DEFAULT: '#0D1B2A',
          medium: '#1B3A5C',
        },
        royal: '#2E75B6',
        teal: '#0096B4',
        gold: {
          DEFAULT: '#C9A961',
          soft: '#E0C988',
        },
        // Theme-aware accent token (Phase 2.4E.2) — uses the
        // --theme-accent-rgb CSS variable so Tailwind's opacity modifier
        // works (`text-theme/40`, `bg-theme/10`, `border-theme/50`).
        // Premium Navy: gold (201,169,97). Partnership: ADAC yellow
        // (255,210,0). Drop-in replacement for `gold` in any
        // audience-facing component that should follow the active
        // visual theme.
        theme: 'rgb(var(--theme-accent-rgb) / <alpha-value>)',
        ice: '#F4F8FC',
        ink: {
          dark: '#0F1B2D',
          medium: '#4A5568',
          soft: '#7A8B9D',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card-rest': '0 4px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 20px 40px -10px rgba(201,169,97,0.15)',
        'gold-glow': '0 0 32px rgba(201,169,97,0.25)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
        snap: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        rotateMesh: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 8px rgba(201,169,97,0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 16px rgba(201,169,97,0.7))' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
        'rotate-mesh': 'rotateMesh 60s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

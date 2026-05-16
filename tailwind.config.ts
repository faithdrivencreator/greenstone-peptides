import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0D1117',
          mid: '#161C26',
          light: '#1E2738',
        },
        gold: {
          DEFAULT: '#6FA8DC',
          light: '#9DC4E8',
          dim: '#3D6FA8',
        },
        blue: {
          DEFAULT: '#6FA8DC',
          light: '#9DC4E8',
          dim: '#3D6FA8',
          50: '#F0F6FC',
          100: '#DCEAF5',
          200: '#BFD8EE',
          300: '#A6C8E5',
          400: '#88B8DE',
          500: '#6FA8DC',
          600: '#4F8AC0',
          700: '#3D6FA8',
          800: '#2E5482',
          900: '#1F3A5C',
          950: '#122238',
        },
        sage: {
          DEFAULT: '#7A9E87',
          light: '#A8C4B0',
        },
        emerald: {
          DEFAULT: '#1A9E6E',
          light: '#26C98A',
          dim: '#0F6647',
          glow: 'rgba(26, 158, 110, 0.2)',
        },
        cream: {
          DEFAULT: '#F5F1EB',
          dim: '#B8B2A8',
        },
        error: '#E07070',
        success: '#70B090',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Playfair Display', 'Georgia', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'DM Sans', '-apple-system', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'IBM Plex Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        container: '1280px',
        prose: '65ch',
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 169, 110, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(201, 169, 110, 0)' },
        },
        molecularFloat: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(8px, -6px) rotate(2deg)' },
          '66%': { transform: 'translate(-6px, 4px) rotate(-1deg)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-gold': 'pulseGold 2.4s ease-in-out infinite',
        'molecular-float': 'molecularFloat 18s ease-in-out infinite',
      },
      backgroundImage: {
        'obsidian-gradient':
          'radial-gradient(ellipse 80% 50% at 20% 100%, rgba(111, 168, 220, 0.08), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 0%, rgba(26, 158, 110, 0.07), transparent 60%), radial-gradient(ellipse 40% 30% at 50% 50%, rgba(26, 158, 110, 0.03), transparent 70%)',
        'gold-shimmer':
          'linear-gradient(90deg, transparent, rgba(111, 168, 220, 0.18), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;

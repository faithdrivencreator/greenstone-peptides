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
          DEFAULT: '#C9A96E',
          light: '#E8C98A',
          dim: '#8A6E3E',
        },
        sage: {
          DEFAULT: '#7A9E87',
          light: '#A8C4B0',
        },
        cream: {
          DEFAULT: '#F5F1EB',
          dim: '#B8B2A8',
        },
        error: '#E07070',
        success: '#70B090',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'DM Sans', '-apple-system', 'sans-serif'],
        jetbrains: ['var(--font-jetbrains)', 'JetBrains Mono', 'Courier New', 'monospace'],
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
          'radial-gradient(ellipse 80% 50% at 20% 100%, rgba(201, 169, 110, 0.08), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 0%, rgba(122, 158, 135, 0.05), transparent 60%)',
        'gold-shimmer':
          'linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.15), transparent)',
      },
    },
  },
  plugins: [],
};

export default config;

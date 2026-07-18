import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        accent: '#06B6D4',
        surface: '#F8FAFC',
        ink: '#111827',
      },
      boxShadow: {
        glow: '0 20px 60px -20px rgba(79, 70, 229, 0.45)',
        glass: '0 20px 80px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(79,70,229,0.22), transparent 38%), radial-gradient(circle at 80% 10%, rgba(6,182,212,0.15), transparent 26%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        'glass-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.18))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(8px, -8px, 0) rotate(4deg)' },
          '100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.55', filter: 'blur(30px)' },
          '50%': { opacity: '1', filter: 'blur(22px)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dash: {
          '0%': { strokeDashoffset: '1200' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        drift: 'drift 10s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
        glow: 'glow 8s ease-in-out infinite',
        revealUp: 'revealUp 0.8s ease forwards',
        dash: 'dash 10s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;

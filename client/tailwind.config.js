/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Black Theme - Figma Design System
        dark: {
          950: '#030303',  // Deepest black
          900: '#0a0a0f',  // Primary background
          850: '#0f0f14',  // Card background
          800: '#141419',  // Elevated surfaces
          750: '#1a1a20',  // Hover states
          700: '#1f1f26',  // Borders
          600: '#2a2a33',  // Dividers
          500: '#3a3a47',  // Disabled
          400: '#525260',  // Secondary text
          300: '#6b6b7b',  // Tertiary text
          200: '#9a9aad',  // Muted text
          100: '#c4c4d4',  // Body text
          50: '#f0f0f5',   // Primary text
        },
        // Accent Colors - Blue Professional Theme
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Primary brand
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Severity Colors
        severity: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#22c55e',
          info: '#3b82f6',
        },
        accent: {
          red: '#ef4444',
          green: '#22c55e',
          blue: '#3b82f6',
          yellow: '#eab308',
          cyan: '#06b6d4',
          indigo: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // Professional glow effects
        'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.4)',
        // Card shadows
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)',
        // Inner shadows for depth
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'inner-dark': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, hsla(259,100%,60%,0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(267,100%,60%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(259,100%,60%,0.1) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
}

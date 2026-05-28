/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f9fb',
          100: '#e8eef5',
          200: '#d5e0ec',
          300: '#adbfce',
          400: '#7892a8',
          500: '#516b81',
          600: '#3f566a',
          700: '#334656',
          800: '#263641',
          900: '#1a2630',
          950: '#101820',
        },
        sap: {
          50: '#edf7ff',
          100: '#d6ecff',
          200: '#b5ddff',
          300: '#83c7ff',
          400: '#49a6f5',
          500: '#1f82d0',
          600: '#1268ad',
          700: '#105287',
          800: '#12466f',
          900: '#143a5b',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        soft: '0 16px 48px rgba(16, 24, 32, 0.08)',
      },
    },
  },
  plugins: [],
};

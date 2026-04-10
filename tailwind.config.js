/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      colors: {
        ultimate: '#111111',
        steel: '#464c4c',
        navy: {
          50: '#e7e8ea',
          100: '#b4b8c0',
          200: '#818997',
          300: '#4e5a6e',
          400: '#1c2a44',
          500: '#131e33',
          600: '#111a2e',
          700: '#0e1728',
          800: '#1a2235',
          900: '#111827',
          950: '#0d1728',
        },
        lightCustom: '#c0c1c4',
      },
    },
  },
  plugins: [],
};

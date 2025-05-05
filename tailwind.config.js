/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#127475',
          light: '#1a9899',
          dark: '#0e5a5b',
          100: '#e6f0f0',
          200: '#b8dbdb',
          300: '#8bc5c6',
          400: '#5dafb0',
          500: '#127475',
          600: '#0f5d5e',
          700: '#0c4647',
          800: '#092f30',
          900: '#06181a',
        },
        'border-primary': '#127475',
        secondary: '#f5dfbb',
        accent: '#f2542d',
      },
    },
  },
  plugins: [],
};

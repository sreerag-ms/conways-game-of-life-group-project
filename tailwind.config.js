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
        },
        secondary: '#f5dfbb',
        accent: '#f2542d',
      },
    },
  },
  plugins: [],
};

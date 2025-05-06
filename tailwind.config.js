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
          50: '#e3f6f6',
          100: '#b9e6e6',
          200: '#8ad6d6',
          300: '#5bc6c6',
          400: '#2cb6b6',
          500: '#127475',
          600: '#0e5a5a',
          700: '#0a4040',
          800: '#062626',
          900: '#021212',
        },
      },
      maxWidth: {
        '9xl': '96rem',
        '10xl': '104rem',
        '11xl': '112rem',
        '12xl': '120rem',
      },
    },
  },
  plugins: [],
};

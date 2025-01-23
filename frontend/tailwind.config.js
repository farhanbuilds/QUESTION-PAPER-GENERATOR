/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ananda: ['ananda'],
        poppins: ['poppins'],
      },
      animation: {
        loader1: 'loader 0.6s ease-in-out infinite',
        loader2: 'loader 0.6s ease-in-out 0.2s infinite',
        loader3: 'loader 0.6s ease-in-out 0.4s infinite',
        blob1: 'blob 7s infinite',
        blob2: 'blob 8s infinite',
        blob3: 'blob 9s infinite',
      },
      keyframes: {
        loader: {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '0.5',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
};
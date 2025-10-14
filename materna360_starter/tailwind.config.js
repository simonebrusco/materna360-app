/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'm360-orange': '#F17324',
        'm360-rose': '#fda4af',
        'm360-violet': '#6C4AB6',
      },
      borderRadius: {
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};
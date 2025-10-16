// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./materna360_starter/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./materna360_starter/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./materna360_starter/lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff005e",
          light: "#ffd8e6",
          navy: "#2f3a56",
          gray: "#545454",
          white: "#ffffff",
        },
      },
      boxShadow: {
        card: "0 10px 24px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

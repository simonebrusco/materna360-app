/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff005e",   // principal
          light: "#ffd8e6",     // complemento
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

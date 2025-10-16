/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // app atual
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",

    // estrutura dentro de materna360_starter
    "./materna360_starter/app/**/*.{js,jsx,ts,tsx}",
    "./materna360_starter/components/**/*.{js,jsx,ts,tsx}",
    "./materna360_starter/lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          pink: "#ff005e",
          pinkSoft: "#ffd8e6",
          navy: "#2f3a56",
          slate: "#545454",
          white: "#ffffff",
        },
      },
      boxShadow: {
        card: "0 6px 22px rgba(47,58,86,0.08)", // sombra suave premium
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

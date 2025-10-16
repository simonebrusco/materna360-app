/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#ff005e",  // principal
          soft: "#ffd8e6",     // complemento
          navy: "#2f3a56",     // apoio 1
          ink: "#545454",      // apoio 2
          white: "#ffffff",    // apoio 3
        },
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(47,58,86,0.18)", // navy sutil
        glass:
          "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 30px -12px rgba(0,0,0,0.18)",
        card: "0 6px 24px -8px rgba(47,58,86,0.18)", // alias p/ compatibilidade
      },
      borderRadius: {
        xl2: "1.25rem", // ~20px
      },
      fontFamily: {
        poppins: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#F15A2E",
          secondary: "#6C4AB6",
          accent: "#F17324",
          bg: "#F5F5F5",
          text: "#1E1E1E",
        },
      },
      borderRadius: {
        xl2: "1rem",
      },
      boxShadow: {
        card: "0 6px 18px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

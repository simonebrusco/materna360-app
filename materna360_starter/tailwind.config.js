/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        m360: {
          primary: "#ff005e",
          heading: "#2f3a56",
          body: "#59636f",
        },
      },
      container: { center: true },
    },
  },
  plugins: [],
};

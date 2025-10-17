/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🔎 Caminhos RELATIVOS à pasta onde ESTÁ este arquivo (materna360_starter/)
  content: [
    "./app/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌸 Paleta oficial Materna360 (usa CSS variables definidas em styles/globals.css)
        brand: "var(--m360-coral)",   // principal #ff005e
        blush: "var(--m360-blush)",   // secundária #ffd8e6
        navy:  "var(--m360-navy)",    // #2f3a56
        grayx: "var(--m360-gray)",    // #545454
        blackx:"var(--m360-black)",   // #000000
        whitex:"var(--m360-white)",   // #ffffff

        // 🔁 Aliases de compatibilidade (não quebrar layouts antigos)
        peach: "var(--m360-peach)",   // aponta para blush (#ffd8e6)
        coral: "var(--m360-coral)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        m360: "0 1px 6px rgba(47,58,86,0.08)",
      },
    },
  },
  plugins: [],
};

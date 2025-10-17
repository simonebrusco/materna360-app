/** @type {import('tailwindcss').Config} */
module.exports = {
  // Caminhos RELATIVOS a esta pasta (materna360_starter/)
  content: [
    "./app/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{css}",
  ],

  // Garante classes com CSS vars e opacidades (evita "purgar")
  safelist: [
    // base via CSS vars
    { pattern: /bg-\[--m360-(coral|blush|navy|gray|black|white|peach)\]/ },
    { pattern: /text-\[--m360-(coral|blush|navy|gray|black|white|peach)\]/ },
    { pattern: /border-\[--m360-(coral|blush|navy|gray|black|white|peach)\]/ },
    { pattern: /ring-\[--m360-(coral|blush|navy|gray|black|white|peach)\]/ },
    // com opacidade (ex.: /40 /60 /70)
    { pattern: /bg-\[--m360-(coral|blush|navy)\]\/(10|20|30|40|50|60|70|80|90)/ },
    { pattern: /text-\[--m360-(coral|blush|navy)\]\/(10|20|30|40|50|60|70|80|90)/ },
    { pattern: /border-\[--m360-(coral|blush|navy)\]\/(10|20|30|40|50|60|70|80|90)/ },
    { pattern: /ring-\[--m360-(coral|blush|navy)\]\/(10|20|30|40|50|60|70|80|90)/ },
  ],

  theme: {
    extend: {
      colors: {
        // 🌸 Paleta oficial Materna360 (CSS variables em styles/globals.css)
        brand: "var(--m360-coral)",   // #ff005e
        blush: "var(--m360-blush)",   // #ffd8e6
        navy:  "var(--m360-navy)",    // #2f3a56
        grayx: "var(--m360-gray)",    // #545454
        blackx:"var(--m360-black)",   // #000000
        whitex:"var(--m360-white)",   // #ffffff

        // Aliases de compatibilidade
        peach: "var(--m360-peach)",   // aponta para blush
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

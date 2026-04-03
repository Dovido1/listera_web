const { Warning } = require("postcss");

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#40E0D0",   // turquoise du logo
        neutral: "#000000",   // noir du texte
        background: "#FFFFFF", // blanc du fond
        danger: "#DC2626",   // rouge pour stop/ rupture de stock
        success: "#16A34A",   // vert pour succès/ en stock
        Warning: "#F59E0B",   // orange pour avertissement/ stock faible
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          background: {
            100: "#DDD8D8",
            300: "#D1CCCC",
            500: "#C5C0C0",
            700: "#BAB4B4",
            900: "#AEA9A9",
          },
          text: "#333",
          accent: {
            100: "#C29FFA",
            300: "#A989D5",
            500: "#8E73B0",
            700: "#735C8B",
            900: "#5D4A6F",
          },
        },
        dark: {
          background: {
            100: "#252E39",
            300: "#293643",
            500: "#2C3E4D",
            700: "#2F4757",
            900: "#315061",
          },
          text: "#eee",
          accent: {
            100: "#0A58CA",
            300: "#0B50B2",
            500: "#0B479A",
            700: "#0B3D83",
            900: "#0B336B",
          },
        },
      },
    },
  },
  plugins: [],
};

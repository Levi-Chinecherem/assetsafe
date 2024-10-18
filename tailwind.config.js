/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust paths based on your project structure
  ],
  theme: {
    extend: {
      colors: {
        vintageBrown: "#B5651D",
        mutedBlue: "#6B8E23",
        fadedYellow: "#F3E5AB",
        sepia: "#704214",
        mutedPink: "#D8BFD8",
      },
      fontFamily: {
        vintage: ["'Cormorant Garamond', serif"],
        script: ["'Dancing Script', cursive"],
      },
    },
  },
  plugins: [],
};


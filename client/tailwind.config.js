/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D94CC",
        primaryHover: "#4096FF",
      },
    },
  },
  plugins: [],
  corePlugins:{
    preflight:false
  },
}
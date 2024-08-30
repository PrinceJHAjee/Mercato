/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' if you want to use the prefers-color-scheme media query
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
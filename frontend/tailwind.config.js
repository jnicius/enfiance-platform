/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#0B1426",
        secondary: "#1E3A8A",
        accent: "#2563EB",
        gold: "#FACC15",
      },
    },
  },

  plugins: [],
}

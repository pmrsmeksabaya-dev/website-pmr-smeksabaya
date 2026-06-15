/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pmi: '#E32626',
        maroon: '#800020',
        gold: '#D4AF37',
      },
    },
  },
  plugins: [],
}
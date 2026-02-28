/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'crime': {
          'dark': '#0B2447',
          'medium': '#1C3A5F',
          'light': '#2E5C8A',
          'glow': '#9AC7FF',
          'soft': '#C3D9FF',
        }
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./popup.html"
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'glass': 'rgba(255, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}

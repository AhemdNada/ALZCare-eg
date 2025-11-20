/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6A0DAD",     // Primary brand
        darkpurple: "#4B0A7A",  // Deep accent
        lightAccent: "#E6CCFF", // Soft lavender
        bgpurple: "#F7F1FF"     // Page background
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial']
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(106,13,173,0.12)',
        'soft-xl': '0 24px 60px rgba(15,23,42,0.16)'
      },
      borderRadius: {
        'xl-2': '1rem'
      },
      transitionTimingFunction: {
        'gentle': 'cubic-bezier(0.23, 1, 0.32, 1)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'soft-pulse': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '70%': { transform: 'scale(1.06)', opacity: '0.8' },
          '100%': { transform: 'scale(1.08)', opacity: '0' }
        }
      },
      animation: {
        'float-slow': 'float 14s ease-in-out infinite',
        'float-slower': 'float 18s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: []
}

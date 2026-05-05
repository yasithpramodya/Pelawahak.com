/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-rose': '#B85C6E',
        'deep-rose': '#9E3D55',
        'logo-gold': '#C8973A',
        'blush': '#F9EEE9',
        'warm-white': '#FFFAF8',
        'near-black': '#1C1C1C',
        'dark-grey': '#4A4A4A',
        'light-grey': '#E8E8E8',
        'wedding-cream': '#FDF6EE',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}


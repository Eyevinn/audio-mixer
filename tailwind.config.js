/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        darkgrey: '#a9a9a9',
        selectgreen: '#0fcc00',
        pflyellow: '#ffd000',
        mutered: '#ff0f00'
      }
    }
  },
  plugins: []
};

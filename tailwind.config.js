/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      width: {
        strip: '97px',
        'strip-container': '100px'
      },
      height: {
        strip: '726px'
      },
      colors: {
        'dark-grey': '#a9a9a9',
        'select-green': '#0fcc00',
        'pfl-yellow': '#ffd000',
        'mute-red': '#ff0f00',
        'strip-bg': '#151515',
        'slider-green': '#04AA6D',
        'meter-red': '#e00',
        'meter-yellow': '#ee0',
        'meter-green': '#0e0',
        delete: '#bb3e3c'
      }
    }
  },
  plugins: []
};

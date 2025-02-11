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
        'filter-bg': '#262829',
        'filter-highlited-bg': '#2a2c2e',
        'dark-grey': '#a9a9a9',
        // Strip colors:
        'strip-bg': '#2B2C2E',
        'strip-hover': '#3a3b3d',
        'slider-green': '#04AA6D',
        'label-field': '#F9FADA',
        'input-field': '#D9D9D9',
        'meter-red': '#e00',
        'meter-yellow': '#ee0',
        'meter-green': '#0e0',
        'select-btn': '#63B65F',
        'pfl-btn': '#b6b15f',
        'mute-btn': '#b15f5f',
        'default-btn': '#a9a9a9',
        // Filter-settings colors:
        'grid-bg': '#151515',
        // Mix colors:
        'mix-bg': '#1a273f',
        'selected-mix-bg': '#291531',
        'input-bg': '#374151',
        'input-hover': '#3f3f46',
        'border-bg': '#535151',
        'modal-bg': '#27272a',
        'button-green': '#1DB954',
        'button-green-hover': '#22c55e',
        'button-delete': '#dc2626',
        'button-delete-hover': '#ef4444',
        'button-abort': '#d6d3d1',
        'button-abort-hover': '#f5f5f4',
        delete: '#bb3e3c'
      }
    }
  },
  plugins: []
};

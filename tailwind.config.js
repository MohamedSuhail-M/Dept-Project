/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFDEE',
        'lime-light': '#E2FBCE',
        lime: '#E3EF26',
        emerald: '#076653',
        'deep-emerald': '#0C342C',
        forest: '#06231D',
      },
    },
  },
  plugins: [],
};

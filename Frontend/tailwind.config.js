/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          900: '#0a1f12',
          800: '#0d2818',
          700: '#143a23',
          600: '#1c4d30',
        },
        leaf: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        tropic: {
          yellow: '#fde047',
          orange: '#f97316',
          amber: '#fbbf24',
        },
        cream: '#fefce8',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
      },
      boxShadow: {
        brutal: '6px 6px 0px 0px #000000',
        'brutal-sm': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
      },
    },
  },
  plugins: [],
};

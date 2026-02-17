/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD4C7',
          300: '#FFBBA8',
          400: '#FF9B7F',
          500: '#FF7043',
          600: '#E65A2E',
          700: '#CC4A24',
          800: '#A33D1F',
          900: '#7A2E17',
        },
        secondary: {
          50: '#F0F7F4',
          100: '#D9EBE2',
          200: '#B8D9C9',
          300: '#8FC2A8',
          400: '#66A882',
          500: '#4A9167',
          600: '#3A7352',
          700: '#2D5A40',
          800: '#234532',
          900: '#1A3325',
        },
        accent: {
          50: '#FAF6F1',
          100: '#F2E9DB',
          200: '#E6D4B8',
          300: '#D9BE94',
          400: '#CCA870',
          500: '#A18267',
          600: '#8A6D56',
          700: '#735845',
          800: '#5C4637',
          900: '#45352A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

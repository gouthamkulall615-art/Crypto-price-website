/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3EFE6',
        ink: '#14110F',
        forest: '#14532D',
        tint: '#E7E0CF',
        mustard: '#E0A526',
        gain: '#15803D',
        loss: '#B91C1C',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

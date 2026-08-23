export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F4',
        surface: '#FFFFFF',
        cream: '#F5F0E8',
        beige: '#EBE2D5',
        line: '#E5DCCF',
        ink: {
          DEFAULT: '#2E2A26',
          70: '#5B534B',
          50: '#8A8178',
          30: '#B9B1A7',
        },
        brown: {
          DEFAULT: '#8C6A4E',
          soft: '#A98A6D',
          tint: '#F0E7DC',
        },
        gold: {
          DEFAULT: '#B8913C',
          tint: '#F6EEDA',
        },
        terracotta: {
          DEFAULT: '#BB6440',
          tint: '#F8E9E1',
        },
        sage: {
          DEFAULT: '#5C7A5E',
          tint: '#E9F0E8',
        },
        danger: {
          DEFAULT: '#B0453A',
          tint: '#F9E7E4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(46,42,38,0.05)',
        pop: '0 10px 30px -10px rgba(46,42,38,0.22)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

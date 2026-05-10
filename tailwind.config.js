/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        olive: {
          300: '#B5C99A',
          400: '#9AB57E',
          500: '#82A064',
          600: '#6B8C4E',
          700: '#57763E',
          800: '#435E30',
          900: '#2F4522',
          950: '#1C2B13',
        },
        cream: {
          50: '#FAFAF7',
          100: '#F5F0E8',
          200: '#EDE7D9',
          300: '#E0D9C8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',  // Emerald 50
          100: '#d1fae5', // Emerald 100
          200: '#a7f3d0', // Emerald 200
          300: '#6ee7b7', // Emerald 300
          400: '#34d399', // Emerald 400
          500: '#10b981', // Emerald 500 (Base)
          600: '#059669', // Emerald 600 (Royal Green - Button Hover)
          700: '#047857', // Emerald 700 (Royal Green - Deep)
          800: '#065f46', // Emerald 800
          900: '#064e3b', // Emerald 900
          950: '#022c22', // Emerald 950
        },
        accent: {
          500: '#f59e0b', // Amber 500 (Orange)
          600: '#d97706', // Amber 600
        }
      },
      keyframes: {
        'toast-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'toast-out': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        slideIn: {
            'from': { opacity: '0', transform: 'translateY(10px)' },
            'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-up': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      animation: {
        'toast-in': 'toast-in 0.3s ease-out forwards',
        'toast-out': 'toast-out 0.3s ease-in forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'scale-up': 'scale-up 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

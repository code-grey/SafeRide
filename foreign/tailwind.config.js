/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        'brand': {
          'primary': '#007BFF',
          'secondary': '#6C757D',
        },
        'light': {
          'background': '#F8F9FA',
          'surface': '#FFFFFF',
          'text': '#212529',
          'subtle': '#6C757D',
        },
        'dark': {
          'background': '#050505', // Deep black
          'surface': '#0a0a0a', // Slightly lighter black
          'text': '#E0E0E0',
          'subtle': '#9E9E9E',
        },
        'accent': {
          'blue': '#00f3ff', // Neon Cyan
          'violet': '#bc13fe', // Neon Purple
        },
        'neon': {
          'blue': '#00f3ff',
          'purple': '#bc13fe',
          'green': '#0aff00',
        }
      },
      borderRadius: {
        'xl': '1rem',
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'glow-blue': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
        'glow-purple': '0 0 10px rgba(188, 19, 254, 0.5), 0 0 20px rgba(188, 19, 254, 0.3)',
      },
      backdropBlur: {
        'xl': '20px',
      },
      transitionProperty: {
        'all': 'all',
      },
      transitionDuration: {
        '300': '300ms',
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.8), 0 0 30px rgba(0, 243, 255, 0.5)'
          }
        }
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
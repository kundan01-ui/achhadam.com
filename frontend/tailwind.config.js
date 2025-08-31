/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Agricultural Color Palette
        'primary-green': '#2E7D32',
        'secondary-green': '#4CAF50',
        'light-green': '#81C784',
        'accent-orange': '#FF8F00',
        'warm-brown': '#5D4037',
        'neutral-gray': '#F5F5F5',
        'text-dark': '#212121',
        'text-light': '#757575',
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#F44336',
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'agricultural': '0 4px 6px -1px rgba(46, 125, 50, 0.1), 0 2px 4px -1px rgba(46, 125, 50, 0.06)',
        'card-hover': '0 10px 25px -3px rgba(46, 125, 50, 0.1), 0 4px 6px -2px rgba(46, 125, 50, 0.05)',
      },
      borderRadius: {
        'agricultural': '12px',
      },
    },
  },
  plugins: [],
}


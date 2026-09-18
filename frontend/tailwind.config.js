/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Manrope', 'Outfit', 'sans-serif']
      },
      colors: {
        background: '#F9F9F6',
        surface: '#F3F2EE',
        'surface-hover': '#EAE8E3',
        primary: '#C84B31',
        'primary-hover': '#A63A23',
        'text-main': '#1A1A1A',
        'text-muted': '#4A4A44',
        border: '#E5E5E0',
        bone: '#F9F9F6',
        terracotta: '#C84B31'
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem'
      },
      boxShadow: {
        ambient: '0 8px 32px rgba(0,0,0,0.04)',
        'ambient-lg': '0 16px 48px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
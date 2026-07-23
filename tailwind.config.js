/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fafafa',
          100: '#f5f5f5',
          400: '#ffffff',
          500: '#e2e8f0', // Liquid Chrome Silver
          600: '#cbd5e1',
          700: '#94a3b8',
        },
        dark: {
          950: '#000000', // Deep Obsidian Black
          900: '#080808', // Studio Dark Charcoal
          800: '#121212', // Elevated Obsidian Card
          700: '#222222', // Subtly Lit Border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        ultra: '0.25em',
      }
    },
  },
  plugins: [],
}

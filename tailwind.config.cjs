/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        primary: '#e74c3c',
        'primary-foreground': '#ffffff',
        border: '#e5e7eb',
      },
    },
  },
  plugins: [],
}

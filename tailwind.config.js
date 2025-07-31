/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <-- important for toggling dark mode with 'dark' class
  content: [
    './app/**/*.{js,ts,jsx,tsx}',   // adapt these to your folder structure
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

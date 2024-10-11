/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",    
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    fontFamily: {
      Dosis: ['Dosis', "sans-serif"],
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },

    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
};

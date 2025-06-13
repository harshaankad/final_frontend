/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ]
  ,
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        orbitron: ['var(--font-orbitron)'],
        geist: ['var(--font-geist-sans)'],
        geistMono: ['var(--font-geist-mono)'],
        sacramento: ['var(--font-sacramento)'],
        sixtyfour: ['var(--font-sixtyfour-convergence)'],
      },
    },
  },
  plugins: [],
};

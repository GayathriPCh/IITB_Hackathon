/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          950: "#7f1d1d", // Custom dark red color
        },
      },
    },
  },
  plugins: [],
}


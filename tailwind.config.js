/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)", // the green color from the mockup
          hover: "var(--primary-hover)",
        },
      },
    },
  },
  plugins: [],
};

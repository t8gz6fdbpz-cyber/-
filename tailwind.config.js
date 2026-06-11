/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        kanit: ["Kanit", "sans-serif"],
      },
      boxShadow: {
        "contact-glow":
          "0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px rgba(119, 33, 177, 0.95)",
      },
    },
  },
  plugins: [],
};


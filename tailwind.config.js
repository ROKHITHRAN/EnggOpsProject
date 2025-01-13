/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        1061: "1061px", // Custom screen size
      },
      animation: {
        "fade-left": "fadeLeft 1.0s ease-in-out", // Custom animation
      },
      keyframes: {
        fadeLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      // Add delay utilities
      extend: {
        transitionDelay: {
          50:"50ms",
          100: "100ms",
          200: "200ms",
          300: "300ms",
          500: "500ms",
        },
      },
    },
  },
  plugins: [],
};

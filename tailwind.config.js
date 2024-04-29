/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff9fc",
          100: "#d8eff5",
          200: "#b5deec",
          300: "#82c7de",
          400: "#48a6c9",
          500: "#2c89ae",
          600: "#276f93",
          700: "#265b78",
          800: "#274d63",
          900: "#244155",
          950: "#132939",
        },
        "figma-yellow": "#FFFBF1",
      },
    },
    fontFamily: {
      "kaisei-regular": "kaisei",
    },
  },
  plugins: [],
};

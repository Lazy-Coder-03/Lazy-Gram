import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lilac: {
          50: "#f0ecf9",
          100: "#e6e1f4",
          200: "#dcd5f0",
          300: "#c8bce7",
          400: "#b09adb",
          500: "#9876cb",
          600: "#946bc2",
          700: "#764ea2",
          800: "#624186",
          900: "#51366d",
          950: "#312046",
        },
        lavender: {
          50: "#f7f6fa",
          100: "#eeeef5",
          200: "#e5e4f0",
          300: "#d4d0e5",
          400: "#bcb8d7",
          500: "#a49fc7",
          600: "#9c96bf",
          700: "#7f78a1",
          800: "#685d84",
          900: "#534b6c",
          950: "#312c42",
        },
        violet: {
          50: "#f7f6fa",
          100: "#eeeef5",
          200: "#e5e4f0",
          300: "#d4d0e5",
          400: "#bcb8d7",
          500: "#a49fc7",
          600: "#9c96bf",
          700: "#7f78a1",
          800: "#685d84",
          900: "#534b6c",
          950: "#312c42",
        },
      },
    },
    mytheme: {
      primary: "#764ea2", // lilac-600

      secondary: "#9c96bf", // violet-600

      accent: "#a49fc7", // lavender-500

      neutral: "#262626",

      "base-100": "#f8fff6",

      info: "#0097bc",

      success: "#008500",

      warning: "#ff9300",

      error: "#ff7a92",
    },
  },
  plugins: [daisyui],
};

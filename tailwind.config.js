/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
    },
    fontFamily: {
      sans: ["SF Pro Rounded", "system-ui", "sans-serif"],
    },
    fontSize: {
      caps: ["0.625rem", { lineHeight: "0.75rem" }], // 10px
      xs: ["0.75rem", { lineHeight: "0.9375rem" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.0625rem" }], // 14px
      base: ["1rem", { lineHeight: "1.25rem" }], // 16px
      lg: ["1.25rem", { lineHeight: "1.5rem" }], // 20px
      xl: ["1.5rem", { lineHeight: "1.875rem" }], // 24px
      "2xl": ["2rem", { lineHeight: "2.375rem" }], // 32px
    },
    extend: {
      colors: {
        base: {
          black: "#060B0F",
          white: "#FFFFFF",
        },
        neutral: {
          50: "#F9FAFA",
          100: "#F1F2F4",
          200: "#E9EBED",
          300: "#C7CDD1",
          400: "#ABB4BB",
          500: "#818D98",
          600: "#475B6B",
          700: "#2B4255",
          800: "#162837",
          900: "#0D1821",
          950: "#10171D",
        },
        green: {
          light: "#65FB79",
          dark: "#15A74C",
        },
        orange: {
          light: "#FF9F0B",
          dark: "#C27600",
        },
        purple: {
          light: "#5E5CE6",
          dark: "#322FDF",
        },
        red: {
          light: "#FD3B3B",
          dark: "#A4181A",
        },
        blue: {
          light: "#01A8ED",
          dark: "#025A98",
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(94.49deg, #65FB79 0.59%, #ADFA3C 97.74%)",
      },
    },
  },
  plugins: [],
};

import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  lightMode: "class",
  plugins: [
    nextui({
      themes: {
        "sew-light": {
          extend: "light", // <- inherit default values from dark theme
          colors: {
            background: "#CCEDD9",
            foreground: "#254E70",
            primary: {
              50: "#fdfcdd",
              100: "#f7f4b5",
              200: "#f2ed89",
              300: "#ede55c",
              400: "#CCEDD9",
              500: "#cfc517",
              600: "#a1990e",
              700: "#736d07",
              800: "#454201",
              900: "#181600",
              DEFAULT: "#CCEDD9",
              foreground: "#ffffff",
            },
            secondary: "#EE964B",
            focus: "#F182F6",
            linkHover: "#D1603D",
          },
          layout: {
            disabledOpacity: "0.3",
            radius: {
              small: "4px",
              medium: "6px",
              large: "8px",
            },
            borderWidth: {
              small: "1px",
              medium: "2px",
              large: "3px",
            },
          },
        },
      },
    }),
  ],
};

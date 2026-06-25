import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        medelite: {
          pink: "#E91E8C",
          purple: "#7B2CBF",
          blue: "#1E78B4",
          "blue-light": "#5DA9DD",
          navy: "#312E81",
          teal: "#E91E8C",
          accent: "#5DA9DD",
          slate: "#6B7280",
          light: "#F8FAFC",
        },
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(90deg, #E91E8C 0%, #7B2CBF 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

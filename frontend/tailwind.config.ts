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
          navy: "#0f2744",
          teal: "#1a6b7a",
          accent: "#2dd4bf",
          slate: "#64748b",
          light: "#f1f5f9",
        },
      },
    },
  },
  plugins: [],
};

export default config;

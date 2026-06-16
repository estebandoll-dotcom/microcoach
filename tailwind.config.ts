import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        primaryHover: "var(--primary-hover)",
        surface: "var(--surface)",
        border: "var(--border)",
        success: "var(--success)",
      },
    },
  },
  plugins: [],
};
export default config;

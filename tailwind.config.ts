import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linkpost: {
          blue: "#3B82F6",
          ink: "#111827",
          muted: "#6B7280",
        },
      },
      boxShadow: {
        glow: "0 24px 65px rgba(59, 130, 246, 0.22)",
        soft: "0 18px 50px rgba(15, 23, 42, 0.12)",
        button: "0 12px 28px rgba(59, 130, 246, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;

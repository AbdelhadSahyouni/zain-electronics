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
        primary: "#1A56DB",
        secondary: "#FBBF24",
        "dark-bg": "#0F172A",
        surface: "#1E293B",
        "light-bg": "#F8FAFC",
        "text-primary": "#0F172A",
        "text-muted": "#64748B",
        success: "#10B981",
        danger: "#EF4444",
        whatsapp: "#25D366",
      },
      fontFamily: {
        arabic: ["Noto Sans Arabic", "sans-serif"],
        sans: ["Inter", "Noto Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

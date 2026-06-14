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
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "cart-bounce": "cart-bounce 0.4s ease",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.4)" },
          "70%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0)" },
        },
        "cart-bounce": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

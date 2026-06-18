import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#12121A",
        border: "#1E1E2E",
        "border-bright": "#2A2A3E",
        cyan: "#00D4FF",
        "cyan-dim": "#00A3C4",
        slate: "#4A5568",
        "text-primary": "#E8E8F0",
        "text-secondary": "#8888A8",
        "text-muted": "#44445A",
        "win-glow": "rgba(0, 212, 255, 0.15)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

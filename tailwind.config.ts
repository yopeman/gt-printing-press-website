import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          secondary: "rgb(var(--surface-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--surface-tertiary) / <alpha-value>)",
        },
        foreground: {
          DEFAULT: "rgb(var(--foreground) / <alpha-value>)",
          muted: "rgb(var(--foreground-muted) / <alpha-value>)",
        },
        border: "var(--border-color)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          glow: "var(--primary-glow)",
        },
        brand: {
          red: "#DC2626",
          darkred: "#991B1B",
          ruby: "#FF2E56",
          black: "#0A0A0A",
          charcoal: "#0F172A",
          slate: "#1E293B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "var(--font-ethiopic)", "sans-serif"],
        ethiopic: ["var(--font-ethiopic)", "sans-serif"],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px var(--primary-glow)',
        'glow-md': '0 0 25px -4px var(--primary-glow)',
        'glow-lg': '0 0 40px -5px var(--primary-glow)',
        'card-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

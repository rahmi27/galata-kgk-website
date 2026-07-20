import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "ui-sans-serif", "sans-serif"],
        body: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          50: "#F6F7FB",
          100: "#E8EBF4",
          200: "#C4CBE1",
          300: "#95A2CA",
          400: "#6173AE",
          500: "#344C8E",
          600: "#283B74",
          700: "#202F62",
          800: "#1B2A5E",
          900: "#131D41",
          950: "#0A1026",
          DEFAULT: "#1B2A5E",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          50: "#FFF4EF",
          100: "#FFE6D8",
          200: "#FFC9B0",
          300: "#FFA27F",
          400: "#F8764D",
          500: "#E85D2C",
          600: "#D9481C",
          700: "#B53617",
          800: "#912C1A",
          900: "#752719",
          DEFAULT: "#E85D2C",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;

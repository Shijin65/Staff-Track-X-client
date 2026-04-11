import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
          contrast: "var(--primary-contrast)",
        },
        secondary: "var(--secondary)",
        background: "var(--background)",
        paper: "var(--paper)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
      },
      backgroundImage: {
        "primary-gradient": "var(--primary-gradient)",
      },
      boxShadow: {
        "primary-shadow": "var(--primary-shadow)",
      },
    },
  },
  plugins: [],
}

export default config
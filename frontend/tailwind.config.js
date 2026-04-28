/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#22C55E",
        darkBg: "#0B0F19",
        cardBg: "#111827",
        textMain: "#E5E7EB",
        textMuted: "#9CA3AF",
      },
    },
  },
  plugins: [],
}


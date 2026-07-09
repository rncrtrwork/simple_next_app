/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8F9FA",
        ink: "#0A192F",
        crimson: "#D32F2F",
        audit: "#1B5E20",
        folder: "#D8C591",
        "folder-edge": "#BFA35C",
      },
      fontFamily: {
        ledger: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      boxShadow: {
        ledger: "0 16px 40px rgba(10, 25, 47, 0.08)",
      },
    },
  },
  plugins: [],
};

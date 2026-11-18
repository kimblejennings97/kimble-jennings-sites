/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#ededef", 2: "#c4c4c9", mute: "#8b8b93", faint: "#5c5c64" },
        base: "#09090b",
        card: "#111114",
        // vintage accents, used only inside the drawers
        phosphor: { DEFAULT: "#7dffa8", dim: "#3f8f5c", deep: "#0a120d" },
        amber: { led: "#ffb000", dim: "#7a5300", deep: "#120c03" },
      },
      borderColor: { hair: "rgba(255,255,255,0.08)", hair2: "rgba(255,255,255,0.14)" },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        crt: ["VT323", '"IBM Plex Mono"', "monospace"],
      },
      letterSpacing: { tightest: "-0.04em" },
    },
  },
  plugins: [],
};

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the build works under /kimble-jennings-sites/ on GitHub Pages (and locally).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { outDir: "dist", assetsInlineLimit: 0 },
});

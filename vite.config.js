import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      // Optimize JPG images
      jpg: {
        quality: 75, // 75 is sweet spot for quality vs size
      },
      // Optimize PNG images
      png: {
        quality: 75,
      },
      // Convert to WebP (modern format, smaller size)
      webp: {
        quality: 75,
      },
    }),
  ],
  server: {
    allowedHosts: ["substernal-virilely-suzette.ngrok-free.dev"],
  },
});

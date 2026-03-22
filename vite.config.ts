import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy libs into their own chunks so they load in parallel
          "three-core":   ["three"],
          "three-stdlib": ["three-stdlib"],
          "gsap-core":    ["gsap"],
          "r3f":          ["@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
          "rapier":       ["@react-three/rapier"],
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
    // Raise warning limit slightly (three.js is inherently large)
    chunkSizeWarningLimit: 1000,
  },
  // Pre-bundle large deps for faster dev server cold start
  optimizeDeps: {
    include: ["three", "gsap", "@react-three/fiber", "@react-three/drei"],
  },
});
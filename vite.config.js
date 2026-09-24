import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This maps "@/" to your "src" folder
      "@": path.resolve(__dirname, "./"),
    },
  },
});
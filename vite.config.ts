import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-electron-plugin";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      include: ["src/electron"],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@/core",
        replacement: path.resolve(__dirname, "src/core/"),
      },
      {
        find: "@/i18n",
        replacement: path.resolve(__dirname, "src/i18n/"),
      },
      {
        find: "@/utils",
        replacement: path.resolve(__dirname, "src/utils/"),
      },
    ],
  },
});

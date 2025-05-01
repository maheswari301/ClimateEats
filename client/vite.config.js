import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

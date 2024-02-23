import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@contexts": "/src/contexts",
      "@config": "/src/config",
      "@utils": "/src/utils"
    }
  }
})

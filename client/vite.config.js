import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": "/src",
      "@api": "/src/api",
      "@assets": "/assets",
      "@pulic": "/src/public",
      "@components": "/src/components",
      "@config": "/src/config",
      "@contexts": "/src/contexts",
      "@hooks": "/src/hooks",
      "@pages": "/src/pages",
      "@schemas": "/src/schemas",
      "@utils": "/src/utils"
    }
  }
})

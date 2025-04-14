import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from 'url'
import AutoImport from "unplugin-auto-import/vite"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    AutoImport({
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
      "@components": fileURLToPath(new URL('./src/components', import.meta.url)),
      "@hooks": fileURLToPath(new URL('./src/hooks', import.meta.url)),
      "@stores": fileURLToPath(new URL('./src/stores', import.meta.url)),
      "@lib": fileURLToPath(new URL('./src/lib', import.meta.url)),
      "@utils": fileURLToPath(new URL('./src/utils', import.meta.url)),
      "@types": fileURLToPath(new URL('./src/types', import.meta.url)),
      "@constants": fileURLToPath(new URL('./src/constants', import.meta.url)),
      "@features": fileURLToPath(new URL('./src/features', import.meta.url)),
    }
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          tanstack: ["@tanstack/react-query"],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      "react", 
      "react-dom", 
      "react-router-dom", 
      "@tanstack/react-query",
      "@supabase/supabase-js",
      "@supabase/postgrest-js"
    ],
    exclude: [],
  },
}))

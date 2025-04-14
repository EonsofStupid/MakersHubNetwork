import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { componentTagger } from "lovable-tagger"
import AutoImport from "unplugin-auto-import/vite"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
  // ... keep existing code (server configuration)

  plugins: [
    react(),
    mode === "development" && componentTagger(),
    AutoImport({
      // ... keep existing code (imports configuration)
      dts: resolve(__dirname, "./src/auto-imports.d.ts"),
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
      // ... keep existing code (remaining AutoImport config)
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@components": resolve(__dirname, "./src/components"),
      "@hooks": resolve(__dirname, "./src/hooks"),
      "@stores": resolve(__dirname, "./src/stores"),
      "@lib": resolve(__dirname, "./src/lib"),
      "@utils": resolve(__dirname, "./src/utils"),
      "@types": resolve(__dirname, "./src/types"),
      "@constants": resolve(__dirname, "./src/constants"),
      "@features": resolve(__dirname, "./src/features"),
    }
  },
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

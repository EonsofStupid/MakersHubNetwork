import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
    },
  },
  plugins: [
    react({
      plugins: [
        ["@swc/plugin-emotion", {}],
        ["@swc/plugin-styled-components", {}],
      ],
    }),
    mode === "development" && componentTagger(),
    AutoImport({
      // We explicitly import from "@/hooks/use-toast" and "@/lib/utils"
      // so remove "./src/hooks" and "./src/lib" from dirs to avoid duplicates
      imports: [
        "react",
        "react-router-dom",
        {
          "@tanstack/react-query": [
            "useQuery",
            "useMutation",
            "useQueryClient",
            "useInfiniteQuery",
            "useQueries",
            "useSuspenseQuery",
            "useSuspenseInfiniteQuery",
            "useSuspenseQueries",
          ],
          // Single source for useToast:
          "@/hooks/use-toast": ["useToast"],

          // Single source for "cn" etc.
          "@/lib/utils": [
            "cn",
            "formatDate",
            "wait",
            "createUrl",
            "absoluteUrl",
            "constructMetadata",
            "formatBytes",
            "slugify",
            "truncate",
          ],
          // ... other manual imports
        },
      ],
      // Only scan certain folders, excluding './src/hooks' and './src/lib'
      dirs: [
        "./src/components",
        "./src/stores",
        "./src/utils",    // Only if you want to auto-import from "./src/utils"? 
                          // But if that duplicates stuff from "@/lib/utils", remove it too
        "./src/types",
        "./src/constants",
        "./src/features/**/components",
        "./src/features/**/hooks",   // This is separate from root-level ./src/hooks
        "./src/features/**/stores",
        // ^ adjust as needed
      ],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
      },
      defaultExportByFilename: true,
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
        /\.md$/,
      ],
      resolvers: [],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@features": path.resolve(__dirname, "./src/features"),
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
          ui: ["@/components/ui"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
    exclude: ["@supabase/supabase-js"],
  },
}))

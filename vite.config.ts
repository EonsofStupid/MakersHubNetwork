// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    AutoImport({
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
          "@/stores/auth/store": ["useAuthStore", "selectUser", "selectIsAuthenticated", "selectUserRoles"],
          // ...
        },
      ],
      dirs: [
        "./src/components",
        "./src/hooks",
        "./src/stores",
        // ...
      ],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
      },
      // IMPORTANT: No "dtsLocations" field here
      // dtsLocations: [...]
      // ^ Remove or comment out any usage
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))

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
          "@/stores/auth/store": [
            "useAuthStore",
            "selectUser",
            "selectIsAuthenticated",
            "selectUserRoles",
          ],
          "@/hooks/use-toast": ["useToast"],
          "lucide-react": ["Search", "Menu", "User", "Settings", "LayoutDashboard", "LogOut"],
          "@/components/ui/button": ["Button"],
          "@/components/ui/sheet": ["Sheet", "SheetContent", "SheetTrigger"],
          "@/lib/utils": ["cn", "formatDate"],
        },
      ],
      dirs: [
        "./src/components",
        "./src/hooks",
        "./src/stores",
        "./src/lib",
        "./src/utils",
        "./src/types",
        "./src/constants",
      ],
      dts: "./src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
      },
      defaultExportByFilename: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
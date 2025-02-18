import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "path"
import { componentTagger } from "lovable-tagger"
import AutoImport from "unplugin-auto-import/vite"

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    cors: true, // Enable CORS
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      overlay: true,
      clientPort: 443, // Force client to use HTTPS port
      protocol: 'wss', // Use secure WebSocket
    },
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
          "@/app/stores/auth/store": [
            "useAuthStore",
            "selectUser",
            "selectIsAuthenticated",
            "selectUserRoles",
            "selectStatus",
            "selectError",
            "selectIsLoading",
          ],
          "@/stores/ui/store": [
            "useUIStore",
            "selectThemeMode",
            "selectAccentColor",
            "selectLayout",
            "selectPreferences",
          ],
          "@/stores/theme/store": [
            "useThemeStore",
            "selectCurrentTheme",
            "selectThemeTokens",
            "selectThemeComponents",
          ],
          "@/hooks/use-toast": ["useToast"],
          "lucide-react": [
            "Search",
            "Menu",
            "User",
            "Settings",
            "LayoutDashboard",
            "LogOut",
            "Plus",
            "Minus",
            "ChevronDown",
            "ChevronUp",
            "ChevronLeft",
            "ChevronRight",
            "X",
            "Check",
            "Edit",
            "Trash",
            "Save",
            "Upload",
            "Download",
            "Share",
            "Info",
            "AlertCircle",
            "Bell",
            "Calendar",
            "Clock",
            "Filter",
            "Home",
            "Mail",
            "MessageSquare",
            "MoreHorizontal",
            "MoreVertical",
            "Settings",
            "Star",
          ],
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
        "./src/features/**/components",
        "./src/features/**/hooks",
        "./src/features/**/stores",
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
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@features": path.resolve(__dirname, "./src/features"),
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

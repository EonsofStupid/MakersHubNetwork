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
            "selectIsAdmin",
            "selectIsSuperAdmin",
            "selectRole",
            "selectError",
            "selectIsLoading",
          ],
          "@/app/stores/ui/store": [
            "useUIStore",
            "selectThemeMode",
            "selectAccentColor",
            "selectLayout",
            "selectPreferences",
            "selectIsNavOpen",
            "selectContentWidth",
          ],
          "@/app/stores/theme/store": [
            "useThemeStore",
            "selectCurrentTheme",
            "selectThemeTokens",
            "selectThemeComponents",
            "selectAdminComponents",
            "selectUserPreferences",
          ],
          "@/app/stores/notifications/store": [
            "useNotificationStore",
            "selectNotifications",
            "selectToasts",
            "selectAlerts",
          ],
          "@/app/stores/performance/store": [
            "usePerformanceStore",
            "selectFrameMetrics",
            "selectStoreMetrics",
            "selectMemoryMetrics",
            "selectIsMonitoring",
          ],
          "@/app/stores/components/store": [
            "useComponentStore",
            "selectVisibleModals",
            "selectActiveDialogs",
            "selectComponentStates",
          ],
          "@/app/stores/shared/store": [
            "useSharedStore",
            "selectErrors",
            "selectLoading",
          ],
          "@/app/hooks/useNotify": ["useNotify"],
          "@/app/utils/cn": ["cn"],
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
            "Edit2",
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
            "Github",
            "Twitter",
            "Link",
          ],
        },
      ],
      dirs: [
        "./src/app/components",
        "./src/app/hooks",
        "./src/app/stores",
        "./src/app/utils",
        "./src/app/types",
        "./src/app/constants",
        "./src/features/**/components",
        "./src/features/**/hooks",
        "./src/features/**/utils",
        "./src/features/**/types",
        "./src/site/components",
        "./src/site/hooks",
        "./src/site/utils",
        "./src/platforms/**/components",
        "./src/platforms/**/hooks",
        "./src/platforms/**/utils",
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
      "@app": path.resolve(__dirname, "./src/app"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@site": path.resolve(__dirname, "./src/site"),
      "@platforms": path.resolve(__dirname, "./src/platforms"),
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

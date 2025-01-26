// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    AutoImport({
      imports: [
        'react',
        'react-router-dom',
        {
          '@tanstack/react-query': [
            'useQuery',
            'useMutation',
            'useQueryClient',
            'useInfiniteQuery',
            'useQueries',
            'useSuspenseQuery',
            'useSuspenseInfiniteQuery',
            'useSuspenseQueries',
          ],
          '@/stores/auth/store': [
            'useAuthStore',
            'selectUser',
            'selectIsAuthenticated',
            'selectUserRoles',
          ],
          '@/stores/theme/store': [
            'useThemeStore',
            'selectThemeMode',
            'selectAccentColor',
            'selectLayout',
          ],
          '@/stores/components/store': [
            'useComponentStore',
            'selectVisibleModals',
            'selectActiveDialogs',
          ],
          '@/stores/performance/store': [
            'usePerformanceStore',
            'selectFrameMetrics',
            'selectStoreMetrics',
            'selectMemoryMetrics',
          ],
          '@/lib/utils': [
            'cn',
            'formatDate',
            'formatNumber',
            'truncateText',
          ],
          '@/hooks': [
            'useToast',
            'useThemeManager',
            'useFrameMetrics',
          ],
          'lucide-react': [
            'Home',
            'Settings',
            'User',
            'Search',
            'Menu',
            'X',
            'Check',
            'ChevronDown',
            'ChevronUp',
            'ChevronLeft',
            'ChevronRight',
            'Plus',
            'Minus',
            'Edit',
            'Trash',
            'Save',
            'Download',
            'Upload',
            'Share',
            'Mail',
            'Calendar',
            'Clock',
            'Bell',
            'Info',
            'AlertCircle',
            'CheckCircle',
            'XCircle',
            'Terminal',
          ],
        },
      ],

      // Directories to scan for auto-imports
      dirs: [
        './src/components',
        './src/hooks',
        './src/stores',
        './src/lib',
        './src/utils',
        './src/features',
        './src/layouts',
      ],

      // Generate TypeScript declaration file
      dts: './src/auto-imports.d.ts',

      // ESLint integration
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },

      // Default imports for specific files
      defaultExportByFilename: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
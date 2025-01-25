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
      // Automatically import React hooks
      imports: [
        'react',
        'react-router-dom',
        {
          '@tanstack/react-query': [
            'useQuery',
            'useMutation',
            'useQueryClient',
          ],
          '@/stores/auth/store': [
            'useAuthStore',
          ],
          '@/stores/theme/store': [
            'useThemeStore',
          ],
          '@/stores/components/store': [
            'useComponentStore',
          ],
          '@/lib/utils': [
            'cn',
          ],
        },
      ],
      // Generate TypeScript declaration file
      dts: './src/auto-imports.d.ts',
      // Filepath to generate declarations
      dirs: [
        './src/components',
        './src/hooks',
        './src/stores',
        './src/lib',
      ],
      // ESLint integration
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
      // Custom resolvers
      resolvers: [],
      // Default imports
      defaultExportByFilename: true,
      // Additional options for TypeScript
      typescript: {
        declaration: true,
        declarationMap: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
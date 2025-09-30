/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext', // or a modern baseline you support
    minify: 'esbuild', // esbuild is faster/smaller than terser
    cssCodeSplit: true, // split CSS per component
    sourcemap: false, // turn off in prod
    rollupOptions: {
      treeshake: 'smallest',
      output: {
        assetFileNames: (assetInfo) => {
          // Keep favicon.png without hash
          if (assetInfo.names && assetInfo.names.includes('favicon.png')) {
            return 'public/favicon.png'
          }
          // Default hashing for other assets
          return 'assets/[name]-[hash][extname]'
        },
      },
      plugins: [
        visualizer({
          filename: 'stats.html',
          template: 'treemap', // sunburst/treemap/network
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    watch: {
      // Vite crashes from time to time with iOS running without these ignored.
      ignored: [
        '**/ios/**', // whole iOS project folder
      ],
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
